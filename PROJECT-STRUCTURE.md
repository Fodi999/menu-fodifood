# 📁 Структура проекта FODI SUSHI

```
menu-fodifood/
│
├── 📂 prisma/                          # База данных
│   ├── migrations/                     # Миграции БД
│   │   └── 20251003085714_init/        # Первая миграция
│   ├── schema.prisma                   # Схема БД (9 моделей)
│   └── seed.ts                         # Seed-скрипт (тестовые данные)
│
├── 📂 public/                          # Статические файлы
│   ├── products/                       # Изображения продуктов
│   │   ├── california.jpg              # Ролл Калифорния
│   │   ├── cola.jpg                    # Кола
│   │   ├── mix-set.jpg                 # Микс-сет
│   │   ├── nigiri-salmon.jpg           # Нигири с лососем
│   │   ├── philadelphia.jpg            # Ролл Филадельфия
│   │   └── README.md                   # Инструкция по изображениям
│   ├── 00029.jpg                       # Демо изображение
│   ├── 00030.jpg                       # Демо изображение
│   ├── 00031.jpg                       # Демо изображение
│   └── *.svg                           # Иконки и логотипы
│
├── 📂 scripts/                         # Скрипты
│   └── check-translations.js           # Проверка переводов
│
├── 📂 src/
│   │
│   ├── 📂 app/                         # Next.js App Router
│   │   │
│   │   ├── 📂 admin/                   # Админ-панель
│   │   │   ├── orders/
│   │   │   │   └── page.tsx            # /admin/orders
│   │   │   ├── users/
│   │   │   │   └── page.tsx            # /admin/users
│   │   │   ├── layout.tsx              # Layout для админки
│   │   │   └── page.tsx                # /admin (главная)
│   │   │
│   │   ├── 📂 api/                     # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts        # NextAuth endpoints
│   │   │   ├── health/
│   │   │   │   └── route.ts            # /api/health
│   │   │   └── products/
│   │   │       └── route.ts            # /api/products
│   │   │
│   │   ├── 📂 auth/                    # Аутентификация
│   │   │   ├── signin/
│   │   │   │   └── page.tsx            # /auth/signin
│   │   │   └── signup/
│   │   │       └── page.tsx            # /auth/signup
│   │   │
│   │   ├── 📂 components/              # React компоненты
│   │   │   ├── Header.tsx              # Шапка сайта
│   │   │   ├── LanguageSwitcher.tsx    # Переключатель языков
│   │   │   ├── MainContent.tsx         # Главный контент
│   │   │   ├── MainContentDynamic.tsx  # Динамический контент
│   │   │   └── RecipesDrawer.tsx       # Drawer для рецептов
│   │   │
│   │   ├── 📂 profile/                 # Личный кабинет
│   │   │   └── page.tsx                # /profile
│   │   │
│   │   ├── favicon.ico                 # Favicon
│   │   ├── globals.css                 # Глобальные стили
│   │   ├── layout.tsx                  # Root Layout
│   │   └── page.tsx                    # / (главная страница)
│   │
│   ├── 📂 lib/                         # Утилиты
│   │   └── prisma.ts                   # Prisma Client (singleton)
│   │
│   ├── 📂 locales/                     # Переводы (i18next)
│   │   ├── en/
│   │   │   └── ns1.json                # Английский (111 ключей)
│   │   ├── pl/
│   │   │   └── ns1.json                # Польский (111 ключей)
│   │   └── ru/
│   │       └── ns1.json                # Русский (111 ключей)
│   │
│   ├── 📂 types/                       # TypeScript типы
│   │   ├── css.d.ts                    # Типы для CSS модулей
│   │   └── next-auth.d.ts              # Расширение NextAuth типов
│   │
│   ├── auth.ts                         # NextAuth конфигурация
│   ├── i18n.ts                         # i18next конфигурация
│   └── middleware.ts                   # Next.js Middleware (защита роутов)
│
├── 📄 .env.local                       # Переменные окружения (локально)
├── 📄 .gitignore                       # Git ignore
├── 📄 eslint.config.mjs                # ESLint конфигурация
├── 📄 i18next.d.ts                     # TypeScript типы для i18next
├── 📄 next-env.d.ts                    # Next.js типы
├── 📄 next.config.ts                   # Next.js конфигурация
├── 📄 package.json                     # NPM зависимости и скрипты
├── 📄 postcss.config.mjs               # PostCSS конфигурация
├── 📄 tailwind.config.ts               # Tailwind CSS конфигурация
├── 📄 tsconfig.json                    # TypeScript конфигурация
│
└── 📚 Документация/
    ├── README.md                       # Главная документация
    ├── TRANSLATIONS.md                 # Гайд по переводам
    ├── VERCEL-ENV-VARS.md             # Переменные окружения Vercel
    ├── DEPLOYMENT.md                   # Гайд по деплою
    ├── DEPLOY-CHECKLIST.md            # Чек-лист деплоя
    ├── ENV-SETUP.md                    # Настройка окружения
    ├── QUICK-COMMANDS.md               # Быстрые команды
    ├── STATUS-TRANSLATIONS.md          # Статус переводов
    ├── FIX-VERCEL-500.md              # Исправление ошибок Vercel
    ├── GET-REAL-DATABASE-URL.md       # Получение DATABASE_URL
    ├── UPDATE-ENV-LOCAL.md            # Обновление .env.local
    └── ICONS.md                        # Документация по иконкам
```

---

