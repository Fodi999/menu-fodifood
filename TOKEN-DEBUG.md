# 🔍 Проверка токенов и cookies (NextAuth)

## 📋 Быстрая диагностика

### 1️⃣ Проверка на локальной машине

```bash
# Проверить debug endpoint
curl http://localhost:3000/api/debug-auth

# Проверить заголовки
curl -I http://localhost:3000/api/debug-auth
```

**Ожидаемый результат (без авторизации):**
```json
{
  "authenticated": false,
  "session": null,
  "timestamp": "2025-10-05T10:00:00.000Z"
}
```

---

### 2️⃣ Проверка на Vercel (Production)

```bash
# Проверить HTTPS и заголовки
curl -I https://menu-fodifood.vercel.app/api/debug-auth

# Проверить JSON ответ
curl https://menu-fodifood.vercel.app/api/debug-auth

# С красивым форматированием (если установлен jq)
curl https://menu-fodifood.vercel.app/api/debug-auth | jq
```

**Важные заголовки для проверки:**
```
HTTP/2 200 
content-type: application/json
set-cookie: next-auth.session-token=...; Path=/; HttpOnly; Secure; SameSite=Lax
```

---

## 🍪 Проверка cookies в Chrome DevTools

### Шаг 1: Откройте DevTools
1. Нажмите `F12` или `Cmd+Option+I` (Mac)
2. Перейдите на вкладку **Application**
3. Слева выберите **Cookies** → ваш домен

### Шаг 2: Проверьте cookie `next-auth.session-token`

**Правильные настройки для Production (Vercel):**
| Параметр | Значение |
|----------|----------|
| **Name** | `next-auth.session-token` |
| **Value** | Длинная строка (JWT) |
| **Domain** | `.menu-fodifood.vercel.app` |
| **Path** | `/` |
| **Expires** | Через 30 дней |
| **HttpOnly** | ✅ (галочка) |
| **Secure** | ✅ (галочка) |
| **SameSite** | `Lax` |

**Правильные настройки для локальной разработки:**
| Параметр | Значение |
|----------|----------|
| **Name** | `next-auth.session-token` |
| **Value** | Длинная строка (JWT) |
| **Domain** | `localhost` |
| **Path** | `/` |
| **Expires** | Через 30 дней |
| **HttpOnly** | ✅ (галочка) |
| **Secure** | ❌ (НЕТ галочки) - HTTP на локалке |
| **SameSite** | `Lax` |

---

## 🔐 Проверка JWT токена

### Вариант 1: Через browser console

```javascript
// В Chrome DevTools → Console
document.cookie
```

**Результат:**
```
"next-auth.session-token=eyJhbGciOiJIUzI1..."
```

### Вариант 2: Декодировать JWT (jwt.io)

1. Скопируйте значение `next-auth.session-token` из DevTools
2. Перейдите на https://jwt.io/
3. Вставьте токен в поле "Encoded"

**Ожидаемая структура (Payload):**
```json
{
  "name": "Admin User",
  "email": "admin@fodisushi.com",
  "role": "admin",
  "id": "cm2tqj...",
  "sub": "cm2tqj...",
  "iat": 1728123456,
  "exp": 1730715456,
  "jti": "..."
}
```

---

## 🧪 Проверка авторизации через API

### 1. Войдите в систему
```
http://localhost:3000/auth/signin
или
https://menu-fodifood.vercel.app/auth/signin

Email: admin@fodisushi.com
Password: admin123
```

### 2. Проверьте сессию
```bash
# Локально
curl http://localhost:3000/api/auth/session

# На Vercel
curl https://menu-fodifood.vercel.app/api/auth/session
```

**Ожидаемый результат (после входа):**
```json
{
  "user": {
    "email": "admin@fodisushi.com",
    "name": "Admin User",
    "role": "admin",
    "id": "cm2tqj..."
  },
  "expires": "2025-11-04T10:00:00.000Z"
}
```

### 3. Проверьте debug endpoint
```bash
curl http://localhost:3000/api/debug-auth
```

