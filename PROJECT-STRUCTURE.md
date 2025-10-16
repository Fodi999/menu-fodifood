# 🌳 Структура проекта FODI — Мультитенантная платформа для бизнесов

## 🎯 Концепция
**Pinterest-витрина бизнесов** с мультитенантностью, AI-ассистентом и Rust+Go микросервисами.

```
menu-fodifood/
│
├── 📦 Frontend (Next.js 15.5.4 + React 19 + TypeScript)
│   │
│   ├── src/
│   │   ├── app/                          # App Router (Next.js 15)
│   │   │   │
│   │   │   ├── page.tsx                 # 🏠 ГЛАВНАЯ — Pinterest-витрина бизнесов
│   │   │   │                            # Сетка карточек (mock → Rust API)
│   │   │   │                            # Фильтры: категория, город, активность
│   │   │   │
│   │   │   ├── components/              # 🎨 Компоненты главной
│   │   │   │   ├── BusinessCard.tsx     # Карточка бизнеса
│   │   │   │   ├── BusinessGrid.tsx     # Masonry/Grid витрина
│   │   │   │   ├── Filters.tsx          # Фильтры (категория, город)
│   │   │   │   ├── Header.tsx           # Шапка с поиском
│   │   │   │   └── RoleSwitcher.tsx     # Тоггл User ↔ Business
│   │   │   │
│   │   │   ├── [businessSlug]/          # 🏪 Страница конкретного бизнеса
│   │   │   │   ├── page.tsx             # Витрина меню + чат
│   │   │   │   └── components/
│   │   │   │       ├── MenuGrid.tsx     # Меню продуктов
│   │   │   │       ├── ChatWidget.tsx   # AI-чат встроенный
│   │   │   │       └── BusinessHeader.tsx
│   │   │   │
│   │   │   ├── auth/                    # 🔐 Онбординг + Авторизация
│   │   │   │   ├── signin/              
│   │   │   │   │   └── page.tsx         # Вход
│   │   │   │   ├── signup/              
│   │   │   │   │   └── page.tsx         # Регистрация пользователя
│   │   │   │   └── onboarding/          # 🎯 НОВОЕ
│   │   │   │       └── page.tsx         # Мастер создания бизнеса
│   │   │   │                            # (название, город, категория)
│   │   │   │
│   │   │   ├── pricing/                 # 💳 НОВОЕ — Тарифные планы
│   │   │   │   └── page.tsx             # Free (User) / Business $19
│   │   │   │                            # Кнопка «Купить» → Stripe
│   │   │   │
│   │   │   ├── chat/                    # 💬 AI Чат (Commerce + Insights)
│   │   │   │   └── page.tsx             # Полноэкранный чат
│   │   │   │                            # Карточки продуктов inline
│   │   │   │                            # Кнопки «Добавить», «Оформить»
│   │   │   │                            # Rust /api/v1/chat
│   │   │   │                            # WebSocket для инсайтов
│   │   │   │
│   │   │   ├── orders/                  # 📦 Заказы пользователя
│   │   │   │   └── page.tsx             # История, статус
│   │   │   │
│   │   │   ├── profile/                 # 👤 Профиль + Переключатель ролей
│   │   │   │   └── page.tsx             # User ↔ Business (тоггл)
│   │   │   │                            # В режиме Business: быстрые ссылки
│   │   │   │                            # → Заказы, Меню, Склад, Аналитика
│   │   │   │
│   │   │   ├── admin/                   # 🔒 АДМИН-ПАНЕЛЬ БИЗНЕСА (Business Mode)
│   │   │   │   ├── page.tsx             # Dashboard (выручка, заказы, конверсия)
│   │   │   │   │                        # Rust /admin/metrics
│   │   │   │   │
│   │   │   │   ├── orders/              # 📋 Управление заказами
│   │   │   │   │   └── page.tsx         # Live-лента (WebSocket)
│   │   │   │   │                        # Смена статуса
│   │   │   │   │
│   │   │   │   ├── products/            # 🍱 CRUD меню
│   │   │   │   │   └── page.tsx         # Go API /api/products
│   │   │   │   │
│   │   │   │   ├── ingredients/         # 📦 Управление складом
│   │   │   │   │   ├── page.tsx         # Go API /api/ingredients
│   │   │   │   │   ├── types.ts
│   │   │   │   │   ├── constants.ts
│   │   │   │   │   ├── utils/           # Утилиты группировки
│   │   │   │   │   └── components/      # UI компоненты
│   │   │   │   │
│   │   │   │   ├── semi-finished/       # 🥡 Полуфабрикаты
│   │   │   │   │   └── page.tsx         # Go API /api/semi-finished
│   │   │   │   │
│   │   │   │   ├── users/               # 👥 Сотрудники и права
│   │   │   │   │   └── page.tsx         # Управление командой
│   │   │   │   │
│   │   │   │   └── metrics/             # 📊 НОВОЕ — Аналитика
│   │   │   │       └── page.tsx         # Графики (Rust /admin/metrics)
│   │   │   │                            # Revenue, Orders, Insights
│   │   │   │
│   │   │   ├── api/                     # API Routes (Next.js)
│   │   │   │   ├── orders/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/             # Stripe webhooks
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   ├── layout.tsx               # Root layout
│   │   │   ├── providers.tsx            # Context Providers
│   │   │   └── globals.css              # Глобальные стили
│   │   │
│   │   ├── components/                   # 🧩 Переиспользуемые компоненты
│   │   │   ├── ui/                      # shadcn/ui компоненты
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   └── toggle.tsx           # 🆕 Для User ↔ Business
│   │   │   │
│   │   │   ├── CartDrawer.tsx           # Корзина
│   │   │   ├── OrderNotificationToast.tsx
│   │   │   └── SubscribeButton.tsx      # 🆕 Подписка на бизнес
│   │   │
│   │   ├── contexts/                     # 🔄 React Contexts
│   │   │   ├── AuthContext.tsx          # Авторизация + JWT
│   │   │   ├── RoleContext.tsx          # 🆕 User ↔ Business переключение
│   │   │   └── BusinessContext.tsx      # 🆕 Текущий бизнес (multitenant)
│   │   │
│   │   ├── hooks/                        # 🪝 Custom Hooks
│   │   │   ├── useOrderNotifications.ts # WebSocket для заказов
│   │   │   ├── useInsights.ts           # 🆕 WebSocket для AI insights
│   │   │   ├── useRole.ts               # 🆕 User/Business роль
│   │   │   └── useBusiness.ts           # 🆕 Текущий бизнес
│   │   │
│   │   ├── lib/                          # 📚 Библиотеки
│   │   │   ├── rust-api.ts              # � Rust Gateway Client
│   │   │   ├── go-api.ts                # 🆕 Go Backend Client
│   │   │   ├── mock-api.ts              # 🎭 Mock для разработки
│   │   │   ├── utils.ts                 # Утилиты
│   │   │   ├── stripe.ts                # 🆕 Stripe интеграция
│   │   │   └── errorLogger.ts           # Логирование ошибок
│   │   │
│   │   ├── locales/                      # 🌍 Переводы (i18n)
│   │   │   ├── en/                      # Английский
│   │   │   │   └── translation.json
│   │   │   ├── pl/                      # Польский
│   │   │   │   └── translation.json
│   │   │   └── ru/                      # Русский
│   │   │       └── translation.json
│   │   │
│   │   ├── types/                        # 📝 TypeScript типы
│   │   │   ├── business.ts              # 🆕 Типы бизнеса
│   │   │   ├── user.ts                  # Типы пользователя
│   │   │   ├── order.ts                 # Типы заказов
│   │   │   ├── product.ts               # Типы продуктов
│   │   │   ├── chat.ts                  # 🆕 Типы AI чата
│   │   │   └── metrics.ts               # 🆕 Типы аналитики
│   │   │
│   │   ├── i18n.ts                       # Конфигурация i18next
│   │   └── middleware.ts                 # Next.js Middleware (auth + tenant)
│   │
│   └── public/                           # 🖼️ Статические файлы
│       ├── businesses/                   # 🆕 Логотипы бизнесов
│       ├── products/                     # Фото продуктов
│       └── *.svg                         # Иконки
│
├── 🦀 Backend #1: Rust Gateway (Shuttle.rs)
│   └── http://127.0.0.1:8000
│       ├── /api/v1/businesses           # 🆕 CRUD бизнесов
│       │   ├── GET  /                   # Список для витрины
│       │   ├── POST /                   # Создать бизнес
│       │   ├── GET  /:id                # Детали бизнеса
│       │   └── PUT  /:id                # Обновить
│       │
│       ├── /api/v1/chat                 # 🆕 AI Chat
│       │   ├── POST /message            # Отправить сообщение
│       │   └── POST /suggestions        # Получить подсказки
│       │
│       ├── /api/v1/insights             # 🆕 AI Insights
│       │   ├── GET  /                   # Получить инсайты
│       │   └── POST /generate           # Сгенерировать новые
│       │
│       ├── /api/v1/subscriptions        # 🆕 Подписки пользователей
│       │   ├── POST /                   # Подписаться на бизнес
│       │   └── DELETE /:id              # Отписаться
│       │
│       ├── /api/v1/admin/metrics        # 🆕 Метрики бизнеса
│       │   ├── GET  /revenue            # Выручка
│       │   ├── GET  /orders             # Статистика заказов
│       │   └── GET  /conversion         # Конверсия
│       │
│       ├── /ws                          # WebSocket
│       │   ├── /api/v1/admin/ws         # Заказы real-time
│       │   └── /api/v1/insight          # 🆕 AI инсайты стрим
│       │
│       └── /api/v1/health               # Health check
│
├── 🟢 Backend #2: Go Service (Продукты + Склад)
│   └── http://127.0.0.1:8080
│       ├── /api/products                # CRUD продуктов
│       ├── /api/ingredients             # Управление складом
│       ├── /api/semi-finished           # Полуфабрикаты
│       └── /health                      # Health check
│
├── 🔧 MCP Server (Model Context Protocol)
│   └── mcp-server/
│       ├── src/
│       │   └── index.ts                  # WebSocket сервер
│       ├── dist/                         # Скомпилированный код
│       ├── package.json
│       ├── start.sh                      # Скрипт запуска
│       └── README.md
│
├── 📜 Scripts
│   └── scripts/
│       ├── dev-local.sh                  # Запуск всех сервисов
│       ├── deploy-vercel.sh              # Деплой frontend
│       └── seed-businesses.sh            # 🆕 Заполнить тестовыми бизнесами
│
├── 📄 Конфигурация
│   ├── .env.local                        # 🆕 Новые переменные
│   │                                     # NEXT_PUBLIC_RUST_API
│   │                                     # NEXT_PUBLIC_GO_API
│   │                                     # NEXT_PUBLIC_WS_URL
│   │                                     # NEXT_PUBLIC_INSIGHT_WS
│   │                                     # STRIPE_PUBLIC_KEY
│   │
│   ├── .env.development.local            # Локальная разработка
│   ├── .env.production                   # Production
│   ├── next.config.ts                    # Next.js конфиг
│   ├── tailwind.config.ts                # Tailwind CSS
│   ├── tsconfig.json                     # TypeScript
│   ├── eslint.config.mjs                 # ESLint
│   ├── postcss.config.mjs                # PostCSS
│   ├── components.json                   # shadcn/ui
│   └── vercel.json                       # Vercel деплой
│
└── 📚 Документация
    ├── README.md                         # Главный README
    ├── ARCHITECTURE.md                   # Архитектура проекта
    ├── RUST-BACKEND-INTEGRATION.md       # ✅ Интеграция с Rust
    ├── FRONTEND-RUST-MIGRATION.md        # ✅ Миграция на Rust
    ├── WEBSOCKET-FIX.md                  # ✅ Исправление WebSocket
    ├── MOCK-API-USAGE.md                 # Mock API гайд
    ├── API-ENDPOINTS-STATUS.md           # Статус эндпоинтов
    ├── LOCAL-DEVELOPMENT.md              # Локальная разработка
    ├── CHAT-ARCHITECTURE.md              # AI чат архитектура
    ├── ELIXIR-INTEGRATION.md             # ❌ Legacy (Elixir)
    ├── MIGRATION-TO-GATEWAY.md           # ❌ Legacy
    ├── VERCEL-DEPLOYMENT.md              # Деплой на Vercel
    ├── RESPONSIVE-DESIGN.md              # Адаптивный дизайн
    └── HOW-TO-SHARE-DEVTOOLS-LOGS.md     # Debug гайд
```

