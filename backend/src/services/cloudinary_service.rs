use anyhow::{Result, anyhow};
use reqwest::multipart::{Form, Part};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct CloudinaryConfig {
    pub cloud_name: String,
    pub api_key: String,
    pub api_secret: String,
    pub upload_preset: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CloudinaryResponse {
    pub secure_url: String,
    pub public_id: String,
    pub format: String,
    pub width: u32,
    pub height: u32,
    pub bytes: u64,
}

pub struct CloudinaryService {
    config: CloudinaryConfig,
    client: reqwest::Client,
}

impl CloudinaryService {
    pub fn new(config: CloudinaryConfig) -> Self {
        Self {
            config,
            client: reqwest::Client::new(),
        }
    }

    /// Upload image to Cloudinary
    pub async fn upload_image(
        &self,
        file_data: Vec<u8>,
        filename: String,
        folder: Option<String>,
    ) -> Result<CloudinaryResponse> {
        let upload_url = format!(
            "https://api.cloudinary.com/v1_1/{}/image/upload",
            self.config.cloud_name
        );

        let folder_name = folder.unwrap_or_else(|| "portfolio".to_string());

        // Use unsigned upload with preset
        let form = Form::new()
            .part("file", Part::bytes(file_data).file_name(filename))
            .text("upload_preset", self.config.upload_preset.clone())
            .text("folder", folder_name);

        let response = self.client
            .post(&upload_url)
            .multipart(form)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(anyhow!("Cloudinary upload failed: {}", error_text));
        }

        let cloudinary_response: CloudinaryResponse = response.json().await?;
        Ok(cloudinary_response)
    }

    /// Upload image from base64
    pub async fn upload_base64(
        &self,
        base64_data: String,
        folder: Option<String>,
    ) -> Result<CloudinaryResponse> {
        let upload_url = format!(
            "https://api.cloudinary.com/v1_1/{}/image/upload",
            self.config.cloud_name
        );

        let folder_name = folder.unwrap_or_else(|| "portfolio".to_string());

        // Use unsigned upload with preset
        let form = Form::new()
            .text("file", base64_data)
            .text("upload_preset", self.config.upload_preset.clone())
            .text("folder", folder_name);

        let response = self.client
            .post(&upload_url)
            .multipart(form)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(anyhow!("Cloudinary upload failed: {}", error_text));
        }

        let cloudinary_response: CloudinaryResponse = response.json().await?;
        Ok(cloudinary_response)
    }

    /// Delete image from Cloudinary (requires admin API)
    pub async fn delete_image(&self, public_id: String) -> Result<()> {
        let delete_url = format!(
            "https://api.cloudinary.com/v1_1/{}/image/destroy",
            self.config.cloud_name
        );

        // For delete, we still need to use signed request
        // This is a simplified version - in production you'd want proper signature
        let form = Form::new()
            .text("public_id", public_id)
            .text("api_key", self.config.api_key.clone());

        let response = self.client
            .post(&delete_url)
            .multipart(form)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(anyhow!("Cloudinary delete failed: {}", error_text));
        }

        Ok(())
    }
}
