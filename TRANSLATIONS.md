# 🌐 Мультиязычность (i18next)

## Поддерживаемые языки

- 🇬🇧 **English** (en) - Английский
- 🇷🇺 **Русский** (ru) - Русский
- 🇵🇱 **Polski** (pl) - Польский

---

## Структура переводов

Все переводы находятся в `src/locales/{lang}/ns1.json`:

```
src/locales/
├── en/
│   └── ns1.json  # Английский
├── ru/
│   └── ns1.json  # Русский
└── pl/
    └── ns1.json  # Польский
```

---

## Категории переводов

### 1. **hero** - Главный экран
```json
{
  "hero": {
    "title": "FODI SUSHI",
    "subtitle": "Premium Sushi Delivery",
    "description": "Freshest ingredients...",
    "orderButton": "Order Now",
    "viewMenuButton": "View Menu"
  }
}
```

### 2. **menu** - Меню и категории
```json
{
  "menu": {
    "title": "Our Menu",
    "categories": ["All", "Rolls", "Sushi", "Sets", "Drinks"]
  }
}
```

### 3. **products** - Товары (используется в seed)
```json
{
  "products": [
    {
      "id": 1,
      "name": "California Roll",
      "category": "Rolls",
      "description": "Crab, avocado, cucumber, tobiko caviar",
      "price": 450,
      "image": "/products/california.jpg",
      "weight": "250g"
    }
  ]
}
```

### 4. **cart** - Корзина
```json
{
  "cart": {
    "title": "Cart",
    "empty": "Your cart is empty",
    "total": "Total",
    "checkout": "Checkout",
    "addToCart": "Add to Cart"
  }
}
```

### 5. **order** - Оформление заказа
```json
{
  "order": {
    "title": "Checkout",
    "name": "Your Name",
    "phone": "Phone",
    "address": "Delivery Address",
    "submit": "Confirm Order"
  }
}
```

### 6. **auth** - Аутентификация
```json
{
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out",
    "email": "Email",
    "password": "Password",
    "welcomeBack": "Welcome back!"
  }
}
```

### 7. **profile** - Личный кабинет
```json
{
  "profile": {
    "title": "My Profile",
    "myOrders": "My Orders",
    "orderHistory": "Order History",
    "settings": "Settings"
  }
}
```

### 8. **admin** - Админ-панель
```json
{
  "admin": {
    "dashboard": "Dashboard",
    "users": "Users",
    "products": "Products",
    "orders": "Orders",
    "totalUsers": "Total Users"
  }
}
```

### 9. **status** - Статусы заказов
```json
{
  "status": {
    "pending": "Pending",
    "processing": "Processing",
    "completed": "Completed",
    "cancelled": "Cancelled",
    "delivered": "Delivered"
  }
}
```

### 10. **common** - Общие элементы
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

---

## Использование в компонентах

### Client Component (React)

```tsx
"use client";
import { useTranslation } from "react-i18next";

export default function MyComponent() {
  const { t } = useTranslation("ns1");
  
  return (
    <div>
      <h1>{t("hero.title")}</h1>
      <button>{t("cart.addToCart")}</button>
    </div>
  );
}
```

### Server Component (Next.js 15)

```tsx
import { useTranslation } from "@/i18n";

export default async function ServerComponent() {
  const { t } = await useTranslation("ns1");
  
  return <h1>{t("hero.title")}</h1>;
}
```

---

## Переключение языка

Компонент `LanguageSwitcher.tsx` уже реализован:

```tsx
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";

// Использование
<LanguageSwitcher />
```

Текущий язык сохраняется в `localStorage` и автоматически применяется при загрузке.

---

## Добавление нового языка

1. Создайте папку `src/locales/{код_языка}/`
2. Создайте файл `ns1.json` со всеми ключами
3. Обновите `src/i18n.ts`:

```ts
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { ns1: enNs1 },
      ru: { ns1: ruNs1 },
      pl: { ns1: plNs1 },
      de: { ns1: deNs1 }, // Новый язык
    },
    // ...
  });
```

4. Обновите `LanguageSwitcher.tsx`:

```tsx
const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" }, // Новый язык
];
```

---

## Добавление новых ключей

1. Добавьте ключ во **все** языковые файлы:

```json
// en/ns1.json
{
  "newSection": {
    "newKey": "New Value"
  }
}

// ru/ns1.json
{
  "newSection": {
    "newKey": "Новое значение"
  }
}

// pl/ns1.json
{
  "newSection": {
    "newKey": "Nowa wartość"
  }
}
```

2. Используйте в компоненте:

```tsx
{t("newSection.newKey")}
```

---

## TypeScript поддержка

Для автодополнения ключей создайте файл `i18next.d.ts`:

```ts
import "i18next";
import ns1 from "./src/locales/en/ns1.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: typeof ns1;
    };
  }
}
```

---

## Проверка переводов

```bash
# Локальный запуск
npm run dev

# Переключите язык в интерфейсе
# Проверьте все страницы:
# - Главная (/)
# - Вход (/signin)
# - Регистрация (/signup)
# - Профиль (/profile)
# - Админка (/admin)
```

---

## Лучшие практики

✅ **DO:**
- Всегда добавляйте ключи во все языковые файлы
- Используйте осмысленные названия ключей
- Группируйте переводы по секциям
- Проверяйте переводы на всех языках

❌ **DON'T:**
- Не хардкодите текст в компонентах
- Не используйте пустые значения
- Не дублируйте одинаковые переводы
- Не забывайте про плюрализацию

---

## Плюрализация (для будущего)

```json
{
  "cart": {
    "items": "{{count}} item",
    "items_plural": "{{count}} items"
  }
}
```

```tsx
{t("cart.items", { count: itemsCount })}
```

---

## Интерполяция (переменные)

```json
{
  "welcome": "Hello, {{name}}!"
}
```

```tsx
{t("welcome", { name: user.name })}
```

---

## Полезные ссылки

- [i18next документация](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [Next.js + i18next](https://locize.com/blog/next-i18next/)

---

## Поддержка

Если нашли ошибку в переводах:
1. Откройте соответствующий файл `src/locales/{lang}/ns1.json`
2. Исправьте перевод
3. Закоммитьте изменения
4. Сделайте push на GitHub
5. Vercel автоматически задеплоит обновления
