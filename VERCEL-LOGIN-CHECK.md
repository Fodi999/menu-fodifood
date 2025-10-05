# ✅ Чек-лист проверки входа на Vercel

## 🔍 Пошаговая диагностика проблем с авторизацией

### 1️⃣ Проверка переменных окружения на Vercel

**Перейдите:** Vercel Dashboard → Settings → Environment Variables

Проверьте наличие и правильность этих переменных:

#### ✅ NEXTAUTH_URL
```env
# Production
NEXTAUTH_URL=https://menu-fodifood.vercel.app

# Preview (опционально)
NEXTAUTH_URL=https://menu-fodifood-git-*.vercel.app
```

**❌ Частые ошибки:**
- `http://localhost:3000` на продакшене
- Отсутствует `https://`
- Неправильный домен
- Пробелы в начале/конце

**✅ Как проверить:**
```bash
# В терминале
curl https://menu-fodifood.vercel.app/api/auth/providers

# Должен вернуть JSON с providers
```

---

#### ✅ NEXTAUTH_SECRET

```env
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

**Требования:**
- Минимум 32 символа
- Случайная строка (не "secret" или "password123")
- Одинаковая на всех окружениях (Production, Preview, Development)

**✅ Как сгенерировать новый:**
```bash
openssl rand -base64 32
```

**❌ Частые ошибки:**
- Отсутствует переменная
- Слишком короткий секрет
- Разные секреты на локалке и Vercel

---

#### ✅ DATABASE_URL

```env
DATABASE_URL=postgresql://neondb_owner:npg_dz4Gl8ZhPLbX@ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**✅ Как проверить подключение:**
```bash
# Локально
npx prisma db pull

# Должен вернуть успех без ошибок
```

---

### 2️⃣ Проверка конфигурации NextAuth

