use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Json, Response},
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::error::AppError;
use crate::models::restaurant::{MenuItem, CreateMenuItem, UpdateMenuItem};

#[derive(Debug, Deserialize)]
pub struct MenuFilters {
    pub category_id: Option<i32>,
    pub is_popular: Option<bool>,
    pub is_new: Option<bool>,
    pub is_vegetarian: Option<bool>,
}

// Get all menu items with optional filters
pub async fn get_menu_items(
    State(pool): State<PgPool>,
    Query(filters): Query<MenuFilters>,
) -> Result<Json<Vec<MenuItem>>, AppError> {
    let mut query = String::from(
        r#"
        SELECT id, category_id, name, name_ru, name_pl, 
               description, description_ru, description_pl,
               price, original_price, image, images,
               is_available, is_popular, is_new, is_vegetarian, is_spicy,
               allergens, weight, calories, cooking_time, ingredients, tags,
               created_at, updated_at
        FROM menu_items
        WHERE is_available = true
        "#
    );

    let mut conditions = vec![];
    
    if let Some(category_id) = filters.category_id {
        conditions.push(format!("category_id = {}", category_id));
    }
    if let Some(is_popular) = filters.is_popular {
        conditions.push(format!("is_popular = {}", is_popular));
    }
    if let Some(is_new) = filters.is_new {
        conditions.push(format!("is_new = {}", is_new));
    }
    if let Some(is_vegetarian) = filters.is_vegetarian {
        conditions.push(format!("is_vegetarian = {}", is_vegetarian));
    }

    if !conditions.is_empty() {
        query.push_str(" AND ");
        query.push_str(&conditions.join(" AND "));
    }

    query.push_str(" ORDER BY id ASC");

    let items = sqlx::query_as::<_, MenuItem>(&query)
        .fetch_all(&pool)
        .await?;

    Ok(Json(items))
}

