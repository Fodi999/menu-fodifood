use shuttle_axum::axum::{
    extract::State,
    Json,
    http::StatusCode,
};
use std::sync::Arc;
use crate::{
    services::auth_service_single::AuthService,
    models_single::{LoginRequest, AuthResponse},
    error::AppError,
};

pub async fn login(
    State(auth_service): State<Arc<AuthService>>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    let response = auth_service.login(req).await?;
    Ok(Json(response))
}
