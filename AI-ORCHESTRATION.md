# 🤖 AI Orchestration - Полная интеграция

## 📋 Обзор

Система AI-оркестрации позволяет Rust backend управлять UI в реальном времени через WebSocket.

---

## 🎯 Архитектура

```
┌─────────────────────┐
│   Rust Backend      │
│   (Shuttle.rs)      │
│                     │
│  ┌───────────────┐  │
│  │ UIManager     │  │──┐
│  │ - redirect()  │  │  │
│  │ - toast()     │  │  │ WebSocket
│  │ - refresh()   │  │  │ /api/v1/insight
│  │ - update()    │  │  │
│  └───────────────┘  │  │
└─────────────────────┘  │
                         │
                         ▼
┌─────────────────────────────────────┐
│   Next.js Frontend                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ useUIEvents Hook            │   │
│  │ - Слушает WebSocket         │   │
│  │ - Обрабатывает UI события   │   │
│  │ - Диспатчит custom events   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ UI Components               │   │
│  │ - Реагируют на события      │   │
│  │ - Обновляются в real-time   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 📁 Frontend Files

### 1. `src/hooks/useUIEvents.ts`

**Основной hook для UI events:**

```typescript
export function useUIEvents() {
  // Подключается к WebSocket /api/v1/insight
  // Слушает события от Rust backend
  // Выполняет UI действия (redirect, toast, refresh)
  // Автоматическое переподключение при обрыве
}

export function useUIEventListener<T>(
  eventType: 'ui-update' | 'ui-modal',
  handler: (data: T) => void
) {
  // Подписка на конкретные UI события
  // Используется в компонентах для реакции на обновления
}
```

**Поддерживаемые события:**

| Тип события | Действие | Параметры |
|-------------|----------|-----------|
| `ui_redirect` | Перенаправление на другую страницу | `target: string` |
| `ui_toast` | Показать toast уведомление | `title, description, variant` |
| `ui_refresh` | Перезагрузить страницу | - |
| `ui_update` | Обновить данные компонента | `data: any` |
| `ui_modal` | Открыть модальное окно | `data: any` |

---

### 2. `src/app/providers.tsx` (обновлён)

```typescript
function ProvidersInner({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { isConnected } = useUIEvents(); // ✅ Подключаем UI events

  return (
    <RoleProvider user={user}>
      <BusinessProvider initialBusinessId={user?.business_id}>
        <I18nextProvider i18n={i18n}>
          {children}
          <Toaster position="top-right" richColors /> {/* ✅ Toast notifications */}
        </I18nextProvider>
      </BusinessProvider>
    </RoleProvider>
  );
}
```

---

## 🦀 Rust Backend Implementation

### 📁 `backend/src/orchestration/ui_manager.rs`

```rust
use serde_json::json;
use tokio::sync::broadcast::Sender;

#[derive(Clone)]
pub struct UIManager {
    pub broadcaster: Sender<String>,
}

impl UIManager {
    pub fn new(broadcaster: Sender<String>) -> Self {
        Self { broadcaster }
    }

    /// Перенаправить пользователя на другую страницу
    pub fn redirect(&self, path: &str) {
        let _ = self.broadcaster.send(
            json!({
                "type": "ui_redirect",
                "target": path
            })
            .to_string(),
        );
    }

    /// Показать toast уведомление
    pub fn show_toast(&self, title: &str, description: &str, variant: &str) {
        let _ = self.broadcaster.send(
            json!({
                "type": "ui_toast",
                "title": title,
                "description": description,
                "variant": variant // "success" | "error" | "warning" | "info"
            })
            .to_string(),
        );
    }

    /// Перезагрузить страницу
    pub fn refresh(&self) {
        let _ = self.broadcaster.send(
            json!({
                "type": "ui_refresh"
            })
            .to_string(),
        );
    }

    /// Обновить данные в UI (custom event)
    pub fn update_ui(&self, data: serde_json::Value) {
        let _ = self.broadcaster.send(
            json!({
                "type": "ui_update",
                "data": data
            })
            .to_string(),
        );
    }

    /// Открыть модальное окно
    pub fn show_modal(&self, modal_type: &str, data: serde_json::Value) {
        let _ = self.broadcaster.send(
            json!({
                "type": "ui_modal",
                "data": {
                    "type": modal_type,
                    "payload": data
                }
            })
            .to_string(),
        );
    }
}
```

---

### 📁 `backend/src/routes/websocket.rs`

```rust
use axum::{
    extract::{ws::WebSocket, WebSocketUpgrade, Query},
    response::IntoResponse,
};
use tokio::sync::broadcast;

#[derive(Deserialize)]
struct WsQuery {
    token: String,
    channel: Option<String>,
}

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    Query(params): Query<WsQuery>,
) -> impl IntoResponse {
    // Проверка токена
    let user = verify_token(&params.token).await?;
    
    ws.on_upgrade(move |socket| handle_socket(socket, user, params.channel))
}

