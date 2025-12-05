use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Json, Response},
};
use sqlx::PgPool;

use crate::error::AppError;
use crate::models::restaurant::{Category, CreateCategory, UpdateCategory};

// Get all categories
pub async fn get_categories(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Category>>, AppError> {
    let categories = sqlx::query_as!(
        Category,
        r#"
        SELECT id, name, name_ru, name_pl, slug, description, image, 
               "order", is_active, created_at, updated_at
        FROM categories
        WHERE is_active = true
        ORDER BY "order" ASC, id ASC
        "#
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(categories))
}

// Get all categories (including inactive) - Admin only
pub async fn get_all_categories(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Category>>, AppError> {
    let categories = sqlx::query_as!(
        Category,
        r#"
        SELECT id, name, name_ru, name_pl, slug, description, image, 
               "order", is_active, created_at, updated_at
        FROM categories
        ORDER BY "order" ASC, id ASC
        "#
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(categories))
}

// Get category by ID
pub async fn get_category(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<Category>, AppError> {
    let category = sqlx::query_as!(
        Category,
        r#"
        SELECT id, name, name_ru, name_pl, slug, description, image, 
               "order", is_active, created_at, updated_at
        FROM categories
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(category))
}

// Get category by slug
pub async fn get_category_by_slug(
    State(pool): State<PgPool>,
    Path(slug): Path<String>,
) -> Result<Json<Category>, AppError> {
    let category = sqlx::query_as!(
        Category,
        r#"
        SELECT id, name, name_ru, name_pl, slug, description, image, 
               "order", is_active, created_at, updated_at
        FROM categories
        WHERE slug = $1
        "#,
        slug
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(category))
}

// Create category - Admin only
pub async fn create_category(
    State(pool): State<PgPool>,
    Json(category_data): Json<CreateCategory>,
) -> Result<Response, AppError> {
    let category = sqlx::query_as!(
        Category,
        r#"
        INSERT INTO categories (name, name_ru, name_pl, slug, description, image, "order")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, name_ru, name_pl, slug, description, image, 
                  "order", is_active, created_at, updated_at
        "#,
        category_data.name,
        category_data.name_ru,
        category_data.name_pl,
        category_data.slug,
        category_data.description,
        category_data.image,
        category_data.order.unwrap_or(0)
    )
    .fetch_one(&pool)
    .await?;

    Ok((StatusCode::CREATED, Json(category)).into_response())
}

// Update category - Admin only
pub async fn update_category(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    Json(category_data): Json<UpdateCategory>,
) -> Result<Json<Category>, AppError> {
    // Get current category
    let mut category = sqlx::query_as!(
        Category,
        r#"
        SELECT id, name, name_ru, name_pl, slug, description, image, 
               "order", is_active, created_at, updated_at
        FROM categories
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(&pool)
    .await?;

    // Update fields if provided
    if let Some(name) = category_data.name {
        category.name = name;
    }
    if let Some(name_ru) = category_data.name_ru {
        category.name_ru = name_ru;
    }
    if let Some(name_pl) = category_data.name_pl {
        category.name_pl = name_pl;
    }
    if let Some(slug) = category_data.slug {
        category.slug = slug;
    }
    if let Some(description) = category_data.description {
        category.description = Some(description);
    }
    if let Some(image) = category_data.image {
        category.image = Some(image);
    }
    if let Some(order) = category_data.order {
        category.order = Some(order);
    }
    if let Some(is_active) = category_data.is_active {
        category.is_active = Some(is_active);
    }

    // Save to database
    let updated_category = sqlx::query_as!(
        Category,
        r#"
        UPDATE categories
        SET name = $2, name_ru = $3, name_pl = $4, slug = $5, 
            description = $6, image = $7, "order" = $8, is_active = $9
        WHERE id = $1
        RETURNING id, name, name_ru, name_pl, slug, description, image, 
                  "order", is_active, created_at, updated_at
        "#,
        id,
        category.name,
        category.name_ru,
        category.name_pl,
        category.slug,
        category.description,
        category.image,
        category.order,
        category.is_active
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(updated_category))
}

// Delete category - Admin only
pub async fn delete_category(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<StatusCode, AppError> {
    sqlx::query!(
        r#"
        DELETE FROM categories
        WHERE id = $1
        "#,
        id
    )
    .execute(&pool)
    .await?;

    Ok(StatusCode::NO_CONTENT)
}
