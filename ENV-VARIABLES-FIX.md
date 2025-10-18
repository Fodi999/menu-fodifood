# 🔧 Исправление переменных окружения

## ❌ Проблемы, которые были найдены:

### 1. **rust-api.ts** - Неправильное имя переменной
```typescript
// ❌ БЫЛО:
const RUST_API_URL = process.env.NEXT_PUBLIC_RUST_API || 'http://127.0.0.1:8000';

// ✅ СТАЛО:
const RUST_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
```

### 2. **mock-api.ts** - Hardcoded URL
```typescript
// ❌ БЫЛО:
const response = await fetch("http://127.0.0.1:8000/health", {

// ✅ СТАЛО:
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const baseUrl = API_URL.replace('/api/v1', '');
const response = await fetch(`${baseUrl}/health`, {
```

### 3. **app/api/orders/route.ts** - Неправильный fallback
```typescript
// ❌ БЫЛО:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ✅ СТАЛО:
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
```

### 4. **.env.local** - Добавлена недостающая переменная
```bash
# ✅ ДОБАВЛЕНО:
NEXT_PUBLIC_INSIGHT_WS="ws://127.0.0.1:8000/api/v1/insight"
```

---

## ✅ Результат проверки:

### Файлы, которые ПРАВИЛЬНО используют переменные:

1. ✅ **src/lib/api.ts**
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
   ```

2. ✅ **src/lib/utils.ts**
   ```typescript
   export function getApiUrl(): string {
     return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
   }
   
   export function getWsUrl(): string {
     return process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000/api/v1/admin/ws";
   }
   ```

3. ✅ **src/hooks/useInsights.ts**
   ```typescript
   const INSIGHT_WS_URL = process.env.NEXT_PUBLIC_INSIGHT_WS || 'ws://127.0.0.1:8000/api/v1/insight';
   ```

4. ✅ **src/hooks/useUIEvents.ts**
   ```typescript
   const INSIGHT_WS_URL = process.env.NEXT_PUBLIC_INSIGHT_WS || 'ws://127.0.0.1:8000/api/v1/insight';
   ```

---

## 📋 Итоговая конфигурация .env.local:

```bash
# 🔧 FRONTEND ENVIRONMENT (Next.js)

# Rust Backend API - единая точка входа для всех запросов
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000/api/v1"

# WebSocket URLs для real-time функций
NEXT_PUBLIC_WS_URL="ws://127.0.0.1:8000/api/v1/admin/ws"
NEXT_PUBLIC_INSIGHT_WS="ws://127.0.0.1:8000/api/v1/insight"

# JWT Secret для авторизации
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

---

## 🚀 Для Production (Vercel):

В настройках Vercel нужно добавить:

```bash
NEXT_PUBLIC_API_URL=https://your-rust-backend.shuttleapp.rs/api/v1
NEXT_PUBLIC_WS_URL=wss://your-rust-backend.shuttleapp.rs/api/v1/admin/ws
NEXT_PUBLIC_INSIGHT_WS=wss://your-rust-backend.shuttleapp.rs/api/v1/insight
JWT_SECRET=your-production-secret-key
```

---

## ✅ Проверка:

- ✅ Build успешен (29 страниц)
- ✅ Все API запросы используют `process.env.NEXT_PUBLIC_API_URL`
- ✅ Нет hardcoded URLs
- ✅ Fallback значения корректны
- ✅ WebSocket URLs настроены

---

## 🎯 Итог:

**Фронтенд теперь готов к production deployment!**

Все запросы будут автоматически использовать правильный API URL из переменных окружения:
- В development: `http://127.0.0.1:8000/api/v1`
- В production: URL из Vercel environment variables