## 📊 Статистика

```
Всего файлов: ~200+
TypeScript/TSX: ~80 файлов
Markdown документация: 20+ файлов
Компоненты UI (shadcn/ui): 20+ компонентов
Переводы: 3 языка (en, pl, ru)
```


## 🧱 Технологический стек

### Frontend
- **Next.js 15.5.4** - App Router, Server Components, Turbopack
- **React 19.2.0** - Contexts, Hooks, Suspense
- **TypeScript** - Полная типизация
- **Tailwind CSS 4.x** - Утилитарные стили
- **shadcn/ui** - Radix UI компоненты
- **react-i18next** - Мультиязычность (EN, PL, RU)
- **Lucide Icons** - Иконки

### Backend Architecture (Микросервисы)
#### 🦀 Rust Gateway (Shuttle.rs) - Основной API
- **Роль**: Главный gateway для всех запросов
- **Функционал**:
  - Мультитенантность (businesses)
  - AI Chat интеграция
  - AI Insights генерация
  - Метрики и аналитика
  - WebSocket для real-time
  - Stripe payments
- **URL**: http://127.0.0.1:8000/api/v1

#### 🟢 Go Service - Продукты и склад
- **Роль**: Управление товарами и инвентарём
- **Функционал**:
  - CRUD продуктов
  - Управление складом (ingredients)
  - Полуфабрикаты (semi-finished)
  - Калькуляция себестоимости
