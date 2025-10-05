#!/bin/bash

echo "🚀 Starting FODI SUSHI Development Servers..."
echo ""

# Запуск Backend
echo "📦 Starting Go Backend on port 8080..."
cd backend && go run cmd/server/main.go &
BACKEND_PID=$!
cd ..

# Пауза для запуска backend
sleep 2

# Запуск Frontend
echo "⚛️  Starting Next.js Frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo ""
echo "   🔧 Backend:  http://localhost:8080"
echo "   ⚛️  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Обработчик остановки
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Ожидание
wait
