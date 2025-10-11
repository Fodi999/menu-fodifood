#!/bin/bash

echo "🚀 FODI SUSHI - Локальная разработка"
echo "===================================="
echo ""

# Проверяем наличие Go
if ! command -v go &> /dev/null; then
    echo "❌ Go не установлен. Установите Go с https://go.dev/dl/"
    exit 1
fi

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js с https://nodejs.org/"
    exit 1
fi

echo "✅ Go версия: $(go version | cut -d ' ' -f 3)"
echo "✅ Node.js версия: $(node --version)"
echo ""

# Проверяем существование backend директории
if [ ! -d "backend" ]; then
    echo "❌ Папка backend не найдена!"
    echo "   Создайте папку backend с Go сервером"
    exit 1
fi

echo "📦 Устанавливаем зависимости..."
npm install

echo ""
echo "🔧 Используем локальную конфигурацию (.env.development.local)"
echo "   NEXT_PUBLIC_API_URL=http://localhost:8080"
echo ""

# Функция для очистки процессов при выходе
cleanup() {
    echo ""
    echo "🛑 Останавливаем серверы..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

echo "🚀 Запускаем Go backend на порту 8080..."
cd backend
go run main.go &
BACKEND_PID=$!
cd ..

# Ждем запуска бэкенда
sleep 3

echo ""
echo "🎨 Запускаем Next.js frontend на порту 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Серверы запущены!"
echo ""
echo "📍 Backend:  http://localhost:8080"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "💡 Нажмите Ctrl+C для остановки"
echo ""

# Ждем
wait
