# 🎯 Marketing / CRM System - Implementation Plan

## 📊 Обзор Системы

Полноценная система маркетинга и управления клиентами для ресторана с **5 ключевыми модулями**:

1. **Kupóny (Купоны)** - промокоды и скидочные купоны
2. **Rabaty (Скидки)** - автоматические и условные скидки
3. **Newsletter** - email-рассылки
4. **SMS Marketing** - SMS-уведомления и акции
5. **Program Lojalnościowy (Программа лояльности)** - баллы, уровни, награды

---

## 🏗️ Архитектура Системы

### Database Schema (PostgreSQL)

```sql
-- 1. КУПОНЫ
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name_pl VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    description_pl TEXT,
    type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed_amount', 'free_delivery', 'free_item'
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER, -- null = unlimited
    usage_count INTEGER DEFAULT 0,
    user_usage_limit INTEGER DEFAULT 1, -- сколько раз один пользователь может использовать
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    active BOOLEAN DEFAULT true,
    applicable_categories TEXT[], -- ['pizza', 'sushi', 'burger']
    applicable_items UUID[], -- specific menu items
    first_order_only BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- История использования купонов
CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id),
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    discount_amount DECIMAL(10,2),
    used_at TIMESTAMP DEFAULT NOW()
);

-- 2. СКИДКИ
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_pl VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'happy_hour', 'bulk_discount', 'combo', 'birthday', 'category_discount'
    value DECIMAL(10,2) NOT NULL,
    conditions JSONB, -- гибкие условия
    schedule JSONB, -- расписание (дни недели, часы)
    priority INTEGER DEFAULT 0, -- приоритет если несколько скидок
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. NEWSLETTER
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(200),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
    preferences JSONB, -- какие типы писем хочет получать
    source VARCHAR(100), -- откуда подписался
    subscribed_at TIMESTAMP DEFAULT NOW(),
    unsubscribed_at TIMESTAMP,
    tags TEXT[]
);

CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    subject_pl VARCHAR(300) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    segment JSONB, -- кому отправлять
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent'
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    stats JSONB, -- открытия, клики, отписки
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. SMS MARKETING
CREATE TABLE sms_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    message_pl TEXT NOT NULL,
    segment JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    stats JSONB, -- доставлено, ошибки
    cost DECIMAL(10,2), -- стоимость рассылки
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sms_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100), -- 'order_confirmation', 'delivery_update', 'promotion'
    message_pl TEXT NOT NULL,
    variables TEXT[], -- ['order_number', 'customer_name', 'delivery_time']
    active BOOLEAN DEFAULT true
);

-- 5. ПРОГРАММА ЛОЯЛЬНОСТИ
CREATE TABLE loyalty_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_pl VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    level INTEGER UNIQUE NOT NULL, -- 1, 2, 3
    min_points INTEGER NOT NULL,
    color VARCHAR(50), -- для UI
    benefits JSONB, -- список преимуществ
    discount_percentage DECIMAL(5,2), -- постоянная скидка на уровне
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loyalty_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    current_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0, -- всего заработано
    tier_id UUID REFERENCES loyalty_tiers(id),
    last_activity TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES loyalty_accounts(id),
    type VARCHAR(50) NOT NULL, -- 'earn', 'spend', 'expire', 'bonus'
    points INTEGER NOT NULL,
    order_id UUID REFERENCES orders(id),
    description_pl TEXT,
    expires_at TIMESTAMP, -- баллы могут сгорать
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loyalty_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_pl VARCHAR(200) NOT NULL,
    description_pl TEXT,
    points_cost INTEGER NOT NULL,
    reward_type VARCHAR(50), -- 'discount', 'free_item', 'free_delivery'
    reward_value JSONB,
    image_url TEXT,
    stock INTEGER, -- null = unlimited
    active BOOLEAN DEFAULT true,
    tier_requirement INTEGER, -- минимальный уровень
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. КЛИЕНТЫ (расширение таблицы users)
CREATE TABLE customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    birthday DATE,
    preferred_language VARCHAR(10) DEFAULT 'pl',
    marketing_consent BOOLEAN DEFAULT false,
    sms_consent BOOLEAN DEFAULT false,
    favorite_items UUID[],
    tags TEXT[],
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    average_order_value DECIMAL(10,2),
    last_order_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 Frontend Components

### 1. Kupóny (Купоны) - UI Components

```typescript
// /src/components/Marketing/CouponInput.tsx
interface CouponInputProps {
  onApply: (code: string) => void;
  currentCoupon?: AppliedCoupon;
}

