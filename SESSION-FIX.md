# 🔐 Исправление проблемы с сессией NextAuth

## Проблема
После успешного входа имя пользователя отображается в Header, но при клике на него (переход на `/profile`) происходит повторный редирект на страницу входа.

## Причина
1. Использование `window.location.href` вызывает полную перезагрузку страницы
2. Сессия на клиенте (React context) не синхронизируется автоматически после входа
3. `useSession()` в Header не получает обновлённые данные сессии

## Решение

### 1. Изменён способ редиректа в signin/page.tsx
**Было:**
```typescript
window.location.href = redirectPath;
```

**Стало:**
```typescript
// Обновляем сессию на клиенте
await update();

// Используем Next.js router для SPA-навигации
router.push(redirectPath);
router.refresh();
```

### 2. Добавлен useSession().update()
Это обновляет сессию в React context без полной перезагрузки страницы.

### 3. Настроен SessionProvider в layout.tsx
```typescript
<SessionProvider 
  refetchInterval={5 * 60}        // Обновление каждые 5 минут
  refetchOnWindowFocus={true}     // Обновление при фокусе на окне
>
```

### 4. Добавлено логирование в Header
```typescript
useEffect(() => {
  console.log("🔍 Header session status:", status);
  console.log("👤 Header session data:", session);
}, [session, status]);
```

## Преимущества нового подхода

✅ **SPA-навигация:** Переход между страницами без полной перезагрузки  
✅ **Синхронизация сессии:** `update()` обновляет context немедленно  
✅ **Лучший UX:** Быстрее и плавнее для пользователя  
✅ **Автоматические обновления:** SessionProvider периодически проверяет сессию  

## Тестирование

### Локально
```bash
npm run dev
```

1. Откройте http://localhost:3000
2. Войдите как user@example.com / password
3. Проверьте, что имя отображается в Header
4. Нажмите на имя → должен открыться /profile без запроса входа
5. Проверьте консоль браузера на наличие логов сессии

### На Vercel
1. Сделайте git push
2. Дождитесь деплоя
3. Повторите шаги тестирования

## Отладка

Если проблема сохраняется, проверьте в консоли браузера:
- `🔍 Header session status:` должен быть `"authenticated"`
- `👤 Header session data:` должен содержать `user` объект
- При переходе на /profile не должно быть редиректов

## Альтернативное решение (если не поможет)

Если проблема всё ещё воспроизводится, можно вернуться к `window.location.href`, но добавить:

```typescript
// Форсируем обновление сессии на сервере
await fetch("/api/auth/session", { 
  method: "GET",
  headers: { "Cache-Control": "no-cache" }
});

// Ждём дополнительное время
await new Promise(resolve => setTimeout(resolve, 1500));

window.location.href = redirectPath;
```

## Дополнительные проверки

1. **Проверьте cookies:** В DevTools → Application → Cookies должен быть `next-auth.session-token`
2. **Проверьте middleware:** В `/src/middleware.ts` правильно настроена защита роутов
3. **Проверьте базу данных:** Сессия должна сохраняться (если используется database strategy)

---
**Дата:** 2025-01-XX  
**Статус:** В тестировании  
