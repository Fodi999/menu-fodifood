# 🚀 Checkout Enhancements - Sposób Dostawy i Płatności

## ✅ Co zostało dodane

### 1. **Wybór sposobu dostawy (Dostawa / Odbiór osobisty)**

```tsx
<DeliveryMethodSelector
  onChange={(options) => {
    console.log('Delivery method:', options.method); // 'delivery' | 'pickup'
    console.log('Delivery time:', options.time); // 'asap' | 'scheduled'
    console.log('Scheduled date:', options.scheduledDate); // '2025-12-07'
    console.log('Scheduled time:', options.scheduledTime); // '18:30'
  }}
/>
```

#### Funkcje:
- ✅ **Dostawa** - 30-45 minut, z kalkulatorem adresu
- ✅ **Odbiór osobisty** - 20-30 minut, adres restauracji
- ✅ **Wybór czasu**:
  - Jak najszybciej (ASAP)
  - Zaplanuj czas (data + godzina)
- ✅ Walidacja godzin otwarcia (11:00 - 22:00)
- ✅ Animowane przejścia między opcjami
- ✅ Visual feedback (ikony, kolory, checkmark)

---

### 2. **Wybór sposobu płatności (BLIK / Karta / Przelewy24 / Gotówka)**

```tsx
<PaymentMethodSelector
  onChange={(method) => {
    console.log('Payment method:', method); // 'blik' | 'card' | 'p24' | 'cash'
  }}
  deliveryMethod="pickup" // cash dostępna tylko przy pickup
/>
```

#### Dostępne metody płatności:

##### 🔵 **BLIK**
- Szybka płatność mobilna (6-cyfrowy kod)
- Instrukcja krok po kroku dla użytkownika
- Najszybsza metoda w Polsce

##### 💳 **Karta płatnicza (Stripe)**
- Visa, Mastercard, Maestro
- Apple Pay, Google Pay
- Płatności jednym kliknięciem (po zapisaniu karty)
- Bezpieczne 3D Secure

##### 🏦 **Przelewy24**
- Szybkie przelewy bankowe
- mBank, ING, PKO BP, Santander, Alior, Millennium, Pekao SA
- Szeroki wybór polskich banków

##### 💵 **Gotówka** (tylko przy odbiorze osobistym)
- Płatność przy odbiorze w restauracji
- Automatycznie ukryta przy dostawie

---

## 🎨 Visual Design

### Delivery Method Selector

```
┌─────────────────────────────────────────────────┐
│ Sposób dostawy                                  │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐          │
│  │   🚴 Dostawa │    │  🏪 Odbiór   │          │
│  │   30-45 min  │    │   20-30 min  │   ●      │
│  └──────────────┘    └──────────────┘          │
│                                                 │
│  📍 Fodifood Restaurant                         │
│     ul. Marszałkowska 123, 00-001 Warszawa     │
│     Pn-Nd: 11:00 - 22:00                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Czas dostawy                                    │
├─────────────────────────────────────────────────┤
│  🕐 Jak najszybciej                      ●      │
│     30-45 minut                                 │
├─────────────────────────────────────────────────┤
│  🕐 Zaplanuj czas                               │
│     Wybierz datę i godzinę                      │
│                                                 │
│     Data: [2025-12-07]  Godzina: [18:30]       │
│     ⏰ Godziny otwarcia: 11:00 - 22:00          │
└─────────────────────────────────────────────────┘
```

### Payment Method Selector

```
┌─────────────────────────────────────────────────┐
│ Sposób płatności                                │
├─────────────────────────────────────────────────┤
│  📱 BLIK                           [BLIK]  ●    │
│     Szybka płatność mobilna                     │
│                                                 │
│     Jak zapłacić BLIK?                          │
│     1. Otwórz aplikację bankową                 │
│     2. Wygeneruj kod BLIK (6 cyfr)              │
│     3. Wpisz kod na następnej stronie           │
│     4. Potwierdź płatność w aplikacji           │
├─────────────────────────────────────────────────┤
│  💳 Karta płatnicza           [MC] [VISA]       │
│     Visa, Mastercard, Apple Pay                 │
├─────────────────────────────────────────────────┤
│  🏦 Przelewy24                      [P24]       │
│     Szybkie przelewy bankowe                    │
├─────────────────────────────────────────────────┤
│  💵 Gotówka (tylko przy odbiorze)               │
│     Płatność przy odbiorze                      │
├─────────────────────────────────────────────────┤
│  🔒 Bezpieczna płatność                         │
│     Wszystkie transakcje są szyfrowane          │
└─────────────────────────────────────────────────┘
```

---

## 📝 Integracja w Cart.tsx

### Stan komponentu

```tsx
const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('blik');
```

