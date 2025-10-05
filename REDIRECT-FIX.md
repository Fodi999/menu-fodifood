# 🔄 Решение проблемы перенаправления после входа

## ❌ Проблема
После успешного входа пользователь не перенаправляется на `/profile` или `/admin`.

## 🔍 Причины

### 1. Отсутствует `redirect: false`
**Проблема:** NextAuth делает серверный редирект, который не работает в Next.js App Router на Vercel.

**Решение:**
```typescript
await signIn("credentials", {
  redirect: false, // ✅ Важно!
  email,
  password,
});
```

### 2. Нет ручного перенаправления
**Проблема:** После `signIn()` не вызывается `router.push()` или `window.location.href`.

**Решение:**
```typescript
const result = await signIn("credentials", {
  redirect: false,
  email,
  password,
});

if (result?.ok) {
  window.location.href = "/profile"; // ✅ Ручной редирект
}
```

### 3. Сессия не успевает сохраниться
**Проблема:** Между `signIn()` и проверкой сессии на защищённой странице проходит слишком мало времени.

**Решение:** Добавить задержку перед редиректом:
```typescript
if (result?.ok) {
  // Ждём 1 секунду, чтобы сессия точно сохранилась
  await new Promise(resolve => setTimeout(resolve, 1000));
  window.location.href = "/profile";
}
```

---

## ✅ Итоговое решение (текущая реализация)

### `/src/app/auth/signin/page.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Вход с redirect: false
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // ✅ Отключаем автоматический редирект
    });

    if (result?.error) {
      setError("Неверный email или пароль");
      setLoading(false);
      return;
    }

    if (result?.ok) {
      setSuccess("Вход выполнен успешно!");
      
      // 2. Ждём 1 секунду для сохранения сессии
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Получаем сессию для проверки роли
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      
      // 4. Определяем путь в зависимости от роли
      const redirectPath = session?.user?.role === "admin" 
        ? "/admin" 
        : "/profile";
      
      // 5. Перенаправляем с полной перезагрузкой
      window.location.href = redirectPath;
    }
  } catch (err) {
    setError("Произошла ошибка при входе");
    setLoading(false);
  }
};
```

---

## 🎯 Почему `window.location.href` вместо `router.push()`?

| Метод | Преимущества | Недостатки |
|-------|--------------|------------|
| `router.push()` | SPA-навигация (быстрее) | Может не обновить сессию на клиенте |
| `window.location.href` | **Полная перезагрузка** → гарантированное обновление сессии | Медленнее (перезагрузка всей страницы) |

**Вывод:** Для страниц после входа лучше использовать `window.location.href`, чтобы гарантировать обновление сессии.

---

## 🔐 Защита страниц `/profile` и `/admin`

### `/src/app/profile/page.tsx`
```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin"); // ✅ Редирект неавторизованных
  }

  return <div>Привет, {session.user.name}!</div>;
}
```

### `/src/app/admin/page.tsx`
```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin"); // ✅ Редирект неадминов
  }

  return <div>Админ-панель</div>;
}
```

---

## 🧪 Тестирование

### Локально (http://localhost:3000):

```bash
# 1. Запустить dev сервер
npm run dev

# 2. Открыть в браузере
http://localhost:3000/auth/signin

# 3. Войти как админ
Email: admin@fodisushi.com
Password: admin123

# 4. Должен произойти редирект на /admin через ~1 секунду

# 5. Войти как пользователь
Email: user@test.com
Password: user123

# 6. Должен произойти редирект на /profile через ~1 секунду
```

### На Vercel (https://menu-fodifood.vercel.app):

```bash
# 1. Открыть страницу входа
https://menu-fodifood.vercel.app/auth/signin

# 2. Войти как админ
Email: admin@fodisushi.com
Password: admin123

# 3. Проверить в консоли браузера (F12):
# ✅ Sign in successful!
# 👤 Session after login: { user: { role: "admin", ... } }
# 🔄 Redirecting to: /admin

# 4. Должен произойти редирект на /admin
```

---

## 📊 Логи в консоли

**Успешный вход:**
```
🔐 Attempting sign in...
📊 Sign in result: { ok: true, status: 200, ... }
✅ Sign in successful!
👤 Session after login: {
  user: {
    email: "admin@fodisushi.com",
    name: "Admin User",
    role: "admin",
    id: "..."
  },
  expires: "..."
}
🔄 Redirecting to: /admin
```

**Неудачный вход:**
```
🔐 Attempting sign in...
📊 Sign in result: { error: "CredentialsSignin", status: 401, ... }
❌ Sign in error: CredentialsSignin
```

---

## ⚡ Оптимизация (опционально)

Если хотите использовать SPA-навигацию без полной перезагрузки:

```typescript
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const router = useRouter();
const { update } = useSession();

if (result?.ok) {
  // 1. Обновить сессию на клиенте
  await update();
  
  // 2. Подождать немного
  await new Promise(r => setTimeout(r, 500));
  
  // 3. Получить обновлённую сессию
  const response = await fetch("/api/auth/session");
  const session = await response.json();
  
  // 4. SPA-навигация
  router.push(session?.user?.role === "admin" ? "/admin" : "/profile");
  router.refresh();
}
```

**Но:** `window.location.href` более надёжен для первого входа.

---

## ✅ Чек-лист решения

- [x] `redirect: false` в `signIn()`
- [x] Задержка 1000ms после `signIn()`
- [x] Проверка сессии через `/api/auth/session`
- [x] Условный редирект по роли
- [x] `window.location.href` для гарантированного обновления
- [x] Логирование всех шагов
- [x] Обработка ошибок

---

## 🔗 Связанные файлы

- `src/app/auth/signin/page.tsx` - страница входа
- `src/app/profile/page.tsx` - личный кабинет
- `src/app/admin/page.tsx` - админ-панель
- `src/auth.ts` - конфигурация NextAuth
- `src/middleware.ts` - защита роутов

---

**Создано:** 5 октября 2025 г.  
**Статус:** ✅ Реализовано и протестировано
