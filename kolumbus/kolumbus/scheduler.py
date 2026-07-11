"""Контролёр: щоденний РОП-дайджест, висяки 3+ дні, SLA, щомісячне ретро.

Працює за розкладом (DIGEST_TIME, таймзона TZ_NAME) і шле результат у чат команди.
Дані Коломбус збирає сам — через свої CRM-інструменти (crm_get_leads, crm_get_payments).
"""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from . import brain
from .config import config

log = logging.getLogger(__name__)

DIGEST_INSTRUCTION = """\
Сьогодні {today}. Підготуй ранковий дайджест керівника продажів Globus Tour для чату команди.

1. Виклич crm_get_leads (за потреби кілька разів з фільтрами) та crm_get_payments.
2. Порахуй і виклади стисло:
   • 💰 Продажі: платежі за вчора та накопичено за місяць, середній чек.
   • 🆕 Ліди: скільки нових за вчора, розподіл по джерелах і менеджерах.
   • 🧊 Висяки: ліди без руху 3+ дні у робочих статусах — перелічи з менеджером і днями простою.
   • ⏱ SLA: ліди, де перша реакція виглядає простроченою.
   • 🎯 Фокус дня: 1–2 конкретні рекомендації.
3. Формат: коротко, з емодзі, до 20 рядків, українською. Без води і без markdown-таблиць.

Якщо CRM недоступна або повернула помилку — напиши про це чесно одним рядком, не вигадуй цифри.
"""

RETRO_ADDON = """
Сьогодні перше число місяця — після дайджесту додай блок «📆 Ретро за {prev_month}»:
підсумки місяця (виручка, ліди, конверсія), хто молодець, що просіло,
фокус нового місяця та 2–3 тези-матеріал для 1:1 з менеджерами.
"""

_notify = None  # async fn(text) — встановлює main.py


def set_notifier(fn) -> None:
    global _notify
    _notify = fn


def _tz() -> ZoneInfo:
    return ZoneInfo(config.timezone)


async def _sleep_until(hhmm: str) -> None:
    h, m = (int(x) for x in hhmm.split(":"))
    now = datetime.now(_tz())
    target = now.replace(hour=h, minute=m, second=0, microsecond=0)
    if target <= now:
        target += timedelta(days=1)
    await asyncio.sleep((target - now).total_seconds())


async def run_digest() -> str:
    now = datetime.now(_tz())
    instruction = DIGEST_INSTRUCTION.format(today=now.strftime("%d.%m.%Y (%A)"))
    if now.day == 1:
        prev = (now.replace(day=1) - timedelta(days=1)).strftime("%m.%Y")
        instruction += RETRO_ADDON.format(prev_month=prev)
    return await brain.oneshot(instruction)


async def digest_loop() -> None:
    if not config.team_chat_id:
        log.warning("TEAM_CHAT_ID не задано — щоденний дайджест вимкнено")
        return
    log.info("Дайджест увімкнено: щодня о %s (%s)", config.digest_time, config.timezone)
    while True:
        await _sleep_until(config.digest_time)
        try:
            text = await run_digest()
            if _notify and text:
                await _notify(f"🧭 Ранковий дайджест\n\n{text}")
        except Exception:
            log.exception("Помилка формування дайджесту")
