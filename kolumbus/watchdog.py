"""🩺 Монітор працездатності — СТОРОЖ, НЕ НАЧАЛЬНИК.

Окремий процес без AI і без залежностей (тільки стандартна бібліотека),
тому надійний. Раз на хвилину перевіряє пульс Коломбуса (файл heartbeat);
якщо агент замовк довше HEARTBEAT_STALE_SEC — шле алерт у Telegram
(ALERT_CHAT_IDS: ти та Вікторія). Сам нічого не вирішує і не чинить.

Запуск:  python watchdog.py
"""
from __future__ import annotations

import json
import os
import time
import urllib.parse
import urllib.request

# Читаємо .env вручну, щоб не тягнути залежності
def _load_env(path: str = ".env") -> None:
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip())


_load_env()

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
ALERT_CHAT_IDS = [x for x in os.environ.get("ALERT_CHAT_IDS", "").replace(";", ",").split(",") if x.strip()]
HEARTBEAT_FILE = os.environ.get("HEARTBEAT_FILE", "data/heartbeat")
STALE_SEC = int(os.environ.get("HEARTBEAT_STALE_SEC", "180"))
CHECK_EVERY = 60          # heartbeat кожну хвилину — як в архітектурі
ALERT_COOLDOWN = 30 * 60  # не спамити частіше ніж раз на 30 хв


def send_alert(text: str) -> None:
    for chat_id in ALERT_CHAT_IDS:
        try:
            data = urllib.parse.urlencode({"chat_id": chat_id, "text": text}).encode()
            req = urllib.request.Request(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage", data=data)
            with urllib.request.urlopen(req, timeout=15) as r:
                json.load(r)
        except Exception as e:  # noqa: BLE001 — сторож не має падати
            print(f"[watchdog] не вдалося надіслати алерт у {chat_id}: {e}")


def heartbeat_age() -> float | None:
    try:
        return time.time() - float(open(HEARTBEAT_FILE, encoding="utf-8").read().strip())
    except Exception:
        return None


def main() -> None:
    print(f"[watchdog] стежу за пульсом: {HEARTBEAT_FILE}, поріг {STALE_SEC}с")
    last_alert = 0.0
    was_down = False
    while True:
        age = heartbeat_age()
        down = age is None or age > STALE_SEC
        now = time.time()
        if down and now - last_alert > ALERT_COOLDOWN:
            detail = "heartbeat-файл відсутній" if age is None else f"мовчить уже {int(age)}с"
            send_alert(f"🩺🔴 Коломбус не подає ознак життя ({detail}). Перевірте сервіс!")
            last_alert = now
            was_down = True
        elif not down and was_down:
            send_alert("🩺🟢 Коломбус знову на зв'язку.")
            was_down = False
            last_alert = 0.0
        time.sleep(CHECK_EVERY)


if __name__ == "__main__":
    main()
