# 🛡️ Middleware для защиты страниц

## 📋 Что делает middleware?

Middleware автоматически проверяет авторизацию пользователя **до** того, как страница будет загружена. Это более эффективно и безопасно, чем проверка на уровне компонента.

## 🔧 Как работает

### 1. Проверка JWT токена
```typescript
const token = await getToken({ 
  req: request,
  secret: process.env.NEXTAUTH_SECRET 
});
```
- Извлекает JWT токен из cookies
- Проверяет подпись токена
- Возвращает данные пользователя (email, role, id)

### 2. Защита админки `/admin`
```typescript
if (pathname.startsWith("/admin")) {
  if (!token) {
    // Не авторизован → редирект на /auth/signin
    return NextResponse.redirect("/auth/signin?callbackUrl=/admin");
  }
  if (token.role !== "admin") {
    // Не админ → редирект на /profile
    return NextResponse.redirect("/profile");
  }
  // ✅ Админ → доступ разрешён
}
```

**Логика:**
- ❌ **Нет токена** → редирект на `/auth/signin`
- ❌ **Роль не "admin"** → редирект на `/profile`
- ✅ **Роль "admin"** → доступ разрешён

### 3. Защита профиля `/profile` и `/orders`
```typescript
if (pathname.startsWith("/profile") || pathname.startsWith("/orders")) {
  if (!token) {
    // Не авторизован → редирект на /auth/signin
    return NextResponse.redirect("/auth/signin?callbackUrl=/profile");
  }
  // ✅ Авторизован → доступ разрешён
}
```

**Логика:**
- ❌ **Нет токена** → редирект на `/auth/signin`
- ✅ **Есть токен** → доступ разрешён (любая роль)

## 📊 Примеры работы

### Сценарий 1: Неавторизованный пользователь пытается открыть `/profile`
```
1. Пользователь открывает /profile
2. Middleware проверяет токен → нет токена
3. Middleware редиректит на /auth/signin?callbackUrl=/profile
4. Пользователь входит
5. NextAuth редиректит обратно на /profile (используя callbackUrl)
6. ✅ Пользователь видит свой профиль
```

### Сценарий 2: Обычный пользователь пытается открыть `/admin`
```
1. Пользователь (role: "user") открывает /admin
2. Middleware проверяет токен → есть токен, role = "user"
3. Middleware проверяет роль → не "admin"
4. Middleware редиректит на /profile
5. ❌ Пользователь видит свой профиль (не админку)
```

### Сценарий 3: Администратор открывает `/admin`
```
1. Пользователь (role: "admin") открывает /admin
2. Middleware проверяет токен → есть токен, role = "admin"
3. Middleware проверяет роль → "admin" ✅
4. Middleware разрешает доступ
5. ✅ Администратор видит админку
```

## 🔍 Логирование

Middleware выводит логи для отладки:

```
✅ Успешный доступ:
🛡️ Middleware: /profile | Authenticated: true | Role: user
✅ Authenticated access: user@test.com

✅ Админ доступ:
🛡️ Middleware: /admin | Authenticated: true | Role: admin
✅ Admin access granted: admin@fodisushi.com

❌ Неавторизованный доступ:
🛡️ Middleware: /profile | Authenticated: false | Role: none
❌ Unauthorized access to protected page, redirecting to signin

❌ Не-админ пытается войти в админку:
🛡️ Middleware: /admin | Authenticated: true | Role: user
❌ Non-admin user attempted to access admin area: user@test.com
```

## ⚙️ Конфигурация

### Matcher (какие пути проверять)
```typescript
export const config = {
  matcher: [
    "/admin/:path*",   // /admin, /admin/users, /admin/orders и т.д.
    "/profile/:path*", // /profile, /profile/settings и т.д.
    "/orders/:path*",  // /orders, /orders/123 и т.д.
  ],
};
```

**Синтаксис:**
- `/admin/:path*` - проверять `/admin` и все вложенные пути
- `/profile` - проверять только `/profile` (без вложенных)

### Добавление новых защищённых путей

