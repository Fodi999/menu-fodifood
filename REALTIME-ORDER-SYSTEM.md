# 📡 Система заказов в реальном времени

## ✅ Что реализовано

### Backend (Rust + Shuttle)
- ✅ WebSocket сервер (`/api/ws`)
- ✅ Broadcast channel для pub/sub
- ✅ Автоматическая отправка аналитики при подключении
- ✅ Heartbeat (ping/pong каждые 30 секунд)
- ✅ Broadcast при создании заказа
- ✅ Автообновление статистики после заказа

### Frontend (Next.js)
- ✅ WebSocket клиент (`src/lib/websocket.ts`)
- ✅ React hook (`src/hooks/useWebSocket.ts`)
- ✅ Автоматическое переподключение
- ✅ Индикатор статуса подключения (🟢/⚪)
- ✅ Toast уведомления о новых заказах
- ✅ Автообновление дашборда

### Данные
- ✅ Меню загружается из API (без mock данных)
- ✅ Корзина автоматически очищается от старых товаров
- ✅ ID товаров валидируются (5-19)

## 🧪 Как протестировать

### 1. Очистка данных браузера
```javascript
// Откройте DevTools Console (F12) и выполните:
localStorage.removeItem('restaurant_cart');
localStorage.removeItem('fodifood_analytics');
location.reload();
```

### 2. Тест WebSocket подключения

**Откройте дашборд:**
```
https://portfolio-a4yb.shuttle.app/admin/dashboard
Login: admin
Password: admin123
```

**Проверьте в консоли:**
```
🔌 Connecting to WebSocket: wss://portfolio-a4yb.shuttle.app/api/ws
✅ WebSocket connected
📨 WebSocket message: {...}
```

**Индикатор подключения:**
- 🟢 Онлайн - WebSocket подключен
- ⚪ Офлайн - WebSocket не подключен

### 3. Тест создания заказа

**В первой вкладке:**
1. Откройте дашборд: `/admin/dashboard`
2. Проверьте что WebSocket подключен (🟢)
3. Запомните текущие счетчики

**Во второй вкладке:**
1. Откройте меню: `/menu`
2. Добавьте товары в корзину
3. Перейдите в оформление: `/checkout`
4. Заполните форму:
   - Имя: Тест
   - Телефон: +1234567890
   - Email: test@test.com
   - Адрес: Test address
   - Количество персон: 2
5. Нажмите "Оформить заказ"

**Вернитесь в первую вкладку (дашборд):**
- ✅ Должно появиться toast уведомление
- ✅ Счетчики должны обновиться
- ✅ Новый заказ появится в списке

### 4. Проверка логов

**Backend logs (Shuttle):**
```bash
cargo shuttle logs
```

Ищите:
```
📦 Received order request from: Тест
📡 Broadcasting new order via WebSocket: ORD-...
```

**Frontend logs (Console):**
```
📨 Received WS message: {
  "type": "new_order",
  "order_id": 1,
  "order_number": "ORD-...",
  "customer_name": "Тест",
  "total": "42.50"
}
```

## 🔧 Устранение проблем

### WebSocket не подключается

**Проверка URL:**
```javascript
// В консоли браузера:
const ws = new WebSocket('wss://portfolio-a4yb.shuttle.app/api/ws');
ws.onopen = () => console.log('✅ Connected');
ws.onerror = (e) => console.log('❌ Error:', e);
```

**Проверка CORS:**
- Backend должен разрешать WebSocket connections
- В `main.rs` настроен `CorsLayer::new().allow_origin(Any)`

### Заказ создается но не появляется в дашборде

**1. Проверьте что WebSocket подключен:**
```javascript
// В консоли дашборда:
console.log('Connected:', wsService.isConnected());
```

**2. Проверьте broadcast в backend:**
```rust
// В restaurant_orders.rs должно быть:
ws_state.broadcast(WsMessage::NewOrder {
    order_id: order.id,
    order_number: order.order_number.clone(),
    customer_name: order_data.customer_name.clone(),
    total: total.to_string(),
});
```

**3. Проверьте формат сообщения:**
```javascript
// Должен совпадать:
// Backend: #[serde(tag = "type", rename_all = "snake_case")]
// Frontend: type: 'new_order' | 'analytics_update' | ...
```

### Старые товары в корзине (ID > 100)

**Автоматическая очистка:**
- При загрузке `CartContext` проверяет ID
- Если находит ID > 100 → очищает корзину
- Показывает toast уведомление

**Ручная очистка:**
```javascript
localStorage.removeItem('restaurant_cart');
location.reload();
```

## 📊 WebSocket Message Types

### От сервера к клиенту:

**1. analytics_update** - Обновление статистики
```json
{
  "type": "analytics_update",
  "total_orders": 42,
  "total_revenue": "1234.56",
  "pending_orders": 5
}
```

**2. new_order** - Новый заказ создан
```json
{
  "type": "new_order",
  "order_id": 123,
  "order_number": "ORD-1733420567-1234",
  "customer_name": "Иван",
  "total": "42.50"
}
```

**3. order_status_update** - Статус заказа изменен
```json
{
  "type": "order_status_update",
  "order_id": 123,
  "order_number": "ORD-...",
  "status": "preparing"
}
```

**4. ping** - Heartbeat от сервера
```json
{
  "type": "ping"
}
```

**5. pong** - Ответ на ping
```json
{
  "type": "pong"
}
```

### От клиента к серверу:

**ping** - Heartbeat от клиента
```json
{
  "type": "ping"
}
```

## 🚀 Deployment Checklist

- [x] Backend deployed to Shuttle
- [x] WebSocket endpoint accessible
- [x] Database migrations run
- [x] Menu seeded with real data (IDs 5-19)
- [x] Frontend updated to load from API
- [x] Cart validation implemented
- [x] WebSocket broadcast on order creation
- [x] Analytics auto-update enabled

## 📝 Current Deployment

**URL:** https://portfolio-a4yb.shuttle.app  
**WebSocket:** wss://portfolio-a4yb.shuttle.app/api/ws  
**Deployment ID:** depl_01KBR4P3CPS6CYMH4QW4FS65XX

**Database:**
- Categories: 5 (Sushi, Rolls, Hot Dishes, Drinks, Desserts)
- Menu Items: 15 (IDs: 5-19)
- Orders: Dynamic

**Admin Access:**
- Username: `admin`
- Password: `admin123`

## 🎯 Next Steps

1. ✅ Test order creation flow
2. ✅ Verify WebSocket messages in console
3. ✅ Check dashboard auto-update
4. ⏳ Add order status change notifications
5. ⏳ Add sound notification for new orders
6. ⏳ Add order history in dashboard
