# 🚀 Инструкция по использованию DashboardRedirect

## 📌 Что это?

`DashboardRedirect` - универсальный компонент для автоматического перенаправления пользователей на их дашборды в зависимости от роли.

## 🎯 Маршруты редиректа

```typescript
admin          → /admin/dashboard
business_owner → /business/dashboard
investor       → /invest/dashboard
user           → /profile
```

## 💡 Использование

### Вариант 1: На главной странице

```tsx
// src/app/page.tsx
import DashboardRedirect from "@/components/DashboardRedirect";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { UserRole } from "@/types/user";

export default function HomePage() {
  const { user } = useAuth();
  const { currentRole } = useRole();
  
  // Редирект для не-USER ролей
  const shouldRedirect = user && currentRole && currentRole !== UserRole.USER;
  
  if (shouldRedirect) {
    return <DashboardRedirect />;
  }
  
  // Контент главной страницы для обычных пользователей
  return <div>...</div>;
}
```

### Вариант 2: После логина

```tsx
// src/app/auth/signin/page.tsx
import DashboardRedirect from "@/components/DashboardRedirect";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const { user } = useAuth();
  
  // После успешного логина
  if (user) {
    return <DashboardRedirect />;
  }
  
  return <LoginForm />;
}
```

### Вариант 3: Универсальная страница

```tsx
// src/app/dashboard/page.tsx
import DashboardRedirect from "@/components/DashboardRedirect";

export default function DashboardPage() {
  // Просто вызываем компонент - он сам всё сделает
  return <DashboardRedirect />;
}
```

## 🔍 Как это работает?

1. Компонент использует `useRole()` для получения текущей роли
2. Проверяет роль через `Record<string, string>` маппинг
3. Делает `router.push()` на соответствующий маршрут
4. Логирует редирект в консоль для отладки

## 🛡️ Защита

Компонент работает в связке с **middleware.ts**:

```typescript
// middleware.ts проверяет доступ
if (pathname.startsWith("/admin") && role !== "admin") {
  return NextResponse.redirect(new URL("/", request.url));
}

if (pathname.startsWith("/business") && role !== "business_owner") {
  return NextResponse.redirect(new URL("/", request.url));
}

if (pathname.startsWith("/invest") && role !== "investor") {
  return NextResponse.redirect(new URL("/", request.url));
}
```

## 📊 Примеры сценариев

### Сценарий 1: Business Owner заходит на главную
1. User логинится как `business_owner`
2. Открывает `/` (главная страница)
3. `DashboardRedirect` срабатывает
4. Редирект на `/business/dashboard`
5. Видит свой ресторан и статистику

### Сценарий 2: Investor заходит в профиль
1. User с ролью `investor`
2. Переключается на роль инвестора через RoleSwitcher
3. `DashboardRedirect` срабатывает
4. Редирект на `/invest/dashboard`
5. Видит портфель и рынок инвестиций

### Сценарий 3: Admin входит в систему
1. Admin логинится
2. `DashboardRedirect` срабатывает
3. Редирект на `/admin/dashboard`
4. Видит системную статистику

### Сценарий 4: Обычный пользователь
1. User с ролью `user`
2. Остаётся на `/` (главная)
3. Видит витрину ресторанов
4. Может заказывать еду

## 🎨 Визуальный flow

```
┌─────────────────┐
│  Login / Signup │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   useRole()     │
│  currentRole    │
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │ Role?  │
    └───┬────┘
        │
   ┌────┴────┬────────┬─────────┬──────┐
   │         │        │         │      │
   ▼         ▼        ▼         ▼      ▼
 admin   business  investor   user   null
   │      owner      │         │      │
   ▼         │        │         │      ▼
/admin/   /business/ │      /profile  (stay)
dashboard dashboard  │
          │          ▼
          └──────> /invest/
                  dashboard
```

## 🔧 Кастомизация

Если нужно изменить маршруты:

```typescript
// src/components/DashboardRedirect.tsx
const routes: Record<string, string> = {
  admin: "/admin/overview",           // было: /admin/dashboard
  business_owner: "/business/home",   // было: /business/dashboard
  investor: "/invest/home",           // было: /invest/dashboard
  user: "/",                          // было: /profile
};
```

## 📝 Debug

Компонент логирует каждый редирект:

```
🔄 DashboardRedirect: Role "business_owner" → /business/dashboard
```

Проверить в консоли браузера.

## ✅ Checklist

- [x] `DashboardRedirect.tsx` создан
- [x] `useRole()` hook используется
- [x] Маршруты настроены для 4 ролей
- [x] Интегрирован в `src/app/page.tsx`
- [x] Middleware защищает роуты
- [x] Логирование работает
- [x] Без ошибок компиляции

## 🎯 Результат

Теперь при любом входе пользователь автоматически попадает на свой дашборд! 🚀
