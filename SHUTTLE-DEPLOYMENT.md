# Shuttle Deployment Guide 🚀

## Текущий статус
- **Project ID**: proj_01KATPN2VCPZ8WCN7QX6TNSA7X
- **Project Name**: portfolio
- **URL**: https://portfolio-a4yb.shuttle.app
- **Instance**: Basic (0.25 vCPU, 0.5 GB RAM)
- **Последний деплой**: 2025-11-30T14:48:47 (running)

## Быстрый деплой

```bash
cd backend

# 1. Убедиться что код компилируется
cargo check

# 2. Задеплоить на Shuttle
cargo shuttle deploy

# 3. Проверить статус
cargo shuttle deployment list
```

## Полная инструкция

### Перед деплоем

1. **Проверить компиляцию**
```bash
cargo build --release
```

2. **Проверить секреты** (если нужно обновить)
```bash
cargo shuttle secrets list
```

3. **Обновить секреты** (опционально)
```bash
# Редактировать Secrets.toml, затем:
cargo shuttle secrets push
```

### Деплой

```bash
# Задеплоить на Shuttle
cargo shuttle deploy

# Или с флагом --allow-dirty если есть uncommitted изменения
cargo shuttle deploy --allow-dirty
```

### После деплоя

1. **Проверить статус**
```bash
cargo shuttle deployment list
cargo shuttle project status
```

2. **Посмотреть логи**
```bash
cargo shuttle logs
```

3. **Проверить health endpoint**
```bash
curl https://portfolio-a4yb.shuttle.app/health
```

4. **Тестировать API**
```bash
# Проверить категории
curl https://portfolio-a4yb.shuttle.app/api/restaurant/categories

# Проверить меню
curl https://portfolio-a4yb.shuttle.app/api/restaurant/menu
```

## Управление базой данных

### Добавить тестовые данные

```bash
# Получить строку подключения к БД
cargo shuttle resource list

# Выполнить seed скрипт (замените CONNECTION_STRING)
psql postgresql://CONNECTION_STRING < migrations/seed_data.sql
```

### Проверить данные в БД

```bash
# Подключиться к БД
psql postgresql://CONNECTION_STRING

# SQL команды
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM menu_items;
SELECT COUNT(*) FROM orders;
SELECT * FROM restaurant_info;
```

## Откат к предыдущей версии

```bash
# Посмотреть историю деплоев
cargo shuttle deployment list

# Остановить текущий
cargo shuttle deployment stop depl_CURRENT_ID

# Запустить старый
cargo shuttle deployment start depl_OLD_ID
```

## Troubleshooting

### Ошибка компиляции
```bash
# Очистить кэш и пересобрать
cargo clean
cargo build --release
```

### Ошибка "Project not found"
```bash
# Переинициализировать проект
cargo shuttle init --name portfolio
```

### Проблемы с БД
```bash
# Пересоздать БД (⚠️ удалит все данные!)
cargo shuttle resource delete database
cargo shuttle deploy
```

### Проверить логи ошибок
```bash
cargo shuttle logs --latest
```

## Секреты (Secrets.toml)

Текущие секреты в проекте:

```toml
JWT_SECRET = "your-secret-key-change-in-production"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = "$2b$12$mwSCIgJtnb8aOnJ50Kki6O8IsPnlT8CPZD5xvcnkj7AcFYzGIWVUe"  # admin123

CLOUDINARY_CLOUD_NAME = "dwrn0ohbp"
CLOUDINARY_API_KEY = "548187327547635"
CLOUDINARY_API_SECRET = "Kw3PMLna2GIOOHoSRbtUGF90hXM"
CLOUDINARY_UPLOAD_PRESET = "portfolio_unsigned"
```

⚠️ **Важно**: Не коммитить Secrets.toml в git!

## Мониторинг

### Проверка работоспособности
```bash
# Health check
curl https://portfolio-a4yb.shuttle.app/health

# Должен вернуть: OK
```

### Тест авторизации
```bash
# Login
curl -X POST https://portfolio-a4yb.shuttle.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'

# Должен вернуть JWT токен
```

### Тест создания заказа
```bash
curl -X POST https://portfolio-a4yb.shuttle.app/api/restaurant/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test",
    "customer_phone": "+48123456789",
    "delivery_street": "Test",
    "delivery_building": "1",
    "delivery_city": "Warszawa",
    "delivery_postal_code": "00-001",
    "payment_method": "cash",
    "items": [{"menu_item_id": 1, "quantity": 1}]
  }'
```

## Полезные команды

```bash
# Статус проекта
cargo shuttle project status

# Список ресурсов (БД)
cargo shuttle resource list

# Перезапустить
cargo shuttle project restart

# Удалить проект (⚠️ необратимо!)
cargo shuttle project delete
```

## Что изменилось в последнем коммите

✅ Полная интеграция API:
- Restaurant API клиент (`src/lib/restaurant-api.ts`)
- Интеграция с RestaurantContext
- Создание заказов через API
- Загрузка данных с бэкенда
- Сохранение изменений на бэкенд

✅ Backend готов:
- Все endpoints работают
- JWT авторизация
- PostgreSQL база данных
- Cloudinary для изображений

## Следующие шаги

1. **Задеплоить текущую версию**
```bash
cargo shuttle deploy --allow-dirty
```

2. **Добавить seed данные в БД**
```bash
# Получить connection string
cargo shuttle resource list
# Выполнить seed_data.sql
```

3. **Протестировать на фронтенде**
- Запустить `npm run dev`
- Войти в режим редактирования
- Сохранить изменения
- Создать тестовый заказ

---

**Готово к деплою!** ✅