#### Проверьте файл `src/auth.ts`:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ✅ ОБЯЗАТЕЛЬНО для Vercel!
  trustHost: true, // ← Проверьте это!
  
  // ✅ Проверьте cookies
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax', // не 'strict'!
        path: '/',
        secure: process.env.NODE_ENV === 'production', // true на Vercel
      },
    },
  },
  
  // ✅ Проверьте callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id as string;
      }
      return token; // ← Обязательно возвращайте token!
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "user" | "admin";
        session.user.id = token.id as string;
      }
      return session; // ← Обязательно возвращайте session!
    },
  },
});
```

**❌ Частые ошибки:**
- Отсутствует `trustHost: true`
- `sameSite: 'strict'` вместо `'lax'`
- Не возвращается `token` или `session` в callbacks
- `secure: true` на localhost (должно быть false)

---

### 3️⃣ Проверка CredentialsProvider

#### Проверьте блок `authorize` в `src/auth.ts`:

```typescript
async authorize(credentials) {
  // ✅ Проверка наличия credentials
  if (!credentials?.email || !credentials?.password) {
    console.log('❌ Missing credentials');
    return null; // ← ВАЖНО: возвращать null, не throw
  }

  // ✅ Поиск пользователя
  const user = await prisma.user.findUnique({
    where: { email: credentials.email as string },
  });

  if (!user || !user.password) {
    console.log(`❌ User not found: ${credentials.email}`);
    return null;
  }

  // ✅ Проверка пароля
  const isPasswordValid = await bcrypt.compare(
    credentials.password as string,
    user.password
  );

  if (!isPasswordValid) {
    console.log(`❌ Invalid password for: ${credentials.email}`);
    return null;
  }

  console.log(`✅ Login success: ${user.email}`);
  
  // ✅ ОБЯЗАТЕЛЬНО вернуть объект пользователя
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
```

**❌ Частые ошибки:**
- `throw new Error()` вместо `return null`
- Не возвращается объект пользователя
- Отсутствуют поля `id`, `email`, `role`
- Ошибка в сравнении пароля (bcrypt.compare)

---

### 4️⃣ Проверка middleware

#### Проверьте `src/middleware.ts`:

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
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  
  // Защита админки
  if (isAdminRoute && (!token || token.role !== "admin")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Если авторизован, не показывать /auth/signin
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
```

**❌ Частые ошибки:**
- Используется `auth()` вместо `getToken()` (не работает в Edge Runtime)
- Отсутствует `secret` в getToken
- Неправильный matcher

---

### 5️⃣ Проверка cookies в браузере

#### Chrome DevTools (F12) → Application → Cookies

**После успешного входа должно быть:**

| Cookie | Значение |
|--------|----------|
| **Name** | `next-auth.session-token` |
| **Value** | Длинная строка (JWT) |
| **Domain** | `.vercel.app` или ваш домен |
| **Path** | `/` |
| **HttpOnly** | ✅ |
| **Secure** | ✅ (на HTTPS) |
| **SameSite** | `Lax` |

**❌ Если cookie НЕТ:**
1. Проверьте `trustHost: true` в auth.ts
2. Проверьте `NEXTAUTH_URL` на Vercel
3. Проверьте `NEXTAUTH_SECRET` на Vercel
4. Очистите cookies (`Ctrl+Shift+Del`) и попробуйте снова

---

### 6️⃣ Проверка базы данных

#### Убедитесь, что пользователь существует:

```bash
# Откройте Prisma Studio
npx prisma studio

# Перейдите в таблицу User
# Найдите admin@fodisushi.com
# Проверьте:
# - email: admin@fodisushi.com
# - password: должен быть bcrypt хеш (начинается с $2a$ или $2b$)
# - role: admin
```

**✅ Или через Neon Console:**
1. https://console.neon.tech/
2. SQL Editor
3. Выполните:
```sql
SELECT id, email, name, role, password 
FROM "User" 
WHERE email = 'admin@fodisushi.com';
```

**❌ Если пользователя нет:**
```bash
npx prisma db seed
```

---

### 7️⃣ Проверка логов на Vercel

#### Vercel Dashboard → Deployments → Latest → Logs

**✅ Успешный вход должен показывать:**
```
✅ Successful login: admin@fodifood.com (admin)
🔑 JWT created for: admin@fodifood.com (role: admin)
👤 Session loaded for: admin@fodifood.com (role: admin)
```

**❌ Ошибки:**
```
❌ User not found: admin@fodifood.com
❌ Invalid password for: admin@fodifood.com
❌ Missing credentials
```

---

## 🧪 Полный тест входа на Vercel

### Шаг 1: Очистите cookies
```
Chrome → F12 → Application → Cookies → 
Правый клик на домене → Clear
```

### Шаг 2: Проверьте /api/auth/providers
```bash
curl https://menu-fodifood.vercel.app/api/auth/providers
```

**Ожидаемый результат:**
```json
{
  "credentials": {
    "id": "credentials",
    "name": "credentials",
    "type": "credentials"
  }
}
```

### Шаг 3: Войдите на сайт
```
https://menu-fodifood.vercel.app/auth/signin

Email: admin@fodisushi.com
Password: admin123
```

### Шаг 4: Проверьте сессию
```bash
curl https://menu-fodifood.vercel.app/api/auth/session
```

**Ожидаемый результат (если вошли):**
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

### Шаг 5: Проверьте debug endpoint
```bash
curl https://menu-fodifood.vercel.app/api/debug-auth
```

**Ожидаемый результат (если вошли):**
```json
{
  "timestamp": "2025-10-05T15:00:00.000Z",
  "environment": "production",
  "session": {
    "user": {
      "email": "admin@fodisushi.com",
      "role": "admin"
    }
  },
  "cookie": {
    "exists": true
  },
  "env": {
    "NEXTAUTH_URL": "https://menu-fodifood.vercel.app",
    "NEXTAUTH_SECRET_EXISTS": true
  },
  "status": {
    "authenticated": true,
    "hasCookie": true
  }
}
```

---

## 🔧 Исправление типичных проблем

### Проблема 1: Cookie не устанавливается

**Решение:**
1. Добавьте `trustHost: true` в `src/auth.ts`
2. Проверьте `NEXTAUTH_URL=https://menu-fodifood.vercel.app`
3. Убедитесь, что `secure: process.env.NODE_ENV === 'production'`
4. Сделайте **Redeploy** на Vercel

### Проблема 2: Редирект на /auth/signin после входа

**Решение:**
1. Проверьте, что callbacks возвращают token и session
2. Проверьте middleware (должен использовать getToken)
3. Проверьте типы NextAuth (src/types/next-auth.d.ts)

### Проблема 3: "Invalid credentials" при правильном пароле

**Решение:**
1. Проверьте, что seed был выполнен на Neon (`npx prisma db seed`)
2. Проверьте bcrypt.compare в authorize
3. Проверьте, что пароль в БД - это хеш, а не plaintext

### Проблема 4: Сессия пропадает после перезагрузки

**Решение:**
1. Проверьте, что `session.strategy = "jwt"`
2. Проверьте `maxAge: 30 * 24 * 60 * 60` (30 дней)
3. Проверьте, что NEXTAUTH_SECRET одинаковый везде

---

## ✅ Финальный чек-лист

- [ ] `NEXTAUTH_URL` правильный на Vercel
- [ ] `NEXTAUTH_SECRET` установлен на Vercel
- [ ] `DATABASE_URL` правильный на Vercel
- [ ] `trustHost: true` в auth.ts
- [ ] `sameSite: 'lax'` в cookies
- [ ] `secure: process.env.NODE_ENV === 'production'`
- [ ] Callbacks возвращают token и session
- [ ] Middleware использует getToken
- [ ] Типы NextAuth обновлены
- [ ] Seed выполнен на Neon
- [ ] Пароль в БД - bcrypt хеш
- [ ] Vercel Redeploy выполнен
- [ ] Cookies очищены в браузере
- [ ] Тест входа пройден успешно

---

## 📞 Если ничего не помогает

1. **Проверьте логи Vercel:**
   ```bash
   vercel logs --follow
   ```

2. **Включите debug mode:**
   ```env
   NEXTAUTH_DEBUG=true
   ```

3. **Проверьте сеть в DevTools:**
   - Chrome → F12 → Network
   - Попробуйте войти
   - Ищите запросы к `/api/auth/*`
   - Проверьте Response

4. **Создайте минимальный тест:**
   ```typescript
   // pages/api/test-db.ts
   import { prisma } from "@/lib/prisma";
   
   export default async function handler(req, res) {
     const users = await prisma.user.findMany();
     res.json({ count: users.length, users });
   }
   ```

---

**Обновлено:** 5 октября 2025 г.
