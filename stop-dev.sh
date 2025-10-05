#!/bin/bash

echo "🛑 Stopping FODI SUSHI Servers..."

if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo "Stopping Backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    rm .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo "Stopping Frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    rm .frontend.pid
fi

# Убиваем все процессы на портах 8080 и 3000
echo "Cleaning up ports 8080 and 3000..."
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

echo "✅ All servers stopped!"
