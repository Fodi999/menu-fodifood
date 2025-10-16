#!/bin/bash

# 🧪 Тестирование Rust Backend API
# Использование: chmod +x test-rust-api.sh && ./test-rust-api.sh

API_URL="http://127.0.0.1:8000/api/v1"

echo "🧪 Тестирование FodiFood Rust Backend API"
echo "========================================="
echo ""

# 1. Health Check
echo "1️⃣ Health Check"
echo "GET $API_URL/health"
curl -s "$API_URL/health" | jq '.' || echo "❌ Health check failed"
echo ""
echo ""

# 2. Получение продуктов
echo "2️⃣ Получение списка продуктов"
echo "GET $API_URL/products"
curl -s "$API_URL/products" | jq '.' || echo "❌ Products fetch failed"
echo ""
echo ""

# 3. Регистрация пользователя
echo "3️⃣ Регистрация нового пользователя"
echo "POST $API_URL/auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@fodifood.com",
    "password": "test123456",
    "name": "Test User"
  }')
echo "$REGISTER_RESPONSE" | jq '.' || echo "❌ Registration failed"
echo ""
echo ""

# 4. Вход пользователя
echo "4️⃣ Вход пользователя"
echo "POST $API_URL/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@fodifood.com",
    "password": "test123456"
  }')
echo "$LOGIN_RESPONSE" | jq '.'

# Извлекаем токен
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed - no token received"
else
  echo "✅ Token received: $TOKEN"
fi
echo ""
echo ""

# 5. Получение профиля (с авторизацией)
if [ ! -z "$TOKEN" ]; then
  echo "5️⃣ Получение профиля пользователя"
  echo "GET $API_URL/auth/me"
  curl -s "$API_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN" | jq '.' || echo "❌ Profile fetch failed"
  echo ""
  echo ""
fi

# 6. Создание заказа (с авторизацией)
if [ ! -z "$TOKEN" ]; then
  echo "6️⃣ Создание тестового заказа"
  echo "POST $API_URL/orders"
  curl -s -X POST "$API_URL/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "name": "Test User",
      "phone": "+48123456789",
      "address": "Test Address 123",
      "comment": "Test order",
      "items": [
        {
          "productId": "1",
          "quantity": 2,
          "price": 25.99
        }
      ]
    }' | jq '.' || echo "❌ Order creation failed"
  echo ""
  echo ""
fi

# 7. Получение заказов (с авторизацией)
if [ ! -z "$TOKEN" ]; then
  echo "7️⃣ Получение списка заказов"
  echo "GET $API_URL/orders"
  curl -s "$API_URL/orders" \
    -H "Authorization: Bearer $TOKEN" | jq '.' || echo "❌ Orders fetch failed"
  echo ""
  echo ""
fi

echo "========================================="
echo "✅ Тестирование завершено!"
echo ""
echo "💡 Если вы видите ошибки:"
echo "  1. Убедитесь что Rust backend запущен: cargo shuttle run"
echo "  2. Проверьте что порт 8000 доступен"
echo "  3. Проверьте логи backend в терминале"
