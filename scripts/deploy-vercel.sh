#!/bin/bash

# Скрипт для развертывания на Vercel

echo "🚀 Начинаем развертывание на Vercel..."

# Проверяем что Vercel CLI установлен
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен. Устанавливаем..."
    npm install -g vercel
fi

# Проверяем что мы залогинены в Vercel
echo "🔑 Проверяем авторизацию в Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "🔐 Необходимо войти в Vercel..."
    vercel login
fi

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Проект успешно собран!"
    
    # Развертываем на Vercel
    echo "🚀 Развертываем на Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Развертывание завершено успешно!"
        echo "📝 Не забудьте проверить переменные окружения в Vercel Dashboard"
        echo "🔗 https://vercel.com/dashboard"
    else
        echo "❌ Ошибка при развертывании"
    fi
else
    echo "❌ Ошибка при сборке проекта"
fi
