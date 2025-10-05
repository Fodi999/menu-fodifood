# 🔄 Миграция на Go Backend

## 📋 Текущая архитектура (Monolith)

```
Next.js 15 (Frontend + Backend)
├── Frontend (React Components)
├── API Routes (/api/*)
├── NextAuth.js (Authentication)
├── Prisma ORM
└── PostgreSQL (Neon)
```

## 🎯 Целевая архитектура (Microservices)

```
┌─────────────────────┐         ┌─────────────────────┐
│   Next.js 15        │         │   Go Backend        │
│   (Frontend Only)   │◄───────►│   (REST API)        │
│                     │  HTTP   │                     │
│  - React UI         │         │  - Fiber/Gin        │
│  - SSR/SSG          │         │  - JWT Auth         │
│  - API Client       │         │  - GORM/sqlx        │
└─────────────────────┘         │  - Business Logic   │
                                └──────────┬──────────┘
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │  PostgreSQL (Neon)  │
                                └─────────────────────┘
```

## 📝 План миграции

### Этап 1: Создание Go Backend (2-3 дня)

#### 1.1 Инициализация Go проекта
```bash
mkdir fodi-sushi-backend
cd fodi-sushi-backend
go mod init github.com/Fodi999/fodi-sushi-backend

# Установка зависимостей
go get github.com/gofiber/fiber/v2
go get github.com/golang-jwt/jwt/v5
go get gorm.io/gorm
go get gorm.io/driver/postgres
go get github.com/joho/godotenv
```

#### 1.2 Структура Go проекта
```
fodi-sushi-backend/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── auth/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── middleware.go
│   ├── user/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   ├── product/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   ├── order/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── repository.go
│   └── models/
│       ├── user.go
│       ├── product.go
│       └── order.go
├── pkg/
│   ├── database/
│   │   └── postgres.go
│   ├── config/
│   │   └── config.go
│   └── utils/
│       └── response.go
├── migrations/
│   └── *.sql
├── .env
├── go.mod
└── go.sum
```

### Этап 2: API Endpoints (1-2 дня)

#### 2.1 Аутентификация
```
POST   /api/v1/auth/register       - Регистрация
POST   /api/v1/auth/login          - Вход
POST   /api/v1/auth/logout         - Выход
POST   /api/v1/auth/refresh        - Обновление токена
GET    /api/v1/auth/me             - Текущий пользователь
```

#### 2.2 Пользователи
```
GET    /api/v1/users               - Список пользователей (admin)
GET    /api/v1/users/:id           - Пользователь по ID
PUT    /api/v1/users/:id           - Обновление пользователя
DELETE /api/v1/users/:id           - Удаление пользователя (admin)
```

#### 2.3 Продукты
```
GET    /api/v1/products            - Список продуктов
GET    /api/v1/products/:id        - Продукт по ID
POST   /api/v1/products            - Создание продукта (admin)
PUT    /api/v1/products/:id        - Обновление продукта (admin)
DELETE /api/v1/products/:id        - Удаление продукта (admin)
```

#### 2.4 Заказы
```
GET    /api/v1/orders              - Список заказов
GET    /api/v1/orders/:id          - Заказ по ID
POST   /api/v1/orders              - Создание заказа
PUT    /api/v1/orders/:id          - Обновление заказа
DELETE /api/v1/orders/:id          - Удаление заказа
```

### Этап 3: Адаптация Next.js Frontend (2-3 дня)

#### 3.1 Создание API клиента
```typescript
// src/lib/api/client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = {
  async get(endpoint: string, token?: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
  
  async post(endpoint: string, data: any, token?: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // ... put, delete
};
```

#### 3.2 Замена NextAuth на JWT Auth
```typescript
// src/lib/auth/jwt.ts
export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
```

#### 3.3 Обновление компонентов
```typescript
// Было (NextAuth):
import { useSession } from "next-auth/react";
const { data: session } = useSession();

// Стало (Custom JWT):
import { useAuth } from "@/hooks/useAuth";
const { user, isLoading } = useAuth();
```

### Этап 4: Миграция данных (1 день)

#### 4.1 Экспорт данных из текущей БД
```bash
# Экспорт схемы
pg_dump -h <neon-host> -U <user> -d <db> --schema-only > schema.sql

# Экспорт данных
pg_dump -h <neon-host> -U <user> -d <db> --data-only > data.sql
```

#### 4.2 Миграция на Go GORM
```go
// internal/models/user.go
type User struct {
    ID        string    `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
    Email     string    `gorm:"uniqueIndex;not null"`
    Name      string
    Password  string    `gorm:"not null"`
    Role      string    `gorm:"type:varchar(20);default:'user'"`
    CreatedAt time.Time `gorm:"autoCreateTime"`
}
```

### Этап 5: Деплой (1 день)

#### 5.1 Go Backend на Railway/Render/Fly.io
```bash
# Dockerfile для Go
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main cmd/api/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

