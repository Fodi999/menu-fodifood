# 🌍 Структура переводов FODI

## 📁 Структура файлов

```
src/locales/
├── en/           # 🇬🇧 Английский
├── ru/           # 🇷🇺 Русский (по умолчанию)
└── pl/           # 🇵🇱 Польский
    ├── common.json      # Общие элементы (навигация, кнопки, статусы)
    ├── home.json        # Главная страница
    ├── auth.json        # Авторизация (signin, signup, onboarding)
    ├── profile.json     # Профиль пользователя
    ├── chat.json        # AI Чат
    ├── business.json    # Бизнес панель (dashboard, menu, orders, analytics, settings)
    ├── invest.json      # Инвестиции и токены FODI
    ├── cart.json        # Корзина и checkout
    ├── admin.json       # Админ панель
    └── ns1.json         # Старый формат (для обратной совместимости)
```

## 🚀 Использование в компонентах

### 1. Базовое использование (namespace: common)

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("common");
  
  return (
    <button>{t("buttons.submit")}</button>
    // Русский: "Отправить"
    // English: "Submit"
    // Polski: "Wyślij"
  );
}
```

### 2. Использование с конкретным namespace

```tsx
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation("home");
  
  return (
    <div>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.description")}</p>
      <button>{t("hero.orderButton")}</button>
    </div>
  );
}
```

### 3. Множественные namespaces

```tsx
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation(["common", "home"]);
  
  return (
    <nav>
      <a>{t("common:navigation.home")}</a>
      <button>{t("common:buttons.submit")}</button>
    </nav>
  );
}
```

### 4. С интерполяцией (переменные)

```tsx
const { t } = useTranslation("profile");

<p>{t("overview.welcomeBack", { name: "Дмитрий" })}</p>
// Нужно добавить в JSON: "welcomeBack": "С возвращением, {{name}}!"
```

## 📝 Примеры использования по страницам

### 🏠 Главная страница (`src/app/page.tsx`)

```tsx
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation(["home", "common"]);
  
  return (
    <>
      {/* Hero секция */}
      <h1>{t("home:hero.title")}</h1>
      <p>{t("home:hero.description")}</p>
      <button>{t("home:hero.orderButton")}</button>
      
      {/* Категории бизнесов */}
      <h2>{t("home:businesses.title")}</h2>
      {categories.map(cat => (
        <button key={cat}>{t(`home:businesses.categories.${cat}`)}</button>
      ))}
      
      {/* Навигация */}
      <a>{t("common:navigation.home")}</a>
      <button>{t("common:buttons.search")}</button>
    </>
  );
}
```

### 🔐 Авторизация (`src/app/auth/signin/page.tsx`)

```tsx
import { useTranslation } from "react-i18next";

export default function SignInPage() {
  const { t } = useTranslation("auth");
  
  return (
    <>
      <h1>{t("signIn.title")}</h1>
      <p>{t("signIn.subtitle")}</p>
      
      <input placeholder={t("signIn.emailPlaceholder")} />
      <input placeholder={t("signIn.passwordPlaceholder")} />
      
      <button>{t("signIn.signInButton")}</button>
      <p>
        {t("signIn.noAccount")} 
        <a>{t("signIn.signUpLink")}</a>
      </p>
    </>
  );
}
```

### 👤 Профиль (`src/app/profile/page.tsx`)

```tsx
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation(["profile", "common"]);
  
  return (
    <>
      <h1>{t("profile:title")}</h1>
      
      {/* Табы */}
      <Tabs>
        <Tab>{t("profile:tabs.overview")}</Tab>
        <Tab>{t("profile:tabs.orders")}</Tab>
        <Tab>{t("profile:tabs.favorites")}</Tab>
        <Tab>{t("profile:tabs.settings")}</Tab>
      </Tabs>
      
      {/* Статистика */}
      <div>
        <span>{t("profile:overview.stats.totalOrders")}</span>
        <span>{t("profile:overview.stats.totalSpent")}</span>
      </div>
      
      {/* Кнопки */}
      <button>{t("common:buttons.save")}</button>
      <button>{t("common:buttons.cancel")}</button>
    </>
  );
}
```

### 💬 AI Чат (`src/components/ChatWidget.tsx`)

```tsx
import { useTranslation } from "react-i18next";

