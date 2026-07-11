"""Пам'ять діалогів: chat_id → історія повідомлень (тільки текстові репліки,
tool-блоки живуть лише всередині одного виклику brain.reply). Персист у JSON."""
from __future__ import annotations

import json
import logging
from pathlib import Path

from .config import config

log = logging.getLogger(__name__)

_sessions: dict[str, list[dict]] = {}
_path = Path(config.sessions_file)


def load() -> None:
    global _sessions
    if _path.exists():
        try:
            _sessions = json.loads(_path.read_text(encoding="utf-8"))
            log.info("Завантажено %d діалогів", len(_sessions))
        except Exception:
            log.exception("Не вдалося прочитати %s — стартуємо з чистого", _path)
            _sessions = {}


def _save() -> None:
    try:
        _path.parent.mkdir(parents=True, exist_ok=True)
        _path.write_text(json.dumps(_sessions, ensure_ascii=False), encoding="utf-8")
    except Exception:
        log.exception("Не вдалося зберегти сесії")


def history(chat_id: int) -> list[dict]:
    return list(_sessions.get(str(chat_id), []))


def append(chat_id: int, user_text: str, assistant_text: str) -> None:
    h = _sessions.setdefault(str(chat_id), [])
    h.append({"role": "user", "content": user_text})
    h.append({"role": "assistant", "content": assistant_text})
    # тримаємо хвіст, щоб не роздувати контекст
    if len(h) > config.history_limit:
        del h[: len(h) - config.history_limit]
    _save()


def reset(chat_id: int) -> None:
    _sessions.pop(str(chat_id), None)
    _save()
