# 🧪 Тестирование SessionProvider и редиректов

## ✅ Что проверено

### 1. SessionProvider настроен правильно
```tsx
// src/app/providers.tsx
<SessionProvider
  refetchInterval={5 * 60}           // Обновление каждые 5 минут
  refetchOnWindowFocus={true}         // Обновление при фокусе
>
```

### 2. Все клиентские компоненты обёрнуты
- ✅ `Header.tsx` (useSession)
- ✅ `signin/page.tsx` (signIn)
- ✅ `signup/page.tsx` (signIn)

### 3. Redirect callback настроен
```typescript
// src/auth.ts
async redirect({ url, baseUrl }) {
  // Относительные URL → абсолютные
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  // Предотвращаем редирект на /auth/signin
  if (url.includes('/auth/signin')) {
    return `${baseUrl}/profile`;
  }
}
```

### 4. Страница /profile защищена
```typescript
// src/app/profile/page.tsx
const session = await auth();
if (!session?.user) {
  redirect("/auth/signin");
}
```

## 🔬 Тесты для проверки

### Тест 1: Вход и редирект
```bash
1. Откройте http://localhost:3000/auth/signin
2. Войдите как admin@fodisushi.com / admin123
3. ✅ Должны попасть на /admin
4. Войдите как user@test.com / user123
5. ✅ Должны попасть на /profile
```

**Ожидаемые логи в консоли:**
```
🔐 Attempting sign in...
🎯 Using callback URL: /profile
✅ Successful login: user@test.com (user)
🔑 JWT created for: user@test.com (role: user)
🔀 Redirect callback: url=/profile, baseUrl=http://localhost:3000
👤 Session loaded for: user@test.com (role: user)
```

### Тест 2: Перезагрузка /profile не выкидывает
```bash
1. Войдите на сайт
2. Откройте /profile
3. ✅ Видите свой профиль
4. Нажмите F5 (перезагрузка)
5. ✅ Остаётесь на /profile (не редиректит на /auth/signin)
```

**Проверка в консоли:**
```javascript
// Выполните в консоли браузера на странице /profile
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log);

// Должно вернуть:
{
  "user": {
    "email": "user@test.com",
    "name": "Test User",
    "role": "user",
    "id": "..."
  },
  "expires": "2025-11-04T..."
}
```

### Тест 3: Регистрация и автоматический вход
```bash
1. Откройте /auth/signup
2. Зарегистрируйтесь с новым email
3. ✅ Видите "Регистрация успешна! Выполняется вход..."
4. ✅ Автоматически попадаете на /profile
5. Нажмите F5
6. ✅ Остаётесь на /profile
```

**Ожидаемые логи:**
```
✅ Registration successful, logging in...
✅ Successful login: newemail@test.com (user)
🔑 JWT created for: newemail@test.com (role: user)
✅ Auto-login successful, redirecting to profile...
```

### Тест 4: Переключение вкладок (refetchOnWindowFocus)
```bash
1. Войдите на сайт
2. Откройте /profile в двух вкладках
3. В одной вкладке выйдите (Sign Out)
4. Переключитесь на вторую вкладку
5. ✅ Через несколько секунд должен быть редирект на /auth/signin
```

### Тест 5: Автообновление сессии (refetchInterval)
```bash
1. Войдите на сайт
2. Откройте DevTools → Network
3. Подождите 5 минут
4. ✅ Должен появиться запрос к /api/auth/session
5. ✅ Сессия обновляется автоматически
```

## 🐛 Возможные проблемы и решения

### Проблема: "Перезагрузка /profile редиректит на /auth/signin"

**Причина:** Сессия не сохраняется в cookies

**Решение:**
```bash
1. Проверьте cookies в DevTools (F12 → Application → Cookies)
2. Должен быть cookie: next-auth.session-token
3. Если нет - проверьте:
   - NEXTAUTH_URL в .env.local
   - NEXTAUTH_SECRET установлен
   - База данных доступна
```

### Проблема: "useSession() возвращает null"

**Причина:** Компонент не обёрнут в SessionProvider

**Решение:**
```tsx
// Убедитесь, что компонент находится внутри <Providers>
// src/app/layout.tsx
<Providers>
  <YourComponent /> {/* ✅ useSession() работает здесь */}
</Providers>
```

### Проблема: "После входа редиректит на /auth/signin"

**Причина:** Некорректный redirect callback

**Решение:**
```typescript
// src/auth.ts - проверьте redirect callback
async redirect({ url, baseUrl }) {
  console.log('🔀 Redirect:', { url, baseUrl }); // Добавьте лог
  
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`; // ✅ Правильно
  }
  
  return url;
}
```

## 📊 Проверка cookies

### В браузере (DevTools)
```
F12 → Application → Cookies → http://localhost:3000

Должны быть:
✅ next-auth.session-token    (значение: JWT токен)
✅ next-auth.csrf-token        (значение: случайная строка)
```

### Через код
```javascript
// В консоли браузера
document.cookie
  .split(';')
  .map(c => c.trim())
  .filter(c => c.startsWith('next-auth'));

// Должно вернуть массив с cookies
```

## 🎯 Итоговая проверка

Выполните все 5 тестов. Если все проходят успешно:

- ✅ SessionProvider настроен правильно
- ✅ Редиректы работают корректно
- ✅ Сессия сохраняется при перезагрузке
- ✅ Автообновление работает
- ✅ Можно деплоить на Vercel!

## 🚀 Деплой на Vercel

После успешных тестов локально:

```bash
git add .
git commit -m "feat: configure SessionProvider with auto-refresh"
git push
```

Vercel автоматически задеплоит. Повторите тесты на продакшене!

---

**Статус:** ✅ Готово к тестированию
**Дата:** 5 октября 2025
