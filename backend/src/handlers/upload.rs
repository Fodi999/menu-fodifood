use shuttle_axum::axum::{
    extract::{State, Multipart},
    Json,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::services::cloudinary_service::{CloudinaryService, CloudinaryResponse};
use crate::error::AppError;

#[derive(Debug, Serialize, Deserialize)]
pub struct UploadResponse {
    pub url: String,
    pub public_id: String,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Base64UploadRequest {
    pub image: String, // base64 encoded image
    pub folder: Option<String>,
}

/// Upload image from multipart form
pub async fn upload_image(
    State(cloudinary): State<Arc<CloudinaryService>>,
    mut multipart: Multipart,
) -> Result<Json<UploadResponse>, AppError> {
    let mut file_data: Option<Vec<u8>> = None;
    let mut filename = "image.jpg".to_string();
    let mut folder: Option<String> = None;

    while let Some(field) = multipart.next_field().await.map_err(|e| {
        tracing::error!("Multipart error: {}", e);
        AppError::BadRequest(format!("Invalid multipart data: {}", e))
    })? {
        let field_name = field.name().unwrap_or("").to_string();

        match field_name.as_str() {
            "file" => {
                filename = field.file_name().unwrap_or("image.jpg").to_string();
                file_data = Some(field.bytes().await.map_err(|e| {
                    tracing::error!("Failed to read file bytes: {}", e);
                    AppError::BadRequest(format!("Failed to read file: {}", e))
                })?.to_vec());
            }
            "folder" => {
                folder = Some(field.text().await.map_err(|e| {
                    tracing::error!("Failed to read folder: {}", e);
                    AppError::BadRequest(format!("Failed to read folder: {}", e))
                })?);
            }
            _ => {
                // Skip unknown fields
            }
        }
    }

    let file_data = file_data.ok_or_else(|| {
        AppError::BadRequest("No file provided".to_string())
    })?;

    tracing::info!("Uploading image: {} ({} bytes)", filename, file_data.len());

    let result = cloudinary
        .upload_image(file_data, filename, folder)
        .await
        .map_err(|e| {
            tracing::error!("Cloudinary upload error: {}", e);
            AppError::InternalError
        })?;

    Ok(Json(UploadResponse {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
    }))
}

/// Upload image from base64
pub async fn upload_base64(
    State(cloudinary): State<Arc<CloudinaryService>>,
    Json(payload): Json<Base64UploadRequest>,
) -> Result<Json<UploadResponse>, AppError> {
    tracing::info!("Uploading base64 image to folder: {:?}", payload.folder);

    let result = cloudinary
        .upload_base64(payload.image, payload.folder)
        .await
        .map_err(|e| {
            tracing::error!("Cloudinary base64 upload error: {}", e);
            AppError::InternalError
        })?;

    Ok(Json(UploadResponse {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
    }))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteRequest {
    pub public_id: String,
}

/// Delete image from Cloudinary
pub async fn delete_image(
    State(cloudinary): State<Arc<CloudinaryService>>,
    Json(payload): Json<DeleteRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    tracing::info!("Deleting image: {}", payload.public_id);

    cloudinary
        .delete_image(payload.public_id)
        .await
        .map_err(|e| {
            tracing::error!("Cloudinary delete error: {}", e);
            AppError::InternalError
        })?;

    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Image deleted successfully"
    })))
}
