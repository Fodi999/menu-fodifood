# 🚀 Финальная проверка перед деплоем на Vercel

## ✅ Выполнено локально

- [x] ✅ DATABASE_URL обновлен в `.env.local` с правильным Neon хостом (`c-2` регион)
- [x] ✅ Подключение к Neon PostgreSQL работает
- [x] ✅ Миграции применены: `npx prisma migrate deploy`
- [x] ✅ База данных заполнена тестовыми данными: `npx prisma db seed`
- [x] ✅ Prisma Client сгенерирован: `npx prisma generate`
- [x] ✅ Изображения продуктов добавлены в `public/products/`
- [x] ✅ Next.js конфигурация обновлена (поддержка AVIF/WebP)
- [x] ✅ Все изменения закоммичены и запушены на GitHub
- [x] ✅ Локальный сервер работает без ошибок 404 для изображений

## 📋 Проверка переменных окружения на Vercel

Перейдите в **Vercel Dashboard → Settings → Environment Variables** и проверьте:

### 1. DATABASE_URL
```bash
postgresql://neondb_owner:npg_dz4Gl8ZhPLbX@ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
- Должен быть установлен для всех окружений: **Production, Preview, Development**
- ⚠️ Убедитесь, что хост содержит `c-2` в URL

### 2. NEXTAUTH_URL
**Production:**
```bash
https://menu-fodifood.vercel.app
```
(или ваш кастомный домен)

**Preview & Development:**
```bash
http://localhost:3000
```

### 3. NEXTAUTH_SECRET
```bash
j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```
- Должен быть одинаковым для всех окружений

## 🔄 Redeploy на Vercel

### Вариант 1: Автоматический (рекомендуется)
1. Откройте Vercel Dashboard
2. Перейдите в ваш проект `menu-fodifood`
3. Vercel автоматически обнаружит новый коммит и начнет деплой
4. Дождитесь завершения деплоя (обычно 2-3 минуты)

### Вариант 2: Ручной
1. Откройте Vercel Dashboard
2. Перейдите в **Deployments**
3. Нажмите **Redeploy** на последнем деплое
4. Выберите **Use existing Build Cache** (НЕ отмечайте)
5. Нажмите **Redeploy**

## ✅ Проверка после деплоя

### 1. Проверка API
Откройте в браузере:
- https://menu-fodifood.vercel.app/api/health
  - Ожидается: `{ "status": "ok", "timestamp": "..." }`
  
- https://menu-fodifood.vercel.app/api/products
  - Ожидается: JSON массив с 5 продуктами

### 2. Проверка главной страницы
- https://menu-fodifood.vercel.app/
  - Должны отображаться карточки продуктов
  - Изображения должны загружаться без ошибок 404
  - Кнопка "Add to Cart" должна работать

### 3. Проверка аутентификации
- https://menu-fodifood.vercel.app/auth/signin
  - Форма входа должна отображаться
  - Попробуйте войти с тестовым пользователем:
    - Email: `admin@sushi.com`
    - Password: `admin123`

### 4. Проверка админки
После входа как admin:
- https://menu-fodifood.vercel.app/admin
  - Должна отображаться панель администратора
  - Статистика: продукты, заказы, пользователи

### 5. Проверка логов Vercel
1. Откройте **Vercel Dashboard → Deployments → Latest**
2. Перейдите на вкладку **Runtime Logs**
3. Убедитесь, что нет ошибок типа:
   - ❌ `Error: P1001` (проблемы с подключением к БД)
   - ❌ `500 Internal Server Error`
   - ❌ `NEXTAUTH_URL` не установлен

## 🐛 Диагностика проблем

### Ошибка 500 на главной странице
1. Проверьте Runtime Logs в Vercel
2. Убедитесь, что DATABASE_URL правильный
3. Проверьте, что миграции применены к Neon БД

### Изображения не загружаются (404)
1. Проверьте, что папка `public/products/` есть в репозитории
2. Проверьте, что все изображения закоммичены
3. Очистите кеш деплоя и сделайте redeploy

### NextAuth ошибки
1. Проверьте NEXTAUTH_URL для Production окружения
2. Убедитесь, что NEXTAUTH_SECRET установлен
3. Проверьте, что таблицы `User`, `Account`, `Session` есть в БД

### Проблемы с БД
1. Откройте Neon Console
2. Проверьте, что база `neondb` активна
3. Проверьте подключение через Prisma Studio:
   ```bash
   npx prisma studio
   ```

## 📊 Проверка данных в БД через Neon Console

1. Откройте https://console.neon.tech/
2. Выберите проект и базу `neondb`
3. Перейдите в **SQL Editor**
4. Выполните проверочные запросы:

```sql
-- Проверка продуктов
SELECT COUNT(*) FROM "Product";
-- Ожидается: 5

-- Проверка пользователей
SELECT email, role FROM "User";
-- Ожидается: admin@sushi.com, user@sushi.com

-- Проверка всех таблиц
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
-- Ожидается: User, Product, Order, OrderItem, Cart, CartItem, Account, Session, VerificationToken
```

## 🎯 Критерии успешного деплоя

- ✅ Главная страница загружается без ошибок
- ✅ Продукты отображаются с изображениями
- ✅ API endpoints работают (`/api/health`, `/api/products`)
- ✅ Вход/регистрация работают
- ✅ Админка доступна для admin пользователя
- ✅ Корзина работает (добавление/удаление товаров)
- ✅ В Vercel Runtime Logs нет критических ошибок
- ✅ База данных Neon содержит все таблицы и данные

## 📝 После успешного деплоя

1. Замените изображения-заглушки на реальные фото суши:
   - Используйте инструкцию в `public/products/README.md`
   
2. Обновите мета-данные для SEO:
   - Обновите `src/app/layout.tsx` (title, description)
   
3. Настройте кастомный домен (опционально):
   - Vercel Dashboard → Domains
   
4. Настройте мониторинг (опционально):
   - Vercel Analytics
   - Vercel Speed Insights

---

## 🚀 Быстрые команды

```bash
# Проверка подключения к БД
npx prisma db pull

# Применение миграций
npx prisma migrate deploy

# Заполнение данными
npx prisma db seed

# Открыть Prisma Studio
npx prisma studio

# Локальный dev сервер
npm run dev

# Production build
npm run build

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

---

**Последнее обновление:** 3 октября 2025  
**Статус:** ✅ Готово к production деплою
