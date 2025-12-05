mod models_single;
mod models;
mod error;
mod db_single;
mod websocket;
mod services {
    pub mod auth_service_single;
    pub mod cloudinary_service;
}
mod handlers {
    pub mod auth_single;
    pub mod upload;
    pub mod restaurant_categories;
    pub mod restaurant_menu;
    pub mod restaurant_orders;
    pub mod restaurant_info;
}
mod middleware_single;

// Load .env file for sqlx compile-time verification
#[cfg(not(target_env = "shuttle"))]
fn load_env() {
    dotenvy::dotenv().ok();
}

#[cfg(target_env = "shuttle")]
fn load_env() {
    // Shuttle sets DATABASE_URL automatically
}

use std::sync::Arc;
use shuttle_axum::axum::{
    routing::{get, post, put, delete},
    Router,
    http::Method,
    middleware as axum_middleware,
    extract::DefaultBodyLimit,
};
use tower_http::cors::{CorsLayer, Any};
use services::auth_service_single::AuthService;
use services::cloudinary_service::{CloudinaryService, CloudinaryConfig};
use models_single::AdminConfig;
use shuttle_runtime::SecretStore;
use sqlx::PgPool;

async fn create_app(pool: PgPool, secrets: SecretStore) -> Router {
    // Load .env for local development
    load_env();
    
    // Create WebSocket state
    let ws_state = Arc::new(websocket::WsState::new(pool.clone()));
    
    let jwt_secret = secrets.get("JWT_SECRET")
        .unwrap_or_else(|| "your-secret-key-change-in-production".to_string());

    let admin_username = secrets.get("ADMIN_USERNAME")
        .unwrap_or_else(|| "admin".to_string());
    
    let admin_password_hash = secrets.get("ADMIN_PASSWORD_HASH")
        .unwrap_or_else(|| bcrypt::hash("admin123", bcrypt::DEFAULT_COST).unwrap());

    let admin_config = AdminConfig {
        username: admin_username,
        password_hash: admin_password_hash,
    };

    // Run migrations
    db_single::run_migrations(&pool).await
        .expect("Failed to run migrations");

    // Initialize services
    let auth_service = Arc::new(AuthService::new(admin_config, jwt_secret.clone()));

    // Initialize Cloudinary (optional)
    let cloudinary_service = if let (Some(cloud_name), Some(api_key), Some(api_secret), Some(upload_preset)) = (
        secrets.get("CLOUDINARY_CLOUD_NAME"),
        secrets.get("CLOUDINARY_API_KEY"),
        secrets.get("CLOUDINARY_API_SECRET"),
        secrets.get("CLOUDINARY_UPLOAD_PRESET"),
    ) {
        let config = CloudinaryConfig {
            cloud_name: cloud_name.clone(),
            api_key,
            api_secret,
            upload_preset,
        };
        tracing::info!("☁️  Cloudinary enabled: {}", cloud_name);
        Some(Arc::new(CloudinaryService::new(config)))
    } else {
        tracing::warn!("⚠️  Cloudinary not configured");
        None
    };

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    // Public routes (без auth)
    let public_routes = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/api/auth/login", post(handlers::auth_single::login))
        .with_state(auth_service.clone());
    
    // WebSocket route (отдельно, с собственным state)
    let ws_routes = Router::new()
        .route("/api/ws", get(websocket::ws_handler))
        .with_state(ws_state.clone());

    // Public restaurant routes (with pool)
    let restaurant_public_pool = Router::new()
        // Categories
        .route("/api/restaurant/categories", get(handlers::restaurant_categories::get_categories))
        .route("/api/restaurant/categories/{id}", get(handlers::restaurant_categories::get_category))
        .route("/api/restaurant/categories/slug/{slug}", get(handlers::restaurant_categories::get_category_by_slug))
        // Menu
        .route("/api/restaurant/menu", get(handlers::restaurant_menu::get_menu_items))
        .route("/api/restaurant/menu/{id}", get(handlers::restaurant_menu::get_menu_item))
        .route("/api/restaurant/menu/category/{category_id}", get(handlers::restaurant_menu::get_menu_items_by_category))
        // Orders (public read access for admin dashboard)
        .route("/api/restaurant/orders/{order_number}", get(handlers::restaurant_orders::get_order))
        .route("/api/restaurant/admin/orders", get(handlers::restaurant_orders::get_all_orders))
        .route("/api/restaurant/admin/orders/{id}", get(handlers::restaurant_orders::get_order_by_id))
        // Restaurant info
        .route("/api/restaurant/info", get(handlers::restaurant_info::get_restaurant_info))
        .with_state(pool.clone());
    
    // Order creation route (with ws_state for broadcasting)
    let restaurant_orders = Router::new()
        .route("/api/restaurant/orders", post(handlers::restaurant_orders::create_order))
        .with_state((pool.clone(), ws_state.clone()));

    // Protected restaurant routes (admin only)
    let restaurant_protected = Router::new()
        // Categories
        .route("/api/restaurant/admin/categories", get(handlers::restaurant_categories::get_all_categories))
        .route("/api/restaurant/admin/categories", post(handlers::restaurant_categories::create_category))
        .route("/api/restaurant/admin/categories/{id}", put(handlers::restaurant_categories::update_category))
        .route("/api/restaurant/admin/categories/{id}", delete(handlers::restaurant_categories::delete_category))
        // Menu
        .route("/api/restaurant/admin/menu", get(handlers::restaurant_menu::get_all_menu_items))
        .route("/api/restaurant/admin/menu", post(handlers::restaurant_menu::create_menu_item))
        .route("/api/restaurant/admin/menu/{id}", put(handlers::restaurant_menu::update_menu_item))
        .route("/api/restaurant/admin/menu/{id}", delete(handlers::restaurant_menu::delete_menu_item))
        // Orders (write operations only - read is public)
        .route("/api/restaurant/admin/orders/{id}/status", put(handlers::restaurant_orders::update_order_status))
        .route("/api/restaurant/admin/orders/{id}/cancel", put(handlers::restaurant_orders::cancel_order))
        // Restaurant info
        .route("/api/restaurant/admin/info", put(handlers::restaurant_info::update_restaurant_info))
        .layer(axum_middleware::from_fn_with_state(
            auth_service.clone(),
            middleware_single::auth_middleware,
        ))
        .with_state(pool.clone());

    // Protected routes (тільки для admin з JWT)
    // Build app
    let mut app = Router::new()
        .merge(public_routes)
        .merge(ws_routes)
        .merge(restaurant_public_pool)
        .merge(restaurant_orders)
        .merge(restaurant_protected);

    // Add upload routes if Cloudinary is configured
    if let Some(cloudinary) = cloudinary_service {
        let protected_upload = Router::new()
            .route("/api/upload", post(handlers::upload::upload_image))
            .route("/api/upload/base64", post(handlers::upload::upload_base64))
            .route("/api/upload", delete(handlers::upload::delete_image))
            .layer(DefaultBodyLimit::max(10 * 1024 * 1024)) // 10MB limit for file uploads
            .layer(axum_middleware::from_fn_with_state(
                auth_service.clone(),
                middleware_single::auth_middleware,
            ))
            .with_state(cloudinary);
        
        app = app.merge(protected_upload);
    }

    app = app.layer(cors);

    app
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Postgres] db_url: String,
    #[shuttle_runtime::Secrets] secrets: SecretStore,
) -> shuttle_axum::ShuttleAxum {
    // Shuttle automatically initializes tracing - no need for tracing_subscriber::init()

    // Create pool from connection string
    let pool = db_single::create_pool(&db_url).await
        .expect("Failed to create database pool");

    let router = create_app(pool, secrets).await;

    tracing::info!("🚀 Portfolio API ready for deployment");
    
    Ok(router.into())
}
