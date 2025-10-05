#!/bin/bash

# 🧪 Скрипт тестирования входа на Vercel

echo "🔐 Тестируем вход на Vercel..."
echo ""

# 1. Проверяем health endpoint
echo "1️⃣ Проверка здоровья приложения:"
curl -s https://menu-fodifood.vercel.app/api/health | jq '.'
echo ""

# 2. Получаем CSRF token
echo "2️⃣ Получаем CSRF token..."
CSRF_RESPONSE=$(curl -s -c cookies.txt https://menu-fodifood.vercel.app/api/auth/csrf)
CSRF_TOKEN=$(echo $CSRF_RESPONSE | jq -r '.csrfToken')
echo "CSRF Token: $CSRF_TOKEN"
echo ""

# 3. Выполняем вход
echo "3️⃣ Выполняем вход как admin..."
LOGIN_RESPONSE=$(curl -s -b cookies.txt -c cookies.txt \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{\"csrfToken\":\"$CSRF_TOKEN\",\"email\":\"admin@fodisushi.com\",\"password\":\"admin123\",\"redirect\":false,\"callbackUrl\":\"/profile\"}" \
  https://menu-fodifood.vercel.app/api/auth/callback/credentials)

echo "Ответ входа:"
echo $LOGIN_RESPONSE | jq '.'
echo ""

# 4. Проверяем сессию после входа
echo "4️⃣ Проверяем сессию после входа..."
SESSION_RESPONSE=$(curl -s -b cookies.txt https://menu-fodifood.vercel.app/api/auth/session)
echo "Сессия:"
echo $SESSION_RESPONSE | jq '.'
echo ""

# 5. Проверяем cookies
echo "5️⃣ Проверяем сохранённые cookies:"
cat cookies.txt | grep -v "^#"
echo ""

# 6. Проверяем debug endpoint
echo "6️⃣ Проверяем debug endpoint..."
DEBUG_RESPONSE=$(curl -s -b cookies.txt https://menu-fodifood.vercel.app/api/debug-auth)
echo $DEBUG_RESPONSE | jq '.'
echo ""

# Очистка
rm -f cookies.txt

echo "✅ Тест завершён!"
