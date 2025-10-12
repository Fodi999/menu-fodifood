# 🤖 Интеграция Rust AI Bot с Next.js Frontend

## 📋 Обзор

Этот гайд описывает интеграцию WebSocket чата с AI ботом на Rust в Next.js приложение FODI SUSHI.

## 🔧 Настройка переменных окружения

### `.env.local` (Локальная разработка)

```bash
# Rust Bot WebSocket URL (локально)
NEXT_PUBLIC_RUST_BOT_URL="http://127.0.0.1:8000"

# Go Backend URL (локально)
NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8080"
```

### `.env.production` (Production - Vercel)

```bash
# Rust Bot WebSocket URL (Production)
NEXT_PUBLIC_RUST_BOT_URL="https://fodifood-bot.shuttleapp.rs"

# Или если деплоите на Koyeb:
# NEXT_PUBLIC_RUST_BOT_URL="https://your-rust-bot.koyeb.app"

# Go Backend URL
NEXT_PUBLIC_BACKEND_URL="https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app"
```

## 📂 Структура файлов

```
src/
├── hooks/
│   └── useChatSocket.ts       # WebSocket хук для общения с Rust ботом
└── app/
    └── chat/
        └── page.tsx            # Страница чата с AI
```

## 🎯 Компоненты

### 1. `useChatSocket.ts` - WebSocket Hook

**Функционал:**
- ✅ Автоматическое подключение к WebSocket серверу
- ✅ Отслеживание статуса подключения
- ✅ Отправка и получение сообщений
- ✅ Обработка ошибок
- ✅ SSR-совместимость (проверка `window`)

**Использование:**
```typescript
const { messages, sendMessage, isConnected } = useChatSocket();
```

**API:**
- `messages: string[]` - массив всех сообщений
- `sendMessage(text: string)` - отправить сообщение боту
- `isConnected: boolean` - статус подключения

### 2. `chat/page.tsx` - Chat UI

**Функционал:**
- ✅ Красивый UI на shadcn/ui компонентах
- ✅ Автоскролл к новым сообщениям
- ✅ Badge индикатор подключения
- ✅ Разные цвета для бота и пользователя
- ✅ Адаптивный дизайн
- ✅ Темная тема

**Компоненты shadcn/ui:**
- Card, CardHeader, CardTitle, CardContent
- ScrollArea
- Button
- Input
- Badge

## 🚀 Запуск

### Локальная разработка

1. **Запустите Rust бот:**
```bash
cd rust-bot
cargo run
# Сервер запустится на http://127.0.0.1:8000
```

2. **Запустите Next.js:**
```bash
npm run dev
# Откройте http://localhost:3000/chat
```

### Production деплой

1. **Задеплойте Rust бот на Shuttle:**
```bash
cd rust-bot
shuttle deploy
# URL: https://fodifood-bot.shuttleapp.rs
```

2. **Обновите переменные на Vercel:**
```bash
vercel env add NEXT_PUBLIC_RUST_BOT_URL
# Введите: https://fodifood-bot.shuttleapp.rs
```

3. **Редеплойте фронтенд:**
```bash
git push origin main
# Vercel автоматически задеплоит
```

## 🎨 UI Features

### Индикатор подключения
- 🟢 **Green Badge** - Connected (WebSocket активен)
- 🔴 **Red Badge** - Disconnected (нет подключения)

### Сообщения
- 🤖 **Bot messages** - Оранжевый аватар, серый фон
- 🧑 **User messages** - Синий аватар, синий фон

### Empty State
- Показывается когда нет сообщений
- Иконка бота + подсказка

### Error Handling
- Желтый alert если WebSocket не подключен
- Кнопка отправки disabled при отсутствии подключения

## 🔌 WebSocket Protocol

### URL Format
```
ws://127.0.0.1:8000/ws  (локально)
wss://fodifood-bot.shuttleapp.rs/ws  (production)
```

### Message Format
**От клиента к боту:**
```
Обычный текст сообщения
```

**От бота к клиенту:**
```
AI ответ в текстовом формате
```

## 🛠️ Технический стек

- **WebSocket Client**: Native browser WebSocket API
- **State Management**: React useState
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Styling**: Tailwind CSS
- **SSR**: Next.js App Router (client component)

## 📱 Адаптивность

Полностью адаптивный дизайн:
- **Mobile**: < 640px - вертикальное расположение
- **Tablet**: ≥ 640px - горизонтальное расположение  
- **Desktop**: ≥ 768px - полный UI

## 🔍 Отладка

### Проверка подключения

1. Откройте DevTools Console
2. Найдите сообщения:
```
✅ Connected to Rust bot
```

### Если не подключается:

1. Проверьте что Rust бот запущен
2. Проверьте URL в `.env.local`:
```bash
echo $NEXT_PUBLIC_RUST_BOT_URL
```
3. Проверьте CORS настройки в Rust боте
4. Проверьте WebSocket endpoint `/ws`

### Network Tab

В DevTools → Network → WS можно увидеть:
- Статус подключения (101 Switching Protocols)
- Входящие/исходящие сообщения
- Время подключения

## 🚨 Troubleshooting

### WebSocket closed immediately
**Проблема**: Соединение закрывается сразу после открытия

**Решение**: Проверьте CORS в Rust боте:
```rust
.allow_origin("http://localhost:3000")
.allow_origin("https://menu-fodifood.vercel.app")
```

### Cannot connect to ws://
**Проблема**: Mixed content (HTTPS page → WS connection)

**Решение**: Используйте WSS (wss://) для production

### Messages not updating
**Проблема**: Новые сообщения не отображаются

**Решение**: Проверьте `socket.onmessage` handler и state update

## 📊 Производительность

- WebSocket соединение: ~10ms latency (локально)
- Автоскролл: Debounced для производительности
- State updates: Оптимизированы с useCallback

## 🔐 Безопасность

- ✅ Валидация WebSocket URL
- ✅ Проверка readyState перед отправкой
- ✅ Обработка ошибок подключения
- ✅ SSR-safe (проверка window)

## 📚 Дополнительные ресурсы

- [WebSocket API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🎯 Roadmap

- [ ] Поддержка markdown в сообщениях
- [ ] История чата (localStorage)
- [ ] Typing indicator
- [ ] File uploads
- [ ] Voice messages
- [ ] Multi-language support (i18n)
- [ ] Message reactions
- [ ] Chat rooms
