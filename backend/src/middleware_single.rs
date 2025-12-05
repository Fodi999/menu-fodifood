use shuttle_axum::axum::{
    extract::{Request, State},
    http::header,
    middleware::Next,
    response::Response,
};

use crate::error::AppError;
use crate::services::auth_service_single::AuthService;
use std::sync::Arc;

pub async fn auth_middleware(
    State(auth_service): State<Arc<AuthService>>,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .ok_or(AppError::InvalidToken)?;

    if !auth_header.starts_with("Bearer ") {
        return Err(AppError::InvalidToken);
    }

    let token = &auth_header[7..];
    
    // Валідація токена (просто перевірка, що він дійсний)
    let claims = auth_service.validate_token(token)?;

    // Перевірка, що це admin
    if claims.sub != "admin" {
        return Err(AppError::Forbidden("Not an admin".to_string()));
    }

    // Додаємо claims в extensions (не потрібно user_id)
    request.extensions_mut().insert(claims);

    Ok(next.run(request).await)
}
