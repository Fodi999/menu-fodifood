use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, NaiveDate, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct BlogPost {
    pub id: String,
    pub slug: String,
    pub title: String,
    pub excerpt: String,
    pub content: String,
    #[serde(with = "naive_date_format")]
    pub date: NaiveDate,
    pub author: String,
    pub image: String,
    pub category: String,
    pub read_time: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBlogPost {
    pub slug: String,
    pub title: String,
    pub excerpt: String,
    pub content: String,
    #[serde(with = "naive_date_format")]
    pub date: NaiveDate,
    pub author: String,
    pub image: String,
    pub category: String,
    pub read_time: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateBlogPost {
    pub slug: Option<String>,
    pub title: Option<String>,
    pub excerpt: Option<String>,
    pub content: Option<String>,
    #[serde(default, with = "naive_date_format_option")]
    pub date: Option<NaiveDate>,
    pub author: Option<String>,
    pub image: Option<String>,
    pub category: Option<String>,
    pub read_time: Option<String>,
}

// Custom serialization for NaiveDate
mod naive_date_format {
    use chrono::NaiveDate;
    use serde::{self, Deserialize, Deserializer, Serializer};

    const FORMAT: &str = "%Y-%m-%d";

    pub fn serialize<S>(date: &NaiveDate, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT));
        serializer.serialize_str(&s)
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<NaiveDate, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveDate::parse_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }
}

// Custom serialization for Option<NaiveDate>
mod naive_date_format_option {
    use chrono::NaiveDate;
    use serde::{self, Deserialize, Deserializer};

    const FORMAT: &str = "%Y-%m-%d";

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Option<NaiveDate>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s: Option<String> = Option::deserialize(deserializer)?;
        match s {
            Some(s) => NaiveDate::parse_from_str(&s, FORMAT)
                .map(Some)
                .map_err(serde::de::Error::custom),
            None => Ok(None),
        }
    }
}