#### 5.2 Next.js Frontend на Vercel (как сейчас)
```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.fodisushi.com
```

## 🔄 Поэтапная миграция (Zero Downtime)

### Вариант 1: Big Bang (не рекомендуется)
- Весь переход за раз
- ❌ Риск простоя
- ❌ Сложно откатиться

### Вариант 2: Strangler Fig Pattern (рекомендуется)
```
Week 1: Go Backend + Auth API
Week 2: Переключить Auth на Go
Week 3: Go Products API
Week 4: Переключить Products на Go
Week 5: Go Orders API
Week 6: Переключить Orders на Go
Week 7: Удалить старые Next.js API routes
```

## 💰 Стоимость и ресурсы

### Команда
- 1 Go Developer (Senior) - 1 месяц
- 1 Frontend Developer - 2 недели

### Инфраструктура
- Go Backend Server: $10-20/месяц (Railway/Render)
- PostgreSQL (Neon): уже есть
- Next.js Frontend (Vercel): бесплатно
- **Итого:** +$10-20/месяц

## ⚖️ Плюсы и минусы

### ✅ Преимущества Go Backend

1. **Производительность**
   - В 10-50 раз быстрее чем Node.js
   - Лучше обрабатывает concurrent запросы

2. **Типизация**
   - Статическая типизация из коробки
   - Меньше runtime ошибок

3. **Деплой**
   - Один бинарный файл
   - Нет зависимостей (no node_modules)

4. **Масштабируемость**
   - Легко горизонтально масштабировать
   - Меньше потребление памяти

### ❌ Недостатки

1. **Время разработки**
   - Нужно переписать всю бизнес-логику
   - 1-2 месяца работы

2. **Сложность**
   - Дополнительный сервис для поддержки
   - CORS, API Gateway и т.д.

3. **Команда**
   - Нужен Go разработчик
   - Два стека технологий

## 🤔 Альтернативы

### Вариант A: Оставить Next.js API Routes
**Когда подходит:**
- Малый проект (< 10k пользователей)
- Небольшая команда
- Быстрое MVP

**Плюсы:**
- ✅ Уже работает
- ✅ Один стек
- ✅ Проще поддерживать

### Вариант B: Гибридный подход
**Архитектура:**
```
Next.js (Frontend + Simple API)
    │
    ├─► Go Microservice (Heavy operations)
    └─► Go Microservice (Real-time features)
```

**Когда подходит:**
- Есть специфичные задачи требующие высокой производительности
- Постепенная миграция

### Вариант C: Полная миграция на Go
**Архитектура:**
```
Next.js (Frontend Only) ──► Go Backend (All API)
```

**Когда подходит:**
- Большой проект (> 50k пользователей)
- Высокие требования к производительности
- Есть Go команда

## 🎯 Рекомендация

### Для вашего проекта (Интернет-магазин суши):

**📊 Текущая оценка:**
- Размер: Малый/Средний
- Трафик: < 10k пользователей/месяц
- Команда: 1-2 разработчика

**💡 Рекомендация: Вариант B (Гибридный подход)**

1. **Оставить Next.js API для:**
   - Аутентификация (NextAuth работает отлично)
   - CRUD операции (User, Product, Order)
   - Простые эндпоинты

2. **Добавить Go микросервис для:**
   - Обработка платежей (если будет Stripe/PayPal)
   - Рекомендации продуктов (ML)
   - Real-time заказы (WebSocket)
   - Экспорт отчетов (PDF/Excel)

3. **Преимущества:**
   - ✅ Лучшее из двух миров
   - ✅ Постепенная миграция
   - ✅ Можно начать с малого

## 📅 Next Steps

Если всё же хотите мигрировать:

### Шаг 1: Proof of Concept (1 неделя)
```bash
# Создать минимальный Go API
- Auth endpoints (login/register)
- JWT middleware
- One CRUD resource (Products)
```

### Шаг 2: A/B Testing (1 неделя)
```
- 10% трафика на Go API
- 90% на Next.js API
- Сравнить метрики
```

### Шаг 3: Решение
```
Если метрики улучшились > 30%:
  → Продолжить миграцию
Иначе:
  → Остаться на Next.js
```

---

**Вопрос:** Почему вы хотите перейти на Go backend? 

- [ ] Проблемы с производительностью?
- [ ] Масштабирование?
- [ ] Предпочтение технологии?
- [ ] Требование команды?

Уточните причину, и я дам более конкретные рекомендации! 🎯
