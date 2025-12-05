use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::Response,
};
use bigdecimal::BigDecimal;
use futures::{sink::SinkExt, stream::StreamExt};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::sync::Arc;
use tokio::sync::broadcast;
use tracing::{error, info};

// WebSocket state shared across connections
#[derive(Clone)]
pub struct WsState {
    pub tx: broadcast::Sender<WsMessage>,
    pub pool: PgPool,
}

// Messages that can be sent over WebSocket
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum WsMessage {
    // New order notification
    NewOrder {
        order_id: i32,
        order_number: String,
        customer_name: String,
        total: String,
    },
    // Order status update
    OrderStatusUpdate {
        order_id: i32,
        order_number: String,
        status: String,
    },
    // Analytics update
    AnalyticsUpdate {
        total_orders: i64,
        total_revenue: String,
        pending_orders: i64,
    },
    // Heartbeat to keep connection alive
    Ping,
    // Response to ping
    Pong,
}

impl WsState {
    pub fn new(pool: PgPool) -> Self {
        let (tx, _rx) = broadcast::channel(100);
        Self { tx, pool }
    }

    /// Broadcast a message to all connected WebSocket clients
    pub fn broadcast(&self, message: WsMessage) {
        let _ = self.tx.send(message);
    }

    /// Send analytics update to all connected clients
    pub async fn send_analytics_update(&self) {
        match self.get_analytics().await {
            Ok(analytics) => {
                self.broadcast(analytics);
            }
            Err(e) => {
                error!("Failed to get analytics: {:?}", e);
            }
        }
    }

    /// Get current analytics from database
    async fn get_analytics(&self) -> Result<WsMessage, sqlx::Error> {
        // Get total orders
        let total_orders: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM orders")
            .fetch_one(&self.pool)
            .await
            .unwrap_or(0);

        // Get total revenue
        let total_revenue: Option<BigDecimal> = 
            sqlx::query_scalar("SELECT COALESCE(SUM(total), 0) FROM orders")
                .fetch_one(&self.pool)
                .await
                .ok();

        // Get pending orders
        let pending_orders: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM orders WHERE status = 'pending'")
            .fetch_one(&self.pool)
            .await
            .unwrap_or(0);

        Ok(WsMessage::AnalyticsUpdate {
            total_orders,
            total_revenue: total_revenue.unwrap_or_default().to_string(),
            pending_orders,
        })
    }
}

/// WebSocket upgrade handler
pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<WsState>>,
) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

/// Handle individual WebSocket connection
async fn handle_socket(socket: WebSocket, state: Arc<WsState>) {
    let (mut sender, mut receiver) = socket.split();

    // Subscribe to broadcast channel
    let mut rx = state.tx.subscribe();

    // Task to send messages from broadcast channel to client
    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            // Serialize message to JSON
            if let Ok(json) = serde_json::to_string(&msg) {
                if sender.send(Message::Text(json.into())).await.is_err() {
                    break;
                }
            }
        }
    });

    // Task to receive messages from client
    let tx = state.tx.clone();
    let pool = state.pool.clone();
    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(text))) = receiver.next().await {
            // Handle incoming messages
            if let Ok(msg) = serde_json::from_str::<WsMessage>(&text) {
                match msg {
                    WsMessage::Ping => {
                        // Respond with Pong
                        let _ = tx.send(WsMessage::Pong);
                    }
                    _ => {
                        info!("Received WebSocket message: {:?}", msg);
                    }
                }
            }
        }
    });

    // Send initial analytics when client connects
    tokio::spawn({
        let state = state.clone();
        async move {
            tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
            state.send_analytics_update().await;
        }
    });

    // Heartbeat task - send ping every 30 seconds
    let tx_heartbeat = state.tx.clone();
    let mut heartbeat_task = tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(30));
        loop {
            interval.tick().await;
            if tx_heartbeat.send(WsMessage::Ping).is_err() {
                break;
            }
        }
    });

    // Wait for any task to finish
    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
        _ = (&mut heartbeat_task) => {
            send_task.abort();
            recv_task.abort();
        }
    }

    info!("WebSocket connection closed");
}
