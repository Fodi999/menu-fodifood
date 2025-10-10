#!/bin/bash

# 🚀 Скрипт быстрого запуска MCP Server для FODI SUSHI

set -e

echo "🚀 Установка и запуск MCP Server для FODI SUSHI"
echo "================================================"
echo ""

# Переход в директорию MCP сервера
cd "$(dirname "$0")"

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo "Установите Node.js: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js версия: $NODE_VERSION"
echo ""

# Проверка npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен!"
    exit 1
fi

# Установка зависимостей если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
    echo "✅ Зависимости установлены"
    echo ""
fi

# Проверка порта
PORT=${HTTP_PORT:-3001}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Порт $PORT уже занят!"
    echo "Остановите процесс или измените порт в .env"
    exit 1
fi

echo "🎯 Запуск MCP сервера..."
echo "📍 HTTP API: http://localhost:$PORT"
echo "📍 WebSocket: ws://localhost:$PORT"
echo ""
echo "💡 Нажмите Ctrl+C для остановки"
echo "================================================"
echo ""

# Запуск в dev режиме
npm run dev
