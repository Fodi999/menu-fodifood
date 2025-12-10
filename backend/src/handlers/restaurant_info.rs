use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Json},
};
use sqlx::PgPool;

use crate::error::AppError;
use crate::models::restaurant::{RestaurantInfo, UpdateRestaurantInfo};

// Get restaurant info (Public)
pub async fn get_restaurant_info(
    State(pool): State<PgPool>,
) -> Result<Json<RestaurantInfo>, AppError> {
    let info = sqlx::query_as!(
        RestaurantInfo,
        r#"
        SELECT id, name, name_ru, name_pl, description, description_ru, description_pl,
               logo, phone, email, address, city, postal_code, opening_hours,
               delivery_radius, minimum_order, delivery_fee, free_delivery_from,
               average_delivery_time, social_media,
               hero_image, hero_title, hero_subtitle, hero_description,
               featured_dish_image, featured_dish_title, featured_dish_description,
               featured_dish_price, updated_at
        FROM restaurant_info
        WHERE id = 1
        "#
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(info))
}

// Update restaurant info - Admin only
pub async fn update_restaurant_info(
    State(pool): State<PgPool>,
    Json(info_data): Json<UpdateRestaurantInfo>,
) -> Result<Json<RestaurantInfo>, AppError> {
    // Get current info
    let mut info = sqlx::query_as!(
        RestaurantInfo,
        r#"
        SELECT id, name, name_ru, name_pl, description, description_ru, description_pl,
               logo, phone, email, address, city, postal_code, opening_hours,
               delivery_radius, minimum_order, delivery_fee, free_delivery_from,
               average_delivery_time, social_media,
               hero_image, hero_title, hero_subtitle, hero_description,
               featured_dish_image, featured_dish_title, featured_dish_description,
               featured_dish_price, updated_at
        FROM restaurant_info
        WHERE id = 1
        "#
    )
    .fetch_one(&pool)
    .await?;

    // Update fields if provided
    if let Some(name) = info_data.name {
        info.name = name;
    }
    if let Some(name_ru) = info_data.name_ru {
        info.name_ru = name_ru;
    }
    if let Some(name_pl) = info_data.name_pl {
        info.name_pl = name_pl;
    }
    if let Some(description) = info_data.description {
        info.description = Some(description);
    }
    if let Some(description_ru) = info_data.description_ru {
        info.description_ru = Some(description_ru);
    }
    if let Some(description_pl) = info_data.description_pl {
        info.description_pl = Some(description_pl);
    }
    if let Some(logo) = info_data.logo {
        info.logo = Some(logo);
    }
    if let Some(phone) = info_data.phone {
        info.phone = Some(phone);
    }
    if let Some(email) = info_data.email {
        info.email = Some(email);
    }
    if let Some(address) = info_data.address {
        info.address = Some(address);
    }
    if let Some(city) = info_data.city {
        info.city = Some(city);
    }
    if let Some(postal_code) = info_data.postal_code {
        info.postal_code = Some(postal_code);
    }
    if let Some(opening_hours) = info_data.opening_hours {
        info.opening_hours = Some(opening_hours);
    }
    if let Some(delivery_radius) = info_data.delivery_radius {
        info.delivery_radius = Some(delivery_radius);
    }
    if let Some(minimum_order) = info_data.minimum_order {
        info.minimum_order = Some(minimum_order);
    }
    if let Some(delivery_fee) = info_data.delivery_fee {
        info.delivery_fee = Some(delivery_fee);
    }
    if let Some(free_delivery_from) = info_data.free_delivery_from {
        info.free_delivery_from = Some(free_delivery_from);
    }
    if let Some(average_delivery_time) = info_data.average_delivery_time {
        info.average_delivery_time = Some(average_delivery_time);
    }
    if let Some(social_media) = info_data.social_media {
        info.social_media = Some(social_media);
    }
    // Hero section fields
    if let Some(hero_image) = info_data.hero_image {
        info.hero_image = Some(hero_image);
    }
    if let Some(hero_title) = info_data.hero_title {
        info.hero_title = Some(hero_title);
    }
    if let Some(hero_subtitle) = info_data.hero_subtitle {
        info.hero_subtitle = Some(hero_subtitle);
    }
    if let Some(hero_description) = info_data.hero_description {
        info.hero_description = Some(hero_description);
    }
    // Featured dish fields
    if let Some(featured_dish_image) = info_data.featured_dish_image {
        info.featured_dish_image = Some(featured_dish_image);
    }
    if let Some(featured_dish_title) = info_data.featured_dish_title {
        info.featured_dish_title = Some(featured_dish_title);
    }
    if let Some(featured_dish_description) = info_data.featured_dish_description {
        info.featured_dish_description = Some(featured_dish_description);
    }
    if let Some(featured_dish_price) = info_data.featured_dish_price {
        info.featured_dish_price = Some(featured_dish_price);
    }

    // Save to database
    let updated_info = sqlx::query_as!(
        RestaurantInfo,
        r#"
        UPDATE restaurant_info
        SET name = $1, name_ru = $2, name_pl = $3,
            description = $4, description_ru = $5, description_pl = $6,
            logo = $7, phone = $8, email = $9, address = $10, city = $11, postal_code = $12,
            opening_hours = $13, delivery_radius = $14, minimum_order = $15,
            delivery_fee = $16, free_delivery_from = $17, average_delivery_time = $18,
            social_media = $19,
            hero_image = $20, hero_title = $21, hero_subtitle = $22, hero_description = $23,
            featured_dish_image = $24, featured_dish_title = $25,
            featured_dish_description = $26, featured_dish_price = $27
        WHERE id = 1
        RETURNING id, name, name_ru, name_pl, description, description_ru, description_pl,
                  logo, phone, email, address, city, postal_code, opening_hours,
                  delivery_radius, minimum_order, delivery_fee, free_delivery_from,
                  average_delivery_time, social_media,
                  hero_image, hero_title, hero_subtitle, hero_description,
                  featured_dish_image, featured_dish_title, featured_dish_description,
                  featured_dish_price, updated_at
        "#,
        info.name,
        info.name_ru,
        info.name_pl,
        info.description,
        info.description_ru,
        info.description_pl,
        info.logo,
        info.phone,
        info.email,
        info.address,
        info.city,
        info.postal_code,
        info.opening_hours,
        info.delivery_radius,
        info.minimum_order,
        info.delivery_fee,
        info.free_delivery_from,
        info.average_delivery_time,
        info.social_media,
        info.hero_image,
        info.hero_title,
        info.hero_subtitle,
        info.hero_description,
        info.featured_dish_image,
        info.featured_dish_title,
        info.featured_dish_description,
        info.featured_dish_price
    )
    .fetch_one(&pool)
    .await?;

    Ok(Json(updated_info))
}
