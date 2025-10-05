#!/bin/bash

# 🔍 Скрипт проверки переменных окружения

echo "🔍 Проверка переменных окружения..."
echo ""

# Локальные переменные
echo "📂 Локальные переменные (.env.local):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f .env.local ]; then
  echo "✅ .env.local найден"
  echo ""
  
  # DATABASE_URL
  if grep -q "DATABASE_URL" .env.local; then
    DB_URL=$(grep "DATABASE_URL=" .env.local | head -1 | cut -d'=' -f2 | tr -d '"')
    DB_HOST=$(echo "$DB_URL" | sed -n 's/.*@\([^/]*\).*/\1/p')
    echo "DATABASE_URL: postgresql://...@${DB_HOST}/neondb"
  else
    echo "❌ DATABASE_URL не найден"
  fi
  
  # NEXTAUTH_URL
  if grep -q "NEXTAUTH_URL" .env.local; then
    NEXTAUTH_URL=$(grep "NEXTAUTH_URL=" .env.local | cut -d'=' -f2 | tr -d '"')
    echo "NEXTAUTH_URL: $NEXTAUTH_URL"
  else
    echo "❌ NEXTAUTH_URL не найден"
  fi
  
  # NEXTAUTH_SECRET
  if grep -q "NEXTAUTH_SECRET" .env.local; then
    SECRET=$(grep "NEXTAUTH_SECRET=" .env.local | cut -d'=' -f2 | tr -d '"')
    SECRET_LENGTH=${#SECRET}
    SECRET_PREVIEW="${SECRET:0:10}...${SECRET: -5}"
    echo "NEXTAUTH_SECRET: $SECRET_PREVIEW (длина: $SECRET_LENGTH)"
  else
    echo "❌ NEXTAUTH_SECRET не найден"
  fi
else
  echo "❌ .env.local не найден"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Проверка на Vercel:"
echo "1. Перейдите: https://vercel.com/dashboard"
echo "2. Выберите проект: menu-fodifood"
echo "3. Settings → Environment Variables"
echo ""
echo "✅ Проверьте, что следующие переменные установлены:"
echo ""
echo "   DATABASE_URL (должно содержать: ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech)"
echo "   NEXTAUTH_URL (должно быть: https://menu-fodifood.vercel.app)"
echo "   NEXTAUTH_SECRET (должно быть: $SECRET_PREVIEW)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔑 Ваш NEXTAUTH_SECRET для копирования:"
echo "$SECRET"
echo ""
echo "💡 Скопируйте это значение и вставьте на Vercel"
