# 🎫 KUPÓNY JEDNORAZOWE - Live Demo

## ✅ Что изменилось

### ДО (многоразовые):
```
❌ Купон PIZZA20 можно было использовать бесконечно
❌ Пользователь мог удалить и применить снова
❌ Никакого контроля использования
```

### ПОСЛЕ (одноразовые):
```
✅ Каждый купон можно использовать только ОДИН раз
✅ После применения сохраняется в localStorage
✅ Повторное использование блокируется
✅ Визуальная индикация использованных купонов
✅ Dev режим: кнопка сброса для тестирования
```

---

## 🎨 UI/UX Изменения

### 1. Quick Buttons - До использования

```
┌─────────────────────────────────────────┐
│  Masz kupon?                            │
├─────────────────────────────────────────┤
│  [Input]              [Zastosuj]        │
│                                         │
│  [PIZZA20] [WELCOME10] [FREEDEL]       │
│   🟦 Dostępny                            │
└─────────────────────────────────────────┘
```

### 2. Quick Buttons - После использования PIZZA20

```
┌─────────────────────────────────────────┐
│  Masz kupon?                            │
├─────────────────────────────────────────┤
│  [Input]              [Zastosuj]        │
│                                         │
│  [PIZZA20 ✓] [WELCOME10] [FREEDEL]     │
│   🔘 Użyty    🟦 Dostępny              │
└─────────────────────────────────────────┘
```

**Стиль использованного купона:**
- ~~Przekreślony tekst~~
- Opacity 50%
- Disabled (nie кликабельный)
- Checkmark ✓

---

## 🧪 Тестовые сценарии

### Сценарий 1: Первое использование

**Шаги:**
1. Открой корзину с товарами 50+ zł
2. Увидишь кнопки: `[PIZZA20] [WELCOME10] [FREEDEL]`
3. Нажми на **PIZZA20**
4. Автоматически заполнится input
5. Нажми **"Zastosuj"**
6. ⏳ 800ms валидация...
7. ✅ **Успех!** Зеленая плашка с купоном
8. 💰 Цена пересчитана: 85 zł → 68 zł

**localStorage после:**
```json
{
  "used_coupons": ["PIZZA20"]
}
```

---

### Сценарий 2: Попытка повторного использования

**Шаги:**
1. Нажми **X** чтобы удалить купон
2. Попробуй ввести **PIZZA20** снова
3. Нажми **"Zastosuj"**
4. ⏳ Валидация...
5. ❌ **Ошибка:** "Ten kupon został już wykorzystany"

**Визуально:**
```
┌──────────────────────────────────────┐
│ ⚠️ Ten kupon został już wykorzystany│
└──────────────────────────────────────┘
```

**Quick button теперь:**
```
[PIZZA20 ✓]  ← Серый, disabled, ~~зачеркнутый~~
```

---

### Сценарий 3: Использование других купонов

**Шаги:**
1. PIZZA20 уже использован ✓
2. Можешь использовать **WELCOME10** ✅
3. После применения localStorage:
```json
{
  "used_coupons": ["PIZZA20", "WELCOME10"]
}
```

**Quick buttons теперь:**
```
[PIZZA20 ✓]  [WELCOME10 ✓]  [FREEDEL]
   disabled      disabled     активный
```

---

### Сценарий 4: Все купоны использованы

**Состояние:**
```json
{
  "used_coupons": ["PIZZA20", "WELCOME10", "FREEDEL"]
}
```

**UI:**
```
┌─────────────────────────────────────────┐
│  Masz kupon?                            │
├─────────────────────────────────────────┤
│  [Input]              [Zastosuj]        │
│                                         │
│  [PIZZA20 ✓] [WELCOME10 ✓] [FREEDEL ✓]│
│   Wszystkie kupony wykorzystane         │
└─────────────────────────────────────────┘
```

---

## 🔧 DEV MODE - Сброс купонов

### Только в development режиме!

**Увидишь кнопку:**
```
🔄 Reset kuponów (DEV)
```