async fn handle_socket(
    socket: WebSocket,
    user: User,
    channel: Option<String>,
) {
    let (tx, mut rx) = broadcast::channel::<String>(100);
    let ui_manager = UIManager::new(tx.clone());

    // Подписка на UI events
    if channel.as_deref() == Some("ui_events") {
        tokio::spawn(async move {
            while let Ok(msg) = rx.recv().await {
                if socket.send(Message::Text(msg)).await.is_err() {
                    break;
                }
            }
        });
    }

    // Пример использования
    ui_manager.show_toast(
        "Добро пожаловать!",
        &format!("Привет, {}!", user.name),
        "success"
    );
}
```

---

## 💡 Примеры использования

### 1. В компоненте (слушать обновления)

```typescript
'use client';

import { useUIEventListener } from '@/hooks/useUIEvents';

export function OrdersList() {
  useUIEventListener<{ orderId: string }>('ui-update', (data) => {
    if (data.orderId) {
      // Обновить конкретный заказ в списке
      refreshOrder(data.orderId);
    }
  });

  return <div>...</div>;
}
```

### 2. Rust → Toast после создания заказа

```rust
pub async fn create_order(
    order_data: CreateOrderDto,
    ui_manager: UIManager,
) -> Result<Order> {
    let order = db.create_order(order_data).await?;
    
    // ✅ Показать toast на frontend
    ui_manager.show_toast(
        "Заказ создан!",
        &format!("Заказ #{} успешно создан", order.id),
        "success"
    );
    
    Ok(order)
}
```

### 3. Rust → Redirect после оплаты

```rust
pub async fn process_payment(
    payment: Payment,
    ui_manager: UIManager,
) -> Result<()> {
    stripe.process(payment).await?;
    
    // ✅ Перенаправить на страницу успеха
    ui_manager.redirect("/orders?status=success");
    
    Ok(())
}
```

### 4. Rust → Обновить данные в real-time

```rust
pub async fn update_metrics(
    business_id: &str,
    ui_manager: UIManager,
) {
    let metrics = calculate_metrics(business_id).await?;
    
    // ✅ Обновить метрики на dashboard
    ui_manager.update_ui(json!({
        "type": "metrics_update",
        "businessId": business_id,
        "metrics": metrics
    }));
}
```

---

## 🔧 Настройка

### 1. Установить зависимость (если нужна)

```bash
npm install sonner
```

### 2. Обновить `.env.local`

```bash
# WebSocket для UI events
NEXT_PUBLIC_INSIGHT_WS=ws://127.0.0.1:8000/api/v1/insight
```

### 3. Проверить подключение

Откройте консоль браузера и проверьте логи:
```
✅ UI Events WebSocket connected
✅ UI Events system active
```

---

## 🎯 Преимущества

1. **Real-time UI updates** - Моментальные обновления без перезагрузки
2. **Centralized control** - Backend управляет UX логикой
3. **Auto-reconnect** - Автоматическое переподключение при обрыве
4. **Type-safe events** - TypeScript типизация всех событий
5. **Extensible** - Легко добавлять новые типы событий

---

## 🚀 Что дальше?

1. Реализовать `UIManager` в Rust backend
2. Добавить WebSocket endpoint `/api/v1/insight`
3. Интегрировать в существующие API routes
4. Создать примеры использования для каждого типа событий
5. Добавить unit тесты для UI events

---

**Статус:** ✅ Frontend готов, ожидается Rust backend  
**Дата:** 15 октября 2025  
**Версия:** 1.0.0
