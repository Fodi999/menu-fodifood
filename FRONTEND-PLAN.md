# 📋 Frontend Implementation Plan - FODI Multi-Tenant Platform

## ✅ Общий прогресс: **80%** 🚀

---

## ✅ Статус выполнения

### 1️⃣ Аутентификация (Auth Flow) - **90% ГОТОВО**

**Папка:** `src/app/auth/`

**Выполнено:**
- ✅ AuthContext подключен к приложению (providers.tsx)
- ✅ Страница `/auth/signin` - вход с формой
- ✅ Страница `/auth/signup` - регистрация
- ✅ JWT сохранение в localStorage + cookie
- ✅ Role сохранение в cookie для middleware
- ✅ Редирект после входа на /profile
- ✅ Интеграция с Rust API

**API Endpoints:**
```typescript
POST /api/v1/auth/signup  // или /auth/register
POST /api/v1/auth/signin  // или /auth/login  
GET  /api/v1/auth/me      // получение профиля
```

**Что нужно улучшить:**
- 🔄 Добавить react-hook-form + zod валидацию (DONE - создан validations/auth.ts)
- 🔄 Обновить формы для использования валидации

---

### 2️⃣ Страница профиля /profile - **100% ГОТОВО** ✅

**Папка:** `src/app/profile/page.tsx`

**Выполнено:**
- ✅ Базовая структура страницы
- ✅ AuthContext интегрирован
- ✅ Middleware защита (/profile требует авторизации)
- ✅ RoleSwitcher компонент (переключение между 4 ролями)
- ✅ Отображение активной роли с цветными бейджами
- ✅ Автоматический редирект на соответствующий дашборд

---

### 3️⃣ Role-Based Access Control (RBAC) - **100% ГОТОВО** 🎭

**Папка:** `src/app/components/RoleSwitcher.tsx`

**Выполнено:**
- ✅ Enum с 4 ролями: USER, BUSINESS_OWNER, INVESTOR, ADMIN
- ✅ RoleSwitcher компонент с premium UI
- ✅ RoleContext для управления активной ролью
- ✅ localStorage + cookie синхронизация
- ✅ Middleware защита маршрутов по ролям
- ✅ Автоматический редирект на правильный дашборд
- ✅ DashboardRedirect компонент

**Созданные дашборды:**
- ✅ `/business/dashboard` - для BUSINESS_OWNER
- ✅ `/admin/dashboard` - для ADMIN
- ✅ `/invest` - для INVESTOR
- ✅ `/` - для USER

**Документация:** `RBAC-SYSTEM.md`

---

### 4️⃣ Онбординг бизнеса /auth/onboarding - **100% UI** ✅

**Компоненты для создания:**
```
src/app/components/ProfileCard.tsx
src/app/components/RoleSwitcher.tsx  // уже есть базовая версия
```

---

### 3️⃣ RoleSwitcher - **100% ГОТОВО** ✅

**Папка:** `src/app/components/RoleSwitcher.tsx`

**Выполнено:**
- ✅ Компонент полностью реализован с премиум UI
- ✅ RoleContext создан (`src/contexts/RoleContext.tsx`)
- ✅ Хук useRole создан (`src/hooks/useRole.ts`)
- ✅ Визуальный дизайн с кнопками (USER, BUSINESS_OWNER, INVESTOR)
- ✅ Логика редиректов:
  - BUSINESS_OWNER → `/auth/onboarding`
  - INVESTOR → `/invest`
  - USER → `/`
- ✅ Интегрирован в /profile
- ✅ Градиенты и иконки для каждой роли

---

### 4️⃣ Onboarding бизнеса - **100% ГОТОВО** ✅

**Папка:** `src/app/auth/onboarding/page.tsx`

**Выполнено:**
- ✅ Создана страница `/auth/onboarding`
- ✅ 4-шаговый процесс регистрации:
  - Шаг 1: Название и город
  - Шаг 2: Категория и описание
  - Шаг 3: Логотип и обложка
  - Шаг 4: Оплата ($19)
