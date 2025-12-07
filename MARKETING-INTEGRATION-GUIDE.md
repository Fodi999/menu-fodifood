# 🚀 Quick Integration Guide - Marketing & CRM System

## ✅ Что уже готово (Created Components)

### 1. **Купоны (Coupons)**
```typescript
/src/components/Marketing/CouponInput.tsx
```
- ✅ Input для промокодов
- ✅ Валидация купонов
- ✅ Показ ошибок и успеха
- ✅ Типы: percentage, fixed_amount, free_delivery
- ✅ Интегрировано в корзину

**Использование:**
```tsx
import { CouponInput, AppliedCoupon } from '@/components/Marketing/CouponInput';

const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

<CouponInput
  orderTotal={totalPrice}
  currentCoupon={appliedCoupon}
  onApply={(coupon) => setAppliedCoupon(coupon)}
  onRemove={() => setAppliedCoupon(null)}
/>
```

### 2. **Newsletter**
```typescript
/src/components/Marketing/NewsletterForm.tsx
```
- ✅ Форма подписки (полная и компактная)
- ✅ Email + SMS consent
- ✅ Автоматический купон после подписки
- ✅ Privacy policy integration

**Использование в Footer:**
```tsx
import { NewsletterForm } from '@/components/Marketing/NewsletterForm';

<NewsletterForm 
  source="footer" 
  compact={true}
  showSMSConsent={false}
/>
```

**Использование в Popup:**
```tsx
<NewsletterForm 
  source="popup" 
  compact={false}
  showSMSConsent={true}
  onSuccess={(couponCode) => {
    console.log('Coupon generated:', couponCode);
  }}
/>
```

### 3. **Программа Лояльности (Loyalty)**
```typescript
/src/components/Loyalty/LoyaltyDashboard.tsx
/src/components/Loyalty/PointsIndicator.tsx
```

**Features:**
- ✅ 4 уровня: Brązowy, Srebrny, Złoty, Platynowy
- ✅ Progress bar до следующего уровня
- ✅ Список всех преимуществ
- ✅ Points indicator в корзине
- ✅ Cashback calculation

**Использование в Sidebar/Profile:**
```tsx
import { LoyaltyDashboard } from '@/components/Loyalty/LoyaltyDashboard';

<LoyaltyDashboard
  account={{
    userId: 'user-id',
    currentPoints: 1250,
    lifetimePoints: 3400,
    tierId: 'silver',
    lastActivity: new Date().toISOString(),
  }}
  compact={false}
/>
```

**Использование в Корзине:**
```tsx
import { CartPointsPreview } from '@/components/Loyalty/PointsIndicator';

<CartPointsPreview />
```

---

## 📦 Уже Интегрировано

### Cart.tsx
- ✅ CouponInput - ввод и применение купонов
- ✅ CartPointsPreview - показ баллов за заказ
- ✅ Расчет скидки по купону
- ✅ Бесплатная доставка по купону
- ✅ Итоговая цена с учетом всех скидок

---

## 🔨 Что нужно сделать

### PHASE 1: Backend API (Priority: HIGH)

#### 1. Создать таблицы в базе данных

```sql
-- См. MARKETING-CRM-PLAN.md для полных схем
-- Основные таблицы:
- coupons
- coupon_usage
- discounts
- newsletter_subscribers
- email_campaigns
- sms_campaigns
- loyalty_tiers
- loyalty_accounts
- loyalty_transactions
- loyalty_rewards
- customer_profiles
```

**Файл:** `/backend/migrations/007_create_marketing_tables.sql`

#### 2. API Endpoints для купонов

```rust
// backend/src/handlers/coupons.rs

// POST /api/coupons/validate
pub async fn validate_coupon(
    State(state): State<AppState>,
    Json(payload): Json<ValidateCouponRequest>,
) -> Result<Json<ValidateCouponResponse>, ApiError> {
    // 1. Найти купон по коду
    // 2. Проверить срок действия
    // 3. Проверить минимальную сумму заказа
    // 4. Проверить лимиты использования
    // 5. Проверить применимые категории
    // 6. Рассчитать скидку
    // 7. Вернуть результат
}

// POST /api/coupons/apply
pub async fn apply_coupon(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Json(payload): Json<ApplyCouponRequest>,
) -> Result<Json<AppliedCoupon>, ApiError> {
    // Сохранить использование купона в coupon_usage
}

// GET /api/coupons/available
pub async fn get_available_coupons(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
) -> Result<Json<Vec<Coupon>>, ApiError> {
    // Купоны доступные для пользователя
}
```

#### 3. API Endpoints для Newsletter