Если нужно защитить новый раздел, например `/cart`:

```typescript
// src/middleware.ts
if (pathname.startsWith("/cart")) {
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
}

// И добавить в matcher:
export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/cart/:path*", // ← новый путь
  ],
};
```

## 🆚 Middleware vs Серверная проверка

### Middleware (Edge Runtime)
```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect("/auth/signin");
  }
}
```

**Преимущества:**
- ✅ Очень быстро (Edge Runtime)
- ✅ Проверка **до** рендеринга страницы
- ✅ Экономит ресурсы сервера
- ✅ Автоматический редирект

**Недостатки:**
- ❌ Ограниченный доступ к API (только JWT)
- ❌ Нельзя делать сложные запросы к БД

### Серверная проверка (Server Component)
```typescript
// app/profile/page.tsx
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  // ...
}
```

**Преимущества:**
- ✅ Полный доступ к БД (Prisma)
- ✅ Можно делать сложные проверки
- ✅ Гибкая логика

**Недостатки:**
- ❌ Медленнее (нужно рендерить страницу)
- ❌ Тратит ресурсы сервера

### 🎯 Рекомендация: Используйте оба!

```typescript
// 1. Middleware - базовая защита (быстро)
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.redirect("/auth/signin");
  }
}

// 2. Серверный компонент - дополнительная проверка (безопасно)
// app/admin/page.tsx
export default async function AdminPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/signin");
  }
  
  if (session.user.role !== "admin") {
    redirect("/profile");
  }
  
  // Теперь точно админ!
}
```

## 🧪 Тестирование middleware

### Тест 1: Неавторизованный доступ к /profile
```bash
1. Откройте браузер в режиме инкогнито
2. Перейдите на http://localhost:3000/profile
3. ✅ Должны быть перенаправлены на /auth/signin?callbackUrl=/profile
```

### Тест 2: Обычный пользователь пытается открыть /admin
```bash
1. Войдите как user@test.com / user123
2. Перейдите на /admin
3. ✅ Должны быть перенаправлены на /profile
4. ✅ В консоли: "Non-admin user attempted to access admin area"
```

### Тест 3: Администратор открывает /admin
```bash
1. Войдите как admin@fodisushi.com / admin123
2. Перейдите на /admin
3. ✅ Должны увидеть админ-панель
4. ✅ В консоли: "Admin access granted: admin@fodisushi.com"
```

### Тест 4: Авторизованный пользователь открывает /profile
```bash
1. Войдите как любой пользователь
2. Перейдите на /profile
3. ✅ Должны увидеть профиль
4. ✅ В консоли: "Authenticated access: ваш@email.com"
```

## 🐛 Troubleshooting

### Проблема: "Middleware не работает, всегда редиректит"

**Решение:**
```bash
1. Проверьте NEXTAUTH_SECRET в .env.local
2. Проверьте cookies в DevTools:
   F12 → Application → Cookies → http://localhost:3000
   Должен быть: next-auth.session-token
3. Проверьте логи middleware в консоли сервера
```

### Проблема: "Бесконечный редирект между /auth/signin и /profile"

**Решение:**
```typescript
// Убедитесь, что /auth/signin НЕ в matcher!
export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    // ❌ НЕ добавляйте: "/auth/:path*"
  ],
};
```

### Проблема: "Middleware не срабатывает на Vercel"

**Решение:**
```typescript
// Убедитесь, что trustHost: true в auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // ← Обязательно для Vercel!
  // ...
});
```

## 📊 Итоговая защита приложения

```
Публичные страницы (без защиты):
├── / (главная)
├── /auth/signin (вход)
├── /auth/signup (регистрация)
└── /api/products (API продуктов)

Защищённые страницы (middleware + серверная проверка):
├── /profile (любой авторизованный)
├── /orders (любой авторизованный)
└── /admin (только role: "admin")
    ├── /admin/users
    ├── /admin/orders
    └── /admin/products
```

---

**Статус:** ✅ Middleware настроен и работает
**Безопасность:** 🛡️ Двойная защита (middleware + серверная проверка)
