#!/bin/bash

# 🚀 Скрипт применения миграций к production базе данных (Neon)

echo "🔧 Применение миграций Prisma к production базе данных..."
echo ""

# Проверяем, что DATABASE_URL установлен
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Ошибка: DATABASE_URL не установлен!"
  echo ""
  echo "📝 Установите переменную окружения DATABASE_URL из Neon:"
  echo "   export DATABASE_URL='postgresql://[user]:[password]@[host]/[database]?sslmode=require'"
  echo ""
  exit 1
fi

echo "✅ DATABASE_URL найден"
echo "📊 Применяем миграции..."
echo ""

# Применяем миграции
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Миграции успешно применены!"
  echo ""
  echo "🌱 Хотите засейдить базу данных тестовыми данными? (y/n)"
  read -r response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🌱 Запускаем seed..."
    npx prisma db seed
    echo "✅ Seed выполнен!"
  fi
else
  echo ""
  echo "❌ Ошибка при применении миграций!"
  echo ""
  echo "💡 Попробуйте альтернативный метод:"
  echo "   npx prisma db push"
  echo ""
  exit 1
fi

echo ""
echo "🎉 Готово! База данных настроена."
echo "🚀 Теперь можно деплоить на Vercel!"
