# ✅ NextAuth полностью удалён - Готовность к Go Backend

## 🎯 Что было сделано

### 1. Удалены зависимости NextAuth
```bash
npm uninstall next-auth @auth/prisma-adapter
```

Удалены пакеты:
- ❌ `next-auth`
- ❌ `@auth/prisma-adapter`

### 2. Удалены файлы NextAuth
- ❌ `src/auth.ts` - конфигурация NextAuth
- ❌ `src/app/api/auth/[...nextauth]/` - API роут NextAuth
- ❌ `src/app/api/auth/register/` - старый роут регистрации
- ❌ `src/app/api/debug-auth/` - отладочный роут

### 3. Обновлена авторизация на клиенте
- ✅ Используется `AuthContext` для управления состоянием пользователя
- ✅ Все страницы переписаны как клиентские компоненты
- ✅ Токены хранятся в `localStorage`

### 4. Обновлён middleware
```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    // Проверка роли через Go API
  }
}
```

### 5. Обновлены страницы
- ✅ `/auth/signin` - вызывает Go API `/api/auth/login`
- ✅ `/auth/signup` - вызывает Go API `/api/auth/register`
- ✅ `/profile` - получает данные из Go API `/api/profile`
- ✅ `/admin` - получает данные из Go API `/api/admin/stats`

## 📦 Текущая архитектура

```
┌───────────────────────────────────────────────┐
│          Next.js 15 (Frontend)                │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  AuthContext (Client State)             │ │
│  │  - user: User | null                    │ │
│  │  - login(email, password)               │ │
│  │  - logout()                             │ │
│  │  - Хранит JWT в localStorage            │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  Pages (Client Components)              │ │
│  │  - /auth/signin                         │ │
│  │  - /auth/signup                         │ │
│  │  - /profile                             │ │
│  │  - /admin                               │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  Middleware (Edge Runtime)              │ │
│  │  - Проверяет наличие token в cookies   │ │
│  │  - Защищает /profile и /admin          │ │
│  └─────────────────────────────────────────┘ │
└───────────────┬───────────────────────────────┘
                │
                │ HTTP/REST
                │ Authorization: Bearer <JWT>
                ↓
┌───────────────────────────────────────────────┐
│          Go Backend API                       │
│          (НЕ РЕАЛИЗОВАНО)                     │
│                                               │
│  Endpoints to implement:                      │
│  ┌─────────────────────────────────────────┐ │
│  │  POST /api/auth/login                   │ │
│  │  POST /api/auth/register                │ │
│  │  GET  /api/auth/me                      │ │
│  │  GET  /api/profile                      │ │
│  │  GET  /api/admin/stats                  │ │
│  │  GET  /api/admin/orders/recent          │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │  JWT Middleware                         │ │
│  │  - Проверяет токен                      │ │
│  │  - Извлекает user_id, role              │ │
│  └─────────────────────────────────────────┘ │
└───────────────┬───────────────────────────────┘
                │
                ↓
┌───────────────────────────────────────────────┐
│          PostgreSQL (Neon)                    │
│                                               │
│  Tables:                                      │
│  - users (id, email, password, role)          │
│  - products                                   │
│  - orders                                     │
└───────────────────────────────────────────────┘
```

## 🔧 Следующие шаги - Разработка Go Backend

### 1. Инициализация Go проекта
```bash
mkdir backend
cd backend
go mod init github.com/your-username/fodi-sushi-api
```

### 2. Установка зависимостей
```bash
go get -u github.com/gin-gonic/gin
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/lib/pq
go get -u golang.org/x/crypto/bcrypt
go get -u github.com/joho/godotenv
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

### 3. Структура Go проекта
```
backend/
├── main.go
├── .env
├── go.mod
├── go.sum
├── models/
│   ├── user.go
│   ├── product.go
│   └── order.go
├── handlers/
│   ├── auth.go
│   ├── profile.go
│   └── admin.go
├── middleware/
│   ├── auth.go
│   └── cors.go
├── database/
│   └── db.go
└── utils/
    ├── jwt.go
    └── password.go
```

### 4. Основные файлы для создания

#### `main.go`
```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    "log"
    "os"
)