- **URL**: http://127.0.0.1:8080/api

### База данных
- **PostgreSQL (Neon)** - Основная БД с пулом соединений
- **Структура**:
  - `businesses` - Таблица бизнесов (мультитенант) 🆕
  - `users` - Пользователи + роли (user, business_owner)
  - `products` - Продукты (связь с business_id) 🆕
  - `orders` - Заказы
  - `ingredients` - Ингредиенты
  - `chat_history` - История AI чата 🆕
  - `subscriptions` - Подписки пользователей на бизнесы 🆕
  - `metrics` - Кэш метрик для аналитики 🆕

### Real-time Communication
- **WebSocket (Native)**:
  - `ws://127.0.0.1:8000/api/v1/admin/ws` - Заказы
  - `ws://127.0.0.1:8000/api/v1/insight` - AI инсайты 🆕

### Payments
- **Stripe** - Оплата подписок Business tier ($19/mo) 🆕

### Authentication
- **JWT Tokens** - localStorage-based
- **Роли**:
  - `user` - Обычный пользователь
  - `business_owner` - Владелец бизнеса 🆕



## 🔧 Переменные окружения

```bash
# .env.local

# 🦀 Rust Gateway API (основной)
NEXT_PUBLIC_RUST_API=http://127.0.0.1:8000/api/v1

# 🟢 Go Service API (продукты + склад)
NEXT_PUBLIC_GO_API=http://127.0.0.1:8080/api

# 🔌 WebSocket URLs
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8000/api/v1/admin/ws
NEXT_PUBLIC_INSIGHT_WS=ws://127.0.0.1:8000/api/v1/insight

# 💳 Stripe (payments)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# 🗄️ Database (если нужен прямой доступ из frontend)
DATABASE_URL=postgresql://user:password@host/db

# Legacy (совместимость)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1  # Алиас для RUST_API
```


