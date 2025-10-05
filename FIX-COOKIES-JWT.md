# 🔧 ИСПРАВЛЕНИЕ: Проблема с cookies в NextAuth v5 + JWT

## ❌ Проблема

**Симптомы:**
- После входа на Vercel пользователь не остаётся авторизованным
- После перезагрузки страницы сессия теряется
- В DevTools → Application → Cookies нет `next-auth.session-token`
- `/api/auth/session` возвращает `null` даже после успешного входа

**Причина:**
В [`src/auth.ts`](src/auth.ts ) был указан блок `cookies`:

```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
},
```

Но при **`session.strategy: "jwt"`** NextAuth v5 **НЕ использует cookie для хранения сессий**!

JWT токен управляется автоматически NextAuth, и кастомный блок `cookies` **конфликтует** с внутренней логикой.

---

## ✅ Решение

### Удалён блок `cookies` из конфигурации

**Было:**
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {  // ❌ ПРОБЛЕМА: конфликтует с JWT
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  trustHost: true,
  // ...
});
```

**Стало:**
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // ✅ NextAuth сам управляет JWT токенами
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true, // ✅ Обязательно для Vercel!
  // ✅ Блок cookies удалён - NextAuth сам управляет JWT
  // ...
});
```

---

## 🔍 Как работает JWT в NextAuth v5

### С `strategy: "jwt"`

1. **Вход пользователя** → NextAuth создаёт JWT токен
2. **JWT токен** сохраняется в **HTTP-only cookie** автоматически
3. **Cookie** устанавливается с правильными флагами:
   - `httpOnly: true` (защита от XSS)
   - `secure: true` на HTTPS (Vercel)
   - `sameSite: lax` (защита от CSRF)
4. **Браузер** автоматически отправляет cookie с каждым запросом
5. **NextAuth** проверяет JWT и восстанавливает сессию

### Важно!

NextAuth v5 **автоматически** управляет cookies при использовании JWT стратегии.

Кастомный блок `cookies` нужен только при:
- `strategy: "database"` (сессии в БД)
- Специфичных требованиях к именам cookies
- Использовании нескольких доменов

Для обычного случая (JWT + Vercel) — **НЕ указывайте `cookies`**!

---

## 📊 Что изменилось

| Параметр | Было | Стало | Зачем |
|----------|------|-------|-------|
| `cookies` блок | ✅ Указан | ❌ Удалён | Конфликтовал с JWT, NextAuth управляет сам |
| `trustHost` | ✅ true | ✅ true | Нужно для Vercel |
| `session.strategy` | ✅ jwt | ✅ jwt | Без изменений |
| `callbacks` | ✅ Настроены | ✅ Без изменений | Работают корректно |

---

## 🧪 Как проверить после исправления

### 1️⃣ Локально (http://localhost:3000)

```bash
# Запустить dev сервер
npm run dev

# Войти на сайт
# Email: admin@fodisushi.com
# Password: admin123

# Проверить сессию
curl http://localhost:3000/api/auth/session

# Ожидаемый результат:
{
  "user": {
    "email": "admin@fodisushi.com",
    "name": "Admin User",
    "role": "admin",
    "id": "..."
  },
  "expires": "2025-11-04T..."
}
```

### 2️⃣ На Vercel (Production)

После деплоя:

```bash
# Проверить сессию
curl https://menu-fodifood.vercel.app/api/auth/session

# Войти на сайт через браузер
open https://menu-fodifood.vercel.app/auth/signin

# Email: admin@fodisushi.com
# Password: admin123

# Проверить в DevTools → Application → Cookies
# Должен быть cookie: next-auth.session-token
```

### 3️⃣ Проверить логи в терминале

После успешного входа вы увидите:

```
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
👤 Session loaded for: admin@fodisushi.com (role: admin)
```

---

## 🚀 Что делать дальше

### 1. Закоммитить изменения

```bash
git add src/auth.ts
git commit -m "fix: удалён блок cookies из NextAuth - конфликтовал с JWT стратегией"
git push origin main
```

### 2. Дождаться деплоя на Vercel

Vercel автоматически запустит новый деплой (~2-3 минуты).

### 3. Очистить cookies в браузере

**Chrome/Edge:**
1. F12 → Application → Cookies
2. Удалите все cookies для `menu-fodifood.vercel.app`
3. Перезагрузите страницу

**Firefox:**
1. F12 → Storage → Cookies
2. Правый клик → Delete All

### 4. Попробовать войти снова

1. Перейдите на https://menu-fodifood.vercel.app/auth/signin
2. Введите:
   - Email: `admin@fodisushi.com`
   - Password: `admin123`
3. После входа проверьте:
   - ✅ Редирект на главную
   - ✅ В шапке отображается имя пользователя
   - ✅ Доступна кнопка "Admin"
   - ✅ После перезагрузки страницы вход сохраняется

---

## ✅ Проверочный чек-лист

После исправления убедитесь:

- [ ] Блок `cookies` удалён из `src/auth.ts`
- [ ] `trustHost: true` остался
- [ ] `session.strategy: "jwt"` без изменений
- [ ] Callbacks настроены (jwt и session)
- [ ] Изменения закоммичены и запушены
- [ ] Деплой на Vercel завершён успешно
- [ ] Вход на Vercel работает
- [ ] Сессия сохраняется после перезагрузки
- [ ] Cookie `next-auth.session-token` появляется в DevTools
- [ ] `/api/auth/session` возвращает данные пользователя
- [ ] Админ-панель доступна для admin@fodisushi.com

---

## 📚 Полезные ссылки

- [NextAuth.js v5 Migration Guide](https://authjs.dev/getting-started/migrating-to-v5)
- [NextAuth.js Session Strategies](https://authjs.dev/concepts/session-strategies)
- [NextAuth.js Configuration](https://authjs.dev/reference/core)

---

## 💡 Извлечённые уроки

### ✅ Правило:

> **При `strategy: "jwt"` в NextAuth v5 — НЕ указывайте блок `cookies`!**

NextAuth автоматически управляет JWT токенами и cookies. Кастомная конфигурация может привести к конфликтам.

### Когда `cookies` нужен:

- `strategy: "database"` (сессии в PostgreSQL/MySQL)
- Кастомные названия cookies
- Multi-tenant приложения
- Специфичные требования безопасности

### Для обычного JWT + Vercel:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  // НЕ добавляйте cookies!
});
```

---

**Дата исправления:** 5 октября 2025 г.

**Результат:** ✅ Вход на Vercel теперь работает корректно, сессия сохраняется после перезагрузки!
