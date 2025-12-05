use crate::error::{AppError, Result};
use crate::models::Portfolio;
use sqlx::PgPool;
use uuid::Uuid;

pub struct PortfolioRepository {
    pool: PgPool,
}

impl PortfolioRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create(&self, portfolio: &Portfolio) -> Result<Portfolio> {
        let portfolio = sqlx::query_as::<_, Portfolio>(
            r#"
            INSERT INTO portfolios (id, user_id, slug, theme, data, is_public)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            "#,
        )
        .bind(portfolio.id)
        .bind(portfolio.user_id)
        .bind(&portfolio.slug)
        .bind(&portfolio.theme)
        .bind(&portfolio.data)
        .bind(portfolio.is_public)
        .fetch_one(&self.pool)
        .await?;

        Ok(portfolio)
    }

    pub async fn get_by_id(&self, id: Uuid) -> Result<Portfolio> {
        let portfolio = sqlx::query_as::<_, Portfolio>("SELECT * FROM portfolios WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.pool)
            .await?
            .ok_or(AppError::PortfolioNotFound)?;

        Ok(portfolio)
    }

    pub async fn get_by_slug(&self, slug: &str) -> Result<Portfolio> {
        let portfolio = sqlx::query_as::<_, Portfolio>("SELECT * FROM portfolios WHERE slug = $1")
            .bind(slug)
            .fetch_optional(&self.pool)
            .await?
            .ok_or(AppError::PortfolioNotFound)?;

        Ok(portfolio)
    }

    pub async fn get_by_user_id(&self, user_id: Uuid) -> Result<Vec<Portfolio>> {
        let portfolios = sqlx::query_as::<_, Portfolio>(
            "SELECT * FROM portfolios WHERE user_id = $1 ORDER BY created_at DESC",
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(portfolios)
    }

    pub async fn update(&self, portfolio: &Portfolio) -> Result<Portfolio> {
        let portfolio = sqlx::query_as::<_, Portfolio>(
            r#"
            UPDATE portfolios 
            SET slug = $2, theme = $3, data = $4, is_public = $5, updated_at = NOW()
            WHERE id = $1
            RETURNING *
            "#,
        )
        .bind(portfolio.id)
        .bind(&portfolio.slug)
        .bind(&portfolio.theme)
        .bind(&portfolio.data)
        .bind(portfolio.is_public)
        .fetch_one(&self.pool)
        .await?;

        Ok(portfolio)
    }

    pub async fn delete(&self, id: Uuid) -> Result<()> {
        sqlx::query("DELETE FROM portfolios WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await?;

        Ok(())
    }

    pub async fn slug_exists(&self, slug: &str) -> Result<bool> {
        let exists: bool =
            sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM portfolios WHERE slug = $1)")
                .bind(slug)
                .fetch_one(&self.pool)
                .await?;

        Ok(exists)
    }
}
