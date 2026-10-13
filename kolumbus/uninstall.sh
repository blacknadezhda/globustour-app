#!/usr/bin/env bash
# 🧭 Удаление Коломбуса с сервера одной командой:
#
#   curl -fsSL https://raw.githubusercontent.com/blacknadezhda/globustour-app/main/kolumbus/uninstall.sh | bash
#
# Убирает ТОЛЬКО Коломбуса: контейнеры kolumbus-bot / kolumbus-watchdog,
# их образы и папку ~/kolumbus-app (вместе с .env и памятью диалогов).
# Глобу, Docker и всё остальное на сервере не трогает.
set -uo pipefail

DIR="$HOME/kolumbus-app"
SUDO=""
docker info >/dev/null 2>&1 || SUDO="sudo"

echo "🧭 Останавливаю и удаляю Коломбуса (только его — Глобу не трогаю)"

# 1. Остановить и убрать контейнеры + образы через compose
if [ -f "$DIR/kolumbus/docker-compose.yml" ]; then
  (cd "$DIR/kolumbus" && $SUDO docker compose down --rmi local --remove-orphans) || true
fi

# 2. Подстраховка, если compose-файла уже нет
$SUDO docker rm -f kolumbus-bot kolumbus-watchdog 2>/dev/null || true
$SUDO docker image rm kolumbus-kolumbus kolumbus-watchdog 2>/dev/null || true

# 3. Удалить папку с кодом, .env и данными
if [ -d "$DIR" ]; then
  rm -rf "$DIR"
  echo "→ Папка $DIR удалена (вместе с .env и памятью диалогов)."
else
  echo "→ Папки $DIR нет — код уже удалён или ставился в другое место."
fi

echo
echo "✅ Готово: Коломбус остановлен и удалён с сервера."
echo "   Рекомендации напоследок:"
echo "   • BotFather → /revoke — отозвать токен бота, если бот больше не нужен."
echo "   • platform.claude.com → API Keys — отключить ключ Claude, если он был только для бота."