func main() {
    godotenv.Load()
    
    r := gin.Default()
    
    // CORS
    r.Use(CORSMiddleware())
    
    // Public routes
    r.POST("/api/auth/login", handlers.Login)
    r.POST("/api/auth/register", handlers.Register)
    
    // Protected routes
    authorized := r.Group("/api")
    authorized.Use(middleware.AuthMiddleware())
    {
        authorized.GET("/profile", handlers.GetProfile)
        authorized.GET("/auth/me", handlers.GetMe)
    }
    
    // Admin routes
    admin := r.Group("/api/admin")
    admin.Use(middleware.AuthMiddleware())
    admin.Use(middleware.AdminMiddleware())
    {
        admin.GET("/stats", handlers.GetAdminStats)
        admin.GET("/orders/recent", handlers.GetRecentOrders)
    }
    
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    
    log.Printf("🚀 Server starting on port %s", port)
    r.Run(":" + port)
}
```

#### `models/user.go`
```go
package models

import "time"

type User struct {
    ID        string    `json:"id" gorm:"primaryKey"`
    Email     string    `json:"email" gorm:"unique;not null"`
    Password  string    `json:"-" gorm:"not null"`
    Name      *string   `json:"name"`
    Role      string    `json:"role" gorm:"default:'user'"`
    CreatedAt time.Time `json:"createdAt"`
}

type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
    Email    string  `json:"email" binding:"required,email"`
    Password string  `json:"password" binding:"required,min=6"`
    Name     *string `json:"name"`
}

type LoginResponse struct {
    Token string `json:"token"`
    User  User   `json:"user"`
}
```

#### `handlers/auth.go`
```go
package handlers

import (
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "net/http"
    "your-project/models"
    "your-project/utils"
)

func Login(c *gin.Context) {
    var req models.LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    var user models.User
    if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }
    
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
        return
    }
    
    token, err := utils.GenerateJWT(user.ID, user.Email, user.Role)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }
    
    c.JSON(http.StatusOK, models.LoginResponse{
        Token: token,
        User:  user,
    })
}

func Register(c *gin.Context) {
    var req models.RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }
    
    user := models.User{
        Email:    req.Email,
        Password: string(hashedPassword),
        Name:     req.Name,
        Role:     "user",
    }
    
    if err := db.Create(&user).Error; err != nil {
        c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
        return
    }
    
    token, _ := utils.GenerateJWT(user.ID, user.Email, user.Role)
    
    c.JSON(http.StatusCreated, models.LoginResponse{
        Token: token,
        User:  user,
    })
}
```

#### `middleware/auth.go`
```go
package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "net/http"
    "strings"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "No authorization header"})
            c.Abort()
            return
        }
        
        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
        
        claims, err := utils.ValidateJWT(tokenString)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        
        c.Set("user_id", claims.UserID)
        c.Set("user_email", claims.Email)
        c.Set("user_role", claims.Role)
        c.Next()
    }
}

func AdminMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        role, _ := c.Get("user_role")
        if role != "admin" {
            c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
            c.Abort()
            return
        }
        c.Next()
    }
}
```

### 5. Переменные окружения `.env`
```env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/fodisushi
JWT_SECRET=your-super-secret-key-change-this-in-production
```

### 6. Запуск Go Backend
```bash
cd backend
go run main.go
```

## 🧪 Тестирование после запуска Go API

### 1. Регистрация
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

**Ожидаемый ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@test.com",
    "name": "Test User",
    "role": "user"
  }
}
```

### 2. Вход
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Получение профиля
```bash
curl http://localhost:8080/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Интеграция с Next.js Frontend

### 1. Обновите `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. Запустите оба сервера
```bash
# Terminal 1 - Go Backend
cd backend
go run main.go

# Terminal 2 - Next.js Frontend
npm run dev
```

### 3. Тестирование
1. Откройте http://localhost:3000
2. Перейдите на `/auth/signup`
3. Зарегистрируйтесь
4. Должны автоматически войти и попасть на `/profile`

## ✅ Чек-лист готовности

- [x] NextAuth полностью удалён
- [x] Клиентские страницы используют AuthContext
- [x] Middleware обновлён для JWT
- [x] API роуты NextAuth удалены
- [x] Сборка проекта проходит успешно
- [ ] Go Backend реализован
- [ ] JWT авторизация на Go работает
- [ ] Frontend подключен к Go API
- [ ] Тестирование на локалхосте
- [ ] Деплой Go API (Railway/Fly.io/VPS)
- [ ] Деплой Next.js (Vercel)

## 🚀 Деплой

### Go Backend
Рекомендуемые платформы:
- **Railway** - https://railway.app (бесплатно)
- **Fly.io** - https://fly.io (бесплатно)
- **Render** - https://render.com (бесплатно)
- **VPS** (DigitalOcean, Linode и т.д.)

### Next.js Frontend
- **Vercel** (рекомендуется, бесплатно)

---

**Статус:** ✅ NextAuth удалён, готовность к Go Backend
**Дата:** 5 октября 2025
