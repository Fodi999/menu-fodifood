use crate::error::{AppError, Result};
use crate::models::{Claims, User};
use crate::repositories::UserRepository;
use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::Utc;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

pub struct AuthService {
    user_repo: UserRepository,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(user_repo: UserRepository, jwt_secret: String) -> Self {
        Self {
            user_repo,
            jwt_secret,
        }
    }

    pub async fn register(&self, email: String, username: String, password: String) -> Result<User> {
        // Validate
        if email.is_empty() || username.is_empty() || password.len() < 6 {
            return Err(AppError::Validation("Invalid input".to_string()));
        }

        // Check if exists
        if self.user_repo.email_exists(&email).await? {
            return Err(AppError::UserAlreadyExists);
        }

        if self.user_repo.username_exists(&username).await? {
            return Err(AppError::UserAlreadyExists);
        }

        // Hash password
        let password_hash = hash(password, DEFAULT_COST)
            .map_err(|_| AppError::InternalError)?;

        // Create user
        let user = User {
            id: Uuid::new_v4(),
            email,
            username,
            password_hash,
            plan: "free".to_string(),
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        self.user_repo.create(&user).await
    }

    pub async fn login(&self, login: String, password: String) -> Result<User> {
        // Try email first
        let user = match self.user_repo.get_by_email(&login).await {
            Ok(user) => user,
            Err(_) => self.user_repo.get_by_username(&login).await.map_err(|_| AppError::InvalidCredentials)?,
        };

        // Verify password
        let valid = verify(password, &user.password_hash)
            .map_err(|_| AppError::InvalidCredentials)?;

        if !valid {
            return Err(AppError::InvalidCredentials);
        }

        Ok(user)
    }

    pub fn generate_token(&self, user_id: Uuid) -> Result<String> {
        let expiration = (Utc::now() + chrono::Duration::days(7)).timestamp() as usize;

        let claims = Claims {
            sub: user_id.to_string(),
            exp: expiration,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        )
        .map_err(|_| AppError::InternalError)
    }

    pub fn validate_token(&self, token: &str) -> Result<Uuid> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| AppError::InvalidToken)?;

        Uuid::parse_str(&token_data.claims.sub).map_err(|_| AppError::InvalidToken)
    }
}
