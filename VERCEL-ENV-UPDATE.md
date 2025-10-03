# 🔄 Обновление переменных окружения на Vercel

## ✅ Текущие значения для копирования

Скопируйте эти значения в Vercel → Settings → Environment Variables:

### 1️⃣ DATABASE_URL
```
postgresql://neondb_owner:npg_dz4Gl8ZhPLbX@ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Важно:**
- ✅ Используется Pooled connection (`-pooler`)
- ✅ Включает `c-2` в домене
- ✅ Пароль: `npg_dz4Gl8ZhPLbX`

### 2️⃣ NEXTAUTH_URL
```
https://menu-fodifood.vercel.app
```
⚠️ **Замените** на ваш реальный домен Vercel!

### 3️⃣ NEXTAUTH_SECRET
```
j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```
✅ Тот же секрет, что и локально

---

## 📋 Пошаговая инструкция

### Шаг 1: Откройте настройки Vercel
1. Перейдите на https://vercel.com/dashboard
2. Выберите проект `menu-fodifood`
3. Settings → Environment Variables

### Шаг 2: Обновите переменные
Для каждой переменной:
1. Найдите переменную в списке
2. Нажмите на три точки (...) → **Edit**
3. Вставьте новое значение из списка выше
4. Выберите окружения: **Production**, **Preview**, **Development**
5. Нажмите **Save**

### Шаг 3: Redeploy проекта
После обновления всех переменных:
1. Deployments → последний деплой
2. Три точки (...) → **Redeploy**
3. ✅ Установите галочку "Use existing Build Cache"
4. Нажмите **Redeploy**

---

## ✅ Проверка

После redeploy проверьте:

### 1. Health endpoint
```bash
curl https://menu-fodifood.vercel.app/api/health
```
Ожидаемый результат:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-10-03T..."
}
```

### 2. Products API
```bash
curl https://menu-fodifood.vercel.app/api/products
```
Должен вернуть массив продуктов (5 штук после seed).

### 3. Главная страница
Откройте в браузере: https://menu-fodifood.vercel.app
- ✅ Должны загрузиться продукты
- ✅ Нет ошибок 500
- ✅ Работает навигация

---

## 🔍 Диагностика проблем

### Ошибка: "Can't reach database server"
- ❌ Неправильный DATABASE_URL
- ✅ Проверьте хост: должен включать `c-2`
- ✅ Проверьте, что используется Pooled connection (`-pooler`)

### Ошибка: "password authentication failed"
- ❌ Неправильный пароль
- ✅ Пароль должен начинаться с `npg_`
- ✅ Скопируйте пароль из Neon Console

### Ошибка 500 на сайте
- Проверьте логи: Vercel → Deployments → Runtime Logs
- Убедитесь, что все три переменные установлены
- Проверьте NEXTAUTH_URL (должен быть HTTPS)

---

## 🎯 Локальные учетные данные

После успешного деплоя можете войти с:

**Админ:**
- Email: `admin@fodisushi.com`
- Пароль: `admin123`

**Пользователь:**
- Email: `user@test.com`
- Пароль: `user123`

---

## 📝 Полезные команды

### Локальная проверка
```bash
# Проверить подключение к БД
npx prisma db pull

# Открыть Prisma Studio
npx prisma studio

# Посмотреть данные в БД
# Откроется http://localhost:5555
```

### Vercel CLI (опционально)
```bash
# Посмотреть текущие переменные
vercel env ls

# Добавить переменную
vercel env add DATABASE_URL

# Обновить переменную
vercel env rm DATABASE_URL
vercel env add DATABASE_URL
```