// Функционал:
- Input для ввода промокода
- Кнопка "Zastosuj" (Применить)
- Валидация в реальном времени
- Показ ошибок: "Kupon wygasł", "Minimalna kwota 50 zł"
- Показ успеха: "✓ Rabat 15% zastosowany"
- Удаление купона
```

```typescript
// /src/components/Marketing/CouponCard.tsx
// Карточка доступного купона для пользователя

interface CouponCardProps {
  coupon: Coupon;
  canUse: boolean;
  onCopy: () => void;
}

// Показывает:
- Код купона: "PIZZA20"
- Скидку: "20% zniżki"
- Условия: "Min. 50 zł"
- Срок: "Ważny do 31.12.2025"
- Кнопку "Skopiuj kod"
```

### 2. Rabaty (Скидки) - Auto-apply Logic

```typescript
// /src/lib/discount-engine.ts

interface DiscountRule {
  id: string;
  type: 'happy_hour' | 'bulk_discount' | 'combo' | 'category_discount';
  condition: (cart: Cart, time: Date) => boolean;
  calculate: (cart: Cart) => number;
}

// Примеры скидок:
1. Happy Hour (16:00-18:00) - 20% на все
2. Bulk Discount - купи 3 пиццы, получи 15% скидку
3. Combo Discount - пицца + напиток = -10 zł
4. Category Discount - 10% на все суши по вторникам
5. Birthday Discount - 25% в день рождения
```

### 3. Newsletter - Subscription Form

```typescript
// /src/components/Marketing/NewsletterForm.tsx

interface NewsletterFormProps {
  source: string; // 'footer', 'checkout', 'popup'
}

// Функционал:
- Email input
- Checkbox "Zgadzam się na newsletter"
- Checkbox "Chcę otrzymywać SMS"
- Кнопка "Zapisz się"
- Privacy policy link
- Success message с купоном: "Dziękujemy! Twój kod: WELCOME10"
```

```typescript
// /src/components/Marketing/NewsletterPopup.tsx
// Popup через 30 секунд на сайте

// Показывает:
- "Zapisz się i otrzymaj 10% rabatu na pierwsze zamówienie!"
- Email input
- Кнопку "Otrzymaj kupon"
- Кнопку закрыть
```

### 4. SMS Marketing - Opt-in

```typescript
// /src/components/Marketing/SMSConsent.tsx
// Чекбокс в профиле пользователя

interface SMSConsentProps {
  currentConsent: boolean;
  onToggle: (consent: boolean) => void;
}

// Функционал:
- Toggle switch
- "Otrzymuj SMS o promocjach i zamówieniach"
- Privacy info
- Показ примера SMS
```

### 5. Program Lojalnościowy - Dashboard

```typescript
// /src/components/Loyalty/LoyaltyDashboard.tsx

interface LoyaltyDashboardProps {
  account: LoyaltyAccount;
  tier: LoyaltyTier;
}

// Показывает:
- Текущий уровень: "Srebrny" с badge
- Баллы: "1,250 punktów"
- Progress bar до следующего уровня
- Доступные награды
- История транзакций
- Персональные предложения
```

```typescript
// /src/components/Loyalty/PointsIndicator.tsx
// В корзине/checkout

// Показывает:
- "Zarobisz +85 punktów za to zamówienie!"
- "Masz 1,250 punktów = 12.50 zł rabatu"
- Кнопка "Użyj punktów"
```

```typescript
// /src/components/Loyalty/RewardsGallery.tsx
// Витрина наград

interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  image: string;
  type: 'discount' | 'free_item' | 'free_delivery';
}

// Функционал:
- Grid карточек наград
- Фильтр по типу
- Сортировка по цене в баллах
- Кнопка "Wymień" (Обменять)
- Lock icon если не хватает баллов
```

---

## 🔧 Backend API Endpoints

### Kupóny

```typescript
// POST /api/coupons/validate
{
  "code": "PIZZA20",
  "orderTotal": 85.00,
  "userId": "uuid",
  "items": [...]
}
// Response: { valid: true, discount: 17.00, message: "20% zniżki" }

// POST /api/coupons/apply
// Применить купон к заказу

