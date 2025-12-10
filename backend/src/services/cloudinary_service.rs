use anyhow::{Result, anyhow};
use reqwest::multipart::{Form, Part};
use serde::{Deserialize, Serialize};
use std::time::Duration;
use sha1::{Sha1, Digest};
use std::time::{SystemTime, UNIX_EPOCH};

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
        // Создаем клиент с оптимизированными настройками
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(30)) // Timeout 30 секунд
            .connect_timeout(Duration::from_secs(10)) // Timeout подключения 10 секунд
            .pool_max_idle_per_host(10) // Пул соединений
            .build()
            .expect("Failed to create HTTP client");

        Self {
            config,
            client,
        }
    }

    /// Upload image to Cloudinary using SIGNED upload
    pub async fn upload_image(
        &self,
        file_data: Vec<u8>,
        filename: String,
        folder: Option<String>,
    ) -> Result<CloudinaryResponse> {
        let start_time = std::time::Instant::now();
        let file_size_kb = file_data.len() as f64 / 1024.0;
        
        tracing::info!("📤 Starting Cloudinary upload: {} ({:.2} KB)", filename, file_size_kb);

        let upload_url = format!(
            "https://api.cloudinary.com/v1_1/{}/image/upload",
            self.config.cloud_name
        );

        let folder_name = folder.unwrap_or_else(|| "portfolio".to_string());
        let filename_clone = filename.clone();
        
        // Generate timestamp for signature
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .to_string();
        
        // Create signature string (alphabetically ordered params + api_secret)
        let sig_string = format!(
            "folder={}&timestamp={}{}",
            folder_name, timestamp, self.config.api_secret
        );
        
        // Generate SHA1 signature
        let mut hasher = Sha1::new();
        hasher.update(sig_string.as_bytes());
        let signature = format!("{:x}", hasher.finalize());
        
        tracing::info!("🔐 Generated signature for timestamp: {}", timestamp);

        // Use signed upload
        let form = Form::new()
            .part("file", Part::bytes(file_data).file_name(filename))
            .text("folder", folder_name)
            .text("timestamp", timestamp)
            .text("api_key", self.config.api_key.clone())
            .text("signature", signature);

        let response = self.client
            .post(&upload_url)
            .multipart(form)
            .send()
            .await?;

        let elapsed = start_time.elapsed();
        tracing::info!("⏱️ Cloudinary response received in {:.2}s", elapsed.as_secs_f64());

        if !response.status().is_success() {
            let error_text = response.text().await?;
            tracing::error!("❌ Cloudinary upload failed: {}", error_text);
            return Err(anyhow!("Cloudinary upload failed: {}", error_text));
        }

        let cloudinary_response: CloudinaryResponse = response.json().await?;
        
        tracing::info!(
            "✅ Upload successful: {} → {} (total time: {:.2}s)",
            filename_clone,
            cloudinary_response.secure_url,
            elapsed.as_secs_f64()
        );
        
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
