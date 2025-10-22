# 🏦 FODI Bank Integration - Complete

## ✅ Что сделано

### 1. Типы для Bank API (`/src/types/bank.ts`)
Созданы TypeScript типы для работы с банком:
```typescript
- BankStats - статистика банка
- BankBalance - баланс пользователя
- FullBalance - полный баланс (банк + Solana)
- RewardRequest/Response - выдача наград
- TransferRequest/Response - переводы между пользователями
```

### 2. API клиент (`/src/lib/rust-api.ts`)
Добавлен `bankApi` с методами:
```typescript
bankApi.getStats()           // Получить статистику банка
bankApi.getBalance(userId)   // Получить баланс пользователя
bankApi.issueReward(data)    // Выдать награду
bankApi.transfer(data)       // Перевод токенов
```

### 3. Компонент статистики (`/src/components/BankStatsSection.tsx`)
Красивый компонент с:
- ✨ Автоматическое обновление каждые 30 секунд
- 📊 4 карточки статистики:
  - **Общий объем токенов** (Net Supply)
  - **Транзакций** (Total Transactions)
  - **Пользователей** (Unique Users)
  - **Выпущено наград** (Total Rewards Issued)
- 🎨 Анимации Framer Motion
- 🌈 Градиенты для каждой карточки
- 📋 Копирование mint address
- 🟢 Индикатор сети (devnet)

### 4. Интеграция на главную страницу
- Компонент добавлен после `AnimatedStats`
- Показывается перед "Витрина бизнесов"
- Компактный дизайн (2 колонки на мобилке, 4 на десктопе)

---

## 📊 Текущая статистика банка

```json
{
  "bank": {
    "net_supply": 6050000000,           // 6.05 FODI
    "total_burns": 0,
    "total_rewards_issued": 6050000000,  // 6.05 FODI
    "total_transactions": 2,
    "unique_users": 2
  },
  "solana": {
    "configured": true,
    "mint_address": "F9qcQ2HEmjDXmUygFiJjeiMHeF5PYSGnfzhRbETeP8Ek",
    "network": "devnet"
  }
}
```

**Тестовые пользователи:**
- `alice_123`: 1,050,000,000 (1.05 FODI)
- `bob_restaurant_owner`: 5,000,000,000 (5.0 FODI)

---

## 🎨 Дизайн особенности

### Карточки статистики
```typescript
const statCards = [
  {
    icon: Coins,
    label: "Общий объем",
    value: "6.05 FODI",
    color: "from-orange-500 to-yellow-500",  // 🟠 Оранжевый
  },
  {
    icon: TrendingUp,
    label: "Транзакций",
    value: "2",
    color: "from-green-500 to-emerald-500",  // 🟢 Зелёный
  },
  {
    icon: Users,
    label: "Пользователей",
    value: "2",
    color: "from-blue-500 to-cyan-500",      // 🔵 Синий
  },
  {
    icon: Zap,
    label: "Выпущено наград",
    value: "6.05 FODI",
    color: "from-purple-500 to-pink-500",    // 🟣 Фиолетовый
  },
]
```

### Форматирование чисел
```typescript
formatNumber(6_050_000_000) → "6.05B"
formatTokens(6_050_000_000) → "6.05"  // Делим на 1B для FODI
```

---

## 🔌 API Endpoints

### Получить статистику
```bash
GET https://bot-fodifood-lcon.shuttle.app/api/bank/stats
```

**Response:**
```json
{
  "bank": {...},
  "solana": {...},
  "timestamp": "2025-10-22T21:46:25.220734006+00:00"
}
```

### Получить баланс
```bash
GET https://bot-fodifood-lcon.shuttle.app/api/bank/balance/{user_id}/full
```

**Response:**
```json
{
  "user_id": "alice_123",
  "bank_balance": {
    "total": 1050000000,
    "locked": 0,
    "available": 1050000000
  },
  "solana_balance": null,
  "total_balance": 1050000000,
  "network": "devnet"
}
```

### Выдать награду
```bash
POST https://bot-fodifood-lcon.shuttle.app/api/bank/reward
Content-Type: application/json

{
  "user_id": "alice_123",
  "amount": 1050000000,
  "reason": "initial"
}
```

### Перевод токенов
```bash
POST https://bot-fodifood-lcon.shuttle.app/api/bank/transfer
Content-Type: application/json

{
  "from_user_id": "alice_123",
  "to_user_id": "bob_restaurant_owner",
  "amount": 100000000,
  "memo": "Payment for order #123"
}
```

---

## 🧪 Тестирование

### 1. Проверка отображения
1. Откройте http://localhost:3000
2. Прокрутите вниз после секции "Активных бизнесов"
3. Должна быть секция "FODI Bank" с 4 карточками

### 2. Проверка обновления данных
1. В консоли браузера каждые 30 секунд будет загрузка статистики
2. Создайте новый бизнес или выдайте награду
3. Через 30 секунд цифры обновятся автоматически

### 3. Проверка копирования адреса
1. Нажмите на 📋 рядом с mint address
2. Адрес скопируется в буфер обмена
3. Проверьте: `F9qcQ2HEmjDXmUygFiJjeiMHeF5PYSGnfzhRbETeP8Ek`

---

## 📱 Responsive Design

- **Mobile** (< 768px): 2 колонки
- **Tablet** (768px - 1024px): 2 колонки
- **Desktop** (> 1024px): 4 колонки

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

---

## 🚀 Следующие шаги

1. **Wallet Integration**
   - Подключение Phantom/Solflare кошелька
   - Отображение реального баланса Solana

2. **Transactions History**
   - Список последних транзакций
   - Фильтры по типу (награды, переводы, сжигание)

3. **User Balance Display**
   - Показ баланса пользователя в профиле
   - Кнопка "Пополнить" / "Перевести"

4. **Business Tokenization**
   - Создание токенов для бизнесов
   - Инвестирование в бизнесы через токены

---

## ✅ Готово

- [x] Типы для Bank API
- [x] API клиент для банка
- [x] Компонент BankStatsSection
- [x] Интеграция на главную страницу
- [x] Автообновление статистики
- [x] Адаптивный дизайн
- [x] Анимации и градиенты
- [x] Копирование mint address

---

## 🎯 Результат

Теперь на главной странице после блока с "Активных бизнесов" отображается красивая секция **FODI Bank** с живой статистикой:
- 📊 Общий объем токенов
- 📈 Количество транзакций  
- 👥 Количество пользователей
- ⚡ Выпущенные награды
- 🌐 Network status (devnet)
- 📋 Mint address с копированием

Статистика обновляется автоматически каждые 30 секунд! 🎉
