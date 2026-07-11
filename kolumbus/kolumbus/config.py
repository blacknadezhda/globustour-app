"""Конфигурация Коломбуса — всё через переменные окружения (.env)."""
from __future__ import annotations

import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()


def _ids(raw: str) -> list[int]:
    return [int(x) for x in raw.replace(";", ",").split(",") if x.strip()]


@dataclass(frozen=True)
class Config:
    # Telegram
    bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    # ID участников команды (ты, Виктория, менеджеры) — для внутреннего режима
    team_user_ids: list[int] = field(default_factory=lambda: _ids(os.getenv("TEAM_USER_IDS", "")))
    # Чат команды: сюда Коломбус пингует менеджеров о новых лидах
    team_chat_id: int | None = int(os.getenv("TEAM_CHAT_ID", "0")) or None
    # Чат/бот Глобы: сюда уходят делегированные поручения
    globa_chat_id: int | None = int(os.getenv("GLOBA_CHAT_ID", "0")) or None

    # Claude
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    claude_model: str = os.getenv("CLAUDE_MODEL", "claude-opus-4-8")
    max_tokens: int = int(os.getenv("CLAUDE_MAX_TOKENS", "2048"))

    # All Inclusive CRM
    crm_base_url: str = os.getenv("CRM_BASE_URL", "https://api.allinclusivecrm.com/v1")
    crm_token: str = os.getenv("CRM_TOKEN", "")
    # userId менеджера по умолчанию, на которого назначаются новые лиды
    crm_default_user_id: str = os.getenv("CRM_DEFAULT_USER_ID", "")
    lead_source: str = os.getenv("LEAD_SOURCE", "Telegram")

    # Монитор
    heartbeat_file: str = os.getenv("HEARTBEAT_FILE", "data/heartbeat")
    alert_chat_ids: list[int] = field(default_factory=lambda: _ids(os.getenv("ALERT_CHAT_IDS", "")))
    heartbeat_stale_sec: int = int(os.getenv("HEARTBEAT_STALE_SEC", "180"))

    # Память диалогов
    sessions_file: str = os.getenv("SESSIONS_FILE", "data/sessions.json")
    history_limit: int = int(os.getenv("HISTORY_LIMIT", "40"))


config = Config()
