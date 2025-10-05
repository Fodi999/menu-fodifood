# 🍣 FODI SUSHI - Интернет-магазин доставки суши

Современный веб-сайт для заказа и доставки премиальных суши и роллов, построенный на Next.js 15 с поддержкой мультиязычности и Go backend.

![FODI SUSHI](https://img.shields.io/badge/FODI-SUSHI-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0_beta-38bdf8?style=for-the-badge&logo=tailwindcss)
![Go](https://img.shields.io/badge/Go-1.21-00ADD8?style=for-the-badge&logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)

## 🌐 Production URLs

- **Frontend:** https://menu-fodifood.vercel.app
- **Backend API:** https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app
- **Database:** Neon PostgreSQL (Serverless)

## ✨ Основные возможности

- 🍱 **Каталог продуктов** - роллы, суши, сеты с подробным описанием
- 🛒 **Корзина покупок** - добавление товаров, управление количеством
- 📝 **Форма заказа** - оформление заказа с указанием данных доставки
- 🌐 **Мультиязычность** - поддержка 3 языков (EN, RU, PL) с 111+ переводами
- 🔐 **Аутентификация** - вход, регистрация через Go Backend (JWT)
- 👤 **Личный кабинет** - история заказов, управление профилем
- 🔧 **Админ-панель** - управление пользователями, заказами, товарами
- 💾 **База данных** - Prisma ORM + PostgreSQL (Neon)
- 🔌 **Go Backend API** - REST API на Go с JWT авторизацией
- �📱 **Адаптивный дизайн** - идеально работает на всех устройствах
- 🎨 **Современный UI/UX** - темная тема с иконками lucide-react
- ⚡ **Быстрая сборка** - Turbopack для мгновенной разработки

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

#### 1. Создайте `.env.local` из шаблона:

```bash
cp .env.example .env.local
```

#### 2. Отредактируйте `.env.local` для локальной разработки:

```env
# Локальный PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/fodisushi"

# Локальный сервер
NEXTAUTH_URL="http://localhost:3000"

# Сгенерируйте секрет
NEXTAUTH_SECRET="your_generated_secret"
```

#### 3. Сгенерируйте `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Скопируйте результат и вставьте в `.env.local`.

**📖 Подробная инструкция:** см. [ENV-SETUP.md](./ENV-SETUP.md)

---

### Настройка базы данных

1. Сгенерируйте Prisma Client:
```bash
npx prisma generate
```

2. Примените миграции (создание таблиц):
```bash
npx prisma migrate dev --name init
```

3. (Опционально) Откройте Prisma Studio для просмотра данных:
```bash
npx prisma studio
```

### Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Проверка подключения к БД

Откройте [http://localhost:3000/api/health](http://localhost:3000/api/health) - должен вернуться `{ ok: true }`.

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🚀 Быстрый старт для деплоя на Vercel

### 1. Настройка Neon Database
1. Зарегистрируйтесь на [Neon](https://neon.tech)
2. Создайте новый проект PostgreSQL
3. Скопируйте `DATABASE_URL` (Prisma connection string)

### 2. Настройка Vercel Environment Variables
```bash
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
DATABASE_URL=postgresql://[ваша строка подключения из Neon]
```

### 3. Применение миграций
```bash
# Установите DATABASE_URL от Neon
export DATABASE_URL="postgresql://[строка из Neon]"

# Используйте наш скрипт
./deploy-db.sh

# Или вручную
npx prisma migrate deploy
npx prisma db seed  # опционально - тестовые данные
```

### 4. Деплой
```bash
git push  # Vercel автоматически задеплоит
# или
vercel --prod
```

📖 **Подробная инструкция**: см. [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ Технологический стек

### Frontend
- **Framework:** Next.js 15.5.4 (с Turbopack)
- **UI Library:** React 19.2.0
- **Язык:** TypeScript 5.x
- **Стили:** Tailwind CSS 4.0 (beta)
- **Интернационализация:** i18next 24.x, react-i18next 15.x
- **Иконки:** Lucide React
- **Изображения:** Next.js Image Optimization

### Backend
- **Язык:** Go 1.21+
- **Router:** gorilla/mux
- **Аутентификация:** JWT (golang-jwt/jwt)
- **Хеширование:** bcrypt
- **База данных:** PostgreSQL с Prisma ORM
- **CORS:** rs/cors

### Инфраструктура
- **Сборка:** Turbopack (в dev режиме)
- **Деплой Frontend:** Vercel
- **База данных:** Neon (PostgreSQL)

## 📁 Структура проекта

```
menu-fodifood/
├── 📂 prisma/                    # Prisma ORM конфигурация
│   └── schema.prisma             # Схема базы данных (9 моделей)
│
├── 📂 public/                    # Статические файлы
│   ├── 00029.jpg                 # Изображения продуктов
│   ├── 00030.jpg
│   ├── 00031.jpg
│   └── *.svg                     # SVG иконки
│
├── 📂 src/
│   ├── 📂 app/                   # Next.js App Router
│   │   ├── 📂 api/               # API Routes (Server-side)
│   │   │   ├── health/           # Проверка подключения к БД
│   │   │   │   └── route.ts      # GET /api/health
│   │   │   └── products/         # CRUD продуктов
│   │   │       └── route.ts      # GET, POST /api/products
│   │   │
│   │   ├── 📂 components/        # React компоненты
│   │   │   ├── Header.tsx        # Шапка с навигацией и корзиной
│   │   │   ├── MainContent.tsx   # Каталог продуктов + фильтры
│   │   │   ├── CartDrawer.tsx    # Боковая панель корзины
│   │   │   └── LanguageSwitcher.tsx  # Переключатель языков
│   │   │
│   │   ├── globals.css           # Tailwind CSS v4 + кастомные стили
│   │   ├── layout.tsx            # Root layout (i18n provider)
│   │   └── page.tsx              # Главная страница (Home)
│   │
│   ├── 📂 lib/                   # Утилиты и библиотеки
│   │   └── prisma.ts             # Prisma Client singleton
│   │
│   ├── 📂 locales/               # Переводы (i18next)
│   │   ├── 📂 en/                # English
│   │   │   └── ns1.json          # Тексты, меню, продукты
│   │   ├── 📂 pl/                # Polski
│   │   │   └── ns1.json
│   │   └── 📂 ru/                # Русский (по умолчанию)
│   │       └── ns1.json
│   │
│   └── i18n.ts                   # Конфигурация i18next
│
├── .env                          # Переменные окружения (БД)
├── .env.example                  # Пример конфигурации
├── .gitignore                    # Исключения для Git
├── eslint.config.mjs             # ESLint конфигурация
├── i18next.d.ts                  # TypeScript типы для i18n
├── next.config.ts                # Next.js конфигурация
├── package.json                  # Зависимости проекта
├── postcss.config.mjs            # PostCSS + Tailwind v4
├── README.md                     # Документация
└── tsconfig.json                 # TypeScript конфигурация
```

### 🗂️ Основные папки и файлы

#### 🔹 `/prisma/schema.prisma`
База данных с 9 моделями:
- **User** - Пользователи (user/admin)
- **Product** - Продукты (роллы, суши, сеты)
- **Order** - Заказы с адресами доставки
- **OrderItem** - Позиции в заказах
- **Ingredient** - Ингредиенты
- **StockItem** - Складские остатки
- **ProductIngredient** - Состав продуктов
- **TechCard** - Технологические карты
- **ChatMessage** - Сообщения чата поддержки

#### 🔹 `/src/app/api/`
API endpoints для backend:
- `GET /api/health` - Проверка БД
- `GET /api/products` - Список всех продуктов
- `POST /api/products` - Создание нового продукта

#### 🔹 `/src/app/components/`
React компоненты UI:
- **Header** - Навигация + корзина с счетчиком
- **MainContent** - Hero секция + каталог с фильтрами
- **CartDrawer** - Корзина + форма заказа
- **LanguageSwitcher** - Переключатель RU/EN/PL

#### 🔹 `/src/locales/`
Переводы на 3 языка:
- Тексты интерфейса
- Названия и описания продуктов
- Сообщения форм

## 🏗️ Архитектура приложения

```
┌─────────────────────────────────────────────────────────────────┐
│                        КЛИЕНТСКАЯ ЧАСТЬ                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Header     │  │ MainContent  │  │ CartDrawer   │          │
│  │              │  │              │  │              │          │
│  │ • Навигация  │  │ • Каталог    │  │ • Корзина    │          │
│  │ • Корзина    │  │ • Фильтры    │  │ • Заказ      │          │
│  │ • Счетчик    │  │ • Продукты   │  │ • Форма      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌─────────────────────────────────────────────────┐           │
│  │         LanguageSwitcher (RU/EN/PL)              │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API ROUTES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET  /api/health      → Проверка БД                            │
│  GET  /api/products    → Список продуктов                       │
│  POST /api/products    → Создание продукта                      │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Prisma ORM
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   БАЗА ДАННЫХ (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   User   │  │ Product  │  │  Order   │  │Ingredient│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │OrderItem │  │StockItem │  │ TechCard │  │ChatMsg   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Поток данных

1. **Пользователь** открывает сайт → загружается `page.tsx`
2. **i18next** подгружает переводы из `/locales/{язык}/ns1.json`
3. **MainContent** отображает продукты из переводов
4. **Добавление в корзину** → состояние хранится в `useState`
5. **Оформление заказа** → отправка POST запроса в `/api/orders`
6. **API Route** → Prisma → сохранение в PostgreSQL
7. **Уведомление** пользователю об успешном заказе

## 🗄️ Схема базы данных

```
┌─────────────────────────────────────────────────────────────────────┐
│                        МОДЕЛИ БАЗЫ ДАННЫХ                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│        User          │         │       Product        │
├──────────────────────┤         ├──────────────────────┤
│ id (PK)              │    ┌────│ id (PK)              │
│ email (unique)       │    │    │ name                 │
│ name                 │    │    │ description          │
│ password             │    │    │ price                │
│ role (user/admin)    │    │    │ imageUrl             │
│ createdAt            │    │    │ weight               │
└─────────┬────────────┘    │    │ category             │
          │                 │    │ createdAt            │
          │ 1:N             │    └─────────┬────────────┘
          │                 │              │
          ▼                 │              │ 1:N
┌──────────────────────┐    │              ▼
│       Order          │    │    ┌──────────────────────┐
├──────────────────────┤    │    │     OrderItem        │
│ id (PK)              │    │    ├──────────────────────┤
│ userId (FK)          │────┘    │ id (PK)              │
│ status               │         │ orderId (FK)         │
│ total                │────┐    │ productId (FK)       │
│ address              │    │    │ quantity             │
│ phone                │    │    │ price                │
│ comment              │    │    └──────────────────────┘
│ createdAt            │    │
└──────────────────────┘    │
                            │ 1:N
                            ▼

┌──────────────────────┐         ┌──────────────────────┐
│     Ingredient       │         │   ProductIngredient  │
├──────────────────────┤         ├──────────────────────┤
│ id (PK)              │────┬───→│ productId (FK)       │
│ name                 │    │    │ ingredientId (FK)    │
│ unit (g/ml/pcs)      │    │    │ amount               │
│ createdAt            │    │    │ unit                 │
└─────────┬────────────┘    │    └──────────────────────┘
          │                 │              ↑
          │ 1:N             │              │ N:M связь
          ▼                 │              │
┌──────────────────────┐    │    ┌─────────┴────────────┐
│     StockItem        │    │    │      Product         │
├──────────────────────┤    │    │  (см. выше)          │
│ id (PK)              │    │    └──────────────────────┘
│ ingredientId (FK)    │────┘
│ quantity             │
│ updatedAt            │         ┌──────────────────────┐
└──────────────────────┘         │      TechCard        │
                                 ├──────────────────────┤
┌──────────────────────┐         │ id (PK)              │
│    ChatMessage       │         │ productId (FK) 1:1   │
├──────────────────────┤         │ steps (JSON)         │
│ id (PK)              │         │ imageUrl             │
│ userId (FK)          │         └──────────────────────┘
│ isFromAdmin          │
│ content              │         Legend:
│ createdAt            │         ───── Связь (Foreign Key)
└──────────────────────┘         PK - Primary Key
                                 FK - Foreign Key
                                 1:N - One to Many
                                 N:M - Many to Many
```

### 📊 Основные связи:

- **User** → **Order** (1:N) - один пользователь может иметь много заказов
- **Order** → **OrderItem** (1:N) - один заказ содержит много позиций
- **Product** → **OrderItem** (1:N) - один продукт может быть в разных заказах
- **Product** ↔ **Ingredient** (N:M) - продукт состоит из ингредиентов
- **Ingredient** → **StockItem** (1:N) - складской учет ингредиентов
- **Product** → **TechCard** (1:1) - у продукта есть тех. карта

## 📦 Основные компоненты

### Header
Шапка сайта с навигацией, логотипом и иконкой корзины с счетчиком товаров.

### MainContent
Главный контент с hero-секцией, каталогом продуктов и фильтрацией по категориям.

### CartDrawer
Боковая панель корзины с:
- Списком добавленных товаров
- Управлением количества
- Формой оформления заказа
- Подсчетом итоговой суммы

### LanguageSwitcher
Переключатель языков интерфейса.

## 🔧 Разработка

### Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшена
npm start

# Линтинг
npm run lint
```

## 📱 Адаптивность

Сайт полностью адаптирован для:
- 📱 Мобильных телефонов (320px+)
- 💻 Планшетов (768px+)
- 🖥️ Десктопов (1024px+)

## 🔌 API Endpoints

### Проверка здоровья
- `GET /api/health` - Проверка подключения к базе данных

### Продукты
- `GET /api/products` - Получить все продукты
- `POST /api/products` - Создать новый продукт

### Модели базы данных

#### User
Пользователи системы с ролями (user/admin)

#### Product
Продукты (роллы, суши, сеты) с ценами, описаниями и категориями

#### Order
Заказы пользователей со статусами и адресами доставки

#### Ingredient & StockItem
Ингредиенты и складские остатки для управления запасами

#### TechCard
Технологические карты приготовления блюд

#### ChatMessage
Сообщения чата поддержки

## 📄 Лицензия

© 2025 FODI SUSHI. All rights reserved.

## 🤝 Контакты

- 📞 **Телефон:** +7 (999) 123-45-67
- 📧 **Email:** info@fodisushi.ru
- ⏰ **Режим работы:** 10:00 - 23:00 ежедневно

---

Сделано с ❤️ для любителей суши

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
