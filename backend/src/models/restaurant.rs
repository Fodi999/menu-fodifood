use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use bigdecimal::BigDecimal;

// ===== CATEGORY MODELS =====

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub name_ru: String,
    pub name_pl: String,
    pub slug: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub order: Option<i32>,
    pub is_active: Option<bool>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCategory {
    pub name: String,
    pub name_ru: String,
    pub name_pl: String,
    pub slug: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub order: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCategory {
    pub name: Option<String>,
    pub name_ru: Option<String>,
    pub name_pl: Option<String>,
    pub slug: Option<String>,
    pub description: Option<String>,
    pub image: Option<String>,
    pub order: Option<i32>,
    pub is_active: Option<bool>,
}

// ===== MENU ITEM MODELS =====

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct MenuItem {
    pub id: i32,
    pub category_id: Option<i32>,
    pub name: String,
    pub name_ru: String,
    pub name_pl: String,
    pub description: String,
    pub description_ru: String,
    pub description_pl: String,
    pub price: BigDecimal,
    pub original_price: Option<BigDecimal>,
    pub image: String,
    pub images: Option<Vec<String>>,
    pub is_available: Option<bool>,
    pub is_popular: Option<bool>,
    pub is_new: Option<bool>,
    pub is_vegetarian: Option<bool>,
    pub is_spicy: Option<bool>,
    pub allergens: Option<Vec<String>>,
    pub weight: Option<String>,
    pub calories: Option<i32>,
    pub cooking_time: Option<i32>,
    pub ingredients: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateMenuItem {
    pub category_id: i32,
    pub name: String,
    pub name_ru: String,
    pub name_pl: String,
    pub description: String,
    pub description_ru: String,
    pub description_pl: String,
    pub price: BigDecimal,
    pub original_price: Option<BigDecimal>,
    pub image: String,
    pub images: Option<Vec<String>>,
    pub is_vegetarian: Option<bool>,
    pub is_spicy: Option<bool>,
    pub allergens: Option<Vec<String>>,
    pub weight: Option<String>,
    pub calories: Option<i32>,
    pub cooking_time: Option<i32>,
    pub ingredients: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateMenuItem {
    pub category_id: Option<i32>,
    pub name: Option<String>,
    pub name_ru: Option<String>,
    pub name_pl: Option<String>,
    pub description: Option<String>,
    pub description_ru: Option<String>,
    pub description_pl: Option<String>,
    pub price: Option<BigDecimal>,
    pub original_price: Option<BigDecimal>,
    pub image: Option<String>,
    pub images: Option<Vec<String>>,
    pub is_available: Option<bool>,
    pub is_popular: Option<bool>,
    pub is_new: Option<bool>,
    pub is_vegetarian: Option<bool>,
    pub is_spicy: Option<bool>,
    pub allergens: Option<Vec<String>>,
    pub weight: Option<String>,
    pub calories: Option<i32>,
    pub cooking_time: Option<i32>,
    pub ingredients: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
}

// ===== ORDER MODELS =====

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Order {
    pub id: i32,
    pub order_number: String,
    pub customer_name: String,
    pub customer_phone: String,
    pub customer_email: Option<String>,
    pub delivery_street: String,
    pub delivery_building: String,
    pub delivery_apartment: Option<String>,
    pub delivery_floor: Option<String>,
    pub delivery_entrance: Option<String>,
    pub delivery_intercom: Option<String>,
    pub delivery_city: String,
    pub delivery_postal_code: String,
    pub delivery_country: String,
    pub delivery_lat: Option<BigDecimal>,
    pub delivery_lng: Option<BigDecimal>,
    pub subtotal: BigDecimal,
    pub delivery_fee: BigDecimal,
    pub tax: BigDecimal,
    pub total: BigDecimal,
    pub payment_method: String,
    pub status: String,
    pub special_instructions: Option<String>,
    pub delivery_time: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderWithItems {
    #[serde(flatten)]
    pub order: Order,
    pub items: Vec<OrderItem>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderItem {
    pub id: i32,
    pub order_id: Option<i32>,
    pub menu_item_id: Option<i32>,
    pub menu_item_name: String,
    pub menu_item_price: BigDecimal,
    pub quantity: i32,
    pub special_instructions: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateOrderItem {
    pub menu_item_id: i32,
    pub quantity: i32,
    pub special_instructions: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateOrder {
    pub customer_name: String,
    pub customer_phone: String,
    pub customer_email: Option<String>,
    pub delivery_street: String,
    pub delivery_building: String,
    pub delivery_apartment: Option<String>,
    pub delivery_floor: Option<String>,
    pub delivery_entrance: Option<String>,
    pub delivery_intercom: Option<String>,
    pub delivery_city: String,
    pub delivery_postal_code: String,
    pub delivery_country: Option<String>,
    pub payment_method: String,
    pub special_instructions: Option<String>,
    pub items: Vec<CreateOrderItem>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateOrderStatus {
    pub status: String,
}

// ===== RESTAURANT INFO MODELS =====

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RestaurantInfo {
    pub id: i32,
    pub name: String,
    pub name_ru: String,
    pub name_pl: String,
    pub description: Option<String>,
    pub description_ru: Option<String>,
    pub description_pl: Option<String>,
    pub logo: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub postal_code: Option<String>,
    pub opening_hours: Option<serde_json::Value>,
    pub delivery_radius: Option<i32>,
    pub minimum_order: Option<BigDecimal>,
    pub delivery_fee: Option<BigDecimal>,
    pub free_delivery_from: Option<BigDecimal>,
    pub average_delivery_time: Option<i32>,
    pub social_media: Option<serde_json::Value>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRestaurantInfo {
    pub name: Option<String>,
    pub name_ru: Option<String>,
    pub name_pl: Option<String>,
    pub description: Option<String>,
    pub description_ru: Option<String>,
    pub description_pl: Option<String>,
    pub logo: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub postal_code: Option<String>,
    pub opening_hours: Option<serde_json::Value>,
    pub delivery_radius: Option<i32>,
    pub minimum_order: Option<BigDecimal>,
    pub delivery_fee: Option<BigDecimal>,
    pub free_delivery_from: Option<BigDecimal>,
    pub average_delivery_time: Option<i32>,
    pub social_media: Option<serde_json::Value>,
}
