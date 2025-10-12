# 🤖 Rust AI Chat Integration

Интеграция AI чат-бота на Rust с Next.js фронтендом через WebSocket.

## 📋 Структура

```
src/
├── app/
│   └── chat/
│       └── page.tsx          # Страница чата с UI
├── hooks/
│   └── useChatSocket.ts      # WebSocket hook для Rust бота
└── components/
    └── Header.tsx            # Добавлена кнопка "AI Chat"
```

## 🔧 Переменные окружения

### `.env.local` (Development)
```bash
NEXT_PUBLIC_RUST_BOT_URL=http://127.0.0.1:8000
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8080
```

### `.env.production` (Production)
```bash
# Shuttle deployment
NEXT_PUBLIC_RUST_BOT_URL=https://fodifood-bot.shuttleapp.rs

# Koyeb deployment
NEXT_PUBLIC_RUST_BOT_URL=https://your-rust-bot.koyeb.app
```

## 🚀 Использование

### 1. Хук `useChatSocket`

```typescript
import { useChatSocket } from "@/hooks/useChatSocket";

const { messages, sendMessage, isConnected } = useChatSocket();
```

**Возвращает:**
- `messages: string[]` - Массив всех сообщений
- `sendMessage: (text: string) => void` - Отправка сообщения
- `isConnected: boolean` - Статус подключения

### 2. Страница чата

**URL**: `/chat`
- Доступен через кнопку "AI Chat" в Header
- Адаптивный дизайн для всех устройств
- Автоскролл при новых сообщениях
- Индикатор статуса подключения

## 🎨 UI Компоненты

Использует shadcn/ui:
- `Card` - Контейнер чата
- `ScrollArea` - Прокрутка сообщений
- `Input` - Поле ввода
- `Button` - Кнопка отправки
- `Badge` - Статус подключения

## 🔌 WebSocket Protocol

### Подключение
```
ws://127.0.0.1:8000/ws
```

### Формат сообщений

**От клиента:**
```
"Привет, как дела?"
```

**От бота:**
```
"🤖 Ответ от AI..."
```

## 📱 Доступ к чату

### В интерфейсе:
1. Header → кнопка "AI Chat" (иконка MessageCircle)
2. Прямая ссылка: http://localhost:3000/chat

### На мобильных:
- Видна только иконка MessageCircle
- На планшетах/десктопе: иконка + текст "AI Chat"

## 🎯 Особенности

### Безопасность
- SSR проверка (`typeof window === "undefined"`)
- Проверка статуса WebSocket перед отправкой
- Обработка ошибок подключения

### UX
- ✅ Автоматическая прокрутка к последнему сообщению
- ✅ Визуальное разделение сообщений пользователя и бота
- ✅ Индикатор статуса подключения (зеленый/красный)
- ✅ Disabled state при отсутствии подключения
- ✅ Адаптивный дизайн (mobile-first)

### Иконки
- 🤖 Bot - Сообщения от AI
- 🧑 User - Сообщения пользователя
- ✅ Wifi - Подключено
- ❌ WifiOff - Отключено

## 🛠️ Запуск

### Development
```bash
# Терминал 1: Rust бот
cd rust-bot
cargo run

# Терминал 2: Next.js
npm run dev
```

### Production
1. Деплой Rust бота на Shuttle/Koyeb
2. Обновить `NEXT_PUBLIC_RUST_BOT_URL` в Vercel
3. Деплой Next.js на Vercel

## 🐛 Troubleshooting

### "Disconnected" в чате
- ✅ Проверьте что Rust бот запущен
- ✅ Проверьте URL: `http://127.0.0.1:8000/ws`
- ✅ Проверьте CORS настройки в Rust боте

### WebSocket ошибки
```typescript
// В консоли браузера:
WebSocket connection failed
```
**Решение**: Убедитесь что бот слушает на правильном порту

## 📊 Архитектура

```
Frontend (Next.js)
    ↓ WebSocket
Rust Bot (Actix/Tokio)
    ↓ API
AI Service (OpenAI/Local)
```

## 🔗 Полезные ссылки

- Rust WebSocket server: `/rust-bot`
- Frontend chat: `/src/app/chat`
- Hook: `/src/hooks/useChatSocket.ts`

## 💡 Будущие улучшения

- [ ] История сообщений (сохранение в localStorage)
- [ ] Typing indicator (бот печатает...)
- [ ] Markdown рендеринг в сообщениях
- [ ] Загрузка файлов
- [ ] Voice-to-text
- [ ] Эмодзи picker
- [ ] Темы оформления
