# 🎨 Использование иконок в проекте

## Библиотека: lucide-react

В проекте используется библиотека **lucide-react** версии `^0.544.0` для современных и аккуратных иконок.

## Установленные иконки

### Основные компоненты:

| Компонент | Иконки | Назначение |
|-----------|--------|------------|
| **Profile** (`src/app/profile/page.tsx`) | `KeyRound`, `User`, `Calendar`, `ShoppingBag`, `ArrowLeft` | Личный кабинет, админ-панель |
| **Admin Dashboard** (`src/app/admin/page.tsx`) | `BarChart3`, `Home`, `Package`, `ShoppingCart`, `Users` | Главная админ-панели |
| **Admin Products** (`src/app/admin/products/page.tsx`) | `Package`, `Plus`, `X`, `ArrowLeft` | Управление продуктами |
| **Admin Orders** (`src/app/admin/orders/page.tsx`) | `ShoppingCart`, `ArrowLeft` | Управление заказами |
| **MainContent** (`src/app/components/MainContentDynamic.tsx`) | `Plus`, `Package` | Каталог продуктов |

## Примеры использования

### Базовое использование:
```tsx
import { Package } from "lucide-react";

<Package className="w-6 h-6 text-orange-500" />
```

### С размерами:
- `w-4 h-4` - маленькая (16px)
- `w-5 h-5` - средняя (20px)
- `w-6 h-6` - обычная (24px)
- `w-8 h-8` - большая (32px)
- `w-10 h-10` - очень большая (40px)

### С цветами:
```tsx
<KeyRound className="w-5 h-5 text-orange-500" />
<ShoppingCart className="w-8 h-8 text-blue-500" />
<Users className="w-10 h-10 text-green-500" />
```

### В кнопках:
```tsx
<button className="flex items-center gap-2">
  <Plus className="w-4 h-4" />
  Добавить
</button>
```

## Доступные иконки

Полный список иконок: https://lucide.dev/icons/

### Часто используемые:

#### Навигация:
- `Home` - главная
- `ArrowLeft` / `ArrowRight` - стрелки
- `Menu` - меню
- `X` - закрыть

#### E-commerce:
- `ShoppingCart` - корзина
- `Package` - товар/пакет
- `CreditCard` - оплата
- `Truck` - доставка

#### Интерфейс:
- `Plus` / `Minus` - добавить/убрать
- `Edit` / `Trash` - редактировать/удалить
- `Search` - поиск
- `Filter` - фильтр

#### Пользователи:
- `User` / `Users` - пользователь(и)
- `UserPlus` - добавить пользователя
- `LogIn` / `LogOut` - вход/выход
- `KeyRound` - ключ/доступ

#### Статистика:
- `BarChart3` - статистика
- `TrendingUp` - рост
- `Activity` - активность

## Добавление новых иконок

1. Найдите нужную иконку на https://lucide.dev/icons/
2. Импортируйте в компонент:
   ```tsx
   import { IconName } from "lucide-react";
   ```
3. Используйте с нужными стилями:
   ```tsx
   <IconName className="w-6 h-6 text-gray-500" />
   ```

## Преимущества lucide-react

✅ Современный дизайн  
✅ Легкий вес (tree-shakeable)  
✅ Совместимость с React 19  
✅ TypeScript поддержка  
✅ Настраиваемые цвета и размеры  
✅ 1000+ иконок  

---

**Документация:** https://lucide.dev/guide/packages/lucide-react
