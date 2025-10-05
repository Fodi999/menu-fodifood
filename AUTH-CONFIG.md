# 📄 Конфигурация src/auth.ts

## ✅ Текущая конфигурация

### 🔐 Основные настройки

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  trustHost: true, // ✅ Важно для Vercel!
  // ...
});
```

**Ключевые параметры:**
- ✅ **adapter**: PrismaAdapter - подключение к БД
- ✅ **strategy**: JWT - токены вместо database сессий
- ✅ **maxAge**: 30 дней - время жизни сессии
- ✅ **trustHost**: true - разрешает работу на Vercel

---

### 🍪 Настройки cookies

```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,           // ✅ Защита от XSS
      sameSite: 'lax',          // ✅ Защита от CSRF
      path: '/',                // ✅ Доступен на всем сайте
      secure: process.env.NODE_ENV === 'production', // ✅ HTTPS на Vercel
    },
  },
},
```

**Важно:**
- `httpOnly: true` - cookie недоступен через JavaScript
- `sameSite: 'lax'` - защита от CSRF атак
- `secure: true` - только HTTPS (автоматически на продакшене)

---

### 📝 Провайдеры аутентификации

```typescript
providers: [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // 1. Проверка наличия credentials
      if (!credentials?.email || !credentials?.password) {
        console.log('❌ Login attempt without credentials');
        return null;
      }

      // 2. Поиск пользователя в БД
      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user || !user.password) {
        console.log(`❌ User not found: ${credentials.email}`);
        return null;
      }

      // 3. Проверка пароля (bcrypt)
      const isPasswordValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      );

      if (!isPasswordValid) {
        console.log(`❌ Failed login attempt for: ${credentials.email}`);
        return null;
      }

      // 4. Успешный вход
      console.log(`✅ Successful login: ${user.email} (${user.role})`);
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    },
  }),
],
```

**Процесс авторизации:**
1. ✅ Проверка наличия email и password
2. ✅ Поиск пользователя в БД
3. ✅ Сравнение пароля с хешем (bcrypt)
4. ✅ Возврат данных пользователя или null
5. ✅ Логирование всех попыток входа

---

### 🔄 Callbacks

#### JWT Callback
```typescript
async jwt({ token, user }) {
  if (user) {
    token.role = user.role;
    token.id = user.id as string;
    console.log(`🔑 JWT created for: ${user.email} (role: ${user.role})`);
  }
  return token;
}
```

**Что делает:**
- Добавляет `role` и `id` в JWT токен
- Вызывается при создании токена (после входа)
- Логирует создание JWT

---

#### Session Callback
```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.role = token.role as "user" | "admin";
    session.user.id = token.id as string;
    console.log(`👤 Session loaded for: ${session.user.email} (role: ${session.user.role})`);
  }
  return session;
}
```

**Что делает:**
- Добавляет `role` и `id` в объект сессии
- Вызывается при каждом запросе к `auth()`
- Логирует загрузку сессии

---

### 📄 Страницы

```typescript
pages: {
  signIn: "/auth/signin",
  error: "/auth/error",
},
```

**Кастомные страницы:**
- `/auth/signin` - страница входа
- `/auth/error` - страница ошибок

---

## 🔍 Логирование

При работе auth.ts выводит следующие логи:

### ✅ Успешный вход
```
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
👤 Session loaded for: admin@fodisushi.com (role: admin)
```

### ❌ Неудачные попытки

**Отсутствуют credentials:**
```
❌ Login attempt without credentials
```

**Пользователь не найден:**
```
❌ User not found: test@example.com
```

**Неверный пароль:**
```
❌ Failed login attempt for: admin@fodisushi.com
```

---

## 🌍 Переменные окружения

auth.ts использует следующие переменные:

### Обязательные:

```env
# .env.local (локально)
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw="
```

```env
# Vercel (Production)
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://menu-fodifood.vercel.app"
NEXTAUTH_SECRET="j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw="
```

### Важно:

- ✅ `NEXTAUTH_SECRET` **должен быть одинаковым** локально и на Vercel
- ✅ `NEXTAUTH_URL` **должен соответствовать** текущему окружению
- ✅ `DATABASE_URL` должен указывать на Neon (Pooled connection)

---

## 🔐 Типы TypeScript

Для корректной работы необходимо расширить типы NextAuth в `src/types/next-auth.d.ts`:

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

## ✅ Проверка конфигурации

### 1. Проверить структуру файла
```bash
cat src/auth.ts | grep -E "(trustHost|cookies|callbacks)"
```

### 2. Проверить экспорты
```bash
grep "export const" src/auth.ts
```

**Должно быть:**
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({...})
```

### 3. Проверить использование в проекте

**API Route** (`src/app/api/auth/[...nextauth]/route.ts`):
```typescript
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

**Server Component:**
```typescript
import { auth } from "@/auth";
const session = await auth();
```

**Client Component:**
```typescript
import { signIn, signOut } from "next-auth/react";
await signIn("credentials", { email, password });
```

---

## 🐛 Типичные проблемы

### ❌ Вход не работает на Vercel

**Проверьте:**
1. ✅ `NEXTAUTH_SECRET` совпадает на Vercel и локально
2. ✅ `NEXTAUTH_URL` правильный (https://menu-fodifood.vercel.app)
3. ✅ `DATABASE_URL` с реальным паролем (не замаскирован)
4. ✅ `trustHost: true` в конфигурации
5. ✅ После изменения env сделан Redeploy

### ❌ Cookie не сохраняется

**Проверьте:**
1. ✅ `sameSite: 'lax'` (не 'strict')
2. ✅ `secure: process.env.NODE_ENV === 'production'`
3. ✅ В Chrome DevTools → Application → Cookies есть `next-auth.session-token`

### ❌ "Invalid session" ошибка

**Проверьте:**
1. ✅ callbacks возвращают token и session
2. ✅ `session.user.role` правильно типизирован
3. ✅ JWT содержит role и id

---

## 📊 Диаграмма потока авторизации

```
1. Пользователь вводит email/password
   ↓
2. POST /api/auth/callback/credentials
   ↓
3. CredentialsProvider.authorize()
   ↓
4. Проверка в БД через Prisma
   ↓
5. bcrypt.compare(password, hash)
   ↓
6. Возврат user объекта
   ↓
7. jwt() callback - создание токена
   ↓
8. Set-Cookie: next-auth.session-token
   ↓
9. Redirect на главную
   ↓
10. При запросе: session() callback
    ↓
11. Получение session с user.role
```

---

## 🔗 Связанные файлы

- `src/app/api/auth/[...nextauth]/route.ts` - API маршрут NextAuth
- `src/middleware.ts` - защита роутов
- `src/types/next-auth.d.ts` - типы TypeScript
- `src/lib/prisma.ts` - Prisma Client
- `prisma/schema.prisma` - схема User с role

---

## 📝 Команды для отладки

```bash
# Проверить логи при входе
npm run dev
# Затем попробуйте войти и смотрите в терминал

# Проверить сессию через API
curl http://localhost:3000/api/auth/session

# Проверить debug endpoint
curl http://localhost:3000/api/debug-auth

# Проверить на Vercel
curl https://menu-fodifood.vercel.app/api/debug-auth
```

---

**Файл:** `src/auth.ts`  
**Обновлено:** 5 октября 2025 г.
