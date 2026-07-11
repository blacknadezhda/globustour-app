#!/usr/bin/env bash
# 🧭 Установка Коломбуса одной командой (Ubuntu / Amazon Linux).
#
#   curl -fsSL https://raw.githubusercontent.com/blacknadezhda/globustour-app/main/kolumbus/install.sh | bash
#
# Полностью изолированно: своя папка ~/kolumbus-app, свои контейнеры
# kolumbus-bot / kolumbus-watchdog. Другие сервисы (Глоба и т.п.) не трогает.
set -euo pipefail

REPO="https://github.com/blacknadezhda/globustour-app.git"
DIR="$HOME/kolumbus-app"

echo "🧭 Установка Коломбуса → $DIR (изолированно, ничего чужого не трогаем)"

# --- 1. Docker + git ---------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
  echo "→ Устанавливаю Docker…"
  if command -v dnf >/dev/null 2>&1; then          # Amazon Linux 2023
    sudo dnf install -y docker git
    sudo systemctl enable --now docker
  else                                             # Ubuntu / Debian
    curl -fsSL https://get.docker.com | sudo sh
  fi
fi
# compose-плагин (на Amazon Linux не идёт в комплекте)
if ! docker compose version >/dev/null 2>&1 && ! sudo docker compose version >/dev/null 2>&1; then
  echo "→ Устанавливаю docker compose…"
  sudo mkdir -p /usr/local/lib/docker/cli-plugins
  sudo curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi
command -v git >/dev/null 2>&1 || { command -v dnf >/dev/null 2>&1 && sudo dnf install -y git || sudo apt-get install -y git; }

SUDO=""
docker info >/dev/null 2>&1 || SUDO="sudo"

# --- 2. Код -------------------------------------------------------------------
if [ -d "$DIR/.git" ]; then
  echo "→ Код уже есть, обновляю…"
  git -C "$DIR" pull --ff-only
else
  git clone "$REPO" "$DIR"
fi
cd "$DIR/kolumbus"

# --- 3. Настройки (.env) -------------------------------------------------------
set_var() { # set_var ИМЯ значение — вписывает значение в .env
  [ -n "$2" ] && sed -i "s|^$1=.*|$1=$2|" .env
}
if [ ! -f .env ]; then
  cp .env.example .env
  echo
  echo "Введите значения (Enter — пропустить и дописать позже в $DIR/kolumbus/.env):"
  read -rp "  TELEGRAM_BOT_TOKEN: " v_tg </dev/tty || v_tg=""
  read -rp "  ANTHROPIC_API_KEY:  " v_ak </dev/tty || v_ak=""
  read -rp "  CRM_TOKEN (можно позже): " v_crm </dev/tty || v_crm=""
  set_var TELEGRAM_BOT_TOKEN "${v_tg:-}"
  set_var ANTHROPIC_API_KEY "${v_ak:-}"
  set_var CRM_TOKEN "${v_crm:-}"
else
  echo "→ .env уже существует — не трогаю."
fi

# --- 4. Запуск -----------------------------------------------------------------
echo "→ Собираю и запускаю (kolumbus-bot + kolumbus-watchdog)…"
$SUDO docker compose up -d --build
echo
$SUDO docker compose ps
echo
echo "✅ Готово! Дальше:"
echo "   1) Напишите боту /id в личку и в чате команды — получите ID."
echo "   2) Впишите их в $DIR/kolumbus/.env (TEAM_USER_IDS, TEAM_CHAT_ID, ALERT_CHAT_IDS)."
echo "   3) Перезапуск:  cd $DIR/kolumbus && ${SUDO:+sudo }docker compose restart"
echo "   Логи:           cd $DIR/kolumbus && ${SUDO:+sudo }docker compose logs -f kolumbus"
