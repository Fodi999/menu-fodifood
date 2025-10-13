# 🏗️ Архитектура FodiFood с Rust AI Bot

## Схема взаимодействия

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Next.js   │────────▶│   Go Backend │◀────────│  Rust Bot   │
│  Frontend   │  HTTP   │   (Koyeb)    │  HTTP   │  (Shuttle)  │
│             │         │              │         │             │
│             │◀────────│  JWT Auth    │─────────│ JWT Verify  │
│             │  Token  │  PostgreSQL  │  API    │             │
│             │         │              │         │             │
│             │         └──────────────┘         │             │
│             │                                  │             │
│             │◀─────────────────────────────────│             │
│             │        WebSocket /ws             │             │
└─────────────┘                                  └─────────────┘
```

## Текущая проблема

**Ошибка**: `{"type":"error","message":"Not authenticated"}`

**Причина**: Rust бот получает JWT токен, но не может его валидировать самостоятельно.

## Решение: Rust должен проверять токен через Go API

### Вариант 1: Rust бот проверяет токен через Go Backend

```rust
// В Rust боте (handlers/ws.rs)

async fn verify_token(token: &str, go_backend_url: &str) -> Result<User, String> {
    let client = reqwest::Client::new();
    
    let response = client
        .get(format!("{}/api/auth/verify", go_backend_url))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .map_err(|e| format!("Failed to verify token: {}", e))?;
    
    if response.status().is_success() {
        let user = response.json::<User>().await
            .map_err(|e| format!("Failed to parse user: {}", e))?;
        Ok(user)
    } else {
        Err("Invalid token".to_string())
    }
}

// В WebSocket handler
pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    Query(params): Query<HashMap<String, String>>,
) -> impl IntoResponse {
    let token = params.get("token").cloned();
    
    ws.on_upgrade(move |socket| async move {
        if let Some(token) = token {
            // Проверяем токен через Go API
            match verify_token(&token, "http://localhost:8080").await {
                Ok(user) => {
                    // Токен валидный, начинаем чат
                    handle_socket(socket, user).await;
                }
                Err(e) => {
                    // Отправляем ошибку и закрываем
                    let error = json!({
                        "type": "error",
                        "message": format!("Authentication failed: {}", e)
                    });
                    let _ = socket.send(Message::Text(error.to_string())).await;
                    let _ = socket.close().await;
                }
            }
        } else {
            // Нет токена
            let error = json!({
                "type": "error",
                "message": "Not authenticated: token required"
            });
            let _ = socket.send(Message::Text(error.to_string())).await;
            let _ = socket.close().await;
        }
    })
}
```

### Вариант 2: Go Backend добавляет endpoint для проверки токена

```go
// В Go backend (main.go)

func VerifyTokenHandler(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
        c.JSON(401, gin.H{"error": "No token provided"})
        return
    }

    // Убираем "Bearer " prefix
    tokenString = strings.TrimPrefix(tokenString, "Bearer ")

    // Парсим и валидируем JWT
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
    })

    if err != nil || !token.Valid {
        c.JSON(401, gin.H{"error": "Invalid token"})
        return
    }

    claims := token.Claims.(jwt.MapClaims)
    
    // Возвращаем данные пользователя
    c.JSON(200, gin.H{
        "id":    claims["user_id"],
        "email": claims["email"],
        "name":  claims["name"],
        "role":  claims["role"],
    })
}

// Добавляем роут
router.GET("/api/auth/verify", VerifyTokenHandler)
```

## Настройка переменных окружения

### Rust Bot (.env)

```bash
# Go Backend URL для проверки токенов
GO_BACKEND_URL=http://localhost:8080
# Production: https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app

# JWT Secret (должен совпадать с Go)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# OpenAI API Key
OPENAI_API_KEY=sk-...
```

### Cargo.toml (добавить зависимости)

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

## Альтернатива: Rust сам валидирует JWT (не рекомендуется)

```rust
use jsonwebtoken::{decode, DecodingKey, Validation};

#[derive(Debug, Deserialize)]
struct Claims {
    user_id: String,
    email: String,
    name: Option<String>,
    role: String,
    exp: usize,
}

fn verify_jwt(token: &str, secret: &str) -> Result<Claims, String> {
    let validation = Validation::default();
    
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &validation,
    )
    .map(|data| data.claims)
    .map_err(|e| format!("JWT validation failed: {}", e))
}
```

**Недостатки**:
- Нужно дублировать JWT_SECRET
- Нет проверки в базе данных (пользователь может быть удалён)
- Нет проверки прав доступа

## Рекомендуемая архитектура

1. ✅ **Frontend** → отправляет JWT токен в WebSocket URL
2. ✅ **Rust Bot** → получает токен и проверяет через Go API
3. ✅ **Go Backend** → валидирует токен и возвращает user data
4. ✅ **Rust Bot** → если токен валидный, начинает AI чат

## Что нужно сделать

### В Go Backend:
1. Добавить endpoint `GET /api/auth/verify`
2. Проверять JWT токен
3. Возвращать user data или 401

### В Rust Bot:
1. Добавить зависимость `reqwest`
2. Создать функцию `verify_token()`
3. Вызывать Go API перед началом чата
4. Если токен невалидный - отправить ошибку и закрыть WebSocket

### Во Frontend:
1. ✅ Уже передаёт токен в URL (`?token=...`)
2. ✅ Показывает ошибки аутентификации
3. ✅ Предлагает войти если не авторизован

## Production деплой

```bash
# Go Backend на Koyeb
GO_BACKEND_URL=https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app

# Rust Bot на Shuttle
# Автоматически получит HTTPS URL
# wss://fodifood-bot.shuttleapp.rs/ws
```

## Безопасность

- ✅ JWT токен передаётся в query параметре (WSS = зашифровано)
- ✅ Go Backend проверяет токен с секретом
- ✅ Rust Bot не хранит секрет (делегирует проверку)
- ✅ Можно проверить user.role для ограничения доступа

## Следующие шаги

1. Добавить `/api/auth/verify` в Go backend
2. Обновить Rust bot для проверки токена
3. Протестировать локально
4. Задеплоить на production
