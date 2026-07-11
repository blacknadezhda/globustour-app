"""Вебхуки All Inclusive CRM: Integration → Webhooks.

CRM сама повідомляє Коломбуса про події (лід змінив статус, новий платіж) —
реальний час замість опитування. Вмикається, коли задано WEBHOOK_PORT і
WEBHOOK_SECRET; URL для CRM: http://<хост>:<порт>/webhook/crm/<секрет>.
Перед бойовим увімкненням перевірте формат подій на webhook.site.
"""
from __future__ import annotations

import asyncio
import json
import logging

from aiohttp import web

from . import brain
from .config import config

log = logging.getLogger(__name__)

EVENT_INSTRUCTION = """\
З CRM прийшла вебхук-подія (JSON нижче). Якщо подія значуща для команди —
зміна статусу ліда, новий платіж, нова заявка — сформулюй ОДНЕ коротке
повідомлення для чату команди (1–3 рядки, з емодзі, українською), за потреби
поглянь деталі через CRM-інструменти. Якщо подія технічна/незначуща —
відповідай рівно одним словом: skip

Подія:
{payload}
"""

_notify = None  # async fn(text) — встановлює main.py


async def _process(payload: object) -> None:
    try:
        text = await brain.oneshot(
            EVENT_INSTRUCTION.format(payload=json.dumps(payload, ensure_ascii=False)[:4000])
        )
        if _notify and text and text.strip().lower() != "skip":
            await _notify(f"📡 CRM: {text}")
    except Exception:
        log.exception("Помилка обробки вебхука")


async def _handle(request: web.Request) -> web.Response:
    if request.match_info.get("secret") != config.webhook_secret:
        return web.Response(status=403)
    try:
        payload: object = await request.json()
    except Exception:
        payload = {"raw": (await request.text())[:2000]}
    log.info("Вебхук CRM: %s", str(payload)[:500])
    # відповідаємо CRM одразу, обробляємо у фоні
    asyncio.get_running_loop().create_task(_process(payload))
    return web.json_response({"ok": True})


async def start(notify) -> None:
    global _notify
    _notify = notify
    if not config.webhook_port or not config.webhook_secret:
        log.info("Вебхуки вимкнено (WEBHOOK_PORT/WEBHOOK_SECRET не задано)")
        return
    app = web.Application()
    app.router.add_post("/webhook/crm/{secret}", _handle)
    runner = web.AppRunner(app)
    await runner.setup()
    await web.TCPSite(runner, "0.0.0.0", config.webhook_port).start()
    log.info("Вебхук-сервер слухає порт %d (/webhook/crm/<секрет>)", config.webhook_port)