// Get all menu items (including unavailable) - Admin only
pub async fn get_all_menu_items(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<MenuItem>>, AppError> {
    let items = sqlx::query_as!(
        MenuItem,
        r#"
        SELECT id, category_id, name, name_ru, name_pl, 
               description, description_ru, description_pl,
               price, original_price, image, images,
               is_available, is_popular, is_new, is_vegetarian, is_spicy,
               allergens, weight, calories, cooking_time, ingredients, tags,
               created_at, updated_at
        FROM menu_items
        ORDER BY category_id ASC, id ASC
        "#
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(items))
}

// Get menu item by ID
pub async fn get_menu_item(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<MenuItem>, AppError> {
    let item = sqlx::query_as!(
        MenuItem,
        r#"
        SELECT id, category_id, name, name_ru, name_pl, 
               description, description_ru, description_pl,
               price, original_price, image, images,
               is_available, is_popular, is_new, is_vegetarian, is_spicy,
               allergens, weight, calories, cooking_time, ingredients, tags,
               created_at, updated_at
        FROM menu_items
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(item))
}

// Get menu items by category
pub async fn get_menu_items_by_category(
    State(pool): State<PgPool>,
    Path(category_id): Path<i32>,
) -> Result<Json<Vec<MenuItem>>, AppError> {
    let items = sqlx::query_as!(
        MenuItem,
        r#"
        SELECT id, category_id, name, name_ru, name_pl, 
               description, description_ru, description_pl,
               price, original_price, image, images,
               is_available, is_popular, is_new, is_vegetarian, is_spicy,
               allergens, weight, calories, cooking_time, ingredients, tags,
               created_at, updated_at
        FROM menu_items
        WHERE category_id = $1 AND is_available = true
        ORDER BY id ASC
        "#,
        category_id
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(items))
}

// Create menu item - Admin only
pub async fn create_menu_item(
    State(pool): State<PgPool>,
    Json(item_data): Json<CreateMenuItem>,
) -> Result<Response, AppError> {
    let item = sqlx::query_as!(
        MenuItem,
        r#"
        INSERT INTO menu_items (
            category_id, name, name_ru, name_pl,
            description, description_ru, description_pl,
            price, original_price, image, images,
            is_vegetarian, is_spicy, allergens, weight, calories, 
            cooking_time, ingredients, tags
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING id, category_id, name, name_ru, name_pl, 
                  description, description_ru, description_pl,
                  price, original_price, image, images,
                  is_available, is_popular, is_new, is_vegetarian, is_spicy,
                  allergens, weight, calories, cooking_time, ingredients, tags,
                  created_at, updated_at
        "#,
        item_data.category_id,
        item_data.name,
        item_data.name_ru,
        item_data.name_pl,
        item_data.description,
        item_data.description_ru,
        item_data.description_pl,
        item_data.price,
        item_data.original_price,
        item_data.image,
        item_data.images.as_deref(),
        item_data.is_vegetarian.unwrap_or(false),
        item_data.is_spicy.unwrap_or(false),
        item_data.allergens.as_deref(),
        item_data.weight,
        item_data.calories,
        item_data.cooking_time,
        item_data.ingredients.as_deref(),
        item_data.tags.as_deref()
    )
    .fetch_one(&pool)
    .await?;

    Ok((StatusCode::CREATED, Json(item)).into_response())
}

// Update menu item - Admin only
pub async fn update_menu_item(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    Json(item_data): Json<UpdateMenuItem>,
) -> Result<Json<MenuItem>, AppError> {
    // Get current item
    let mut item = sqlx::query_as!(
        MenuItem,
        r#"
        SELECT id, category_id, name, name_ru, name_pl, 
               description, description_ru, description_pl,
               price, original_price, image, images,
               is_available, is_popular, is_new, is_vegetarian, is_spicy,
               allergens, weight, calories, cooking_time, ingredients, tags,
               created_at, updated_at
        FROM menu_items
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(&pool)
    .await?;

    // Update fields if provided
    if let Some(category_id) = item_data.category_id {
        item.category_id = Some(category_id);
    }
    if let Some(name) = item_data.name {
        item.name = name;
    }
    if let Some(name_ru) = item_data.name_ru {
        item.name_ru = name_ru;
    }
    if let Some(name_pl) = item_data.name_pl {
        item.name_pl = name_pl;
    }
    if let Some(description) = item_data.description {
        item.description = description;
    }
    if let Some(description_ru) = item_data.description_ru {
        item.description_ru = description_ru;
    }
    if let Some(description_pl) = item_data.description_pl {
        item.description_pl = description_pl;
    }
    if let Some(price) = item_data.price {
        item.price = price;
    }
    if let Some(original_price) = item_data.original_price {
        item.original_price = Some(original_price);
    }
    if let Some(image) = item_data.image {
        item.image = image;
    }
    if let Some(images) = item_data.images {
        item.images = Some(images);
    }
    if let Some(is_available) = item_data.is_available {
        item.is_available = Some(is_available);
    }
    if let Some(is_popular) = item_data.is_popular {
        item.is_popular = Some(is_popular);
    }
    if let Some(is_new) = item_data.is_new {
        item.is_new = Some(is_new);
    }
    if let Some(is_vegetarian) = item_data.is_vegetarian {
        item.is_vegetarian = Some(is_vegetarian);
    }
    if let Some(is_spicy) = item_data.is_spicy {
        item.is_spicy = Some(is_spicy);
    }
    if let Some(allergens) = item_data.allergens {
        item.allergens = Some(allergens);
    }
    if let Some(weight) = item_data.weight {
        item.weight = Some(weight);
    }
    if let Some(calories) = item_data.calories {
        item.calories = Some(calories);
    }
    if let Some(cooking_time) = item_data.cooking_time {
        item.cooking_time = Some(cooking_time);
    }
    if let Some(ingredients) = item_data.ingredients {
        item.ingredients = Some(ingredients);
    }
    if let Some(tags) = item_data.tags {
        item.tags = Some(tags);
    }

    // Save to database
    let updated_item = sqlx::query_as!(
        MenuItem,
        r#"
        UPDATE menu_items
        SET category_id = $2, name = $3, name_ru = $4, name_pl = $5,
            description = $6, description_ru = $7, description_pl = $8,
            price = $9, original_price = $10, image = $11, images = $12,
            is_available = $13, is_popular = $14, is_new = $15,
            is_vegetarian = $16, is_spicy = $17, allergens = $18,
            weight = $19, calories = $20, cooking_time = $21,
            ingredients = $22, tags = $23
        WHERE id = $1
        RETURNING id, category_id, name, name_ru, name_pl, 
                  description, description_ru, description_pl,
                  price, original_price, image, images,
                  is_available, is_popular, is_new, is_vegetarian, is_spicy,
                  allergens, weight, calories, cooking_time, ingredients, tags,
                  created_at, updated_at
        "#,
        id,
        item.category_id,
        item.name,
        item.name_ru,
        item.name_pl,
        item.description,
        item.description_ru,
        item.description_pl,
        item.price,
        item.original_price,
        item.image,
        item.images.as_deref(),
        item.is_available,
        item.is_popular,
        item.is_new,
        item.is_vegetarian,
        item.is_spicy,
        item.allergens.as_deref(),
        item.weight,
        item.calories,
        item.cooking_time,
        item.ingredients.as_deref(),
        item.tags.as_deref()
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(updated_item))
}

// Delete menu item - Admin only
pub async fn delete_menu_item(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<StatusCode, AppError> {
    sqlx::query!(
        r#"
        DELETE FROM menu_items
        WHERE id = $1
        "#,
        id
    )
    .execute(&pool)
    .await?;

    Ok(StatusCode::NO_CONTENT)
}