### Logika cen

```tsx
// Dostawa = 0 PLN przy samowyvozе
const deliveryPrice = deliveryMethod === 'pickup' 
  ? 0 
  : (isFreeDeliveryFromCoupon 
      ? 0 
      : (deliveryInfo?.isFree ? 0 : (deliveryInfo?.finalPrice || 10))
    );
```

### Renderowanie

```tsx
{/* 1. Wybór sposobu dostawy i czasu */}
<DeliveryMethodSelector
  onChange={(options) => setDeliveryMethod(options.method)}
/>

{/* 2. Kalkulator dostawy - TYLKO dla dostawy */}
{deliveryMethod === 'delivery' && (
  <DeliveryCalculator 
    orderTotal={totalPrice}
    onDeliveryChange={(delivery) => setDeliveryInfo(delivery)}
  />
)}

{/* 3. Kupony */}
<CouponInput ... />

{/* 4. Wybór płatności */}
<PaymentMethodSelector
  onChange={(method) => setPaymentMethod(method)}
  deliveryMethod={deliveryMethod} // cash tylko przy pickup
/>
```

---

## 🧪 Testowanie

### Scenariusz 1: Dostawa ASAP + BLIK
1. Wybierz "Dostawa" (30-45 min)
2. Wybierz "Jak najszybciej"
3. Wprowadź kod pocztowy w kalkulatorze
4. Wybierz "BLIK"
5. Sprawdź cenę dostawy w podsumowaniu

**Oczekiwany wynik:**
- Dostawa: 10 zł (lub za darmo przy progu)
- Płatność: BLIK
- Czas: 30-45 minut

### Scenariusz 2: Odbiór zaplanowany + Gotówka
1. Wybierz "Odbiór osobisty" (20-30 min)
2. Wybierz "Zaplanuj czas"
3. Data: jutro, Godzina: 18:30
4. Wybierz "Gotówka"
5. Sprawdź podsumowanie

**Oczekiwany wynik:**
- Dostawa: "Odbiór osobisty" (0 zł)
- Płatność: Gotówka przy odbiorze
- Czas: jutro 18:30
- Adres restauracji widoczny

### Scenariusz 3: Dostawa + Kupon free delivery + Karta
1. Wybierz "Dostawa"
2. Zastosuj kupon "FREEDEL"
3. Wybierz "Karta płatnicza"
4. Sprawdź podsumowanie

**Oczekiwany wynik:**
- Dostawa: "Za darmo (kupon)"
- Płatność: Visa/Mastercard
- Oszczędność: 10 zł

---

## 🔄 Flow użytkownika

### Krok 1: Koszyk
```
Produkty (3): 89.50 zł
[Wybierz sposób dostawy] ← NOWY
```

### Krok 2: Dostawa
```
● Dostawa (30-45 min)
○ Odbiór osobisty (20-30 min)

Czas dostawy:
● Jak najszybciej
○ Zaplanuj czas
```

### Krok 3: Adres (jeśli dostawa)
```
Kod pocztowy: [00-123]
Ulica: [Marszałkowska 12]
Dostawa: 8 zł
```

### Krok 4: Kupon (opcjonalnie)
```
Kupon: [PIZZA20] [Zastosuj]
Rabat: -17.90 zł ✓
```

### Krok 5: Płatność
```
● BLIK
○ Karta płatnicza
○ Przelewy24
○ Gotówka (tylko pickup)
```

### Krok 6: Podsumowanie
```
Produkty: 89.50 zł
Rabat: -17.90 zł
Dostawa: 8.00 zł (lub 0 zł przy pickup)
─────────────────
Razem: 79.60 zł

[Złóż zamówienie] →
```

---

## 🔧 Backend TODO

### 1. Delivery Options Endpoint

```rust
#[derive(Serialize, Deserialize)]
struct DeliveryOptions {
    method: String, // "delivery" | "pickup"
    time: String,   // "asap" | "scheduled"
    scheduled_date: Option<String>, // "2025-12-07"
    scheduled_time: Option<String>, // "18:30"
}

#[post("/api/orders")]
async fn create_order(
    order: Json<CreateOrderRequest>,
) -> Result<Json<Order>> {
    // Валидация времени доставки
    if order.delivery_options.time == "scheduled" {
        validate_scheduled_time(
            &order.delivery_options.scheduled_date,
            &order.delivery_options.scheduled_time,
        )?;
    }
    
    // ...
}
```

### 2. Payment Integration

