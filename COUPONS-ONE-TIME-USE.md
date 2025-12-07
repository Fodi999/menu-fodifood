# 🎫 Одноразовые купоны - Документация

## ✅ Реализовано

### Механизм одноразового использования

Каждый купон может быть использован **только один раз** на одном устройстве/браузере.

### Как работает:

1. **Пользователь вводит купон** → валидация
2. **Купон валиден** → сохраняется в `localStorage` как использованный
3. **Попытка повторного использования** → ошибка "Ten kupon został już wykorzystany"

---

## 🔧 Технические детали

### localStorage структура

```javascript
// Ключ: 'used_coupons'
// Значение: JSON массив использованных кодов
localStorage.getItem('used_coupons')
// => ["PIZZA20", "WELCOME10", "FREEDEL"]
```

### Функции

```typescript
// Проверить, использован ли купон
function isСouponUsed(code: string): boolean {
  const usedCoupons = localStorage.getItem('used_coupons');
  if (!usedCoupons) return false;
  
  const used: string[] = JSON.parse(usedCoupons);
  return used.includes(code);
}

// Отметить купон как использованный
function markCouponAsUsed(code: string): void {
  const usedCoupons = localStorage.getItem('used_coupons');
  let used: string[] = usedCoupons ? JSON.parse(usedCoupons) : [];
  
  if (!used.includes(code)) {
    used.push(code);
    localStorage.setItem('used_coupons', JSON.stringify(used));
  }
}
```

---

## 🧪 Тестирование

### Сценарий 1: Первое использование купона

```
1. Добавить товары в корзину (50+ zł)
2. Ввести PIZZA20
3. Нажать "Zastosuj"
4. ✅ Результат: "20% zniżki - oszczędzasz X zł"
5. localStorage: ["PIZZA20"]
```

### Сценарий 2: Повторное использование

```
1. Удалить купон (нажать X)
2. Попытаться ввести PIZZA20 снова
3. Нажать "Zastosuj"
4. ❌ Результат: "Ten kupon został już wykorzystany"
```

### Сценарий 3: Разные купоны

```
1. Использовать PIZZA20 ✅
2. Использовать WELCOME10 ✅
3. localStorage: ["PIZZA20", "WELCOME10"]
4. Попытка PIZZA20 снова → ❌ "już wykorzystany"
5. Попытка FREEDEL → ✅ (если заказ 80+ zł)
```

---

## 🔄 Сброс для тестирования

### Метод 1: Browser DevTools

```javascript
// Открыть Console (F12)
localStorage.removeItem('used_coupons')
// Или
localStorage.clear()
```

### Метод 2: Incognito/Private режим

```
Открыть новое окно инкогнито
→ localStorage пустой
→ Все купоны доступны снова
```

### Метод 3: Программный сброс (для разработки)

Добавить в компонент временную кнопку:

```tsx
// В CouponInput.tsx (только для dev)
{process.env.NODE_ENV === 'development' && (
  <button
    onClick={() => {
      localStorage.removeItem('used_coupons');
      alert('Kupony zresetowane!');
    }}
    className="text-xs text-red-500 underline"
  >
    [DEV] Reset kuponów
  </button>
)}
```

---

## 🎯 Доступные купоны

| Код | Тип | Скидка | Мин. сумма | Одноразовый |
|-----|-----|--------|------------|-------------|
| **PIZZA20** | % | 20% | 50 zł | ✅ |
| **WELCOME10** | % | 10% | 30 zł | ✅ |
| **FREEDEL** | Доставка | Бесплатно | 80 zł | ✅ |
| **FIXED15** | Фикс. | 15 zł | 100 zł | ✅ |
| **VIP50** | % | 50% | 200 zł | ✅ |

---

## 🚀 Production: Backend Integration

### Вместо localStorage использовать API:

```typescript
// POST /api/coupons/validate
{
  "code": "PIZZA20",
  "userId": "user-uuid",
  "orderTotal": 85.00
}

// Response:
{
  "valid": true,
  "coupon": {
    "code": "PIZZA20",
    "discount": 20,
    "type": "percentage",
    "message": "20% zniżki"
  },
  "alreadyUsed": false
}

// POST /api/coupons/apply (после оформления заказа)
{
  "couponCode": "PIZZA20",
  "userId": "user-uuid",
  "orderId": "order-uuid"
}
```

### Database tracking:

```sql
-- Таблица использований
CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY,
    coupon_id UUID REFERENCES coupons(id),
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    used_at TIMESTAMP DEFAULT NOW(),
    
    -- Unique constraint: один купон один раз для пользователя
    UNIQUE(coupon_id, user_id)
);

-- Проверка при валидации:
SELECT COUNT(*) 
FROM coupon_usage 
WHERE coupon_id = ? AND user_id = ?
-- Если > 0 → уже использован
```

---

## 💡 Улучшения (Future)

### 1. **Многоразовые купоны с лимитом**

```typescript
// В базе данных:
{
  code: "SUMMER2025",
  userUsageLimit: 3,  // Можно использовать 3 раза
  globalUsageLimit: 1000  // Всего 1000 использований
}
```

### 2. **Купоны с истечением**

```typescript
{
  code: "NEWYEAR",
  validFrom: "2025-12-31T00:00:00Z",
  validUntil: "2026-01-07T23:59:59Z"
}
```

### 3. **Персональные купоны**

```typescript
{
  code: "BIRTHDAY-USER123",
  userId: "user-123",  // Только для этого пользователя
  validDays: 7  // Действует 7 дней с момента создания
}
```

### 4. **Реферальные купоны**

```typescript
{
  code: "REF-JOHN",
  referrerId: "john-uuid",
  // Бонус и рефереру, и новому пользователю
  bonusForReferrer: 20,  // 20 zł для John
  bonusForReferee: 10    // 10 zł для нового пользователя
}
```

---

## 🔒 Безопасность

### Текущая реализация (localStorage):

- ✅ **Простота** - нет бэкенда
- ⚠️ **Ограничение** - можно обойти (новый браузер, incognito)
- ⚠️ **Не подходит для production** с ценными купонами

### Production рекомендации:

1. **Всегда валидировать на сервере**
2. **User ID tracking** - привязка к аккаунту
3. **IP tracking** - дополнительная проверка
4. **Rate limiting** - защита от брутфорса
5. **Audit log** - история использований

---

## 📊 Analytics

### Метрики купонов:

```typescript
// Какие данные собирать:
{
  couponCode: "PIZZA20",
  validationAttempts: 1250,  // Сколько раз пытались применить
  successfulUses: 380,       // Сколько раз успешно применили
  failedReasons: {
    "already_used": 120,
    "min_order": 450,
    "expired": 300
  },
  totalDiscount: 6840,       // Общая сумма скидок (zł)
  averageOrderValue: 95.50,
  conversionRate: 85%        // % заказов с купоном
}
```

---

**Готово! Купоны теперь одноразовые! 🎉**

Для тестирования используйте:
```javascript
localStorage.removeItem('used_coupons')
```
