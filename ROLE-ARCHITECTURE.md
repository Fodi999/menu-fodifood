# 🏗️ Архитектура ролей и страниц

## 📊 Обзор

Чистая архитектура с разделением по ролям. Каждая роль имеет свою папку с дашбордом и функциональными страницами.

## 🎯 Структура ролей

### 🔴 Admin (Администратор платформы)
- **Роль**: `admin`
- **Главная**: `/admin/dashboard`
- **Доступ**: Управление всей платформой

**Страницы:**
```
/admin/
  ├── dashboard/          ✅ Главный дашборд с системной статистикой
  ├── users/              📋 Управление пользователями
  ├── businesses/         🏪 Управление ресторанами
  └── settings/           ⚙️ Настройки платформы
```

### 🟠 Business Owner (Владелец ресторана)
- **Роль**: `business_owner`
- **Главная**: `/business/dashboard`
- **Доступ**: Управление своим рестораном

**Страницы:**
```
/business/
  ├── dashboard/          ✅ Главный дашборд ресторана
  ├── menu/               ✅ Управление меню и блюдами
  ├── orders/             ✅ Заказы клиентов
  ├── analytics/          ✅ Статистика и метрики
  └── settings/           ✅ Настройки профиля бизнеса
```

### 🟢 Investor (Инвестор)
- **Роль**: `investor`
- **Главная**: `/invest/dashboard`
- **Доступ**: Инвестирование через токены

**Страницы:**
```
/invest/
  ├── dashboard/          ✅ Главный дашборд инвестора
  ├── portfolio/          ✅ Текущие инвестиции
  └── market/             ✅ Доступные возможности
```

### 🔵 User (Клиент)
- **Роль**: `user`
- **Главная**: `/profile`
- **Доступ**: Заказ еды, просмотр ресторанов

**Страницы:**
```
/profile                  ✅ Профиль пользователя
/                        ✅ Главная страница (витрина ресторанов)
/orders                  📋 История заказов
```

## 🔄 Логика редиректов

### При логине
```typescript
const redirectByRole = {
  admin: "/admin/dashboard",
  business_owner: "/business/dashboard",
  investor: "/invest/dashboard",
  user: "/profile"
};
```

### Middleware защита
```typescript
// middleware.ts
if (path.startsWith("/admin") && role !== "admin") {
  redirect("/");
}

if (path.startsWith("/business") && role !== "business_owner") {
  redirect("/");
}

if (path.startsWith("/invest") && role !== "investor") {
  redirect("/");
}
```

## 🧩 Компоненты

### RoleNavbar
Глобальная навигация с автоматическим меню по роли.

**Расположение**: `src/components/RoleNavbar.tsx`

**Функции:**
- Показывает только релевантные пункты меню
- Подсвечивает активную страницу
- Отображает текущую роль
- Автоматически скрывается для обычных пользователей

### DashboardCard
Универсальная карточка метрик для всех дашбордов.

**Расположение**: `src/components/ui/DashboardCard.tsx`

**Props:**
- `title` - Название метрики
- `value` - Значение
- `trend` - Тренд (опционально)
- `icon` - Иконка (опционально)
- `trendUp` - Направление тренда (опционально)

## 🔌 API Integration

### Business Stats
```typescript
// GET /api/v1/businesses/{id}/stats
{
  orders_today: number;
  revenue_today: number;
  clients_total: number;
  rating: number;
  products_count: number;
  reviews_count: number;
  subscribers_count: number;
}
```

**Использование:**
```typescript
import { businessesApi } from '@/lib/rust-api';

const stats = await businessesApi.getStats(businessId);
```

## 📦 Созданные файлы

### Компоненты
- ✅ `src/components/RoleNavbar.tsx`
- ✅ `src/components/ui/DashboardCard.tsx`

### Business Pages
- ✅ `src/app/business/dashboard/page.tsx` (обновлен)
- ✅ `src/app/business/menu/page.tsx`
- ✅ `src/app/business/orders/page.tsx`
- ✅ `src/app/business/analytics/page.tsx`
- ✅ `src/app/business/settings/page.tsx`

### Invest Pages
- ✅ `src/app/invest/dashboard/page.tsx`
- ✅ `src/app/invest/portfolio/page.tsx`
- ✅ `src/app/invest/market/page.tsx`

### Admin Pages
- ✅ `src/app/admin/dashboard/page.tsx` (обновлен)

### API
- ✅ `src/lib/rust-api.ts` (добавлен getStats)

## 🎨 UI/UX Паттерны

### Цветовая схема по ролям
```css
Admin:          red (#ef4444)
Business Owner: orange (#f97316)
Investor:       green (#10b981)
User:           blue (#3b82f6)
```

### Навигация
- Все дашборды имеют кнопку "Назад"
- RoleNavbar показывает текущую роль
- Подсветка активной страницы

### Загрузка
```tsx
if (!user || isLoading) {
  return <LoadingSpinner />;
}
```

### Проверка доступа
```tsx
useEffect(() => {
  if (!user || user.role !== UserRole.BUSINESS_OWNER) {
    router.push("/");
  }
}, [user, router]);
```

## 🚀 Следующие шаги

### Высокий приоритет
1. ✅ Создать все страницы структуры
2. ⏳ Rust endpoint: `GET /businesses/{id}/stats`
3. ⏳ Интеграция реальных данных в дашборды
4. ⏳ Переместить `/auth/onboarding` → `/business/onboarding`

### Средний приоритет
1. Admin страницы (users, businesses, settings)
2. Функционал управления меню
3. Обработка заказов
4. Инвестиционная логика

### Низкий приоритет
1. Детальная аналитика
2. Экспорт отчетов
3. Уведомления в реальном времени
4. Мобильная версия

## 📝 Примеры использования

### Добавление новой страницы для Business Owner

1. Создать файл:
```typescript
// src/app/business/staff/page.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import RoleNavbar from "@/components/RoleNavbar";

export default function StaffPage() {
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();
  
  // ... логика
  
  return (
    <div className="min-h-screen">
      <RoleNavbar />
      {/* контент */}
    </div>
  );
}
```

2. Добавить в RoleNavbar:
```typescript
business_owner: [
  // ... существующие
  { name: "Персонал", href: "/business/staff", icon: Users },
],
```

## ✨ Ключевые особенности

- ✅ Чистое разделение по ролям
- ✅ Единообразный UI
- ✅ Автоматическая навигация
- ✅ Защита маршрутов
- ✅ Переиспользуемые компоненты
- ✅ TypeScript типизация
- ✅ Responsive дизайн
- ✅ Premium dark theme
