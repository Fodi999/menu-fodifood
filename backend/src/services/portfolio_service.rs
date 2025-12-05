use crate::error::{AppError, Result};
use crate::models::Portfolio;
use crate::repositories::PortfolioRepository;
use chrono::Utc;
use uuid::Uuid;

pub struct PortfolioService {
    portfolio_repo: PortfolioRepository,
}

impl PortfolioService {
    pub fn new(portfolio_repo: PortfolioRepository) -> Self {
        Self { portfolio_repo }
    }

    pub async fn create(
        &self,
        user_id: Uuid,
        slug: String,
        theme: String,
        data: serde_json::Value,
        is_public: bool,
    ) -> Result<Portfolio> {
        // Check if slug exists
        if self.portfolio_repo.slug_exists(&slug).await? {
            return Err(AppError::Validation("Slug already exists".to_string()));
        }

        let portfolio = Portfolio {
            id: Uuid::new_v4(),
            user_id,
            slug,
            theme,
            data,
            is_public,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        self.portfolio_repo.create(&portfolio).await
    }

    pub async fn get_by_id(&self, id: Uuid) -> Result<Portfolio> {
        self.portfolio_repo.get_by_id(id).await
    }

    pub async fn get_by_slug(&self, slug: &str) -> Result<Portfolio> {
        let portfolio = self.portfolio_repo.get_by_slug(slug).await?;

        if !portfolio.is_public {
            return Err(AppError::Unauthorized);
        }

        Ok(portfolio)
    }

    pub async fn get_user_portfolios(&self, user_id: Uuid) -> Result<Vec<Portfolio>> {
        self.portfolio_repo.get_by_user_id(user_id).await
    }

    pub async fn update(&self, id: Uuid, user_id: Uuid, mut portfolio: Portfolio) -> Result<Portfolio> {
        let existing = self.portfolio_repo.get_by_id(id).await?;

        // Check ownership
        if existing.user_id != user_id {
            return Err(AppError::Unauthorized);
        }

        portfolio.id = id;
        portfolio.user_id = user_id;
        portfolio.updated_at = Utc::now();

        self.portfolio_repo.update(&portfolio).await
    }

    pub async fn delete(&self, id: Uuid, user_id: Uuid) -> Result<()> {
        let portfolio = self.portfolio_repo.get_by_id(id).await?;

        // Check ownership
        if portfolio.user_id != user_id {
            return Err(AppError::Unauthorized);
        }

        self.portfolio_repo.delete(id).await
    }
}
