# ✅ Проверка SessionProvider

## 🔍 Что проверено

### 1. Структура провайдеров

```
src/app/layout.tsx (client component)
  └── <Providers>                    ← SessionProvider
      └── <I18nextProvider>
          └── {children}             ← Все страницы
```

### 2. Компоненты, использующие NextAuth хуки

| Компонент | Хук | Статус | Путь |
|-----------|-----|--------|------|
| **Header.tsx** | `useSession()` | ✅ Обёрнут | `/src/app/components/Header.tsx` |
| **signin/page.tsx** | `signIn()` | ✅ Обёрнут | `/src/app/auth/signin/page.tsx` |
| **signup/page.tsx** | `signIn()` | ✅ Обёрнут | `/src/app/auth/signup/page.tsx` |

### 3. Конфигурация SessionProvider

```tsx
// src/app/providers.tsx
<SessionProvider
  refetchInterval={5 * 60}        // Обновлять каждые 5 минут
  refetchOnWindowFocus={true}     // Обновлять при фокусе на окне
>
  {children}
</SessionProvider>
```

## 🎯 Преимущества текущей настройки

### ✅ Автоматическое обновление сессии
```typescript
refetchInterval={5 * 60}  // 300 секунд = 5 минут
```
- Сессия автоматически обновляется каждые 5 минут
- Предотвращает неожиданное истечение сессии
- Пользователь остаётся авторизованным

### ✅ Обновление при возврате к вкладке
```typescript
refetchOnWindowFocus={true}
```
- Когда пользователь возвращается к вкладке браузера
- Сессия проверяется и обновляется
- Актуальные данные пользователя всегда в Header

## 🧪 Тестирование

### 1. Проверка useSession в Header

```bash
# Откройте
http://localhost:3000

# В консоли браузера (F12)
# Войдите как admin@fodisushi.com / admin123

# Header должен показать:
# ✅ "Привет, Admin" (или имя пользователя)
# ✅ Кнопку "Выйти"
```

### 2. Проверка signIn в форме входа

```bash
# Откройте
http://localhost:3000/auth/signin

# Введите данные и нажмите "Войти"

# Ожидаемое поведение:
# ✅ Появится сообщение "Вход..."
# ✅ Редирект на /profile или /admin
# ✅ Header покажет имя пользователя
```

### 3. Проверка signIn в форме регистрации

```bash
# Откройте
http://localhost:3000/auth/signup

# Зарегистрируйтесь с новым email

# Ожидаемое поведение:
# ✅ "Регистрация успешна! Выполняется вход..."
# ✅ Автоматический вход
# ✅ Редирект на /profile
# ✅ Header покажет ваше имя
```

### 4. Проверка обновления сессии

```bash
# 1. Войдите в систему
# 2. Откройте консоль браузера (F12)
# 3. Переключитесь на другую вкладку на 10 секунд
# 4. Вернитесь обратно

# В консоли должен быть лог:
# 👤 Session loaded for: email@test.com (role: user)
```

## 🔧 Использование в компонентах

### Пример 1: Получение данных сессии

```tsx
"use client";

import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Загрузка...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Вы не авторизованы</div>;
  }

  return (
    <div>
      <p>Привет, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      <p>Роль: {session.user.role}</p>
    </div>
  );
}
```

### Пример 2: Условный рендеринг

```tsx
"use client";

import { useSession } from "next-auth/react";

export function AdminButton() {
  const { data: session } = useSession();

  if (session?.user.role !== "admin") {
    return null; // Скрываем для обычных пользователей
  }

  return (
    <button>Админ-панель</button>
  );
}
```

### Пример 3: Вход/Выход

```tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()}>
        Выйти
      </button>
    );
  }

  return (
    <button onClick={() => signIn()}>
      Войти
    </button>
  );
}
```

## ⚠️ Важные замечания

### ❌ НЕ используйте хуки NextAuth вне Providers

```tsx
// ❌ НЕПРАВИЛЬНО - вне Providers
export default function SomeComponent() {
  const { data: session } = useSession(); // ОШИБКА!
  // ...
}
```

### ✅ Используйте только внутри Providers

```tsx
// ✅ ПРАВИЛЬНО - внутри layout.tsx
<Providers>
  <SomeComponent /> {/* здесь useSession работает */}
</Providers>
```

### 🔒 Для серверных компонентов используйте auth()

```tsx
// Серверный компонент (НЕ "use client")
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth(); // ✅ Работает на сервере
  
  if (!session) {
    redirect("/auth/signin");
  }

  return <div>Привет, {session.user.name}</div>;
}
```

## 📊 Сравнение подходов

| Подход | Где использовать | Преимущества | Недостатки |
|--------|------------------|--------------|------------|
| `useSession()` | Клиентские компоненты | ✅ Реактивность<br>✅ Автообновление | ❌ Только на клиенте<br>❌ Требует SessionProvider |
| `await auth()` | Серверные компоненты | ✅ SSR/SSG<br>✅ SEO | ❌ Только на сервере<br>❌ Не реактивно |

## ✅ Итоговая проверка

- [x] SessionProvider настроен в `src/app/providers.tsx`
- [x] Providers подключён в `src/app/layout.tsx`
- [x] Header использует `useSession()` внутри Providers
- [x] Формы входа/регистрации используют `signIn()` внутри Providers
- [x] Автообновление сессии настроено (5 минут)
- [x] Обновление при фокусе на окне включено

---

**Всё работает корректно!** ✅
