# 🏗️ Архитектура проекта FodiFood

## 📊 Обзор системы (Gateway Pattern)

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                         │
│                   localhost:3000                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ WebSocket + REST
                            ▼
                ┌──────────────────────────┐
                │  Elixir Phoenix Gateway  │
                │     localhost:4000       │
                │                          │
                │  • WebSocket (AI hints)  │
                │  • REST API Proxy        │
                │  • Smart routing         │
                │  • Rate limiting         │
                │  • Caching               │
                └───────────┬──────────────┘
                            │
                            │ HTTP Proxy
                            ▼
                ┌──────────────────────┐
                │   Go Backend API     │
                │   localhost:8080     │
                │                      │
                │ • Business Logic     │
                │ • Database CRUD      │
                │ • Authentication     │
                │ • Validation         │
                └──────────┬───────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ PostgreSQL   │
                    │ (Neon)       │
                    └──────────────┘
```

---

## 🔌 Конфигурация (.env.local)

### ✅ Новая конфигурация (Gateway):

```env
# Elixir Gateway - единая точка входа
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_WS_URL="ws://localhost:4000/socket"
```

### ❌ Старая конфигурация (удалена):

```env
# NEXT_PUBLIC_API_URL="http://localhost:8080/api" - больше не используется
# NEXT_PUBLIC_RUST_BOT_URL - удалено
```

---

## 🚀 Преимущества Gateway архитектуры

### 1. **Единая точка входа**
- Весь трафик идет через Elixir
- Упрощенная конфигурация фронтенда
- Легче управлять версионированием API

### 2. **Интеллектуальная маршрутизация**
- Elixir решает, какие запросы идут в Go
- Какие обрабатываются локально (AI)
- Кеширование популярных запросов

### 3. **Безопасность**
- Go API не доступен напрямую
- Rate limiting на уровне Gateway
- Централизованная аутентификация

### 4. **Масштабируемость**
- Легко добавить новые сервисы
- Load balancing через Elixir
- Горизонтальное масштабирование

---

## 🔄 Маршрутизация запросов