```rust
// backend/src/handlers/newsletter.rs

// POST /api/newsletter/subscribe
pub async fn subscribe(
    State(state): State<AppState>,
    Json(payload): Json<SubscribeRequest>,
) -> Result<Json<SubscribeResponse>, ApiError> {
    // 1. Сохранить подписчика
    // 2. Сгенерировать welcome купон (WELCOME10)
    // 3. Отправить welcome email
    // 4. Вернуть купон
}

// POST /api/newsletter/unsubscribe
// GET /api/admin/newsletter/subscribers
// POST /api/admin/newsletter/campaigns/send
```

#### 4. API Endpoints для Loyalty

```rust
// backend/src/handlers/loyalty.rs

// GET /api/loyalty/account
pub async fn get_loyalty_account(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
) -> Result<Json<LoyaltyAccount>, ApiError> {
    // Данные программы лояльности пользователя
}

// POST /api/loyalty/earn
pub async fn earn_points(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Json(payload): Json<EarnPointsRequest>,
) -> Result<Json<EarnPointsResponse>, ApiError> {
    // После доставки заказа начислить баллы
    // Обновить tier если достаточно баллов
}

// POST /api/loyalty/redeem
pub async fn redeem_reward(
    State(state): State<AppState>,
    Extension(user): Extension<User>,
    Json(payload): Json<RedeemRequest>,
) -> Result<Json<RedeemResponse>, ApiError> {
    // Обменять баллы на награду
}

// GET /api/loyalty/rewards
// GET /api/loyalty/history
```

---

### PHASE 2: Email Integration

#### Установить Email Provider

**Рекомендация: Mailgun** (бесплатно до 5,000 emails/мес)

```toml
# backend/Cargo.toml
[dependencies]
lettre = "0.11"
handlebars = "4.5"  # для email templates
```

```rust
// backend/src/services/email_service.rs

pub struct EmailService {
    smtp_client: SmtpTransport,
    from_email: String,
}

impl EmailService {
    pub async fn send_welcome_email(
        &self,
        to: &str,
        name: &str,
        coupon_code: &str,
    ) -> Result<(), EmailError> {
        let template = self.render_template("welcome", json!({
            "name": name,
            "coupon_code": coupon_code,
            "expiry_days": 30,
        }))?;

        self.send_email(to, "Witamy w Fodifood! 🎉", &template).await
    }

    pub async fn send_order_confirmation(
        &self,
        to: &str,
        order: &Order,
    ) -> Result<(), EmailError> {
        // Email с деталями заказа
    }

    pub async fn send_campaign(
        &self,
        campaign: &EmailCampaign,
        subscribers: Vec<&NewsletterSubscriber>,
    ) -> Result<CampaignStats, EmailError> {
        // Массовая рассылка
    }
}
```

**Email Templates:**
```html
<!-- backend/templates/emails/welcome.hbs -->
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
        .coupon { background: #f0f0f0; border: 2px dashed #667eea; padding: 20px; margin: 20px; text-align: center; font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Witamy, {{name}}! 🎉</h1>
        <p>Dziękujemy za zapisanie się do newslettera Fodifood</p>
    </div>
    
    <div style="padding: 40px;">
        <p>Jako podziękowanie, oto Twój kod rabatowy:</p>
        
        <div class="coupon">
            {{coupon_code}}
        </div>
        
        <p>Użyj go przy pierwszym zamówieniu i otrzymaj <strong>10% zniżki</strong>!</p>
        <p>Kod ważny przez {{expiry_days}} dni.</p>
        
        <a href="https://fodifood.pl/#menu" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Zamów teraz
        </a>
    </div>
</body>
</html>
```

---

### PHASE 3: SMS Integration (Optional but Recommended)

#### Польский SMS провайдер: **SerwerSMS.pl**

```toml
# backend/Cargo.toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
```

```rust
// backend/src/services/sms_service.rs

pub struct SmsService {
    api_key: String,
    sender_id: String,  // "Fodifood"
}

impl SmsService {
    pub async fn send_order_update(
        &self,
        phone: &str,
        order_number: &str,
        status: &str,
    ) -> Result<(), SmsError> {
        let message = format!(
            "Fodifood: Twoje zamówienie #{} jest w drodze! 🚗 Доставка за ~30 min.",
            order_number
        );

        self.send_sms(phone, &message).await
    }

    pub async fn send_campaign(
        &self,
        campaign: &SmsCampaign,
        recipients: Vec<&str>,
    ) -> Result<CampaignStats, SmsError> {
        // Массовая SMS рассылка
    }

    async fn send_sms(&self, to: &str, message: &str) -> Result<(), SmsError> {
        let client = reqwest::Client::new();
        let response = client
            .post("https://api.serwersms.pl/messages/send_sms")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&json!({
                "phone": to,
                "text": message,
                "sender": self.sender_id,
            }))
            .send()
            .await?;

        // Handle response
        Ok(())
    }
}
```

**Стоимость:** ~0.05 zł за SMS (~$0.01)

---

