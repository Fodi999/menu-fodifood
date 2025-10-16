# 🦀 Rust API Integration Guide

## ✅ Что сделано

### 1️⃣ API Client (`src/lib/rust-api.ts`)
- ✅ Unified Rust Gateway client
- ✅ Simplified exports для быстрого доступа
- ✅ Полная типизация TypeScript
- ✅ Автоматическая обработка JWT токенов

### 2️⃣ Страницы

#### 💬 AI Chat (`/chat`)
```typescript
// Использование:
import { sendChatMessage } from '@/lib/rust-api';

const response = await sendChatMessage(userId, "Покажи меню");
```

**Endpoints:**
- `POST /api/v1/chat/message` - Отправка сообщения
- `GET /api/v1/chat/suggestions` - Подсказки
- `GET /api/v1/chat/conversations` - История

#### 📊 Метрики (`/admin/metrics`)
```typescript
// Использование:
import { fetchMetrics, fetchInsights } from '@/lib/rust-api';

const metrics = await fetchMetrics(businessId, MetricsPeriod.MONTH);
const insights = await fetchInsights(businessId);
```

**Endpoints:**
- `GET /admin/metrics?business_id=...&period=...`
- `GET /api/v1/insights?business=...`
- `POST /api/v1/insights/generate`

#### 🏪 Витрина бизнесов (`/`)
```typescript
// Использование:
import { fetchBusinesses } from '@/lib/rust-api';

const businesses = await fetchBusinesses({ city: "Москва" });
```

**Endpoints:**
- `GET /api/v1/businesses` - Список всех
- `GET /api/v1/businesses/:id` - По ID
- `GET /api/v1/businesses/slug/:slug` - По slug
- `POST /api/v1/businesses` - Создать
- `PUT /api/v1/businesses/:id` - Обновить

### 3️⃣ Hooks

#### `useInsights(businessId)`
Загрузка AI инсайтов для бизнеса

```typescript
const { insights, loading, error, refresh } = useInsights(businessId);
```

#### `useUIEvents()`
WebSocket для UI событий (уже работает)

```typescript
const { isConnected } = useUIEvents();
```

---

## 🚀 Как запустить

### 1. Запустить Rust backend
```bash
cd ../bot_fodifood
cargo run --bin local
```

Должен запуститься на `http://127.0.0.1:8000`

### 2. Запустить Next.js
```bash
npm run dev
```

### 3. Проверить интеграцию

#### Открыть страницы:
- `http://localhost:3000` - Витрина (пока показывает моки)
- `http://localhost:3000/chat` - AI Chat
- `http://localhost:3000/admin/metrics` - Метрики

#### Проверить консоль браузера:
- Ошибки `API Error: 404` → Rust API не реализовал endpoint
- `Rust API недоступен` → Сервер не запущен
- Нет ошибок → Всё работает! ✅

---

## 📋 Что нужно реализовать в Rust

### Приоритет 1 (для витрины):
```rust
// src/handlers/businesses.rs
GET  /api/v1/businesses           // Список
GET  /api/v1/businesses/:id       // По ID
GET  /api/v1/businesses/slug/:slug // По slug
POST /api/v1/businesses           // Создать
PUT  /api/v1/businesses/:id       // Обновить
```

### Приоритет 2 (для чата):
```rust
// src/handlers/chat.rs
POST /api/v1/chat/message         // Уже есть?
GET  /api/v1/chat/suggestions     // Подсказки
GET  /api/v1/chat/conversations   // История
```

### Приоритет 3 (для аналитики):
```rust
// src/handlers/metrics.rs
GET /admin/metrics?business_id=...&period=...
GET /api/v1/insights?business=...
POST /api/v1/insights/generate
```

---

## 🔌 API Response Examples

### GET /api/v1/businesses
```json
[
  {
    "id": "uuid",
    "slug": "fodi-sushi",
    "name": "FODI SUSHI",
    "description": "Лучшие суши в городе",
    "category": "RESTAURANT",
    "city": "Москва",
    "logo_url": "/logo.png",
    "owner_id": "uuid",
    "is_active": true,
    "rating": 4.8,
    "subscribers_count": 1250,
    "products_count": 45
  }
]
```

### POST /api/v1/chat/message
```json
// Request:
{
  "user_id": "uuid",
  "message": "Покажи меню",
  "business_id": "uuid"
}

// Response:
{
  "message": {
    "id": "uuid",
    "role": "assistant",
    "content": "Вот наше меню...",
    "product_suggestions": [
      {
        "product_id": "uuid",
        "product_name": "Филадельфия",
        "reason": "Самый популярный выбор"
      }
    ]
  }
}
```

### GET /admin/metrics?business_id=...&period=month
```json
{
  "revenue": {
    "total": 125000,
    "growth": 15.5,
    "chart_data": []
  },
  "orders": {
    "total": 342,
    "completed": 320,
    "cancelled": 22,
    "average_value": 365
  },
  "conversion": {
    "rate": 93.5,
    "completed": 320,
    "total": 342
  },
  "products": {
    "total": 45,
    "active": 42,
    "out_of_stock": 3
  }
}
```

---

## 🧪 Тестирование

### Проверить здоровье API:
```bash
curl http://127.0.0.1:8000/health
```

### Проверить чат:
```bash
curl -X POST http://127.0.0.1:8000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","message":"привет"}'
```

### Проверить бизнесы:
```bash
curl http://127.0.0.1:8000/api/v1/businesses
```

---

## 📊 Статус интеграции

| Компонент | Frontend | Rust Backend | Статус |
|-----------|----------|--------------|--------|
| AI Chat | ✅ | ✅ (частично) | 🟡 Тестируется |
| Businesses CRUD | ✅ | ⏳ | 🔴 Ожидает |
| Metrics | ✅ | ⏳ | 🔴 Ожидает |
| Insights | ✅ | ⏳ | 🔴 Ожидает |
| WebSocket UI | ✅ | ✅ | 🟢 Работает |

---

**Дата:** 16 октября 2025  
**Версия:** 1.0.0