// GET /api/coupons/available
// Доступные купоны для пользователя

// POST /api/admin/coupons (CRUD)
```

### Rabaty

```typescript
// GET /api/discounts/calculate
{
  "cart": {...},
  "timestamp": "2025-12-07T17:30:00Z"
}
// Response: { discounts: [...], totalDiscount: 25.00 }

// POST /api/admin/discounts (CRUD)
```

### Newsletter

```typescript
// POST /api/newsletter/subscribe
{
  "email": "customer@example.com",
  "name": "Jan Kowalski",
  "source": "footer"
}
// Response: { success: true, couponCode: "WELCOME10" }

// POST /api/newsletter/unsubscribe
// GET /api/admin/newsletter/subscribers
// POST /api/admin/newsletter/campaigns/send
```

### SMS Marketing

```typescript
// POST /api/sms/send-campaign
{
  "templateId": "uuid",
  "segment": { "tags": ["vip"] },
  "scheduledAt": "2025-12-10T10:00:00Z"
}

// POST /api/sms/send-transactional
{
  "userId": "uuid",
  "type": "order_confirmation",
  "variables": { "order_number": "12345" }
}

// Integration with providers:
// - Twilio (международный)
// - SerwerSMS.pl (Польша)
// - SMSAPI.pl (Польша)
```

### Program Lojalnościowy

```typescript
// GET /api/loyalty/account
// Аккаунт пользователя

// POST /api/loyalty/earn
{
  "orderId": "uuid",
  "amount": 85.00
}
// Начисляет баллы: 85 zł = 85 points (1:1)

// POST /api/loyalty/redeem
{
  "rewardId": "uuid"
}
// Обменять баллы на награду

// GET /api/loyalty/rewards
// Список доступных наград

// POST /api/admin/loyalty/tiers (CRUD)
```

---

## 📱 User Flows

### Flow 1: Применение Купона

```
Корзина → Input "Masz kupon?" → Вводит "PIZZA20"
       ↓
Валидация купона (API)
       ↓
✓ "20% zniżki - oszczędzasz 17 zł"
       ↓
Итоговая цена обновлена: 85 zł → 68 zł
       ↓
Checkout → Купон применен
```

### Flow 2: Подписка на Newsletter

```
Footer → "Zapisz się na newsletter"
      ↓
Popup с формой
      ↓
Email + согласие
      ↓
Отправка (API)
      ↓
Success: "Dziękujemy! Twój kod: WELCOME10"
      ↓
Email с приветствием + купон
```

### Flow 3: Заработать Баллы

```
Оформление заказа на 120 zł
         ↓
"Zarobisz +120 punktów!"
         ↓
Заказ доставлен
         ↓
Баллы зачислены автоматически
         ↓
Push notification: "Otrzymałeś 120 punktów! 💰"
         ↓
Профиль → "Masz teraz 1,370 punktów"
```

### Flow 4: Обменять Баллы

```
Профиль → Program Lojalnościowy
        ↓
Rewards Gallery
        ↓
"Darmowa Pizza Margherita - 500 punktów"
        ↓
Кнопка "Wymień"
        ↓
Confirmation modal
        ↓
Баллы списаны → Купон на бесплатную пиццу
        ↓
Купон добавлен в аккаунт
```

---

## 🎯 Бизнес-Логика

### Начисление Баллов

```typescript
// 1 zł заказа = 1 балл
// Минимальный заказ для баллов: 30 zł
// Баллы начисляются после доставки заказа

function calculatePoints(orderTotal: number): number {
  if (orderTotal < 30) return 0;
  return Math.floor(orderTotal); // 85.50 zł = 85 points
}