**Ожидаемый результат (после входа):**
```json
{
  "authenticated": true,
  "session": {
    "user": {
      "email": "admin@fodisushi.com",
      "name": "Admin User",
      "role": "admin",
      "id": "cm2tqj..."
    },
    "expires": "2025-11-04T10:00:00.000Z"
  },
  "timestamp": "2025-10-05T10:00:00.000Z"
}
```

---

## 🐛 Типичные проблемы и решения

### ❌ Cookie не устанавливается в Chrome

**Симптомы:**
- После входа редирект на главную, но пользователь не авторизован
- В DevTools → Application → Cookies нет `next-auth.session-token`

**Причины и решения:**

#### 1. Отсутствует `trustHost: true`
```typescript
// src/auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // ← Добавьте это!
  // ...
});
```

#### 2. Неправильный `NEXTAUTH_URL`
```env
# .env.local (локально)
NEXTAUTH_URL=http://localhost:3000

# Vercel Environment Variables (Production)
NEXTAUTH_URL=https://menu-fodifood.vercel.app
```

#### 3. Cookie `Secure` на HTTP
На локальной разработке (HTTP) `secure: false`:
```typescript
cookies: {
  sessionToken: {
    options: {
      secure: process.env.NODE_ENV === 'production', // false на локалке
    },
  },
},
```

#### 4. SameSite конфликт
```typescript
sameSite: 'lax', // Используйте 'lax', не 'strict'
```

---

### ❌ "Session callback error" в консоли

**Причина:** Не добавлена роль в типы NextAuth

**Решение:** Обновите `src/types/next-auth.d.ts`:
```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "user" | "admin";
    id: string;
  }
}
```

---

### ❌ Редирект на `/auth/signin` после входа

**Причина:** Middleware блокирует доступ

**Проверьте `src/middleware.ts`:**
```typescript
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  
  if (isAdminRoute && (!token || token.role !== "admin")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}
```

---

## 📊 Логи NextAuth

### Включить debug mode

```env
# .env.local
NEXTAUTH_DEBUG=true
```

### Проверить логи в терминале

После входа вы должны увидеть:
```
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
👤 Session loaded for: admin@fodisushi.com (role: admin)
```

При неудачном входе:
```
❌ Failed login attempt for: admin@fodisushi.com
```

При отсутствующем пользователе:
```
❌ User not found: test@example.com
```

---

## ✅ Полный чек-лист диагностики

- [ ] `NEXTAUTH_URL` правильный (http://localhost:3000 или https://vercel.app)
- [ ] `NEXTAUTH_SECRET` установлен (одинаковый локально и на Vercel)
- [ ] `DATABASE_URL` правильный (Neon Pooled connection)
- [ ] `trustHost: true` в auth.ts
- [ ] `secure: process.env.NODE_ENV === 'production'` в cookies
- [ ] Типы NextAuth обновлены (`next-auth.d.ts`)
- [ ] Middleware правильно настроен
- [ ] Seed выполнен (`npx prisma db seed`)
- [ ] Пользователь существует в БД (проверить в Prisma Studio)
- [ ] Пароль правильный (admin123)

---

## 🚀 Быстрая проверка на Vercel

```bash
# 1. Проверить переменные окружения
vercel env ls

# 2. Проверить, что DATABASE_URL есть
vercel env pull .env.production

# 3. Проверить debug endpoint
curl https://menu-fodifood.vercel.app/api/debug-auth

# 4. Проверить HTTPS и заголовки
curl -I https://menu-fodifood.vercel.app/api/auth/session

# 5. Войти на сайт и проверить cookies в DevTools
```

---

## 📝 Полезные команды

```bash
# Открыть Prisma Studio и проверить User
npx prisma studio

# Проверить хеш пароля в базе
# В Prisma Studio → User → найти admin → проверить password

# Пересоздать админа
npx prisma db seed

# Проверить подключение к БД
npx prisma db pull

# Проверить логи на Vercel
vercel logs --follow
```

---

## 🔗 Полезные ресурсы

- [NextAuth.js Debug](https://next-auth.js.org/configuration/options#debug)
- [JWT.io - Decode tokens](https://jwt.io/)
- [Chrome DevTools - Application](https://developer.chrome.com/docs/devtools/storage/cookies/)
- [Vercel Logs](https://vercel.com/docs/observability/runtime-logs)

---

**Обновлено:** 5 октября 2025 г.
