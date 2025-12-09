use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Json, Response},
};
use sqlx::PgPool;
use chrono::Utc;
use bigdecimal::{BigDecimal, FromPrimitive};
use std::sync::Arc;

use crate::error::AppError;
use crate::models::restaurant::{Order, OrderItem, OrderWithItems, CreateOrder, UpdateOrderStatus};
use crate::websocket::{WsState, WsMessage};

// Generate unique order number
fn generate_order_number() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let timestamp = Utc::now().timestamp();
    let random: u32 = rng.gen_range(1000..9999);
    format!("ORD-{}-{}", timestamp, random)
}

// Create order (Public)
pub async fn create_order(
    State((pool, ws_state)): State<(PgPool, Arc<WsState>)>,
    Json(order_data): Json<CreateOrder>,
) -> Result<Response, AppError> {
    tracing::info!("📦 Received order request from: {}", order_data.customer_name);
    tracing::info!("📦 Number of items: {}", order_data.items.len());
    
    // Validate that order has items
    if order_data.items.is_empty() {
        tracing::error!("❌ Order has no items");
        return Err(AppError::Validation("Order must contain at least one item".to_string()));
    }
    
    // Start transaction
    let mut tx = pool.begin().await?;

    // Calculate totals
    let mut subtotal = BigDecimal::from_f64(0.0).unwrap();
    let delivery_fee = BigDecimal::from_f64(10.0).unwrap(); // TODO: Get from restaurant_info
    let tax = BigDecimal::from_f64(0.0).unwrap(); // TODO: Calculate based on country

    // Verify all items exist and calculate subtotal
    for item in &order_data.items {
        tracing::info!("🔍 Checking menu item ID: {}", item.menu_item_id);
        
        let menu_item = sqlx::query!(
            r#"
            SELECT price, is_available
            FROM menu_items
            WHERE id = $1
            "#,
            item.menu_item_id
        )
        .fetch_optional(&mut *tx)
        .await?;

        let menu_item = menu_item.ok_or_else(|| {
            tracing::error!("❌ Menu item not found in validation: ID {}", item.menu_item_id);
            AppError::NotFound(format!("Menu item with ID {} not found", item.menu_item_id))
        })?;

        if !menu_item.is_available.unwrap_or(false) {
            return Err(AppError::BadRequest(format!(
                "Menu item {} is not available",
                item.menu_item_id
            )));
        }

        let item_price = &menu_item.price;
        let item_total = item_price * BigDecimal::from_i32(item.quantity).unwrap();
        subtotal += item_total;
    }

    let total = &subtotal + &delivery_fee + &tax;

    // Create order
    let order_number = generate_order_number();
    let order = sqlx::query_as!(
        Order,
        r#"
        INSERT INTO orders (
            order_number, customer_name, customer_phone, customer_email,
            delivery_street, delivery_building, delivery_apartment, delivery_floor,
            delivery_entrance, delivery_intercom, delivery_city, delivery_postal_code,
            delivery_country, subtotal, delivery_fee, tax, total, payment_method,
            special_instructions, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'pending')
        RETURNING id, order_number, customer_name, customer_phone, customer_email,
                  delivery_street, delivery_building, delivery_apartment, delivery_floor,
                  delivery_entrance, delivery_intercom, delivery_city, delivery_postal_code,
                  delivery_country, delivery_lat, delivery_lng,
                  subtotal, delivery_fee, tax, total, payment_method, status,
                  special_instructions, delivery_time, created_at, updated_at, completed_at
        "#,
        order_number,
        order_data.customer_name,
        order_data.customer_phone,
        order_data.customer_email,
        order_data.delivery_street,
        order_data.delivery_building,
        order_data.delivery_apartment,
        order_data.delivery_floor,
        order_data.delivery_entrance,
        order_data.delivery_intercom,
        order_data.delivery_city,
        order_data.delivery_postal_code,
        order_data.delivery_country.unwrap_or_else(|| "Poland".to_string()),
        subtotal,
        delivery_fee,
        tax,
        total,
        order_data.payment_method,
        order_data.special_instructions
    )
    .fetch_one(&mut *tx)
    .await?;

    // Create order items
    let mut items = Vec::new();
    for item_data in order_data.items {
        let menu_item = sqlx::query!(
            r#"
            SELECT name, price
            FROM menu_items
            WHERE id = $1
            "#,
            item_data.menu_item_id
        )
        .fetch_optional(&mut *tx)
        .await?;

        // Check if menu item exists
        let menu_item = menu_item.ok_or_else(|| {
            tracing::error!("Menu item not found: {}", item_data.menu_item_id);
            AppError::NotFound(format!("Menu item with ID {} not found", item_data.menu_item_id))
        })?;

        let order_item = sqlx::query_as!(
            OrderItem,
            r#"
            INSERT INTO order_items (
                order_id, menu_item_id, menu_item_name, menu_item_price, 
                quantity, special_instructions
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, order_id, menu_item_id, menu_item_name, menu_item_price,
                      quantity, special_instructions, created_at
            "#,
            order.id,
            item_data.menu_item_id,
            menu_item.name,
            menu_item.price,
            item_data.quantity,
            item_data.special_instructions
        )
        .fetch_one(&mut *tx)
        .await?;

        items.push(order_item);
    }

    // Commit transaction
    tx.commit().await?;

    // Broadcast new order via WebSocket
    tracing::info!("📡 Broadcasting new order via WebSocket: {}", order.order_number);
    ws_state.broadcast(WsMessage::NewOrder {
        order_id: order.id,
        order_number: order.order_number.clone(),
        customer_name: order_data.customer_name.clone(),
        total: total.to_string(),
    });
    
    // Send updated analytics
    tokio::spawn({
        let ws_state = ws_state.clone();
        async move {
            ws_state.send_analytics_update().await;
        }
    });

    let order_with_items = OrderWithItems {
        order,
        items,
    };

    Ok((StatusCode::CREATED, Json(order_with_items)).into_response())
}

// Get order by ID (Public - with order number verification)
pub async fn get_order(
    State(pool): State<PgPool>,
    Path(order_number): Path<String>,
) -> Result<Json<OrderWithItems>, AppError> {
    let order = sqlx::query_as!(
        Order,
        r#"
        SELECT id, order_number, customer_name, customer_phone, customer_email,
               delivery_street, delivery_building, delivery_apartment, delivery_floor,
               delivery_entrance, delivery_intercom, delivery_city, delivery_postal_code,
               delivery_country, delivery_lat, delivery_lng,
               subtotal, delivery_fee, tax, total, payment_method, status,
               special_instructions, delivery_time, created_at, updated_at, completed_at
        FROM orders
        WHERE order_number = $1
        "#,
        order_number
    )
    .fetch_one(&pool)
    .await?;

    let items = sqlx::query_as!(
        OrderItem,
        r#"
        SELECT id, order_id, menu_item_id, menu_item_name, menu_item_price,
               quantity, special_instructions, created_at
        FROM order_items
        WHERE order_id = $1
        "#,
        order.id
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(OrderWithItems { order, items }))
}

// Get all orders - Admin only
pub async fn get_all_orders(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<OrderWithItems>>, AppError> {
    // Fetch all orders
    let orders = sqlx::query_as!(
        Order,
        r#"
        SELECT id, order_number, customer_name, customer_phone, customer_email,
               delivery_street, delivery_building, delivery_apartment, delivery_floor,
               delivery_entrance, delivery_intercom, delivery_city, delivery_postal_code,
               delivery_country, delivery_lat, delivery_lng,
               subtotal, delivery_fee, tax, total, payment_method, status,
               special_instructions, delivery_time, created_at, updated_at, completed_at
        FROM orders
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(&pool)
    .await?;

    // Fetch items for each order
    let mut orders_with_items = Vec::new();
    for order in orders {
        let items = sqlx::query_as!(
            OrderItem,
            r#"
            SELECT id, order_id, menu_item_id, menu_item_name, menu_item_price,
                   quantity, special_instructions, created_at
            FROM order_items
            WHERE order_id = $1
            "#,
            order.id
        )
        .fetch_all(&pool)
        .await?;

        orders_with_items.push(OrderWithItems { order, items });
    }

    Ok(Json(orders_with_items))
}

// Get order by ID with items - Admin only
pub async fn get_order_by_id(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<OrderWithItems>, AppError> {
    let order = sqlx::query_as!(
        Order,
        r#"
        SELECT id, order_number, customer_name, customer_phone, customer_email,
               delivery_street, delivery_building, delivery_apartment, delivery_floor,
               delivery_entrance, delivery_intercom, delivery_city, delivery_postal_code,
               delivery_country, delivery_lat, delivery_lng,
               subtotal, delivery_fee, tax, total, payment_method, status,
               special_instructions, delivery_time, created_at, updated_at, completed_at
        FROM orders
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(&pool)
    .await?;

    let items = sqlx::query_as!(
        OrderItem,
        r#"
        SELECT id, order_id, menu_item_id, menu_item_name, menu_item_price,
               quantity, special_instructions, created_at
        FROM order_items
        WHERE order_id = $1
        "#,
        order.id
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(OrderWithItems { order, items }))
}

// Update order status - Admin only
pub async fn update_order_status(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    Json(status_data): Json<UpdateOrderStatus>,
) -> Result<Json<Order>, AppError> {
    // Validate status
    let valid_statuses = vec!["pending", "confirmed", "preparing", "ready", "delivering", "delivered", "cancelled"];
    if !valid_statuses.contains(&status_data.status.as_str()) {
        return Err(AppError::BadRequest(format!(
            "Invalid status. Must be one of: {}",
            valid_statuses.join(", ")
        )));
    }

    let completed_at = if status_data.status == "delivered" || status_data.status == "cancelled" {
        Some(Utc::now())
    } else {
        None
    };

    let order = sqlx::query_as!(
        Order,
        r#"
        UPDATE orders
        SET status = $2, completed_at = $3
        WHERE id = $1
        RETURNING id, order_number, customer_name, customer_phone, customer_email,
                  delivery_street, delivery_building, delivery_apartment, delivery_floor,
                  delivery_entrance, delivery_intercom, delivery_city, delivery_postal_code,
                  delivery_country, delivery_lat, delivery_lng,
                  subtotal, delivery_fee, tax, total, payment_method, status,
                  special_instructions, delivery_time, created_at, updated_at, completed_at
        "#,
        id,
        status_data.status,
        completed_at
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(order))
}

// Cancel order - Admin only
pub async fn cancel_order(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<Order>, AppError> {
    let order = sqlx::query_as!(
        Order,
        r#"
        UPDATE orders
        SET status = 'cancelled', completed_at = NOW()
        WHERE id = $1
        RETURNING id, order_number, customer_name, customer_phone, customer_email,
                  delivery_street, delivery_building, delivery_apartment, delivery_floor,
                  delivery_entrance, delivery_intercom, delivery_city, delivery_postal_code,
                  delivery_country, delivery_lat, delivery_lng,
                  subtotal, delivery_fee, tax, total, payment_method, status,
                  special_instructions, delivery_time, created_at, updated_at, completed_at
        "#,
        id
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(order))
}
