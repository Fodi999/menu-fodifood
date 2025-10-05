# 🗺️ Навигация после входа

## 📋 Логика перенаправления

После успешного входа на `/auth/signin` пользователь перенаправляется на:

| Роль | Страница | URL |
|------|----------|-----|
| **admin** | Админ-панель | `/admin` |
| **user** | Личный кабинет | `/profile` |

---

## 🔐 Защита страниц

### `/profile` - Личный кабинет

**Файл:** `src/app/profile/page.tsx`

**Проверки:**
```typescript
const session = await auth();

if (!session?.user) {
  redirect("/auth/signin");
}
```

**Доступ:**
- ✅ Авторизованные пользователи (любая роль)
- ❌ Неавторизованные → редирект на `/auth/signin`

**Функционал:**
- Информация о пользователе
- История заказов (последние 5)
- Кнопка выхода
- Информация о роли (admin/user)

---

### `/admin` - Админ-панель

**Файл:** `src/app/admin/page.tsx`

**Проверки:**
```typescript
const session = await auth();

if (!session?.user || session.user.role !== "admin") {
  redirect("/auth/signin");
}
```

**Доступ:**
- ✅ Только администраторы (`role === "admin"`)
- ❌ Обычные пользователи → редирект на `/auth/signin`
- ❌ Неавторизованные → редирект на `/auth/signin`

**Функционал:**
- 📊 Статистика:
  - Всего пользователей
  - Всего продуктов
  - Всего заказов
  - Общая выручка
- 📦 Последние заказы
- 🔗 Ссылки на:
  - `/admin/users` - управление пользователями
  - `/admin/orders` - управление заказами

---

## 🎯 Процесс входа (signin)

**Файл:** `src/app/auth/signin/page.tsx`

### Шаг 1: Ввод credentials
```typescript
const result = await signIn("credentials", {
  email,
  password,
  redirect: false, // ✅ Важно!
});
```

### Шаг 2: Проверка результата
```typescript
if (result?.error) {
  setError("Неверный email или пароль");
  return;
}
```

### Шаг 3: Получение сессии
```typescript
const response = await fetch("/api/auth/session");
const session = await response.json();
```

### Шаг 4: Определение пути редиректа
```typescript
const redirectPath = session?.user?.role === "admin" 
  ? "/admin" 
  : "/profile";
```

### Шаг 5: Перенаправление
```typescript
setTimeout(() => {
  router.push(redirectPath);
  router.refresh();
}, 800);
```

---

## 🧪 Тестирование навигации

### Вход как администратор:

```
Email:    admin@fodisushi.com
Password: admin123
```

**Ожидаемый результат:**
1. ✅ Сообщение: "Вход выполнен успешно! Перенаправление..."
2. ✅ Редирект на `/admin` через 800ms
3. ✅ Отображается админ-панель со статистикой
4. ✅ В консоли: `🔄 Redirecting to: /admin`

---

### Вход как обычный пользователь:

```
Email:    user@test.com
Password: user123
```

**Ожидаемый результат:**
1. ✅ Сообщение: "Вход выполнен успешно! Перенаправление..."
2. ✅ Редирект на `/profile` через 800ms
3. ✅ Отображается личный кабинет
4. ✅ В консоли: `🔄 Redirecting to: /profile`

---

### Попытка доступа к `/admin` обычным пользователем:

```
1. Войти как user@test.com
2. Вручную перейти на /admin
```

**Ожидаемый результат:**
1. ❌ Middleware блокирует доступ
2. ✅ Редирект на `/auth/signin`
3. ✅ В консоли middleware: "Access denied for user"

---

## 🔗 Все роуты приложения

### Публичные (доступны всем):
- `/` - главная страница
- `/auth/signin` - вход
- `/auth/signup` - регистрация
- `/api/health` - health check
- `/api/products` - список продуктов

### Требуют авторизации:
- `/profile` - личный кабинет (любая роль)
- `/api/auth/session` - текущая сессия

### Только для администраторов:
- `/admin` - главная админки
- `/admin/users` - управление пользователями
- `/admin/orders` - управление заказами

---

## 📊 Диаграмма навигации

```
┌─────────────────┐
│  /auth/signin   │
│   (вход)        │
└────────┬────────┘
         │
         ▼
   ┌─────────────┐
   │ signIn()    │
   │ успешно?    │
   └──────┬──────┘
          │
    ┌─────▼─────┐
    │  Роль?    │
    └─────┬─────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌───────┐   ┌─────────┐
│ admin │   │  user   │
└───┬───┘   └────┬────┘
    │            │
    ▼            ▼
┌────────┐  ┌──────────┐
│ /admin │  │ /profile │
└────────┘  └──────────┘
```

---

## 🐛 Типичные проблемы

### ❌ Редирект не работает

**Симптомы:**
- После входа остаёмся на `/auth/signin`
- Нет перенаправления

**Причины и решения:**

1. **Отсутствует `redirect: false`**
   ```typescript
   // ❌ Неправильно
   await signIn("credentials", { email, password });
   
   // ✅ Правильно
   await signIn("credentials", { 
     email, 
     password, 
     redirect: false 
   });
   ```

2. **router.push() вызывается синхронно**
   ```typescript
   // ❌ Неправильно
   router.push("/profile");
   
   // ✅ Правильно
   setTimeout(() => {
     router.push("/profile");
     router.refresh();
   }, 800);
   ```

3. **Сессия не создаётся**
   - Проверьте NEXTAUTH_SECRET на Vercel
   - Проверьте логи в консоли браузера

---

### ❌ Редирект на `/admin` для обычного пользователя

**Причина:** Роль не проверяется

**Решение:**
```typescript
const redirectPath = session?.user?.role === "admin" 
  ? "/admin" 
  : "/profile";
```

---

### ❌ Middleware блокирует доступ к `/profile`

**Причина:** Неправильная проверка в middleware

**Решение:** Проверьте `src/middleware.ts`:
```typescript
// /profile доступен любому авторизованному
if (pathname === "/profile" && token) {
  return NextResponse.next();
}

// /admin только для админов
if (pathname.startsWith("/admin") && token?.role !== "admin") {
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}
```

---

## ✅ Чек-лист навигации

- [ ] `redirect: false` в signIn()
- [ ] Получение сессии после входа
- [ ] Проверка роли: `session?.user?.role`
- [ ] Условный редирект: admin → /admin, user → /profile
- [ ] setTimeout для задержки редиректа
- [ ] router.push() → router.refresh()
- [ ] Защита `/admin` в middleware
- [ ] Защита `/admin` в самом компоненте
- [ ] Проверка auth() на обеих страницах
- [ ] Логирование в консоль для отладки

---

## 📝 Логи в консоли

### Успешный вход (admin):
```
🔐 Attempting sign in...
📊 Sign in result: {ok: true, error: null}
✅ Sign in successful!
👤 Session after login: {user: {email: "admin@fodisushi.com", role: "admin"}}
🔄 Redirecting to: /admin
```

### Успешный вход (user):
```
🔐 Attempting sign in...
📊 Sign in result: {ok: true, error: null}
✅ Sign in successful!
👤 Session after login: {user: {email: "user@test.com", role: "user"}}
🔄 Redirecting to: /profile
```

### Неудачный вход:
```
🔐 Attempting sign in...
📊 Sign in result: {ok: false, error: "CredentialsSignin"}
❌ Sign in error: CredentialsSignin
```

---

**Обновлено:** 5 октября 2025 г.