#### BLIK (Przelewy24 API)
```rust
async fn process_blik_payment(
    amount: i32,
    blik_code: String,
) -> Result<PaymentResult> {
    let client = reqwest::Client::new();
    let response = client
        .post("https://secure.przelewy24.pl/api/v1/transaction/register")
        .json(&json!({
            "merchantId": env::var("P24_MERCHANT_ID")?,
            "posId": env::var("P24_POS_ID")?,
            "sessionId": generate_session_id(),
            "amount": amount, // в грошах (8950 = 89.50 zł)
            "currency": "PLN",
            "description": "Zamówienie Fodifood",
            "method": 181, // BLIK method ID
            "blikCode": blik_code,
        }))
        .send()
        .await?;
    
    // ...
}
```

#### Stripe (karty)
```rust
use stripe::{Client, CreatePaymentIntent, Currency, PaymentIntent};

async fn process_card_payment(
    amount: i64,
) -> Result<PaymentIntent> {
    let client = Client::new(env::var("STRIPE_SECRET_KEY")?);
    
    let intent = PaymentIntent::create(
        &client,
        CreatePaymentIntent {
            amount, // в centach (8950 = 89.50 zł)
            currency: Currency::PLN,
            payment_method_types: Some(vec!["card", "apple_pay", "google_pay"]),
            ..Default::default()
        },
    )
    .await?;
    
    Ok(intent)
}
```

#### Przelewy24
```rust
async fn process_p24_payment(
    amount: i32,
    email: String,
) -> Result<String> {
    // Zwraca URL do przekierowania
    let payment_url = format!(
        "https://secure.przelewy24.pl/trnRequest/{}",
        transaction_token
    );
    
    Ok(payment_url)
}
```

### 3. Database Schema

```sql
-- Rozszerz tabelę orders
ALTER TABLE orders ADD COLUMN delivery_method VARCHAR(20) DEFAULT 'delivery';
ALTER TABLE orders ADD COLUMN delivery_time VARCHAR(20) DEFAULT 'asap';
ALTER TABLE orders ADD COLUMN scheduled_date DATE;
ALTER TABLE orders ADD COLUMN scheduled_time TIME;
ALTER TABLE orders ADD COLUMN payment_method VARCHAR(20) DEFAULT 'blik';
ALTER TABLE orders ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN payment_transaction_id VARCHAR(100);

-- Index dla szybkiego wyszukiwania zaplanowanych zamówień
CREATE INDEX idx_orders_scheduled ON orders(scheduled_date, scheduled_time) 
WHERE delivery_time = 'scheduled';
```

---

## 📊 Analytics Events

```typescript
// Google Analytics / Mixpanel
trackEvent('delivery_method_selected', {
  method: 'pickup', // or 'delivery'
  time: 'scheduled', // or 'asap'
  scheduled_date: '2025-12-07',
  scheduled_time: '18:30',
});

trackEvent('payment_method_selected', {
  method: 'blik', // or 'card', 'p24', 'cash'
  order_total: 89.50,
  delivery_method: 'pickup',
});

trackEvent('order_completed', {
  delivery_method: 'pickup',
  payment_method: 'blik',
  total: 89.50,
  scheduled: true,
});
```

---

## 🎯 Kluczowe usprawnienia

### 1. **UX Improvements**
- ✅ Visual feedback dla każdej opcji
- ✅ Ikony + kolory dla łatwej identyfikacji
- ✅ Informacje kontekstowe (czas, adres, instrukcje)
- ✅ Animowane przejścia
- ✅ Walidacja godzin otwarcia

### 2. **Business Logic**
- ✅ Dostawa = 0 zł przy samowyvozе
- ✅ Gotówka tylko przy odbiorze osobistym
- ✅ Kalkulator adresu tylko dla dostawy
- ✅ Różne czasy dla delivery/pickup (45 min vs 30 min)

### 3. **Security**
- ✅ SSL encryption info
- ✅ Payment provider badges (BLIK, Visa, Mastercard, P24)
- ✅ Bezpieczna ikona przy metodach płatności

---

## 🚀 Następne kroki

1. **Backend API** (1-2 tygodnie):
   - Integracja BLIK (Przelewy24)
   - Integracja Stripe
   - Walidacja scheduled time
   - Webhook handlers dla płatności

2. **Testing** (3-5 dni):
   - Unit tests dla logiki cen
   - E2E tests dla flow zamówienia
   - Payment sandbox testing

3. **Production** (1 tydzień):
   - Konfiguracja Przelewy24 (sandbox → production)
   - Konfiguracja Stripe (test → live keys)
   - SSL certificates
   - Monitoring płatności

---

## 📞 Support

Jeśli masz pytania:
1. Sprawdź console.log w `DeliveryMethodSelector` - loguje wszystkie zmiany
2. Sprawdź `paymentMethod` state w Cart.tsx
3. Testuj w DEV mode z mock payments

**Gotowe do testowania!** 🎉
