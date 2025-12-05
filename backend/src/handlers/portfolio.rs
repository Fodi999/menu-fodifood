use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::error::Result;
use crate::models::{CreatePortfolioRequest, Portfolio, UpdatePortfolioRequest};
use crate::services::PortfolioService;
use std::sync::Arc;

// Public endpoint
pub async fn get_by_slug(
    State(portfolio_service): State<Arc<PortfolioService>>,
    Path(slug): Path<String>,
) -> Result<Json<Portfolio>> {
    let portfolio = portfolio_service.get_by_slug(&slug).await?;
    Ok(Json(portfolio))
}

// Protected endpoints
pub async fn create(
    State(portfolio_service): State<Arc<PortfolioService>>,
    Extension(user_id): Extension<Uuid>,
    Json(req): Json<CreatePortfolioRequest>,
) -> Result<(StatusCode, Json<Portfolio>)> {
    let portfolio = portfolio_service
        .create(
            user_id,
            req.slug,
            req.theme.unwrap_or_else(|| "default".to_string()),
            req.data,
            req.is_public.unwrap_or(true),
        )
        .await?;

    Ok((StatusCode::CREATED, Json(portfolio)))
}

pub async fn get_user_portfolios(
    State(portfolio_service): State<Arc<PortfolioService>>,
    Extension(user_id): Extension<Uuid>,
) -> Result<Json<Vec<Portfolio>>> {
    let portfolios = portfolio_service.get_user_portfolios(user_id).await?;
    Ok(Json(portfolios))
}

pub async fn update(
    State(portfolio_service): State<Arc<PortfolioService>>,
    Extension(user_id): Extension<Uuid>,
    Path(id): Path<Uuid>,
    Json(req): Json<UpdatePortfolioRequest>,
) -> Result<Json<Portfolio>> {
    let mut existing = portfolio_service.get_by_id(id).await?;

    if let Some(slug) = req.slug {
        existing.slug = slug;
    }
    if let Some(theme) = req.theme {
        existing.theme = theme;
    }
    if let Some(data) = req.data {
        existing.data = data;
    }
    if let Some(is_public) = req.is_public {
        existing.is_public = is_public;
    }

    let portfolio = portfolio_service.update(id, user_id, existing).await?;
    Ok(Json(portfolio))
}

pub async fn delete(
    State(portfolio_service): State<Arc<PortfolioService>>,
    Extension(user_id): Extension<Uuid>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>> {
    portfolio_service.delete(id, user_id).await?;
    Ok(Json(json!({ "message": "Portfolio deleted successfully" })))
}