// Бонусные баллы:
// - Первый заказ: +100 баллов
// - День рождения: x2 баллы
// - Приведи друга: +50 баллов (оба)
// - Отзыв с фото: +20 баллов
```

### Уровни Лояльности

```typescript
const LOYALTY_TIERS = [
  {
    level: 1,
    name: 'Brązowy',
    minPoints: 0,
    color: '#CD7F32',
    benefits: ['1% cashback', 'Newsletter']
  },
  {
    level: 2,
    name: 'Srebrny',
    minPoints: 500,
    color: '#C0C0C0',
    benefits: ['2% cashback', 'Priorytet w dostawie', 'Darmowa dostawa od 80 zł']
  },
  {
    level: 3,
    name: 'Złoty',
    minPoints: 2000,
    color: '#FFD700',
    benefits: ['5% cashback', 'Ekskluzywne promocje', 'Darmowa dostawa od 50 zł', 'Urodzinowa niespodzianka']
  },
  {
    level: 4,
    name: 'Platynowy',
    minPoints: 5000,
    color: '#E5E4E2',
    benefits: ['10% cashback', 'Osobisty menedżer', 'Darmowa dostawa', 'VIP eventy', '2x punkty']
  }
];
```

### Срок Действия Купонов

```typescript
// Типы сроков:
1. Временные: "Ważny do 31.12.2025"
2. Первое использование: "Użyj w ciągu 7 dni od rejestracji"
3. Разовые: "Jednorazowy"
4. Многоразовые: "Użyj 3 razy"
5. Персональные: "Tylko dla Ciebie"

// Примеры купонов:
{
  code: "WELCOME10",
  type: "percentage",
  value: 10,
  firstOrderOnly: true,
  userUsageLimit: 1,
  validDays: 30 // с момента регистрации
}

{
  code: "PIZZA20",
  type: "percentage",
  value: 20,
  minOrderAmount: 50,
  applicableCategories: ["pizza"],
  validUntil: "2025-12-31",
  usageLimit: 1000
}
```

---

## 📊 Admin Panel - Marketing Dashboard

### 1. Kupóny Management

```
Таблица купонов:
| Kod      | Typ | Wartość | Użycia | Ważność      | Status |
|----------|-----|---------|--------|--------------|--------|
| PIZZA20  | %   | 20%     | 45/100 | 31.12.2025  | ✓      |
| WELCOME10| %   | 10%     | ∞      | -           | ✓      |

Кнопки:
[+ Utwórz kupon] [Import] [Export]

Filtry:
- Status (aktywny/nieaktywny)
- Typ (%, fixed, free delivery)
- Data wygaśnięcia
```

### 2. Rabaty Rules

```
Автоматические скидки:
| Nazwa         | Typ        | Wartość | Harmonogram  | Status |
|---------------|------------|---------|--------------|--------|
| Happy Hour    | % discount | 20%     | Pn-Pt 16-18  | ✓      |
| Wtorek Sushi  | Category   | 10%     | Wt cały dzień| ✓      |

[+ Dodaj rabat]
```

### 3. Newsletter Campaigns

```
Kampanie:
| Nazwa            | Temat                    | Status  | Wysłano | Otwarto |
|------------------|--------------------------|---------|---------|---------|
| Nowe Menu        | Sprawdź nasze nowości!   | Wysłano | 1,250   | 45%     |
| Black Friday     | -50% na wszystko!        | Zapl.   | -       | -       |

[+ Nowa kampania]

Stats:
- Subskrybenci: 1,520
- Open Rate: 42%
- Click Rate: 15%
- Unsubscribe Rate: 0.5%
```

### 4. SMS Campaigns

```
Kampanie SMS:
| Nazwa        | Wiadomość              | Status  | Wysłano | Koszt   |
|--------------|------------------------|---------|---------|---------|
| Weekend Sale | 20% zniżki w weekend!  | Wysłano | 850     | 42.50 zł|

[+ Nowa kampania SMS]

Settings:
- Provider: SerwerSMS.pl
- Sender ID: "Fodifood"
- Balance: 500 zł
```

### 5. Loyalty Program Analytics

```
Statystyki:
- Członkowie programu: 2,340
- Aktywni (30 dni): 1,120
- Średnia punktów: 450

Rozkład poziomów:
🟤 Brązowy: 1,500 (64%)
🔘 Srebrny: 600 (26%)
🟡 Złoty: 200 (8%)
⚪ Platynowy: 40 (2%)

Top 10 klientów (lifetime points)
```

---

## 🔌 Integrations

### Email Provider

```typescript
// Mailgun / SendGrid / AWS SES
import { sendEmail } from '@/lib/email-provider';

await sendEmail({
  to: 'customer@example.com',
  template: 'welcome',
  variables: {
    name: 'Jan',
    couponCode: 'WELCOME10'
  }
});
```

### SMS Provider (Poland)

```typescript
// SerwerSMS.pl или SMSAPI.pl
import { sendSMS } from '@/lib/sms-provider';

