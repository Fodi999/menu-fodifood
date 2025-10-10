# 🔧 Исправление ошибки на Vercel

## ❌ Проблема

**Ошибка:** `Application error: a client-side exception has occurred while loading menu-fodifood.vercel.app`

## 🔍 Причина

Ошибка возникает из-за **использования browser API** (`localStorage`, `window`, `document`) при **серверном рендеринге (SSR)** на Vercel.

В Next.js 15 компоненты по умолчанию рендерятся на сервере, где эти API недоступны. Когда код пытается обратиться к `localStorage` или `window` на сервере, возникает Runtime Error.

### Места где была проблема:

1. **`src/contexts/AuthContext.tsx`** - использование `localStorage` без проверки
2. **`src/hooks/useOrderNotifications.ts`** - использование `window.location` без проверки

## ✅ Решение

Добавлены проверки `typeof window !== "undefined"` перед использованием browser API:

### 1. AuthContext.tsx

```typescript
// ❌ ДО (вызывало ошибку на Vercel)
const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token");
    // ...
  }
}

// ✅ ПОСЛЕ (работает на Vercel)
const checkAuth = async () => {
  try {
    // Проверка на клиентскую сторону
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem("token");
    // ...
  }
}
```

### 2. useOrderNotifications.ts

```typescript
// ❌ ДО
const connect = useCallback(() => {
  if (!token) return;
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // ...
});

// ✅ ПОСЛЕ
const connect = useCallback(() => {
  if (!token) return;
  
  // Проверка на клиентскую сторону
  if (typeof window === 'undefined') {
    console.log('⚠️ Window is undefined, skipping WebSocket connection');
    return;
  }
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  // ...
});
```

## 📝 Все исправленные функции

### AuthContext.tsx
- ✅ `checkAuth()` - добавлена проверка перед `localStorage.getItem()`
- ✅ `login()` - добавлена проверка перед `localStorage.setItem()` и `document.cookie`
- ✅ `signup()` - добавлена проверка перед `localStorage.setItem()` и `document.cookie`
- ✅ `logout()` - добавлена проверка перед `localStorage.removeItem()` и `document.cookie`
- ✅ `getToken()` - уже была проверка

### useOrderNotifications.ts
- ✅ `connect()` - добавлена проверка перед `window.location`

## 🚀 Деплой на Vercel

После этих изменений:

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "fix: добавлены проверки window для SSR совместимости"
   git push origin main
   ```

2. **Vercel автоматически пересоберёт проект**

3. **Проверьте работу:**
   - Откройте https://menu-fodifood.vercel.app
   - Страница должна загрузиться без ошибок
   - Проверьте консоль браузера (F12) - не должно быть ошибок

## 🎯 Best Practices для SSR

### ✅ Правильно:

```typescript
// В клиентских компонентах
"use client";

function MyComponent() {
  useEffect(() => {
    // Browser API доступны в useEffect
    localStorage.setItem("key", "value");
  }, []);
}
```

```typescript
// Проверка перед использованием
if (typeof window !== "undefined") {
  const data = localStorage.getItem("key");
}
```

### ❌ Неправильно:

```typescript
// В серверных компонентах или на верхнем уровне
const data = localStorage.getItem("key"); // ❌ Ошибка на сервере!
```

```typescript
// Без проверки в клиентском компоненте
function MyComponent() {
  const token = localStorage.getItem("token"); // ❌ Может вызвать ошибку при SSR
}
```

## 📊 Проверка

После деплоя убедитесь:

- [ ] Главная страница загружается
- [ ] Страница авторизации работает
- [ ] Админ-панель доступна после входа
- [ ] Нет ошибок в консоли браузера
- [ ] WebSocket подключается (для админов)

## 🔗 Полезные ссылки

- [Next.js: Rendering on the Server](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js: Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)

---

**Статус:** ✅ Исправлено и готово к деплою