## 🎯 Ключевые особенности новой платформы

### � Мультитенантность (Multi-tenant SaaS)
- **Pinterest-style витрина** - Главная страница с карточками всех бизнесов
- **Динамические роуты** - `/{businessSlug}/` для каждого бизнеса
- **Изоляция данных** - Каждый бизнес имеет свои продукты, заказы, метрики
- **Подписки** - Пользователи подписываются на избранные бизнесы

### 💰 Монетизация (Pricing Tiers)
- **Free User** - Просмотр бизнесов, заказы, чат
- **Business Owner ($19/mo)** - Создание бизнеса, админ-панель, метрики, AI инсайты
- **Stripe интеграция** - Автоматическая оплата и управление подписками

### 🔄 Переключатель ролей (Role Switcher)
- **User Mode** - Просмотр витрин, заказы, чат с AI
- **Business Mode** - Админ-панель, управление меню, аналитика
- **Плавный переход** - Кнопка в профиле `/profile`

### 🤖 AI Integration
- **AI Chat** - Помощь в выборе блюд, рекомендации
- **AI Insights** - Аналитика для владельцев (WebSocket стрим)
- **Product Suggestions** - "Добавить в заказ" прямо из чата

### 📊 Аналитика для бизнеса
- **Revenue** - Выручка в реальном времени
- **Conversion Rate** - Процент завершённых заказов
- **Popular Products** - Топ продуктов
- **Real-time Dashboard** - WebSocket обновления

