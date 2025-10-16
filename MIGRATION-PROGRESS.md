# 🚀 План поэтапной миграции проекта

## ✅ PHASE 0: Подготовка (ЗАВЕРШЕНО)

### Создано:
- [x] `src/types/business.ts` - Типы бизнесов, категорий, подписок
- [x] `src/types/user.ts` - Типы пользователей с ролями
- [x] `src/types/product.ts` - Типы продуктов с business_id
- [x] `src/types/order.ts` - Типы заказов
- [x] `src/types/chat.ts` - Типы AI чата
- [x] `src/types/metrics.ts` - Типы аналитики

- [x] `src/lib/rust-api.ts` - Rust Gateway Client
- [x] `src/lib/go-api.ts` - Go Backend Client

- [x] `src/contexts/RoleContext.tsx` - Переключение User ↔ Business
- [x] `src/contexts/BusinessContext.tsx` - Текущий бизнес (multitenant)

- [x] `src/hooks/useRole.ts` - Hook для работы с ролями
- [x] `src/hooks/useBusiness.ts` - Hook для работы с бизнесом
- [x] `src/hooks/useInsights.ts` - WebSocket для AI инсайтов

- [x] `src/app/components/BusinessCard.tsx` - Карточка бизнеса для витрины
- [x] `src/app/components/BusinessGrid.tsx` - Pinterest-сетка бизнесов
- [x] `src/app/components/Filters.tsx` - Фильтры (категория, город, поиск)
- [x] `src/app/components/RoleSwitcher.tsx` - Переключатель User ↔ Business

## 📋 PHASE 1: Недостающие UI компоненты

### Нужно добавить через shadcn/ui:
```bash
npx shadcn@latest add toggle
npx shadcn@latest add tooltip
```

### Или создать вручную:
- [ ] `src/components/ui/toggle.tsx`
- [ ] `src/components/ui/tooltip.tsx`

## 📋 PHASE 2: Обновление Providers

### Файлы для изменения:
- [ ] `src/app/providers.tsx` - Добавить RoleProvider и BusinessProvider
- [ ] `src/app/layout.tsx` - Обернуть в новые провайдеры

## 📋 PHASE 3: Главная страница (Pinterest-витрина)

### Создать:
- [ ] `src/app/page.tsx` - Новая главная с BusinessGrid
  - Загрузка бизнесов из Rust API
  - Фильтрация по категории, городу
  - Поиск
  - Skeleton loader
  - Подписки

## 📋 PHASE 4: Динамический роут [businessSlug]

### Создать:
- [ ] `src/app/[businessSlug]/page.tsx` - Страница бизнеса
- [ ] `src/app/[businessSlug]/components/MenuGrid.tsx` - Меню продуктов
- [ ] `src/app/[businessSlug]/components/ChatWidget.tsx` - AI чат
- [ ] `src/app/[businessSlug]/components/BusinessHeader.tsx` - Шапка бизнеса

## 📋 PHASE 5: Pricing & Onboarding

### Создать:
- [ ] `src/app/pricing/page.tsx` - Тарифные планы
- [ ] `src/app/auth/onboarding/page.tsx` - Wizard создания бизнеса
- [ ] `src/lib/stripe.ts` - Stripe интеграция
- [ ] `src/app/api/webhook/route.ts` - Stripe webhooks

## 📋 PHASE 6: Обновление существующих страниц

### Обновить:
- [ ] `src/app/profile/page.tsx` - Добавить RoleSwitcher
- [ ] `src/app/admin/page.tsx` - Привязка к business_id
- [ ] `src/app/admin/metrics/page.tsx` - Новая страница метрик
- [ ] `src/app/chat/page.tsx` - AI чат с ProductSuggestions
- [ ] `src/contexts/AuthContext.tsx` - Обновить типы User

## 📋 PHASE 7: Environment Variables

### Обновить:
- [ ] `.env.local` - Добавить новые переменные
  ```bash
  NEXT_PUBLIC_RUST_API=http://127.0.0.1:8000/api/v1
  NEXT_PUBLIC_GO_API=http://127.0.0.1:8080/api
  NEXT_PUBLIC_INSIGHT_WS=ws://127.0.0.1:8000/api/v1/insight
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  ```

## 📋 PHASE 8: Backend Implementation

### Rust Backend:
- [ ] Реализовать `/api/v1/businesses` endpoints
- [ ] Реализовать `/api/v1/chat` endpoints
- [ ] Реализовать `/api/v1/insights` endpoints
- [ ] Реализовать `/api/v1/subscriptions` endpoints
- [ ] Реализовать `/api/v1/admin/metrics` endpoints
- [ ] WebSocket `/api/v1/insight`

### Go Backend:
- [ ] Обновить `/api/products` (добавить business_id)
- [ ] Обновить `/api/ingredients` (добавить business_id)
- [ ] Обновить `/api/semi-finished` (добавить business_id)

### PostgreSQL:
- [ ] Создать таблицу `businesses`
- [ ] Добавить поле `business_id` в `products`
- [ ] Добавить поле `role` в `users`
- [ ] Создать таблицу `subscriptions`
- [ ] Создать таблицу `chat_history`
- [ ] Создать таблицу `metrics`

## 📋 PHASE 9: Testing

- [ ] Unit тесты для новых компонентов
- [ ] E2E тесты для основных flow
- [ ] Тестирование переключения ролей
- [ ] Тестирование мультитенантности

## 📋 PHASE 10: Deployment

- [ ] Деплой Rust Gateway на Shuttle
- [ ] Деплой Go Service
- [ ] Деплой Frontend на Vercel
- [ ] Настройка DNS
- [ ] Stripe Production режим

---

## 🎯 Следующий шаг:

1. Установить недостающие UI компоненты: `npx shadcn@latest add toggle tooltip`
2. Обновить `providers.tsx` с новыми Contexts
3. Создать новую главную страницу `src/app/page.tsx`
