"""Місток до Глоби — підлеглого операційного агента.

Глоба вже побудована окремо; Коломбус делегує їй задачі повідомленням у її
Telegram-чат (GLOBA_CHAT_ID). Якщо чат не налаштований — чесно повідомляємо.
"""
from __future__ import annotations

import logging

from .config import config

log = logging.getLogger(__name__)

_send = None  # встановлює main.py: async fn(chat_id, text)


def set_sender(fn) -> None:
    global _send
    _send = fn


async def delegate(task: str) -> str:
    if not config.globa_chat_id or not _send:
        log.warning("Глоба не підключена, задача не делегована: %s", task)
        return "Глоба зараз не підключена (не задано GLOBA_CHAT_ID). Задачу не передано."
    await _send(config.globa_chat_id, f"⚙️ Доручення від Коломбуса:\n{task}")
    return "Задачу передано Глобі."
