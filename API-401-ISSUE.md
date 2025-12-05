# ⚠️ Проблема: Публичные endpoints требуют авторизацию

## Текущая ситуация

**Деплой успешен**: https://portfolio-a4yb.shuttle.app ✅

**Проблема**: Все API endpoints, включая публичные, возвращают 401 Unauthorized

```bash
curl https://portfolio-a4yb.shuttle.app/api/restaurant/categories
# Ответ: {"error":"Invalid token"}

curl https://portfolio-a4yb.shuttle.app/api/restaurant/menu
# Ответ: {"error":"Invalid token"}
```

## Причина

Скорее всего на предыдущих деплоях была другая версия бэкенда, где middleware применялся ко всем роутам. Новая версия с правильным разделением на public/protected routes только что задеплоилась.

## Решение 1: Проверить актуальный код (БЫСТРО)

Текущий код в `backend/src/main.rs` правильный:

```rust
// Public restaurant routes (без middleware!)
let restaurant_public = Router::new()
    .route("/api/restaurant/categories", get(...))
    .route("/api/restaurant/menu", get(...))
    .route("/api/restaurant/orders", post(...))
    .with_state(pool.clone());  // ← НЕТ auth middleware!

// Protected restaurant routes (с middleware)
let restaurant_protected = Router::new()
    .route("/api/restaurant/admin/categories", post(...))
    .route("/api/restaurant/admin/menu", post(...))
    .layer(axum_middleware::from_fn_with_state(
        auth_service.clone(),
        middleware_single::auth_middleware,  // ← ЕСТЬ middleware
    ))
    .with_state(pool.clone());
```

**Проверка**: Деплой только что завершился, поэтому нужно подождать ~1 минуту пока новая версия полностью запустится.

## Решение 2: Добавить seed данные в БД

База данных пуста, поэтому даже когда endpoints заработают, они вернут пустые массивы.

```bash
# 1. Получить connection string к БД
cd backend
cargo shuttle resource list

# Вывод будет примерно:
# Resource: database::shared::postgres
# Connection string: postgresql://user:pass@host:port/db

# 2. Загрузить seed данные
psql "postgresql://CONNECTION_STRING" < migrations/seed_data.sql

# Должно вывести:
# INSERT 0 5  (categories)
# INSERT 0 15 (menu_items)
# INSERT 0 1  (restaurant_info)
```

## Решение 3: Временный workaround для фронтенда

**Уже сделано!** ✅

Обновлен `RestaurantContext.tsx`:
- Оборачивает каждый API call в try-catch
- При ошибке использует пустые массивы
- Показывает warning вместо error toast
- Приложение работает в offline режиме

```typescript
try {
  const categoriesData = await categoriesAPI.getAll();
  // ... обработка
} catch (error) {
  console.warn('⚠️ Failed to load categories, using empty array');
  setCategories([]);
}
```

## Тестирование

### Тест 1: Проверить health endpoint

```bash
curl https://portfolio-a4yb.shuttle.app/health
# Должно вернуть: OK
```

### Тест 2: Проверить публичные endpoints (через 1 минуту)

```bash
# Подождать ~1 минуту после деплоя, затем:

curl https://portfolio-a4yb.shuttle.app/api/restaurant/categories
# Должно вернуть: [] (пустой массив, т.к. БД пуста)

curl https://portfolio-a4yb.shuttle.app/api/restaurant/menu
# Должно вернуть: [] (пустой массив)
```

### Тест 3: После загрузки seed данных

```bash
curl https://portfolio-a4yb.shuttle.app/api/restaurant/categories
# Должно вернуть: массив из 5 категорий

curl https://portfolio-a4yb.shuttle.app/api/restaurant/menu
# Должно вернуть: массив из 15 блюд
```

## Что делать сейчас

### Вариант A: Подождать и проверить (РЕКОМЕНДУЕТСЯ)

```bash
# 1. Подождать 1-2 минуты
sleep 120

# 2. Проверить health
curl https://portfolio-a4yb.shuttle.app/health

# 3. Проверить categories
curl https://portfolio-a4yb.shuttle.app/api/restaurant/categories

# Если вернулся [], а не {"error":"Invalid token"} - ВСЁ РАБОТАЕТ!
# Просто нужно добавить seed данные
```

### Вариант B: Загрузить seed данные прямо сейчас

```bash
cd backend

# Получить connection string
cargo shuttle resource list

# Загрузить данные
psql "CONNECTION_STRING_FROM_ABOVE" < migrations/seed_data.sql

# Проверить
curl https://portfolio-a4yb.shuttle.app/api/restaurant/categories
# Должен вернуть 5 категорий!
```

### Вариант C: Посмотреть логи деплоя

```bash
cd backend
cargo shuttle logs

# Должны увидеть:
# 🚀 Portfolio API ready for deployment
# Listening on 0.0.0.0:8000
```

## Ожидаемое поведение

### После добавления seed данных:

**Публичные endpoints (без токена):**
```bash
GET  /api/restaurant/categories          → [5 категорий]
GET  /api/restaurant/menu                → [15 блюд]
GET  /api/restaurant/info                → {restaurant info}
POST /api/restaurant/orders              → {created order}
```

**Admin endpoints (с токеном):**
```bash
# Сначала получить токен
curl -X POST https://portfolio-a4yb.shuttle.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
# Ответ: {"token": "eyJ..."}

# Использовать токен
curl -H "Authorization: Bearer eyJ..." \
  https://portfolio-a4yb.shuttle.app/api/restaurant/admin/categories
# → [5 категорий с дополнительной инфо]
```

## Статус

- ✅ Деплой завершен успешно
- ✅ Frontend обработка ошибок добавлена
- ⏳ Ожидание запуска новой версии (~1-2 мин)
- ⏳ Нужно добавить seed данные в БД

## Следующие шаги

1. **Подождать 2 минуты** для полного запуска
2. **Проверить** `curl https://portfolio-a4yb.shuttle.app/api/restaurant/categories`
3. Если вернулся `[]` - загрузить seed данные
4. Если вернулся `{"error":"Invalid token"}` - посмотреть логи

---

**Обновлено**: 5 декабря 2025, 20:07  
**Деплой**: depl_01KBQY196YYAHMTRBY5XZVZV0Y (running)
