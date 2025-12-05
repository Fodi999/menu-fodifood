use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use crate::error::Result;
use crate::models::{AuthResponse, LoginRequest, RegisterRequest};
use crate::services::AuthService;
use std::sync::Arc;

pub async fn register(
    State(auth_service): State<Arc<AuthService>>,
    Json(req): Json<RegisterRequest>,
) -> Result<(StatusCode, Json<AuthResponse>)> {
    let user = auth_service
        .register(req.email, req.username, req.password)
        .await?;

    let token = auth_service.generate_token(user.id)?;

    Ok((
        StatusCode::CREATED,
        Json(AuthResponse {
            user: user.into(),
            token,
        }),
    ))
}

pub async fn login(
    State(auth_service): State<Arc<AuthService>>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<AuthResponse>> {
    let user = auth_service.login(req.login, req.password).await?;

    let token = auth_service.generate_token(user.id)?;

    Ok(Json(AuthResponse {
        user: user.into(),
        token,
    }))
}
