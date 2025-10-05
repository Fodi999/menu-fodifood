# 🚀 Production Deployment Guide

## ✅ Backend (Koyeb) - DEPLOYED!

**URL:** https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app

### Status: ✅ Working
- ✅ PostgreSQL подключен (Neon)
- ✅ JWT авторизация работает
- ✅ API endpoints доступны

### API Endpoints:
```
POST   /api/auth/register    - Регистрация
POST   /api/auth/login       - Вход
GET    /api/user/profile     - Профиль (требует JWT)
PUT    /api/user/profile     - Обновление профиля (требует JWT)
GET    /api/admin/users      - Список пользователей (admin)
GET    /api/admin/stats      - Статистика (admin)
GET    /api/admin/orders/recent - Последние заказы (admin)
```

---

## 🌐 Frontend (Vercel) - НАСТРОЙКА

**URL:** https://menu-fodifood.vercel.app

### Переменные окружения для Vercel:

Зайдите в **Settings → Environment Variables** и добавьте:

```env
# Database
DATABASE_URL=postgresql://neondb_owner:npg_dz4Gl8ZhPLbX@ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Go Backend API (Production)
NEXT_PUBLIC_API_URL=https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app

# JWT Secret (должен совпадать с backend)
JWT_SECRET=8yRloNcHhkIkS4ogtQB+6tUxT1kc3HXwDZHE3runafI=
```

### Деплой:

1. **Добавить переменные в Vercel:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   # Введите: https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app
   
   vercel env add DATABASE_URL production
   # Вставьте DATABASE_URL
   
   vercel env add JWT_SECRET production
   # Вставьте JWT_SECRET
   ```

2. **Или через веб-интерфейс:**
   - Откройте https://vercel.com/your-project/settings/environment-variables
   - Добавьте все 3 переменные
   - Выберите Environment: **Production**

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

   Или через GitHub:
   ```bash
   git add .
   git commit -m "🚀 Configure production backend URL"
   git push
   ```

---

## 🔧 Обновление CORS в Backend

Также нужно обновить ALLOWED_ORIGINS в Koyeb:

### В Koyeb → Environment Variables:

Измените `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://menu-fodifood.vercel.app,http://localhost:3000
```

---

## ✅ Проверка работоспособности

### 1. Backend Health Check:
```bash
curl https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fodisushi.com","password":"admin123"}'
```

### 2. Frontend → Backend:
1. Откройте https://menu-fodifood.vercel.app/auth/signin
2. Войдите как: `admin@fodisushi.com` / `admin123`
3. Перейдите в /profile
4. Перейдите в /admin

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         NEXT.JS FRONTEND (Vercel)                       │
│         https://menu-fodifood.vercel.app                │
│                                                          │
│  • Server Components (SSR)                              │
│  • Client Components (CSR)                              │
│  • API Routes (for Prisma queries)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ├─── Auth Requests ──────────┐
                     │                             ▼
                     │              ┌──────────────────────────────┐
                     │              │  GO BACKEND (Koyeb)          │
                     │              │  irrelevant-nellie...app     │
                     │              │                              │
                     │              │  • JWT Authentication        │
                     │              │  • User Management           │
                     │              │  • Admin API                 │
                     │              └────────┬─────────────────────┘
                     │                       │
                     └───── DB Queries ──────┤
                                             ▼
                              ┌──────────────────────────────┐
                              │  POSTGRESQL (Neon)           │
                              │  Serverless Database         │
                              │                              │
                              │  • Users, Orders, Products   │
                              │  • Prisma Schema            │
                              │  • Pooled Connections       │
                              └──────────────────────────────┘
```

---

## 🎯 Тестовые пользователи

### Admin:
```
Email: admin@fodisushi.com
Password: admin123
```

### User:
```
Email: user@test.com
Password: user123
```

---

## 📝 Следующие шаги

- [ ] Добавить переменные окружения в Vercel
- [ ] Обновить ALLOWED_ORIGINS в Koyeb
- [ ] Протестировать вход на production
- [ ] Проверить админ-панель
- [ ] Настроить custom domain (опционально)

---

© 2025 FODI SUSHI | Powered by Next.js, Go, PostgreSQL