- ✅ Progress indicator с иконками
- ✅ Premium UI с градиентами
- ✅ Валидация полей
- ✅ TODO комментарии для интеграции:
  - businessesApi.create()
  - Stripe checkout
  - Обновление роли на BUSINESS_OWNER
  - Редирект на `/admin`

**API Integration:**
```typescript
// src/lib/rust-api.ts
businessesApi.create(data: CreateBusinessDto)
```

---

### 5️⃣ Оплата Stripe - **10% ГОТОВО**

**Папка:** `src/lib/rust-api.ts`

**Выполнено:**
- ✅ Базовая структура Rust API клиента

**Что нужно добавить:**
```typescript
// src/lib/rust-api.ts
export const paymentsApi = {
  createCheckout: async (businessId: string) => {
    return fetchRust<{ checkout_url: string }>('/api/v1/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ businessId }),
    });
  },
  
  verifyPayment: async (sessionId: string) => {
    return fetchRust('/api/v1/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },
};

// Usage in onboarding
const { checkout_url } = await paymentsApi.createCheckout(businessId);
window.location.href = checkout_url;
```

**Rust Backend нужно добавить:**
- Endpoint: `POST /api/v1/payments/checkout`
- Endpoint: `POST /api/v1/payments/verify`
- Stripe integration с webhook

---

### 6️⃣ Dashboard владельца /admin - **70% ГОТОВО**

**Папка:** `src/app/admin/page.tsx`

**Выполнено:**
- ✅ Страница `/admin` существует
- ✅ BusinessContext создан (`src/contexts/BusinessContext.tsx`)
- ✅ Middleware защита (требует BUSINESS_OWNER)
- ✅ Подстраницы:
  - `/admin/products` ✅
  - `/admin/orders` ✅
  - `/admin/metrics` ✅
  - `/admin/ingredients` ✅
  - `/admin/semi-finished` ✅

**Что нужно улучшить:**
- ⏳ Проверка: если нет бизнеса → редирект на `/auth/onboarding`
- ⏳ Отображение метрик с карточек
- ⏳ Навигация между разделами админки

**Логика:**
```typescript
const { currentBusiness } = useBusiness();

useEffect(() => {
  if (!currentBusiness) {
    router.push('/auth/onboarding');
  }
}, [currentBusiness]);
```

---

### 7️⃣ Investor Portal - **100% ГОТОВО** ✅

**Папка:** `src/app/invest/`

**Выполнено:**
- ✅ Создана страница `/invest` - список бизнесов с токенизацией
- ✅ Premium UI с градиентами (зелёная тема для инвесторов)
- ✅ Статистика портфеля (3 карточки: портфель, ROI, активные инвестиции)
- ✅ Карточки бизнесов с:
  - Рейтинг (звёзды)
  - Цена токена
  - Доступность токенов (прогресс бар)
  - ROI метрики
  - Выручка
  - Кнопка "Инвестировать"
- ✅ Инфо-секция "Как это работает" (3 шага)
- ✅ Mock данные для демонстрации

**TODO для интеграции с API:**
- ⏳ Создать `/invest/portfolio` - портфель инвестора
- ⏳ API endpoints в Rust:
  ```typescript
  GET  /api/v1/investments/opportunities  
  GET  /api/v1/investments/portfolio      
  POST /api/v1/investments/purchase       
  ```
- ⏳ TokenPurchaseModal для покупки токенов

---

### 8️⃣ Navbar логика - **80% ГОТОВО**

**Папка:** `src/app/components/Header.tsx`

**Выполнено:**
- ✅ Header компонент существует
- ✅ Показывает "Войти" для неавторизованных
- ✅ Dropdown с профилем для авторизованных
- ✅ Кнопка "Админ-панель" для BUSINESS_OWNER

**Что нужно добавить:**
- ⏳ Кнопка "Портфель" для роли INVESTOR
- ⏳ Индикатор текущей роли
- ⏳ Быстрое переключение ролей в Header

**Логика:**
```typescript
{user && (
  <>
    {user.role === UserRole.BUSINESS_OWNER && (
      <Link href="/admin">Панель управления</Link>
    )}
    {user.role === UserRole.INVESTOR && (
      <Link href="/invest">Портфель</Link>
    )}
  </>
)}
```