await sendSMS({
  to: '+48123456789',
  message: 'Twoje zamówienie #12345 jest w drodze! 🚗'
});
```

### Analytics

```typescript
// Track marketing events
analytics.track('coupon_applied', {
  code: 'PIZZA20',
  discount: 17.00,
  orderId: 'uuid'
});

analytics.track('loyalty_points_earned', {
  points: 85,
  userId: 'uuid'
});
```

---

## 💰 ROI Examples

### Kupóny Impact

```
Без купонов:
- Конверсия checkout: 65%
- Средний чек: 75 zł

С купонами:
- Конверсия checkout: 80% (+15%)
- Средний чек: 95 zł (+27%)
- ROI: 300% (скидка 10% → +15% конверсия + +27% чек)
```

### Newsletter ROI

```
База: 2,000 подписчиков
Open Rate: 40%
Click Rate: 15%

Рассылка "Weekend Sale":
- Открыло: 800 человек
- Кликнуло: 300 человек
- Заказало: 60 человек (20% конверсия)
- Средний чек: 120 zł
- Выручка: 7,200 zł
- Стоимость рассылки: 50 zł
- ROI: 14,300%
```

### Loyalty Program

```
Средний клиент без программы:
- Заказов в год: 3
- Средний чек: 70 zł
- LTV: 210 zł

Средний участник программы:
- Заказов в год: 8 (+167%)
- Средний чек: 95 zł (+36%)
- LTV: 760 zł (+262%)
```

---

## 🚀 Implementation Phases

### Phase 1: Купоны (2 недели)
- [ ] Database schema
- [ ] API endpoints
- [ ] Coupon validation logic
- [ ] UI в корзине/checkout
- [ ] Admin panel CRUD
- [ ] Email с купоном

### Phase 2: Автоматические Скидки (1 неделя)
- [ ] Discount engine
- [ ] Happy Hour logic
- [ ] Bulk discount rules
- [ ] UI индикатор в корзине
- [ ] Admin panel

### Phase 3: Newsletter (2 недели)
- [ ] Subscription form
- [ ] Email provider integration
- [ ] Campaign management
- [ ] Email templates
- [ ] Analytics dashboard
- [ ] Unsubscribe flow

### Phase 4: SMS Marketing (1 неделя)
- [ ] SMS provider integration (SerwerSMS.pl)
- [ ] SMS templates
- [ ] Opt-in/opt-out flow
- [ ] Campaign sending
- [ ] Cost tracking

### Phase 5: Программа Лояльности (3 недели)
- [ ] Points system
- [ ] Tier logic
- [ ] Rewards catalog
- [ ] Loyalty dashboard UI
- [ ] Points redemption flow
- [ ] Admin analytics

### Phase 6: Analytics & Optimization (1 неделя)
- [ ] Marketing dashboard
- [ ] A/B testing framework
- [ ] Segmentation engine
- [ ] Automated campaigns
- [ ] Performance monitoring

---

## ✅ Success Metrics

### KPIs

1. **Coupon Redemption Rate**: 25-35%
2. **Newsletter Open Rate**: 35-45%
3. **SMS Open Rate**: 95%+
4. **Loyalty Program Participation**: 40%+ клиентов
5. **Repeat Purchase Rate**: 60%+ (с программой vs 30% без)
6. **Average Order Value**: +25-30%
7. **Customer Lifetime Value**: +150-200%

---

## 💡 Конкурентное Преимущество

### vs Wolt/Uber Eats

| Фича | Wolt | UberEats | Fodifood |
|------|------|----------|----------|
| Купоны | ✅ | ✅ | ✅ |
| Программа лояльности | ❌ | ⚠️ Базовая | ✅ Продвинутая |
| SMS маркетинг | ⚠️ Только уведомления | ⚠️ | ✅ Промо + транз. |
| Newsletter | ❌ | ❌ | ✅ |
| Персонализация | ⚠️ Слабая | ⚠️ | ✅ Глубокая |
| Автоскидки | ✅ | ✅ | ✅ + Расписание |

### Уникальные Фичи

1. **Smart Coupons** - купоны генерируются автоматически на основе поведения
2. **Birthday Rewards** - автоматическая скидка в день рождения
3. **Referral Program** - приведи друга, получи баллы
4. **VIP Events** - эксклюзивные мероприятия для платиновых клиентов
5. **Gamification** - челленджи и достижения

---

**🎯 Итог:** Полноценная CRM-система уровня enterprise с акцентом на retention и LTV!
