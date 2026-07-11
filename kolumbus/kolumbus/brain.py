"""Мозок Коломбуса: Claude + цикл виклику інструментів.

Клієнтський режим: діалог продажів + create_lead.
Командний режим (Ніко/Вікторія/менеджери): + CRM-читання та делегування Глобі.
"""
from __future__ import annotations

import json
import logging

import anthropic

from . import globa, sessions
from .config import config
from .crm import CRMError, crm
from .prompts import build_system_prompt

log = logging.getLogger(__name__)

client = anthropic.AsyncAnthropic(api_key=config.anthropic_api_key)
SYSTEM_PROMPT = build_system_prompt()

# Повідомлення менеджерам у чат команди про новий лід
_notify_team = None  # встановлює main.py


def set_team_notifier(fn) -> None:
    global _notify_team
    _notify_team = fn


CREATE_LEAD_TOOL = {
    "name": "create_lead",
    "description": (
        "Створити лід в All Inclusive CRM, коли клієнт квалифікований (є ім'я, телефон і фактура). "
        "comment — структуроване саммарі для менеджера: напрямок, дати, склад, тип JTBD, бюджет, "
        "підказки по апселах."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Ім'я клієнта"},
            "phone": {"type": "string", "description": "Телефон клієнта"},
            "comment": {"type": "string", "description": "Саммарі для менеджера"},
        },
        "required": ["name", "phone", "comment"],
    },
}

TEAM_TOOLS = [
    {
        "name": "delegate_to_globa",
        "description": (
            "Делегувати операційну задачу агенту Глоба: дашборд, підтвердження клієнтам, "
            "листи, інфо про готелі, збір даних. Передай задачу повним самодостатнім текстом."
        ),
        "input_schema": {
            "type": "object",
            "properties": {"task": {"type": "string", "description": "Текст доручення для Глоби"}},
            "required": ["task"],
        },
    },
    {
        "name": "crm_get_leads",
        "description": "Прочитати ліди з CRM (GET /leads). Опційно фільтри, напр. {\"status\": \"work_high_priority\"}.",
        "input_schema": {
            "type": "object",
            "properties": {"filters": {"type": "object", "description": "filter[ключ]=значення"}},
        },
    },
    {
        "name": "crm_get_payments",
        "description": "Аналітика фінансів: платежі по датах (GET /analytics/finance/payments). Параметри як є, напр. дати періоду.",
        "input_schema": {
            "type": "object",
            "properties": {"params": {"type": "object"}},
        },
    },
    {
        "name": "crm_get_users",
        "description": "Список менеджерів з userId (GET /users) — щоб призначати ліди потрібній людині.",
        "input_schema": {"type": "object", "properties": {}},
    },
]


async def _run_tool(name: str, args: dict) -> str:
    try:
        if name == "create_lead":
            result = await crm.create_lead(args["name"], args["phone"], args["comment"])
            lead_id = result.get("id") if isinstance(result, dict) else result
            if _notify_team:
                await _notify_team(
                    f"🧭 Новий лід #{lead_id}\n👤 {args['name']} · 📞 {args['phone']}\n📝 {args['comment']}"
                )
            return json.dumps({"ok": True, "lead_id": lead_id}, ensure_ascii=False)
        if name == "delegate_to_globa":
            return await globa.delegate(args["task"])
        if name == "crm_get_leads":
            return json.dumps(await crm.get_leads(args.get("filters")), ensure_ascii=False)[:6000]
        if name == "crm_get_payments":
            return json.dumps(await crm.get_payments(args.get("params")), ensure_ascii=False)[:6000]
        if name == "crm_get_users":
            return json.dumps(await crm.get_users(), ensure_ascii=False)[:6000]
        return f"Невідомий інструмент: {name}"
    except CRMError as e:
        log.error("CRM error in %s: %s", name, e)
        return f"Помилка CRM: {e}"


async def _agent_loop(messages: list[dict], tools: list[dict]) -> str:
    """Цикл Claude ↔ інструменти до фінальної текстової відповіді."""
    final_text = ""
    for _ in range(8):  # захист від нескінченного циклу інструментів
        response = await client.messages.create(
            model=config.claude_model,
            max_tokens=config.max_tokens,
            system=[{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}],
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "refusal":
            final_text = "Вибачте, тут я не зможу допомогти. Передам питання менеджеру 🙌"
            break

        tool_uses = [b for b in response.content if b.type == "tool_use"]
        final_text = next((b.text for b in response.content if b.type == "text"), final_text)

        if not tool_uses:
            break

        messages.append({"role": "assistant", "content": response.content})
        results = []
        for tu in tool_uses:
            log.info("Інструмент %s: %s", tu.name, tu.input)
            out = await _run_tool(tu.name, dict(tu.input))
            results.append({"type": "tool_result", "tool_use_id": tu.id, "content": out})
        messages.append({"role": "user", "content": results})

    return final_text


async def reply(chat_id: int, user_name: str, text: str, internal: bool) -> str:
    """Одна репліка діалогу: історія + новий текст → фінальна відповідь Коломбуса."""
    mode = "КОМАНДА" if internal else "ПРОДАЖІ"
    tools = [CREATE_LEAD_TOOL] + (TEAM_TOOLS if internal else [])

    messages: list[dict] = sessions.history(chat_id)
    messages.append({"role": "user", "content": f"[режим: {mode} · співрозмовник: {user_name}]\n{text}"})

    final_text = await _agent_loop(messages, tools)
    final_text = final_text or "Секунду, я тут 🙂 Розкажіть, яку подорож плануєте?"
    sessions.append(chat_id, text, final_text)
    return final_text


async def oneshot(instruction: str) -> str:
    """Одноразова внутрішня задача без сесії (дайджест, вебхук-подія, ретро).

    Працює в командному режимі з повним набором інструментів."""
    messages = [{"role": "user", "content": f"[режим: КОМАНДА · внутрішня задача]\n{instruction}"}]
    return await _agent_loop(messages, [CREATE_LEAD_TOOL] + TEAM_TOOLS)
