#!/usr/bin/env bash
# 🩺 Диагностика Telegram-бота: почему молчит.
#
# Запуск:
#   bash tools/tg-diag.sh <BOT_TOKEN>
#   TELEGRAM_BOT_TOKEN=... bash tools/tg-diag.sh
#
# Ничего не меняет — только читает состояние через Bot API.
set -uo pipefail

TOKEN="${1:-${TELEGRAM_BOT_TOKEN:-}}"
if [ -z "$TOKEN" ]; then
  echo "❌ Нет токена. Использование: bash tools/tg-diag.sh <BOT_TOKEN>"
  exit 1
fi

API="https://api.telegram.org/bot${TOKEN}"
jqq() { command -v jq >/dev/null 2>&1 && jq "$@" || cat; }

echo "════════ 1. Бот жив? (getMe) ════════"
ME=$(curl -sS -m 20 "${API}/getMe")
echo "$ME" | jqq .
if ! echo "$ME" | grep -q '"ok":true'; then
  echo "❌ Токен не принят Telegram. Причины: токен отозван/перевыпущен в BotFather,"
  echo "   бот удалён, или в .env лежит не тот токен. Это и есть причина молчания."
  exit 2
fi

echo
echo "════════ 2. Webhook и очередь апдейтов (getWebhookInfo) ════════"
WH=$(curl -sS -m 20 "${API}/getWebhookInfo")
echo "$WH" | jqq .
URL=$(echo "$WH" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
PENDING=$(echo "$WH" | grep -o '"pending_update_count":[0-9]*' | head -1 | cut -d: -f2)
LASTERR=$(echo "$WH" | grep -o '"last_error_message":"[^"]*"' | head -1 | cut -d'"' -f4)

echo
echo "──────── Разбор ────────"
if [ -n "$URL" ]; then
  echo "⚠️  У бота ЗАДАН webhook: $URL"
  echo "    Если код работает на long polling (aiogram start_polling) — Telegram отдаёт"
  echo "    апдейты в webhook, а бот их не видит НИКОГДА. Это классическая причина тишины."
  [ -n "$LASTERR" ] && echo "    Последняя ошибка доставки в webhook: $LASTERR"
  echo "    Снять webhook (если бот на polling):"
  echo "      curl -sS \"${API//$TOKEN/<TOKEN>}/deleteWebhook?drop_pending_updates=true\""
else
  echo "✅ Webhook не задан — бот должен работать на polling."
fi

if [ "${PENDING:-0}" -gt 0 ] 2>/dev/null; then
  echo "⚠️  В очереди ${PENDING} необработанных апдейтов — их никто не забирает."
  echo "    Значит процесс бота не запущен, упал, или его вытесняет второй экземпляр."
fi

echo
echo "════════ 3. Кто-то забирает апдейты? (getUpdates) ════════"
UP=$(curl -sS -m 25 "${API}/getUpdates?limit=1&timeout=0")
echo "$UP" | head -c 800; echo
if echo "$UP" | grep -q '"error_code":409'; then
  echo "🔴 КОНФЛИКТ 409: апдейты уже забирает другой процесс."
  echo "    Значит бот ЗАПУЩЕН где-то ещё (старый контейнер, вторая копия на другом сервере,"
  echo "    локальный запуск). Две копии на одном токене глушат друг друга."
  echo "    Найти и оставить одну: docker ps -a | grep -i bot ; pgrep -af python"
elif echo "$UP" | grep -q '"ok":true'; then
  echo "⚠️  getUpdates отработал БЕЗ конфликта — значит апдейты сейчас никто не слушает."
  echo "    Процесс бота, скорее всего, не работает. Проверьте на сервере:"
  echo "      docker ps -a && docker compose logs --tail=100"
fi

echo
echo "════════ 4. Что дальше ════════"
cat <<'TXT'
На сервере с ботом:
  docker ps -a                       # контейнер Up или Exited/Restarting?
  docker compose logs --tail=200     # последняя ошибка перед смертью
  df -h /                            # переполнен диск = молчание
  free -m                            # OOM = контейнер убит
  docker compose restart             # перезапуск после устранения причины
TXT
