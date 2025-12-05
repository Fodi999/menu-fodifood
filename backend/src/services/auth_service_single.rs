use anyhow::{Result, anyhow};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use chrono::Utc;
use crate::models_single::{LoginRequest, AuthResponse, Claims, AdminConfig};

pub struct AuthService {
    admin_config: AdminConfig,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(admin_config: AdminConfig, jwt_secret: String) -> Self {
        Self {
            admin_config,
            jwt_secret,
        }
    }

    // Логін для admin (один пароль)
    pub async fn login(&self, req: LoginRequest) -> Result<AuthResponse> {
        // Перевірка пароля
        let password_valid = bcrypt::verify(&req.password, &self.admin_config.password_hash)?;
        
        if !password_valid {
            return Err(anyhow!("Invalid password"));
        }

        // Генерація JWT токена
        let token = self.generate_token()?;

        Ok(AuthResponse { token })
    }

    // Генерація JWT токена
    fn generate_token(&self) -> Result<String> {
        let expiration = Utc::now()
            .checked_add_signed(chrono::Duration::hours(24))
            .ok_or_else(|| anyhow!("Failed to add expiration time"))?
            .timestamp() as usize;

        let claims = Claims {
            sub: "admin".to_string(),
            exp: expiration,
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        )?;

        Ok(token)
    }

    // Валідація токена
    pub fn validate_token(&self, token: &str) -> Result<Claims> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::default(),
        )?;

        Ok(token_data.claims)
    }
}