**При клике:**
1. `localStorage.removeItem('used_coupons')`
2. Страница перезагружается
3. Все купоны снова доступны! ✅

---

## 🎯 Live Testing

### Шаг 1: Запусти приложение
```bash
npm run dev
```

### Шаг 2: Открой браузер
```
http://localhost:3000
```

### Шаг 3: Добавь товары
- Минимум 50 zł для PIZZA20
- Или 80 zł для FREEDEL

### Шаг 4: Открой корзину
- Scroll вниз до "Masz kupon?"

### Шаг 5: Попробуй купоны

**Test 1: PIZZA20**
```
Input: PIZZA20
Click: Zastosuj
Result: ✅ "20% zniżki - oszczędzasz X zł"
localStorage: ["PIZZA20"]
```

**Test 2: Повтор PIZZA20**
```
Input: PIZZA20
Click: Zastosuj
Result: ❌ "Ten kupon został już wykorzystany"
```

**Test 3: WELCOME10**
```
Input: WELCOME10
Click: Zastosuj
Result: ✅ "10% zniżki"
localStorage: ["PIZZA20", "WELCOME10"]
```

### Шаг 6: Проверь localStorage
```javascript
// Открой DevTools (F12) → Console
localStorage.getItem('used_coupons')
// => '["PIZZA20","WELCOME10"]'
```

### Шаг 7: Сброс (для повторного теста)
```javascript
// Console
localStorage.removeItem('used_coupons')
// Или нажми "🔄 Reset kuponów (DEV)"
```

---

## 📊 Visual States

### State 1: Начальное состояние
```
┌───────────────────────┐
│ [PIZZA20]            │ ← Синий, активный
│  Kliknij aby użyć    │
└───────────────────────┘
```

### State 2: Наведение мыши
```
┌───────────────────────┐
│ [PIZZA20]            │ ← Темнее синий
│  Kliknij aby użyć    │
└───────────────────────┘
```

### State 3: Использован
```
┌───────────────────────┐
│ [~~PIZZA20~~ ✓]      │ ← Серый, зачеркнут
│  Kupon już użyty     │
└───────────────────────┘
```

---

## 🔒 Защита от обмана

### Что блокирует:

✅ **Повторное применение** - localStorage tracking  
✅ **Quick buttons** - визуально показывают использованные  
✅ **Валидация** - проверка перед применением  

### Что НЕ блокирует (пока):

⚠️ **Новый браузер** - можно использовать снова  
⚠️ **Incognito режим** - чистый localStorage  
⚠️ **Другое устройство** - нет синхронизации  

### Production решение:

```typescript
// Backend API с User ID tracking
POST /api/coupons/validate
{
  "code": "PIZZA20",
  "userId": "user-uuid"  // ← Привязка к аккаунту
}

// Database check:
SELECT * FROM coupon_usage 
WHERE coupon_code = 'PIZZA20' 
  AND user_id = 'user-uuid'
// Если есть → уже использован
```

---

## 💡 Примеры ошибок

### 1. Уже использован
```
⚠️ Ten kupon został już wykorzystany
```

### 2. Минимальная сумма
```
⚠️ Minimalna kwota zamówienia: 50 zł
```

### 3. Не существует
```
⚠️ Kupon nie istnieje lub wygasł
```

### 4. Истек срок (future)
```
⚠️ Ten kupon wygasł 31.12.2024
```

### 5. Только для новых (future)
```
⚠️ Ten kupon jest tylko dla nowych klientów
```

---

## 🎉 Готово!

**Все купоны теперь одноразовые!**

### Что работает:
- ✅ localStorage tracking
- ✅ Визуальная индикация (зачеркнуто + ✓)
- ✅ Блокировка повторного использования
- ✅ Dev режим с кнопкой сброса
- ✅ Quick buttons показывают статус
- ✅ Error messages на польском

### Для тестирования:
```javascript
// Сбросить все купоны
localStorage.removeItem('used_coupons')

// Или использовать кнопку в UI:
🔄 Reset kuponów (DEV)
```

**Приятного тестирования! 🚀**
