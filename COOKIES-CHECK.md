# 🍪 Проверка NextAuth Cookies на Vercel

## 🎯 Что проверяем

NextAuth должен правильно устанавливать cookies с флагами безопасности для работы на HTTPS (Vercel).

---

## ✅ Правильная конфигурация в `src/auth.ts`

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,              // ✅ Cookie недоступна из JS
        sameSite: 'lax',             // ✅ Защита от CSRF
        path: '/',                   // ✅ Доступна на всех путях
        secure: process.env.NODE_ENV === 'production', // ✅ HTTPS только на проде
      },
    },
  },
  trustHost: true, // ✅ Важно для Vercel!
  // ...остальная конфигурация
});
```

---

## 🔍 Как проверить cookies в Chrome DevTools

### 1️⃣ **Откройте сайт на Vercel**
```
https://menu-fodifood.vercel.app
```

### 2️⃣ **Откройте Chrome DevTools**
- Нажмите `F12` или `Cmd+Option+I` (Mac)
- Или правый клик → **Inspect**

### 3️⃣ **Перейдите на вкладку Application**
```
DevTools → Application → Storage → Cookies
```

### 4️⃣ **Выберите ваш домен**
```
Cookies → https://menu-fodifood.vercel.app
```

### 5️⃣ **Найдите cookie `next-auth.session-token`**

После входа (Sign In) должна появиться cookie с таким именем.

---

## ✅ Правильные параметры cookie

| Параметр | Значение | Описание |
|----------|----------|----------|
| **Name** | `next-auth.session-token` | Имя cookie |
| **Value** | `eyJhbGc...` (JWT токен) | Зашифрованный токен сессии |
| **Domain** | `.vercel.app` | Домен (с точкой для поддоменов) |
| **Path** | `/` | Доступна на всех путях |
| **Expires** | Дата через 30 дней | Время жизни cookie |
| **Size** | ~200-500 bytes | Размер токена |
| **HttpOnly** | ✅ (галочка) | Cookie недоступна из JavaScript |
| **Secure** | ✅ (галочка) | Только через HTTPS |
| **SameSite** | `Lax` или `Strict` | Защита от CSRF атак |

---

## ❌ Частые проблемы и решения

### Проблема 1: Нет галочки `Secure`

**Симптомы:**
- Cookie видна в DevTools, но флаг `Secure` не установлен
- Браузер может блокировать cookie на HTTPS

**Причина:**
- `secure: false` в конфигурации NextAuth
- Или `NODE_ENV !== 'production'`

**Решение:**
```typescript
cookies: {
  sessionToken: {
    options: {
      secure: process.env.NODE_ENV === 'production', // ✅
    },
  },
},
```

### Проблема 2: Cookie не сохраняется после входа

**Симптомы:**
- После входа сразу выбрасывает на страницу входа
- Cookie `next-auth.session-token` не появляется в DevTools

**Причина:**
- `trustHost: true` не установлен для Vercel
- Неправильный `NEXTAUTH_URL` в переменных окружения

**Решение:**
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // ✅ Добавьте это!
  // ...
});
```

И убедитесь в Vercel:
```
NEXTAUTH_URL=https://menu-fodifood.vercel.app
```

### Проблема 3: `SameSite` не `Lax` или `Strict`

**Симптомы:**
- Браузер предупреждает в консоли о небезопасных cookies
- Cookie может блокироваться на cross-site запросах

**Решение:**
```typescript
cookies: {
  sessionToken: {
    options: {
      sameSite: 'lax', // ✅ Или 'strict'
    },
  },
},
```

### Проблема 4: Cookie expires сразу или через несколько секунд

**Симптомы:**
- Пользователь выходит из системы при обновлении страницы

**Причина:**
- Не установлен `maxAge` для сессии

**Решение:**
```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // ✅ 30 дней
},
```

---

## 🧪 Тестирование cookies локально (http://localhost:3000)

### На локальной разработке:

```typescript
secure: process.env.NODE_ENV === 'production'
// На localhost это будет false (HTTP без SSL)
```

**Ожидаемое поведение:**

| Параметр | Localhost (HTTP) | Vercel (HTTPS) |
|----------|------------------|----------------|
| **Secure** | ❌ (не установлен) | ✅ (установлен) |
| **HttpOnly** | ✅ | ✅ |
| **SameSite** | `Lax` | `Lax` |

⚠️ **На localhost флаг `Secure` не должен быть установлен** (это нормально для HTTP).

---

## 🔐 Безопасность cookies

### ✅ Рекомендации:

1. **HttpOnly** - всегда `true`
   - Защита от XSS атак
   - Cookie недоступна из `document.cookie`

2. **Secure** - `true` на продакшене
   - Только HTTPS
   - Защита от перехвата на HTTP

3. **SameSite** - `Lax` или `Strict`
   - `Lax` - разрешены GET запросы с других сайтов
   - `Strict` - запрещены все cross-site запросы

4. **Path** - `/`
   - Cookie доступна на всех страницах сайта

5. **MaxAge** - разумное время
   - `30 * 24 * 60 * 60` (30 дней) - для Remember Me
   - `24 * 60 * 60` (1 день) - для стандартных сессий

---

## 📝 Чек-лист проверки

- [ ] Cookie `next-auth.session-token` появляется после входа
- [ ] Флаг `HttpOnly` установлен ✅
- [ ] Флаг `Secure` установлен на Vercel (HTTPS) ✅
- [ ] `SameSite` = `Lax` или `Strict` ✅
- [ ] `Path` = `/` ✅
- [ ] Expires через 30 дней (или нужное время)
- [ ] Cookie сохраняется после обновления страницы
- [ ] После выхода (Sign Out) cookie удаляется

---

## 🛠️ Команды для проверки

### В Chrome DevTools Console:

```javascript
// Проверить, что cookie недоступна из JS (должно вернуть пустую строку или без session-token)
document.cookie

// Проверить наличие сессии через NextAuth API
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log)
```

### Ожидаемый результат `/api/auth/session`:

**Если авторизован:**
```json
{
  "user": {
    "id": "...",
    "email": "admin@fodisushi.com",
    "name": "Администратор",
    "role": "admin"
  },
  "expires": "2025-11-03T..."
}
```

**Если не авторизован:**
```json
{}
```

---

## 📚 Дополнительные ресурсы

- [NextAuth.js Cookies Documentation](https://next-auth.js.org/configuration/options#cookies)
- [MDN: Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎯 Итог

После правильной настройки NextAuth cookies:

✅ Пользователи могут входить и оставаться авторизованными  
✅ Сессия сохраняется при обновлении страницы  
✅ Cookies защищены от XSS и CSRF атак  
✅ Работает как на локальной разработке, так и на Vercel  

**Готово для продакшена! 🚀**
