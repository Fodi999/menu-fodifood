# Restaurant API Backend

Backend для сайта ресторана FodiFood на Rust/Axum + PostgreSQL.

## ✅ Что настроено

### Модели данных
- ✅ `Category` - категории меню (Суши, Роллы, Супы и т.д.)
- ✅ `MenuItem` - позиции меню с мультиязычностью (EN/RU/PL)
- ✅ `Order` & `OrderItem` - заказы с детальной информацией о доставке
- ✅ `RestaurantInfo` - информация о ресторане

### Базаданных
- ✅ PostgreSQL (Neon Cloud)
- ✅ Миграции применены (таблицы созданы)
- ✅ Тестовые данные загружены

### API Endpoints

#### 🔓 Public (без авторизации)

**Categories:**
- `GET /api/restaurant/categories` - Получить активные категории
- `GET /api/restaurant/categories/:id` - Получить категорию по ID
- `GET /api/restaurant/categories/slug/:slug` - Получить категорию по slug

**Menu:**
- `GET /api/restaurant/menu` - Получить меню (с фильтрами)
  - Query params: `category_id`, `is_popular`, `is_new`, `is_vegetarian`
- `GET /api/restaurant/menu/:id` - Получить позицию по ID
- `GET /api/restaurant/menu/category/:category_id` - Получить меню по категории

**Orders:**
- `POST /api/restaurant/orders` - Создать заказ
- `GET /api/restaurant/orders/:order_number` - Получить заказ по номеру

**Restaurant Info:**
- `GET /api/restaurant/info` - Получить информацию о ресторане

#### 🔐 Protected (требуется JWT токен админа)

**Categories:**
- `GET /api/restaurant/admin/categories` - Все категории (включая неактивные)
- `POST /api/restaurant/admin/categories` - Создать категорию
- `PUT /api/restaurant/admin/categories/:id` - Обновить категорию
- `DELETE /api/restaurant/admin/categories/:id` - Удалить категорию

**Menu:**
- `GET /api/restaurant/admin/menu` - Все позиции (включая недоступные)
- `POST /api/restaurant/admin/menu` - Создать позицию
- `PUT /api/restaurant/admin/menu/:id` - Обновить позицию
- `DELETE /api/restaurant/admin/menu/:id` - Удалить позицию

**Orders:**
- `GET /api/restaurant/admin/orders` - Все заказы
- `GET /api/restaurant/admin/orders/:id` - Заказ по ID с деталями
- `PUT /api/restaurant/admin/orders/:id/status` - Обновить статус заказа
- `PUT /api/restaurant/admin/orders/:id/cancel` - Отменить заказ

**Restaurant Info:**
- `PUT /api/restaurant/admin/info` - Обновить информацию о ресторане

## 🚀 Запуск локально

```bash
cd backend
cargo run
```

## 📦 Deploy на Shuttle

```bash
cd backend
shuttle deploy
```

## 🔧 Конфигурация

### Secrets (Shuttle.toml)
```toml
JWT_SECRET = "your-secret-key"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = "$2b$12$..." 
```

### Environment (.env)
```env
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## 📝 Примеры запросов

### Создать заказ
```json
POST /api/restaurant/orders
{
  "customer_name": "Ivan Ivanov",
  "customer_phone": "+48123456789",
  "customer_email": "ivan@example.com",
  "delivery_street": "ul. Przykładowa",
  "delivery_building": "123",
  "delivery_apartment": "45",
  "delivery_city": "Warsaw",
  "delivery_postal_code": "00-001",
  "payment_method": "cash",
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2,
      "special_instructions": "Без васаби"
    }
  ]
}
```

### Обновить позицию меню (Admin)
```json
PUT /api/restaurant/admin/menu/1
Authorization: Bearer <JWT_TOKEN>
{
  "price": 35.00,
  "is_popular": true,
  "is_available": true
}
```

## 📊 Статусы заказов
- `pending` - Ожидает подтверждения
- `confirmed` - Подтвержден
- `preparing` - Готовится
- `ready` - Готов
- `delivering` - Доставляется
- `delivered` - Доставлен
- `cancelled` - Отменен

## 🌍 Мультиязычность
Все тексты хранятся на 3 языках:
- `name`, `description` - английский (по умолчанию)
- `name_ru`, `description_ru` - русский
- `name_pl`, `description_pl` - польский

## 🔗 Frontend Integration
Frontend на Next.js подключается через `src/lib/backend-api.ts`