### 🔐 Безопасность
- **JWT Authentication** - Токены с истечением срока
- **Role-based Access** - Разделение прав user/business_owner
- **Tenant Isolation** - Данные бизнесов изолированы друг от друга

### 🌍 Мультиязычность
- **3 языка** - EN, PL, RU (react-i18next)
- **Динамический переключатель** - Компонент LanguageSwitcher

### � Performance
- **Next.js 15** - App Router, Server Components, Turbopack
- **Code Splitting** - Автоматическая оптимизация
- **Suspense** - Скелетоны для загрузки
- **Responsive** - Адаптив для мобильных

---

## 🚀 Roadmap для миграции

### Phase 1: Мультитенантность (2 недели)
- [ ] Создать таблицу `businesses` в PostgreSQL
- [ ] Реализовать `/api/v1/businesses` в Rust
- [ ] Обновить таблицу `products` (добавить `business_id`)
- [ ] Создать Pinterest-style главную страницу
- [ ] Реализовать `/{businessSlug}/` динамический роут
- [ ] Миграция существующих данных в первый бизнес

### Phase 2: Pricing & Payments (1 неделя)
- [ ] Создать страницу `/pricing`
- [ ] Интегрировать Stripe Checkout
- [ ] Реализовать `/api/v1/subscriptions`
- [ ] Добавить роли в таблицу `users` (user, business_owner)
- [ ] Создать onboarding flow `/auth/onboarding`

### Phase 3: Role Switcher (1 неделя)
- [ ] Создать RoleContext.tsx
- [ ] Реализовать useRole() hook
- [ ] Добавить переключатель в /profile
- [ ] Условный рендеринг Header (User vs Business)
- [ ] Защитить админ-панель от обычных users

### Phase 4: AI Integration (2 недели)
- [ ] Реализовать `/api/v1/chat` в Rust
- [ ] Интегрировать ChatGPT API
- [ ] Создать компонент ProductSuggestionCard
- [ ] Реализовать "Добавить в заказ" из чата
- [ ] WebSocket `/api/v1/insight` для AI инсайтов
- [ ] Страница `/admin/metrics` с AI рекомендациями

### Phase 5: Analytics Dashboard (1 неделя)
- [ ] Реализовать `/api/v1/admin/metrics` в Rust
- [ ] Создать таблицу `metrics` для кэширования
- [ ] Компоненты графиков (Recharts или Chart.js)
- [ ] Real-time обновления через WebSocket
- [ ] Экспорт в CSV/PDF

### Phase 6: Testing & Deployment (1 неделя)
- [ ] E2E тесты (Playwright)
- [ ] Unit тесты (Vitest)
- [ ] Performance тестирование (Lighthouse)
- [ ] Деплой Rust Gateway (Shuttle Deploy)
- [ ] Деплой Frontend (Vercel)
- [ ] Настройка custom domain

---

**Обновлено:** 15 октября 2025  
**Версия:** 2.0.0 (Multi-tenant Pinterest-style SaaS)  
**Статус:** 🚧 Migration in Progress
