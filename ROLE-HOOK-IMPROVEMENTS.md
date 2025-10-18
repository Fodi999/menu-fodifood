# 🎭 useRole Hook Improvements

## 📋 Обзор улучшений

Хук `useRole` был расширен для лучшего UX при переключении между ролями и добавлены дополнительные утилиты.

---

## ✨ Что добавлено

### 1️⃣ **Автоматическое логирование смены ролей**

Теперь при каждом изменении роли в консоли появляется сообщение с соответствующей иконкой:

```typescript
useEffect(() => {
  if (context.currentRole) {
    const roleEmoji = getRoleEmoji(context.currentRole);
    console.info(`${roleEmoji} Current role: ${context.currentRole}`);
  }
}, [context.currentRole]);
```

**Примеры логов:**
- `👤 Current role: user`
- `💼 Current role: business_owner`
- `💰 Current role: investor`
- `👑 Current role: admin`

---

### 2️⃣ **Emoji-маппинг ролей**

Функция `getRoleEmoji()` возвращает соответствующую иконку для каждой роли:

```typescript
function getRoleEmoji(role: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    [UserRole.USER]: '👤',
    [UserRole.BUSINESS_OWNER]: '💼',
    [UserRole.INVESTOR]: '💰',
    [UserRole.ADMIN]: '👑',
  };
  return roleMap[role] || '🎭';
}
```

---

### 3️⃣ **Новые хелперы для проверки ролей**

#### `useIsBusinessMode()`
Проверяет, находится ли пользователь в режиме бизнес-владельца:
```typescript
const isBusinessMode = useIsBusinessMode();
// true если currentRole === UserRole.BUSINESS_OWNER
```

#### `useIsAdmin()`
Проверяет, является ли пользователь администратором:
```typescript
const isAdmin = useIsAdmin();
// true если currentRole === UserRole.ADMIN
```

#### `useIsUser()`
Проверяет, является ли пользователь обычным пользователем:
```typescript
const isUser = useIsUser();
// true если currentRole === UserRole.USER
```

#### `useIsInvestor()`
Проверяет, является ли пользователь инвестором:
```typescript
const isInvestor = useIsInvestor();
// true если currentRole === UserRole.INVESTOR
```

#### `useHasBusinessAccess()`
Проверяет, имеет ли пользователь доступ к бизнес-функциям:
```typescript
const hasBusinessAccess = useHasBusinessAccess();
// true если business_owner или admin
```

#### `useHasAdminAccess()`
Проверяет, имеет ли пользователь административные права:
```typescript
const hasAdminAccess = useHasAdminAccess();
// true только для admin
```

---

## 🎯 Примеры использования

### Условный рендеринг по роли

```tsx
import { useIsAdmin, useIsBusinessMode } from '@/hooks/useRole';

export function Dashboard() {
  const isAdmin = useIsAdmin();
  const isBusinessMode = useIsBusinessMode();

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {isBusinessMode && <BusinessDashboard />}
    </div>
  );
}
```

### Защита маршрутов

```tsx
import { useHasAdminAccess } from '@/hooks/useRole';
import { useRouter } from 'next/navigation';

export function AdminPage() {
  const hasAdminAccess = useHasAdminAccess();
  const router = useRouter();

  useEffect(() => {
    if (!hasAdminAccess) {
      router.push('/');
    }
  }, [hasAdminAccess]);

  if (!hasAdminAccess) return null;

  return <AdminContent />;
}
```

### Динамическая навигация

```tsx
import { useRole, useIsInvestor } from '@/hooks/useRole';

export function Navigation() {
  const { currentRole } = useRole();
  const isInvestor = useIsInvestor();

  return (
    <nav>
      <Link href="/">Home</Link>
      {isInvestor && <Link href="/invest">My Portfolio</Link>}
      <RoleIndicator role={currentRole} />
    </nav>
  );
}
```

---

## 🔄 Поведение при смене роли

### Консольные логи при переходах:

1. **Вход в систему:**
   ```
   ✅ Connected to Rust backend (cached)
   👤 Current role: user
   ✅ UI Events system active
   ✅ Error logger initialized
   ```

2. **Переключение на Business Owner:**
   ```
   🔄 RoleContext: switchRole called
   📝 RoleContext: Setting current role to business_owner
   💾 RoleContext: Saved to localStorage and cookie
   🦀 RoleContext: Updating role in database...
   ✅ RoleContext: Role updated in database successfully
   💼 Current role: business_owner
   ```

3. **Переключение на Admin:**
   ```
   🔄 RoleContext: switchRole called
   📝 RoleContext: Setting current role to admin
   💾 RoleContext: Saved to localStorage and cookie
   🦀 RoleContext: Updating role in database...
   ✅ RoleContext: Role updated in database successfully
   👑 Current role: admin
   ```

---

## 📊 Полный список ролей

| Роль | Emoji | Описание | Доступ |
|------|-------|----------|--------|
| `user` | 👤 | Обычный пользователь | Просмотр меню, заказы |
| `business_owner` | 💼 | Владелец бизнеса | Управление меню, аналитика |
| `investor` | 💰 | Инвестор | Портфолио, доходность |
| `admin` | 👑 | Администратор | Полный доступ ко всему |

---

## 🚀 Преимущества улучшений

### 1. **Лучший UX при разработке**
- Мгновенная визуальная обратная связь при смене ролей
- Легко отследить текущую роль в консоли
- Понятные emoji-индикаторы

### 2. **Удобство использования**
- Семантические хелперы вместо прямых проверок `currentRole === 'admin'`
- Единая точка входа для всех проверок ролей
- TypeScript поддержка для всех хелперов

### 3. **Поддерживаемость кода**
- Централизованная логика проверки ролей
- Легко добавить новые роли в будущем
- Понятные имена функций

### 4. **Производительность**
- Все хелперы используют один контекст
- Нет лишних ре-рендеров
- Оптимизированные проверки

---

## 🔍 Связанные файлы

- **Hook:** `/src/hooks/useRole.ts`
- **Context:** `/src/contexts/RoleContext.tsx`
- **Types:** `/src/types/user.ts`
- **Provider:** `/src/app/providers.tsx`

---

## ✅ Чек-лист улучшений

- [x] Добавлено логирование смены ролей с emoji
- [x] Создана функция `getRoleEmoji()`
- [x] Добавлены хелперы `useIsBusinessMode()`, `useIsAdmin()`, `useIsUser()`
- [x] Добавлен хелпер `useIsInvestor()`
- [x] Добавлены хелперы `useHasBusinessAccess()` и `useHasAdminAccess()`
- [x] Поддержаны все 4 роли: user, business_owner, investor, admin
- [x] Типизация через TypeScript
- [x] JSDoc документация для всех функций

---

## 🎉 Итог

Теперь система ролей не только функциональна, но и приятна в использовании:
- 🎭 Визуальная обратная связь
- 🔧 Удобные хелперы
- 📦 Полная типизация
- 🚀 Готовность к расширению