---

### 9️⃣ UI-полировка - **60% ГОТОВО**

**Папка:** `src/components/ui/`

**Выполнено:**
- ✅ shadcn/ui компоненты установлены
- ✅ Loader2, Skeleton компоненты доступны
- ✅ Градиенты и анимации добавлены на главную страницу
- ✅ Dark theme с orange accent (#ff6b00)

**Что нужно улучшить:**
- ⏳ Spinner компонент для загрузки
- ⏳ Skeleton loaders для карточек бизнесов
- ⏳ Toast notifications (sonner уже установлен)
- ⏳ Form error states
- ⏳ Success animations

---

## 🎯 Приоритетный план действий (что делать СЕЙЧАС)

### ✅ COMPLETED
1. ~~Noise texture на главную страницу~~
2. ~~Улучшенные карточки бизнесов~~
3. ~~Premium gradient фон~~
4. ~~Создан validations/auth.ts~~

### 🔥 HIGH PRIORITY (делать сейчас)
1. **Обновить /auth/signin с react-hook-form**
   - Использовать signInSchema
   - Добавить лучшую валидацию
   - Улучшить UI

2. **Обновить /auth/signup с react-hook-form**
   - Использовать signUpSchema
   - Добавить валидацию
   - Улучшить UI

3. **Создать ProfileCard компонент**
   - Отображение: имя, email, роль
   - Avatar с инициалами
   - Кнопки действий

4. **Улучшить RoleSwitcher**
   - Визуальный toggle (tabs)
   - Логика редиректов
   - Проверка доступности ролей

### ⚙️ MEDIUM PRIORITY (следующий шаг)
5. **Создать /auth/onboarding**
   - Форма создания бизнеса
   - Upload изображений
   - Категории

6. **Добавить Stripe integration**
   - Создать paymentsApi
   - Checkout flow
   - Success/cancel pages

7. **Улучшить /admin dashboard**
   - Проверка наличия бизнеса
   - Метрики карточки
   - Навигация

### 💼 LOW PRIORITY (позже)
8. **Создать Investor Portal**
   - `/invest` страница
   - `/invest/portfolio`
   - Investment components

9. **UI Polishing**
   - Skeletons
   - Spinners
   - Animations
   - Error states

---

## 📊 Общий прогресс: **75%**

| Компонент | Прогресс | Статус |
|-----------|----------|--------|
| Auth Flow | 90% | ✅ Почти готово |
| Profile | 100% | ✅ Готово |
| RoleSwitcher | 100% | ✅ Готово |
| Onboarding | 100% | ✅ Готово (UI) |
| Stripe | 10% | ❌ Требуется интеграция |
| Admin Dashboard | 70% | 🔄 В работе |
| Investor Portal | 100% | ✅ Готово (UI) |
| Navbar | 80% | ✅ Почти готово |
| UI Polish | 60% | 🔄 В процессе |

---

## 🚀 Следующие шаги

**✅ ВЫПОЛНЕНО:**
1. ✅ RoleSwitcher с премиум UI - интегрирован в профиль
2. ✅ Onboarding flow - 4-шаговый процесс регистрации бизнеса
3. ✅ Investor Portal - страница с токенизацией бизнесов

**🎯 ФОКУС НА ТЕКУЩУЮ НЕДЕЛЮ:**
1. **Интеграция Stripe** - подключить реальные платежи ($19)
   - Создать endpoints в Rust API
   - Добавить webhook обработку
   - Тестировать checkout flow

2. **Обновление роли после onboarding**
   - После оплаты обновлять user.role на BUSINESS_OWNER
   - Автоматический редирект в /admin

3. **API интеграция для Investor Portal**
   - Endpoints для tokenization
   - Portfolio tracking
   - Purchase flow

4. **Header улучшения**
   - Добавить кнопку "Портфель" для INVESTOR
   - Индикатор текущей активной роли

**ПОСЛЕ ЭТОГО:**
- Dashboard improvements (проверка наличия бизнеса)
- UI animations и transitions
- Skeleton loaders
- Testing всего flow

---

**Обновлено:** 16 октября 2025 г.