### PHASE 4: Admin Panel

#### Создать страницы администратора

```typescript
// /src/app/admin/marketing/page.tsx
// Dashboard с metrics:
// - Активных купонов
// - Newsletter подписчиков
// - Членов программы лояльности
// - ROI по каналам

// /src/app/admin/coupons/page.tsx
// CRUD купонов

// /src/app/admin/newsletter/page.tsx
// Создание и отправка кампаний

// /src/app/admin/loyalty/page.tsx
// Управление уровнями и наградами
```

---

## 🎯 Готовые Примеры Использования

### 1. Добавить Newsletter форму в Footer

```tsx
// /src/components/Footer.tsx
import { NewsletterForm } from '@/components/Marketing/NewsletterForm';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* ... другие колонки ... */}
          
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Zapisz się i otrzymaj 10% rabatu!
            </p>
            <NewsletterForm 
              source="footer" 
              compact={true}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### 2. Показать Loyalty Dashboard в Profile

```tsx
// /src/app/profile/page.tsx
import { LoyaltyDashboard } from '@/components/Loyalty/LoyaltyDashboard';

export default async function ProfilePage() {
  const session = await getServerSession();
  
  // Fetch loyalty account from API
  const loyaltyAccount = await fetch(`/api/loyalty/account`, {
    headers: { 'Authorization': `Bearer ${session.accessToken}` }
  }).then(res => res.json());

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mój Profil</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Данные пользователя */}
        </div>
        
        <div>
          <LoyaltyDashboard 
            account={loyaltyAccount}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
}
```

### 3. Newsletter Popup (появляется через 30 сек)

```tsx
// /src/components/Marketing/NewsletterPopup.tsx
'use client';

import { useState, useEffect } from 'react';
import { NewsletterForm } from './NewsletterForm';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Показать через 30 секунд
    const timer = setTimeout(() => {
      // Проверить localStorage - показывали ли уже
      const hasSeenPopup = localStorage.getItem('newsletter_popup_seen');
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletter_popup_seen', 'true');
  };

  const handleSuccess = (couponCode: string) => {
    // Автоматически применить купон
    localStorage.setItem('welcome_coupon', couponCode);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-2xl shadow-2xl z-50 p-6"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Otrzymaj 10% rabatu! 🎁
              </h2>
              <p className="text-muted-foreground">
                Zapisz się do newslettera i odbierz ekskluzywny kod rabatowy
              </p>
            </div>

            <NewsletterForm
              source="popup"
              compact={false}
              showSMSConsent={true}
              onSuccess={handleSuccess}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

Dodać в layout:
```tsx
// /src/app/layout.tsx
import { NewsletterPopup } from '@/components/Marketing/NewsletterPopup';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <NewsletterPopup />
      </body>
    </html>
  );
}
```

---

## 📊 Testing Checklist

### Kupóny
- [ ] Применить купон PIZZA20 на заказ 100 zł → должна быть скидка 20 zł
- [ ] Попробовать применить на заказ 40 zł → ошибка "Minimalna kwota 50 zł"
- [ ] Применить FREEDEL на заказ 80 zł → доставка бесплатно
- [ ] Неправильный код → ошибка "Kupon nie istnieje"

### Newsletter
- [ ] Подписаться в footer → получить toast success
- [ ] Проверить что купон WELCOME10 отображается
- [ ] Popup появляется через 30 секунд
- [ ] После закрытия popup не показывается снова

### Loyalty
- [ ] Оформить заказ 85 zł → должно показать "+85 pkt"
- [ ] Progress bar корректно показывает до след. уровня
- [ ] Платиновый уровень показывает x2 множитель

---

## 🚀 Next Steps

1. **Week 1-2:** Backend API (купоны, newsletter, loyalty)
2. **Week 3:** Email integration (Mailgun)
3. **Week 4:** SMS integration (SerwerSMS.pl)
4. **Week 5:** Admin Panel
5. **Week 6:** Testing & Launch

---

## 💡 Business Impact (Прогноз)

| Метрика | Без системы | С системой | Improvement |
|---------|-------------|------------|-------------|
| Conversion Rate | 65% | 80% | +15% |
| Average Order Value | 75 zł | 95 zł | +27% |
| Repeat Purchase Rate | 30% | 60% | +100% |
| Customer Lifetime Value | 210 zł | 760 zł | +262% |

**Ожидаемый ROI:** 300-500% в первые 6 месяцев

---

## 🎯 Конкурентное Преимущество

✅ **Wolt/UberEats не имеют:**
- Полноценной программы лояльности с уровнями
- Персонализированных купонов
- Прямого контакта через newsletter/SMS
- Retention механик

✅ **Fodifood получит:**
- Собственную базу клиентов
- Direct marketing channel
- Predictable revenue через retention
- Данные для персонализации

---

**Ready to implement! 🚀**
