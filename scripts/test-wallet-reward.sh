#!/bin/bash

# 🎁 Тестовый скрипт для выдачи награды пользователю
# Использование: ./scripts/test-wallet-reward.sh <user_id> <amount>

USER_ID=${1:-"test_user_123"}
AMOUNT=${2:-500000000}  # 0.5 FODI по умолчанию

API_URL="https://bot-fodifood-lcon.shuttle.app"

echo "🎁 Выдача награды пользователю..."
echo "👤 User ID: $USER_ID"
echo "💰 Amount: $AMOUNT ($(echo "scale=2; $AMOUNT/1000000000" | bc) FODI)"
echo ""

# Выдаём награду
curl -X POST "$API_URL/api/bank/reward" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"amount\": $AMOUNT,
    \"reason\": \"test_reward\"
  }" | jq '.'

echo ""
echo "✅ Готово! Проверьте баланс:"
echo "curl -s $API_URL/api/bank/balance/$USER_ID/full | jq '.'"
