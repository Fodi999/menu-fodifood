# 🔗 Интеграция Go Backend с Next.js Frontend

## ✅ Что реализовано

### 1. **Go Backend (порт 8080)**
- ✅ PostgreSQL интеграция через GORM
- ✅ JWT аутентификация
- ✅ RESTful API endpoints
- ✅ CORS настроен для Next.js
- ✅ Middleware для авторизации и проверки админ-прав
- ✅ JSON ответы для всех endpoints

### 2. **Next.js Frontend (порт 3000)**
- ✅ AuthContext для управления состоянием пользователя
- ✅ Интеграция с Go API через NEXT_PUBLIC_API_URL
- ✅ JWT токены в localStorage
- ✅ Защищённые роуты через middleware
- ✅ Страницы входа, регистрации, профиля, админки

### 3. **База данных PostgreSQL (Neon)**
- ✅ Единая БД для обоих приложений
- ✅ Prisma схема для Next.js
- ✅ GORM для Go backend
- ✅ 9 существующих пользователей

## 🔌 API Endpoints

### Публичные (без авторизации)

```bash
POST http://localhost:8080/api/auth/register
POST http://localhost:8080/api/auth/login
```

**Пример регистрации:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test User",
    "role": "user",
    "createdAt": "2025-10-05T..."
  }
}
```

### Защищённые (требуют JWT токен)

```bash
GET    http://localhost:8080/api/user/profile
PUT    http://localhost:8080/api/user/profile
```

**Пример получения профиля:**
```bash
curl http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Админ-панель (требуют роль admin)

```bash
GET    http://localhost:8080/api/admin/users
PUT    http://localhost:8080/api/admin/users/:id
DELETE http://localhost:8080/api/admin/users/:id
GET    http://localhost:8080/api/admin/orders
```

**Пример получения всех пользователей:**
```bash
curl http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 🚀 Как запустить

### Вариант 1: Оба сервера одновременно (рекомендуется)

```bash
./start-dev.sh        # С tmux (удобнее)
# или
./start-dev-simple.sh # Без tmux
```

### Вариант 2: По отдельности

**Терминал 1 - Go Backend:**
```bash
cd backend
go run cmd/server/main.go
```

**Терминал 2 - Next.js Frontend:**
```bash
npm run dev
```

### Остановка серверов

```bash
./stop-dev.sh
```

## 🔐 Аутентификация

### 1. Frontend → Backend

```typescript
// В AuthContext.tsx
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

### 2. Backend проверяет JWT

```go
// В middleware/auth.go
claims, err := auth.ValidateToken(tokenString)
if err != nil {
    http.Error(w, "Invalid token", http.StatusUnauthorized)
    return
}
```

### 3. Backend возвращает данные из PostgreSQL

```go
// В handlers/auth.go
user, err := userRepo.FindByEmail(req.Email)
// userRepo использует GORM для запроса к PostgreSQL
```

## 📊 Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (User)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (:3000)                       │
├─────────────────────────────────────────────────────────────┤
│  • AuthContext (JWT в localStorage)                         │
│  • Pages: signin, signup, profile, admin                    │
│  • Middleware для защиты роутов                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls (JWT в Authorization header)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                Go Backend API (:8080)                       │
├─────────────────────────────────────────────────────────────┤
│  • JWT validation                                           │
│  • CORS для :3000                                           │
│  • REST API endpoints                                       │
│  • GORM репозитории                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             PostgreSQL (Neon Database)                      │
├─────────────────────────────────────────────────────────────┤
│  • Таблица User (9 пользователей)                          │
│  • Таблица Product, Order, etc.                             │
│  • Создана через Prisma migrations                          │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Переменные окружения

### Frontend (`.env.local`)
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="http://localhost:8080"
JWT_SECRET="your-super-secret-jwt-key"
```

### Backend (`backend/.env`)
```env
PORT=8080
JWT_SECRET="8yRloNcHhkIkS4ogtQB+6tUxT1kc3HXwDZHE3runafI="
DATABASE_URL="postgresql://..."
ALLOWED_ORIGINS="http://localhost:3000,https://menu-fodifood.vercel.app"
```

## 🧪 Тестирование интеграции

### 1. Проверка подключения к БД

```bash
# Запросить список пользователей из Go backend
curl http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Должен вернуть 9 пользователей из PostgreSQL
```

### 2. Вход через фронтенд

1. Откройте http://localhost:3000/auth/signin
2. Введите `admin@fodisushi.com` / `admin123`
3. Токен сохранится в localStorage
4. Редирект на главную страницу

### 3. Доступ к админ-панели

1. После входа как admin
2. Перейдите на http://localhost:3000/admin
3. Middleware проверит JWT токен
4. Покажет админ-панель

### 4. API запросы с фронтенда

```typescript
// Пример из Next.js
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

## 📝 Скрипты для управления

```bash
# Вывести список пользователей из БД
node scripts/list-users.js

# Открыть Prisma Studio
npx prisma studio

# Запустить оба сервера
./start-dev.sh

# Остановить оба сервера
./stop-dev.sh
```

## 🐛 Troubleshooting

### Ошибка: "Invalid credentials" даже с правильным паролем

**Причина:** Go backend использует свой хеш, а не тот что в БД от Next.js

**Решение:** Зарегистрируйтесь через Go API:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","name":"New User","password":"test123"}'
```

### Ошибка: CORS

**Причина:** Frontend пытается обратиться к backend с другого origin

**Решение:** Проверьте CORS настройки в `backend/cmd/server/main.go`:
```go
AllowedOrigins: []string{"http://localhost:3000", "https://menu-fodifood.vercel.app"}
```

### Ошибка: "Failed to connect to database"

**Причина:** Неверный DATABASE_URL или БД недоступна

**Решение:** 
1. Проверьте `backend/.env`
2. Убедитесь что DATABASE_URL правильный
3. Проверьте доступность Neon DB

## 🎯 Следующие шаги

- [ ] Добавить refresh tokens для JWT
- [ ] Реализовать CRUD для заказов через Go API
- [ ] Добавить rate limiting
- [ ] Настроить logging (logrus/zap)
- [ ] Написать unit тесты для handlers
- [ ] Настроить CI/CD
- [ ] Docker контейнеры для деплоя
- [ ] Документация API (Swagger)

## 📄 Полезные ссылки

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Prisma Studio:** http://localhost:5555
- **Neon Console:** https://console.neon.tech

---

© 2025 FODI SUSHI - Полная интеграция Go Backend + Next.js Frontend
