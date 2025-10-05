# 🔄 Исправление автоматического входа после регистрации

## ❌ Проблема

После регистрации пользователь не попадал автоматически в профиль, а снова видел страницу входа.

## 🔍 Причина

1. **Не было задержки** для сохранения сессии NextAuth
2. **Использовался `router.push()`** вместо `window.location.href`
3. **Не было индикатора** успешной регистрации

## ✅ Решение

### 1. Добавлена задержка перед редиректом
```typescript
// Даём время NextAuth сохранить сессию
await new Promise(resolve => setTimeout(resolve, 500));

// Перенаправляем в профиль
window.location.href = "/profile";
```

### 2. Использован `window.location.href`
Вместо `router.push()` используется полный редирект через `window.location.href`, чтобы браузер загрузил страницу с уже установленной сессией.

### 3. Добавлен индикатор успеха
```typescript
setSuccess("Регистрация успешна! Выполняется вход...");
```

### 4. Улучшена обработка ошибок
```typescript
if (result?.error) {
  console.error("❌ Auto-login failed:", result.error);
  setError("Регистрация успешна, но не удалось выполнить вход. Попробуйте войти вручную.");
  setLoading(false);
}
```

## 🎯 Теперь работает так:

1. **Пользователь заполняет форму регистрации**
   ```
   Имя: Иван
   Email: ivan@test.com
   Пароль: password123
   ```

2. **Создаётся аккаунт в БД** (`/api/auth/register`)
   ```typescript
   User {
     email: "ivan@test.com",
     password: "$2a$10$...", // хеш
     name: "Иван",
     role: "user"
   }
   ```

3. **Показывается сообщение "Регистрация успешна! Выполняется вход..."**

4. **Автоматический вход через NextAuth**
   ```typescript
   await signIn("credentials", {
     email: formData.email,
     password: formData.password,
     redirect: false,
   });
   ```

5. **Задержка 500ms** для сохранения сессии

6. **Редирект на `/profile`** через `window.location.href`

7. **Пользователь сразу видит свой профиль!** 🎉

## 📝 Изменённые файлы

- `src/app/auth/signup/page.tsx`

## 🧪 Тестирование

```bash
# 1. Локально
npm run dev

# 2. Откройте http://localhost:3000/auth/signup

# 3. Зарегистрируйтесь с новым email

# 4. Должны автоматически попасть в /profile
```

## 🚀 Деплой

```bash
git add .
git commit -m "fix: auto-login after registration with session delay"
git push
```

Vercel автоматически задеплоит изменения.

## ⚠️ Важно

**Разница между входом и регистрацией:**

| Действие | Метод редиректа | Причина |
|----------|----------------|---------|
| **Вход** | `signIn(..., { redirect: true })` | NextAuth сам делает редирект |
| **Регистрация** | `window.location.href` | Нужен полный перезагруз с новой сессией |

---

**Проблема решена!** ✅
