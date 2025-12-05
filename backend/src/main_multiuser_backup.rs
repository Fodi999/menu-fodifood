mod db;
mod error;
mod handlers;
mod middleware;
mod models;
mod repositories;
mod services;

use axum::{
    http::Method,
    middleware as axum_middleware,
    routing::{delete, get, post, put},
    Router,
};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::db::create_pool;
use crate::handlers::{auth, portfolio};
use crate::middleware::auth_middleware;
use crate::repositories::{PortfolioRepository, UserRepository};
use crate::services::{AuthService, PortfolioService};

#[derive(Clone)]
struct AppState {
    auth_service: Arc<AuthService>,
    portfolio_service: Arc<PortfolioService>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "portfolio_api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables
    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost/portfolio_db".to_string());
    let jwt_secret = std::env::var("JWT_SECRET")
        .unwrap_or_else(|_| "your-super-secret-jwt-key-change-this".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());

    // Create database pool
    tracing::info!("Connecting to database...");
    let pool = create_pool(&database_url).await?;
    tracing::info!("✅ Database connected successfully");

    // Initialize repositories
    let user_repo = UserRepository::new(pool.clone());
    let portfolio_repo = PortfolioRepository::new(pool.clone());

    // Initialize services
    let auth_service = Arc::new(AuthService::new(user_repo, jwt_secret));
    let portfolio_service = Arc::new(PortfolioService::new(portfolio_repo));

    let state = AppState {
        auth_service: auth_service.clone(),
        portfolio_service: portfolio_service.clone(),
    };

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    // Build protected routes
    let protected = Router::new()
        .route("/portfolios", get(portfolio::get_user_portfolios))
        .route("/portfolios", post(portfolio::create))
        .route("/portfolios/:id", put(portfolio::update))
        .route("/portfolios/:id", delete(portfolio::delete))
        .route_layer(axum_middleware::from_fn_with_state(
            auth_service.clone(),
            auth_middleware,
        ))
        .with_state(portfolio_service.clone());

    // Build main router
    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/api/auth/register", post(auth::register).with_state(auth_service.clone()))
        .route("/api/auth/login", post(auth::login).with_state(auth_service.clone()))
        .route("/api/portfolios/@:slug", get(portfolio::get_by_slug).with_state(portfolio_service.clone()))
        .nest("/api", protected)
        .layer(cors);

    // Start server
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;

    tracing::info!("🚀 Server starting on http://{}", addr);

    axum::serve(listener, app).await?;

    Ok(())
}
