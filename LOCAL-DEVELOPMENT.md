# 🚀 Локальная разработка FODI SUSHI

## Быстрый старт

### Вариант 1: Автоматический запуск (рекомендуется)

```bash
npm run dev:local
```

Этот скрипт автоматически:
- ✅ Запустит Go backend на http://localhost:8080
- ✅ Запустит Next.js frontend на http://localhost:3000
- ✅ Использует `.env.development.local` для локальной разработки

### Вариант 2: Ручной запуск

#### Терминал 1 - Backend (Go)
```bash
npm run dev:backend
# или
cd backend
go run main.go
```

Вывод должен быть:
```
✅ Database schema migration completed successfully
📡 Starting WebSocket Hub...
✅ WebSocket Hub initialized
🚀 Server starting on port 8080
```

#### Терминал 2 - Frontend (Next.js)
```bash
npm run dev
```

## 📂 Структура конфигурации

```
.env.development.local  ← Локальная разработка (http://localhost:8080)
.env.production         ← Production (https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app)
.env.local              ← Общие настройки
```

## 🔧 Конфигурация окружений

### Локальная разработка
- **Backend API**: http://localhost:8080
- **Frontend**: http://localhost:3000
- **Database**: Neon PostgreSQL (облако)

### Production
- **Backend API**: https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app
- **Frontend**: https://menu-fodifood.vercel.app
- **Database**: Neon PostgreSQL (облако)

## 🧪 Тестирование API локально

### Проверка работы backend:

```bash
# Проверка здоровья сервера
curl http://localhost:8080/health

# Получение продуктов
curl http://localhost:8080/api/products

# Регистрация пользователя
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Вход
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📝 Требования

- **Go**: 1.21+ (https://go.dev/dl/)
- **Node.js**: 18+ (https://nodejs.org/)
- **npm** или **yarn**

## 🐛 Решение проблем

### Backend не запускается
```bash
# Проверьте установку Go
go version

# Установите зависимости Go
cd backend
go mod download
```

### Frontend не видит backend
```bash
# Убедитесь что backend запущен
curl http://localhost:8080/health

# Проверьте .env.development.local
cat .env.development.local | grep NEXT_PUBLIC_API_URL
# Должно быть: NEXT_PUBLIC_API_URL="http://localhost:8080"
```

### Порт занят
```bash
# Найдите процесс на порту 8080
lsof -i :8080

# Убейте процесс
kill -9 <PID>

# Или используйте другой порт в backend/main.go
```

## 📚 Полезные команды

```bash
# Только frontend (с production API)
npm run dev

# Только backend
npm run dev:backend

# Локальная разработка (frontend + backend)
npm run dev:local

# Build для production
npm run build

# Проверка линтинга
npm run lint

# Проверка переводов
npm run translations:check
```

## 🌍 Переключение между окружениями

### Локальная разработка
```bash
# Автоматически использует .env.development.local
npm run dev
```

### Production API + Local Frontend
```bash
# Переименуйте файлы
mv .env.development.local .env.development.local.backup
# Теперь будет использоваться .env.production
npm run dev
```

## 🔐 Переменные окружения

| Переменная | Локально | Production |
|-----------|----------|------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:8080 | https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app |
| `DATABASE_URL` | Neon (pooled) | Neon (pooled) |
| `JWT_SECRET` | your-super-secret... | your-super-secret... |

## 🎯 Workflow разработки

1. **Создайте новую ветку**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Запустите локальную разработку**
   ```bash
   npm run dev:local
   ```

3. **Внесите изменения**
   - Фронтенд: `src/`
   - Бэкенд: `backend/`

4. **Тестируйте изменения**
   - http://localhost:3000

5. **Коммитьте и пушьте**
   ```bash
   git add .
   git commit -m "feat: описание изменений"
   git push origin feature/my-feature
   ```

6. **Создайте Pull Request**

## 🚀 Деплой

### Frontend (Vercel)
```bash
git push origin main
# Автоматический деплой на Vercel
```

### Backend (Koyeb)
- Push в main ветку
- Koyeb автоматически задеплоит

---

**Happy coding! 🎉**
