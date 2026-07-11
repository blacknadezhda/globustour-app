"""Точка входу: Telegram-бот Коломбус (aiogram 3.x).

Запуск:  python -m kolumbus.main
"""
from __future__ import annotations

import asyncio
import logging
import time
from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ChatAction, ParseMode
from aiogram.filters import Command
from aiogram.types import Message

from . import brain, globa, sessions
from .config import config
from .crm import crm

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("kolumbus")

bot = Bot(token=config.bot_token)
dp = Dispatcher()

GREETING = (
    "Вітаю! Я Коломбус 🧭 — цифровий помічник Globus Tour.\n"
    "Розкажіть, про яку подорож мрієте, — підберемо найкращий варіант, "
    "а персональний менеджер зателефонує з деталями протягом 15 хвилин у робочий час."
)


def _is_team(user_id: int) -> bool:
    return user_id in config.team_user_ids


async def _notify_team(text: str) -> None:
    if config.team_chat_id:
        await bot.send_message(config.team_chat_id, text)


async def _send_to(chat_id: int, text: str) -> None:
    await bot.send_message(chat_id, text)


@dp.message(Command("start"))
async def cmd_start(message: Message) -> None:
    sessions.reset(message.chat.id)
    await message.answer(GREETING)


@dp.message(Command("reset"))
async def cmd_reset(message: Message) -> None:
    sessions.reset(message.chat.id)
    await message.answer("Історію діалогу очищено 🧹")


@dp.message(F.text)
async def on_message(message: Message) -> None:
    user = message.from_user
    internal = _is_team(user.id) if user else False
    await bot.send_chat_action(message.chat.id, ChatAction.TYPING)
    try:
        answer = await brain.reply(
            chat_id=message.chat.id,
            user_name=(user.full_name if user else "клієнт"),
            text=message.text,
            internal=internal,
        )
    except Exception:
        log.exception("Помилка обробки повідомлення")
        answer = ("Ой, щось пішло не так на моєму боці 🙈 Спробуйте ще раз за хвилину — "
                  "або менеджер зв'яжеться з вами напряму.")
    # Telegram обмежує повідомлення 4096 символами
    for i in range(0, len(answer), 4000):
        await message.answer(answer[i : i + 4000])


async def heartbeat_task() -> None:
    """Пульс для монітора-«сторожа»: раз на 30 сек оновлюємо файл heartbeat."""
    path = Path(config.heartbeat_file)
    path.parent.mkdir(parents=True, exist_ok=True)
    while True:
        path.write_text(str(int(time.time())))
        await asyncio.sleep(30)


async def main() -> None:
    sessions.load()
    brain.set_team_notifier(_notify_team)
    globa.set_sender(_send_to)
    asyncio.get_running_loop().create_task(heartbeat_task())
    log.info("Коломбус виходить у море 🧭 (модель: %s)", config.claude_model)
    try:
        await dp.start_polling(bot)
    finally:
        await crm.close()


if __name__ == "__main__":
    asyncio.run(main())