## 📊 Статистика проекта

| Компонент | Количество |
|-----------|------------|
| **Файлы TypeScript/TSX** | 25+ |
| **React компоненты** | 15+ |
| **API Routes** | 3 |
| **Страницы** | 8 |
| **Модели БД (Prisma)** | 9 |
| **Языки** | 3 (EN, RU, PL) |
| **Переводов** | 111 ключей × 3 языка = 333 |
| **Документация** | 15+ файлов |

---

## 🗂️ Основные директории

### `/prisma` - База данных
- **schema.prisma** - схема с 9 моделями (User, Product, Order, OrderItem, Category, Cart, CartItem, Review, Settings)
- **migrations/** - SQL миграции для PostgreSQL
- **seed.ts** - заполнение БД тестовыми данными (5 продуктов, 1 админ)

### `/public` - Статические файлы
- **products/** - изображения товаров (5 шт)
- Логотипы, иконки, демо-изображения

### `/src/app` - Next.js App Router
- **admin/** - админ-панель (защищённая middleware)
- **api/** - REST API endpoints
- **auth/** - страницы входа/регистрации
- **components/** - переиспользуемые компоненты
- **profile/** - личный кабинет

### `/src/locales` - Мультиязычность
- **en/ns1.json** - английский
- **ru/ns1.json** - русский
- **pl/ns1.json** - польский

### `/scripts` - Вспомогательные скрипты
- **check-translations.js** - проверка целостности переводов

---

## 🔑 Ключевые файлы

| Файл | Описание |
|------|----------|
| `src/auth.ts` | NextAuth v5 конфигурация (Credentials, Prisma Adapter) |
| `src/middleware.ts` | Защита роутов (Edge Runtime, getToken) |
| `src/i18n.ts` | i18next конфигурация (3 языка) |
| `src/lib/prisma.ts` | Prisma Client singleton |
| `next.config.ts` | Next.js + Image optimization |
| `tailwind.config.ts` | Tailwind CSS 4 конфигурация |
| `package.json` | Зависимости + скрипты NPM |
| `.env.local` | Переменные окружения (НЕ в Git!) |

---

## 📦 Модели базы данных

```prisma
User         - пользователи (роли: USER, ADMIN)
Product      - товары (роллы, суши, сеты)
Category     - категории товаров
Order        - заказы
OrderItem    - позиции в заказе
Cart         - корзины пользователей
CartItem     - товары в корзине
Review       - отзывы на товары
Settings     - настройки сайта
```

---

## 🎨 Компоненты

### Основные компоненты:
- **Header.tsx** - навигация, корзина, вход/выход
- **LanguageSwitcher.tsx** - переключатель языков (EN/RU/PL)
- **MainContentDynamic.tsx** - каталог продуктов с фильтрацией
- **RecipesDrawer.tsx** - боковая панель с рецептами

### Страницы:
- `/` - главная (каталог + корзина)
- `/auth/signin` - вход
- `/auth/signup` - регистрация
- `/profile` - личный кабинет
- `/admin` - админ-панель (только для ADMIN)
- `/admin/users` - управление пользователями
- `/admin/orders` - управление заказами

---

## 🔒 Защищённые роуты (Middleware)

```typescript
// Публичные роуты
'/', '/auth/signin', '/auth/signup', '/api/health', '/api/products'

// Требуют аутентификации
'/profile', '/api/auth/session'

// Только для администраторов
'/admin', '/admin/users', '/admin/orders'
```

---

## 🌐 Переводы

**Секции переводов:**
- `hero` - главный экран
- `menu` - меню и категории
- `products` - товары
- `cart` - корзина
- `order` - оформление заказа
- `auth` - вход/регистрация
- `profile` - личный кабинет
- `admin` - админ-панель
- `status` - статусы заказов
- `common` - общие элементы
- `footer` - подвал сайта
- `buttonLabels` - кнопки

---

## 🚀 NPM Scripts

```bash
npm run dev                 # Запуск dev сервера (Turbopack)
npm run build               # Production build
npm run start               # Запуск production сервера
npm run lint                # ESLint проверка
npm run db:seed             # Заполнение БД данными
npm run translations:check  # Проверка переводов
```

---

## 📝 Документация

Все документы находятся в корне проекта:

- 📖 **README.md** - главная документация
- 🌐 **TRANSLATIONS.md** - работа с переводами
- 🔧 **VERCEL-ENV-VARS.md** - настройка Vercel
- 🚀 **DEPLOYMENT.md** - гайд по деплою
- ✅ **DEPLOY-CHECKLIST.md** - чек-лист
- ⚡ **QUICK-COMMANDS.md** - быстрые команды

---

## 🔗 Полезные команды

```bash
# Проверка структуры
tree -L 3 -I 'node_modules|.next|.git'

# Статистика кода
cloc src/

# Размер проекта
du -sh .

# Поиск TODO
grep -r "TODO" src/

# Проверка переводов
npm run translations:check
```

---

## 📊 Зависимости (основные)

```json
{
  "next": "^15.5.4",
  "react": "^19.2.0",
  "next-auth": "^5.0.0-beta.29",
  "@prisma/client": "^6.16.3",
  "i18next": "^24.2.0",
  "react-i18next": "^15.4.0",
  "lucide-react": "^0.544.0",
  "bcryptjs": "^3.0.2",
  "tailwindcss": "^4.0.0-beta.14"
}
```

---

**Обновлено:** 3 октября 2025 г.
