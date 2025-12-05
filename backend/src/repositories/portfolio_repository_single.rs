use sqlx::PgPool;
use uuid::Uuid;
use anyhow::Result;
use crate::models_single::{Portfolio, UpdatePortfolioRequest};

pub struct PortfolioRepository {
    pool: PgPool,
}

impl PortfolioRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // Отримати єдине портфоліо (публічний доступ)
    pub async fn get(&self) -> Result<Option<Portfolio>> {
        let portfolio = sqlx::query_as::<_, Portfolio>(
            "SELECT id, slug, theme, data, updated_at FROM portfolio LIMIT 1"
        )
        .fetch_optional(&self.pool)
        .await?;

        Ok(portfolio)
    }

    // Оновити портфоліо (тільки для admin)
    pub async fn update(&self, req: UpdatePortfolioRequest) -> Result<Portfolio> {
        let portfolio = sqlx::query_as::<_, Portfolio>(
            r#"
            UPDATE portfolio
            SET theme = COALESCE($1, theme),
                data = $2,
                updated_at = NOW()
            WHERE id = (SELECT id FROM portfolio LIMIT 1)
            RETURNING id, slug, theme, data, updated_at
            "#,
        )
        .bind(req.theme)
        .bind(req.data)
        .fetch_one(&self.pool)
        .await?;

        Ok(portfolio)
    }
}
