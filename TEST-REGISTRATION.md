# 🧪 Тестирование регистрации и автоматического входа

## 🔍 Проблема

После регистрации пользователь не попадает автоматически в профиль, а снова видит страницу входа.

## 🛠️ Последнее исправление

Изменён подход к редиректу после автоматического входа:

```typescript
// ❌ СТАРЫЙ СПОСОБ (не работал стабильно)
const result = await signIn(..., { redirect: false });
router.push("/profile"); // SPA переход - сессия могла не успеть сохраниться

// ✅ НОВЫЙ СПОСОБ
const result = await signIn(..., { redirect: false });
if (result?.ok) {
  window.location.href = "/profile"; // Полная перезагрузка с новой сессией
}
```

## 📝 Как тестировать локально

### 1. Запустите dev-сервер
```bash
npm run dev
```

### 2. Откройте консоль браузера (F12)
Следите за логами в консоли

### 3. Откройте страницу регистрации
```
http://localhost:3000/auth/signup
```

### 4. Зарегистрируйтесь с новым email
```
Имя: Test User
Email: test999@test.com  (используйте уникальный!)
Пароль: test123
Подтвердите: test123
```

### 5. Ожидаемое поведение

#### В консоли должны появиться логи:
```
✅ Registration successful, logging in...
🔐 Attempting credentials authorization...
✅ Successful login: test999@test.com (user)
🔑 JWT created for: test999@test.com (role: user)
✅ Auto-login successful, redirecting to profile...
```

#### На странице:
1. Появится зелёное сообщение: **"Регистрация успешна! Выполняется вход..."**
2. Произойдёт перенаправление на `/profile`
3. Вы увидите страницу профиля с вашим именем

### 6. Если не работает - проверьте:

#### A. Cookies в браузере
```
F12 → Application → Cookies → http://localhost:3000
```

Должен быть cookie: `next-auth.session-token` или `__Secure-next-auth.session-token`

#### B. Сессия в консоли
На странице `/profile` откройте консоль и выполните:
```javascript
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log);
```

Должен вернуться объект с `user`:
```json
{
  "user": {
    "email": "test999@test.com",
    "name": "Test User",
    "role": "user",
    "id": "..."
  },
  "expires": "..."
}
```

#### C. Database
Проверьте, что пользователь создался:
```bash
npx prisma studio
```

Откройте таблицу `User` и найдите `test999@test.com`

## 🐛 Возможные проблемы

### 1. "Регистрация успешна, но не удалось выполнить вход"
**Причина:** Неверный пароль при автоматическом входе (маловероятно)

**Решение:** Попробуйте войти вручную через `/auth/signin`

### 2. Редирект на `/auth/signin` вместо `/profile`
**Причина:** Сессия не сохранилась

**Решение:** 
- Очистите cookies: `F12` → Application → Clear storage
- Перезапустите dev-сервер
- Попробуйте в режиме инкогнито

### 3. "User already exists"
**Причина:** Email уже зарегистрирован

**Решение:** Используйте другой email или удалите пользователя через Prisma Studio

## 🚀 Тестирование на Vercel

### 1. После деплоя откройте
```
https://ваш-домен.vercel.app/auth/signup
```

### 2. Зарегистрируйтесь с новым email

### 3. Проверьте логи в Vercel
```
Vercel Dashboard → Project → Deployments → Logs
```

Ищите логи вида:
```
✅ Successful login: email@test.com (user)
🔑 JWT created for: email@test.com (role: user)
```

### 4. Проверьте базу данных Neon
```bash
npx prisma studio --schema=./prisma/schema.prisma
```

## 📊 Сравнение подходов

| Метод | Преимущества | Недостатки |
|-------|--------------|------------|
| `router.push()` | ✅ Мягкая SPA-навигация<br>✅ Нет перезагрузки | ❌ Сессия может не успеть сохраниться<br>❌ Требует `router.refresh()` |
| `window.location.href` | ✅ Гарантированная перезагрузка<br>✅ Сервер получит свежие cookies | ❌ Полная перезагрузка страницы<br>❌ "Моргание" интерфейса |
| `signIn(..., {redirect: true})` | ✅ NextAuth сам управляет<br>✅ Использует redirect callback | ❌ Меньше контроля<br>❌ Может редиректить не туда |

**Выбран:** `window.location.href` - как самый надёжный для автоматического входа после регистрации.

## ✅ Итоговая реализация

```typescript
// signup/page.tsx
const result = await signIn("credentials", {
  email: formData.email,
  password: formData.password,
  redirect: false, // Получаем контроль
});

if (result?.ok) {
  // Полная перезагрузка гарантирует актуальность сессии
  window.location.href = "/profile";
} else {
  // Показываем ошибку
  setError("...");
}
```

---

**Статус:** ✅ Готово к тестированию
