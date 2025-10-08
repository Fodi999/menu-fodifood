#!/bin/bash

# Скрипт для создания простого звука уведомления
# Требует установленного ffmpeg: brew install ffmpeg

echo "🔊 Генерация звука уведомления..."

# Проверяем наличие ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg не установлен. Установите: brew install ffmpeg"
    exit 1
fi

# Генерируем простой звук уведомления (два коротких бипа)
ffmpeg -f lavfi -i "sine=frequency=800:duration=0.1" -af "volume=0.3" /tmp/beep1.mp3 -y
ffmpeg -f lavfi -i "sine=frequency=1000:duration=0.1" -af "volume=0.3" /tmp/beep2.mp3 -y

# Склеиваем два звука с паузой
ffmpeg -f lavfi -i "anullsrc=r=44100:cl=mono" -t 0.05 /tmp/silence.mp3 -y
echo "file '/tmp/beep1.mp3'" > /tmp/concat.txt
echo "file '/tmp/silence.mp3'" >> /tmp/concat.txt
echo "file '/tmp/beep2.mp3'" >> /tmp/concat.txt

ffmpeg -f concat -safe 0 -i /tmp/concat.txt -c copy public/notification.mp3 -y

# Очистка временных файлов
rm /tmp/beep1.mp3 /tmp/beep2.mp3 /tmp/silence.mp3 /tmp/concat.txt

echo "✅ Звук создан: public/notification.mp3"
echo "🎵 Тестирование: afplay public/notification.mp3"
