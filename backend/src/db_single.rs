use sqlx::{PgPool, postgres::PgPoolOptions};
use anyhow::Result;

pub async fn create_pool(database_url: &str) -> Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await?;
    
    Ok(pool)
}

pub async fn run_migrations(pool: &PgPool) -> Result<()> {
    // Спрощена таблиця: тільки одне портфоліо без users
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS portfolio (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            slug VARCHAR(255) NOT NULL UNIQUE,
            theme VARCHAR(50) NOT NULL DEFAULT 'elegant',
            data JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        "#,
    )
    .execute(pool)
    .await?;

    // Создание таблицы blog_posts
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS blog_posts (
            id VARCHAR(36) PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            title VARCHAR(500) NOT NULL,
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            date DATE NOT NULL,
            author VARCHAR(255) NOT NULL,
            image VARCHAR(1000) NOT NULL,
            category VARCHAR(100) NOT NULL,
            read_time VARCHAR(50) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        "#,
    )
    .execute(pool)
    .await?;

    // Создание индексов для blog_posts
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)")
        .execute(pool)
        .await?;
    
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC)")
        .execute(pool)
        .await?;

    // Перевірка: якщо портфоліо не існує, створюємо дефолтне
    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM portfolio")
        .fetch_one(pool)
        .await?;

    if count.0 == 0 {
        // Створюємо дефолтне портфоліо
        sqlx::query(
            r#"
            INSERT INTO portfolio (slug, theme, data)
            VALUES ($1, $2, $3)
            "#,
        )
        .bind("my-portfolio")
        .bind("elegant")
        .bind(serde_json::json!({
            "name": "Your Name",
            "title": "Your Title",
            "bio": "Your bio here",
            "contacts": {
                "email": "your@email.com",
                "phone": "+1234567890"
            },
            "experience": [],
            "education": [],
            "skills": []
        }))
        .execute(pool)
        .await?;
        
        println!("✅ Created default portfolio with slug 'my-portfolio'");
    }

    Ok(())
}
