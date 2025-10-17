# 🎨 Динамический Layout - Руководство

## ✅ Что реализовано

Создан **динамический layout** с автоматической адаптацией навигации под роль пользователя.

## 📁 Структура

```
src/
├── app/
│   └── layout.tsx              ✅ Серверный компонент с <html> и <body>
│
└── components/
    ├── LayoutContent.tsx       ✅ Клиентский компонент с логикой
    └── RoleNavbar.tsx          ✅ Навигация по ролям
```

## 🔧 Как это работает

### 1. Серверный Layout (layout.tsx)

```tsx
import LayoutContent from "@/components/LayoutContent";

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="...dark theme...">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
```

**Задачи:**
- Предоставляет HTML структуру
- Оборачивает приложение в Providers (Auth, Role, Business)
- Делегирует клиентскую логику в LayoutContent

### 2. Клиентский LayoutContent

```tsx
"use client";

export default function LayoutContent({ children }) {
  const { currentRole } = useRole();
  const pathname = usePathname();
  
  // Скрываем на auth страницах
  const hideNavbar = pathname?.startsWith("/auth");
  
  // Показываем только если есть роль
  const showNavbar = !hideNavbar && currentRole;
  
  return (
    <>
      {showNavbar && <RoleNavbar />}
      <main>{children}</main>
    </>
  );
}
```

**Задачи:**
- Проверяет текущую роль через `useRole()`
- Определяет, показывать ли навигацию
- Скрывает RoleNavbar на страницах `/auth/*`
- Рендерит RoleNavbar для авторизованных пользователей

### 3. RoleNavbar

Автоматически показывает меню в зависимости от роли:

**Admin:**
- Главная → `/admin/dashboard`
- Пользователи → `/admin/users`
- Рестораны → `/admin/businesses`
- Настройки → `/admin/settings`

**Business Owner:**
- Дашборд → `/business/dashboard`
- Меню → `/business/menu`
- Заказы → `/business/orders`
- Аналитика → `/business/analytics`
- Настройки → `/business/settings`

**Investor:**
- Обзор → `/invest/dashboard`
- Портфель → `/invest/portfolio`
- Рынок → `/invest/market`

**User:**
- Навигация не показывается (использует главную страницу)

## 🎯 Преимущества

### ✅ DRY (Don't Repeat Yourself)
- RoleNavbar подключен **один раз** в layout
- Не нужно добавлять в каждую страницу
- Изменения применяются глобально

### ✅ Автоматическая адаптация
- Меню меняется при смене роли
- Нет дублирования кода
- Единая точка управления навигацией

### ✅ Условный рендеринг
- Скрывается на страницах авторизации
- Показывается только для авторизованных пользователей
- Не мешает публичным страницам

## 📊 Логика отображения

```
┌─────────────────┐
│   usePathname   │
└────────┬────────┘
         │
         ▼
    Starts with    NO  ┌──────────────┐
     "/auth"? ─────────>│   useRole()  │
         │              └──────┬───────┘
         │ YES                 │
         ▼                     ▼
   hideNavbar = true    currentRole exists?
         │                     │
         │                     │ YES
         │                     ▼
         │              showNavbar = true
         │                     │
         └─────────┬───────────┘
                   ▼
            Render RoleNavbar?
                   │
        ┌──────────┴──────────┐
       YES                    NO
        │                      │
        ▼                      ▼
   <RoleNavbar />         (скрыта)
```

## 🔄 Обновленные страницы

Из всех страниц **удален** импорт RoleNavbar:

### Business Pages (5 файлов)
- ✅ `/business/dashboard/page.tsx`
- ✅ `/business/menu/page.tsx`
- ✅ `/business/orders/page.tsx`
- ✅ `/business/analytics/page.tsx`
- ✅ `/business/settings/page.tsx`

### Invest Pages (3 файла)
- ✅ `/invest/dashboard/page.tsx`
- ✅ `/invest/portfolio/page.tsx`
- ✅ `/invest/market/page.tsx`

### Admin Pages (1 файл)
- ✅ `/admin/dashboard/page.tsx`

**Было:**
```tsx
import RoleNavbar from "@/components/RoleNavbar";

return (
  <div>
    <RoleNavbar />
    <div>content</div>
  </div>
);
```

**Стало:**
```tsx
// Никаких импортов и вызовов RoleNavbar!
return (
  <div>
    {/* RoleNavbar автоматически в layout */}
    <div>content</div>
  </div>
);
```

## 🎨 Стилизация

Layout применяет **единый темный градиент** ко всему приложению:

```tsx
<body className="antialiased bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] text-gray-100">
```

Все страницы наследуют этот фон автоматически.

## 🧪 Тестирование

### Сценарий 1: Неавторизованный пользователь
1. Открыть `/` 
2. RoleNavbar **не показывается** (currentRole = null)
3. Видна главная страница-витрина

### Сценарий 2: Авторизация
1. Перейти на `/auth/signin`
2. RoleNavbar **скрыта** (pathname.startsWith("/auth"))
3. Форма логина без навигации

### Сценарий 3: Business Owner логинится
1. Успешный вход
2. Редирект на `/business/dashboard`
3. RoleNavbar **появляется** с 5 пунктами меню
4. Активная страница подсвечена

### Сценарий 4: Смена роли
1. Переключение на Investor через RoleSwitcher
2. RoleNavbar **обновляется** автоматически
3. Показывает 3 пункта меню инвестора

## 📝 Логирование

LayoutContent логирует свое состояние:

```javascript
🎨 LayoutContent: {
  pathname: "/business/dashboard",
  currentRole: "business_owner",
  hideNavbar: false,
  showNavbar: true
}
```

Проверить в консоли браузера.

## ⚙️ Настройка

### Добавить новую страницу без навигации

```tsx
// src/components/LayoutContent.tsx
const hideNavbar = 
  pathname?.startsWith("/auth") || 
  pathname?.startsWith("/onboarding") ||  // добавить
  pathname?.startsWith("/landing");       // добавить
```

### Изменить условие показа

```tsx
// Показывать всегда, даже без роли
const showNavbar = !hideNavbar && user;  // вместо currentRole

// Показывать только для определенных ролей
const showNavbar = !hideNavbar && 
  (currentRole === "business_owner" || currentRole === "admin");
```

## ✨ Итог

**Было:** 9 файлов с дублированием `<RoleNavbar />`  
**Стало:** 1 файл `LayoutContent.tsx` с централизованной логикой

**Преимущества:**
- ✅ Меньше кода
- ✅ Единая точка управления
- ✅ Автоматическая адаптация
- ✅ Легкое тестирование
- ✅ Масштабируемость

Теперь навигация — это **часть архитектуры**, а не повторяющийся код! 🚀