export default function ChatWidget() {
  const { t } = useTranslation("chat");
  
  return (
    <>
      <h2>{t("title")}</h2>
      <p>{t("subtitle")}</p>
      
      <input placeholder={t("placeholder")} />
      <button>{t("sendButton")}</button>
      
      {/* Quick suggestions */}
      <div>
        <p>{t("suggestions.title")}</p>
        <button>{t("suggestions.whatToOrder")}</button>
        <button>{t("suggestions.recommendations")}</button>
        <button>{t("suggestions.dietaryOptions")}</button>
      </div>
    </>
  );
}
```

### 🏢 Бизнес Dashboard (`src/app/business/dashboard/page.tsx`)

```tsx
import { useTranslation } from "react-i18next";

export default function BusinessDashboard() {
  const { t } = useTranslation(["business", "common"]);
  
  return (
    <>
      <h1>{t("business:dashboard.title")}</h1>
      <p>{t("business:dashboard.welcome")}, {userName}</p>
      
      {/* Статистика */}
      <Card>
        <h3>{t("business:dashboard.revenue")}</h3>
        <p>{revenue}</p>
      </Card>
      
      <Card>
        <h3>{t("business:dashboard.orders")}</h3>
        <p>{ordersCount}</p>
      </Card>
      
      {/* Кнопки */}
      <button>{t("common:buttons.viewAll")}</button>
      <button>{t("common:buttons.filter")}</button>
    </>
  );
}
```

### 💰 Инвестиции (`src/app/invest/page.tsx`)

```tsx
import { useTranslation } from "react-i18next";

export default function InvestPage() {
  const { t } = useTranslation("invest");
  
  return (
    <>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.description")}</p>
      
      <button>{t("hero.investButton")}</button>
      
      {/* Портфель */}
      <h2>{t("dashboard.portfolio.title")}</h2>
      <div>
        <span>{t("dashboard.portfolio.totalValue")}</span>
        <span>{t("dashboard.portfolio.totalTokens")}</span>
      </div>
      
      {/* Покупка токенов */}
      <h2>{t("buyTokens.title")}</h2>
      <input placeholder={t("buyTokens.amountPlaceholder")} />
      <button>{t("buyTokens.buyButton")}</button>
    </>
  );
}
```

### 🛒 Корзина (`src/app/cart/page.tsx`)

```tsx
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { t } = useTranslation(["cart", "common"]);
  
  return (
    <>
      <h1>{t("cart:title")}</h1>
      
      {items.length === 0 ? (
        <div>
          <h2>{t("cart:empty.title")}</h2>
          <p>{t("cart:empty.description")}</p>
          <button>{t("cart:empty.browseButton")}</button>
        </div>
      ) : (
        <>
          {/* Товары */}
          <div>
            <span>{t("cart:items.quantity")}</span>
            <span>{t("cart:items.price")}</span>
            <button>{t("cart:items.remove")}</button>
          </div>
          
          {/* Итого */}
          <div>
            <h3>{t("cart:summary.title")}</h3>
            <div>
              <span>{t("cart:summary.subtotal")}</span>
              <span>{t("cart:summary.delivery")}</span>
              <span>{t("cart:summary.total")}</span>
            </div>
            <button>{t("cart:checkout.button")}</button>
          </div>
        </>
      )}
    </>
  );
}
```

## 🎯 Ключевые преимущества

1. **Модульность** - каждая страница имеет свой namespace
2. **Переиспользование** - `common.json` для общих элементов
3. **Типобезопасность** - автодополнение ключей в IDE
4. **Обратная совместимость** - старый `ns1.json` все еще работает
5. **Легкость поддержки** - легко найти и обновить переводы

## 🔄 Смена языка

Язык меняется автоматически через `LanguageSwitcher` компонент:
- Сохраняется в `localStorage` с ключом `i18nextLng`
- Автоопределение при первом визите: localStorage → browser → ru (default)
- Доступные языки: `ru`, `en`, `pl`

## 📦 Добавление новых переводов

1. Создайте новый JSON файл в `locales/[lang]/`
2. Импортируйте в `src/i18n.ts`
3. Добавьте в `resources` объект
4. Добавьте namespace в `ns` массив
5. Используйте: `const { t } = useTranslation("yourNamespace")`

## ✅ Чек-лист интеграции

- [ ] Импортировать `useTranslation` в компонент
- [ ] Указать нужный namespace(s)
- [ ] Заменить хардкод текста на `t("key")`
- [ ] Проверить все 3 языка работают
- [ ] Добавить переменные через интерполяцию если нужно
