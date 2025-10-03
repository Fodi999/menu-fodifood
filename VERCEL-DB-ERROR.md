# 🔴 РЕШЕНИЕ ПРОБЛЕМЫ: Vercel не видит базу данных

## ❌ Ошибка

```
Failed to load resource: the server responded with a status of 500
Products data is not an array: Object
```

Это означает, что **Vercel не может подключиться к Neon БД**.

---

## ✅ РЕШЕНИЕ (Пошагово)

### 1️⃣ Проверьте Environment Variables в Vercel

Зайдите в **Vercel → Settings → Environment Variables** и убедитесь, что **ВСЕ 3 переменные** добавлены для **Production**:

```env
DATABASE_URL=postgresql://neondb_owner:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

#### ⚠️ КРИТИЧЕСКИ ВАЖНО:

**DATABASE_URL должен:**
1. ✅ Быть **Pooled connection** (с `-pooler` в хосте)
2. ✅ Содержать `?sslmode=require` в конце
3. ✅ Включать **полный** пароль без пробелов
4. ✅ Быть скопирован **точно** из Neon Dashboard

**Пример правильного URL:**
```
postgresql://neondb_owner:npg_AbC123XyZ456@ep-soft-mud-a1b2c3d4-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

### 2️⃣ Где взять правильный DATABASE_URL из Neon

1. Зайдите на [https://console.neon.tech](https://console.neon.tech)
2. Выберите ваш проект
3. На Dashboard найдите **"Connection string"**
4. Выберите **"Pooled connection"** (НЕ Direct connection!)
5. Скопируйте **весь URL** целиком
6. Вставьте в Vercel **без изменений**

---

### 3️⃣ Примените миграции к Neon БД (если ещё не сделали)

**Локально** выполните:

```bash
# 1. Установите DATABASE_URL от Neon
export DATABASE_URL="postgresql://neondb_owner:пароль@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# 2. Примените миграции
npx prisma migrate deploy

# 3. (Опционально) Засеедьте данными
npx prisma db seed
```

**Ожидаемый результат:**
```
✔ All migrations have been successfully applied
```

---

### 4️⃣ Redeploy на Vercel

После добавления/изменения Environment Variables **обязательно** сделайте Redeploy:

#### Вариант 1: Через Dashboard

1. Зайдите в **Vercel → Deployments**
2. Найдите последний деплой
3. Нажмите **"..."** → **"Redeploy"**
4. Выберите **"Use existing Build Cache"** → **Deploy**

#### Вариант 2: Через Git

```bash
# Сделайте любое изменение и запушьте
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

### 5️⃣ Проверьте логи в Vercel

1. Зайдите в **Vercel → Deployments**
2. Кликните на последний деплой
3. Перейдите в **"Functions"** → **View Function Logs**
4. Найдите ошибки с `prisma` или `database`

**Что искать:**
- `Error: Can't reach database server`
- `Error: P1001: Can't reach database`
- `Error: SSL connection required`

---

### 6️⃣ Проверьте доступ к БД из Neon

1. Зайдите в **Neon Console**
2. Перейдите в **Settings → IP Allow**
3. Убедитесь, что выбрано **"Allow all" (0.0.0.0/0)**

**Или добавьте IP Vercel:**
- Найдите IP Vercel в логах ошибки
- Добавьте в Neon IP Allow

---

### 7️⃣ Проверьте Prisma Client

В логах Vercel может быть ошибка:
```
Error: @prisma/client did not initialize yet
```

**Решение:** Добавьте postinstall скрипт в `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

Затем redeploy.

---

### 8️⃣ Тестируйте API напрямую

После Redeploy откройте в браузере:

```
https://menu-fodifood.vercel.app/api/health
```

#### ✅ Если работает:
```json
{
  "ok": true,
  "timestamp": "..."
}
```

Затем проверьте:
```
https://menu-fodifood.vercel.app/api/products
```

#### ❌ Если ошибка:
```json
{
  "error": "Failed to fetch products",
  "details": "Can't reach database server...",
  "timestamp": "..."
}
```

Скопируйте `details` и проверьте, что не так с DATABASE_URL.

---

## 🔍 Частые ошибки DATABASE_URL

### ❌ НЕ правильно:

```env
# Без -pooler (Direct connection)
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.region.aws.neon.tech/neondb

# Без sslmode
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx-pooler.region.aws.neon.tech/neondb

# С пробелами в пароле
DATABASE_URL=postgresql://neondb_owner: password @ep-xxx-pooler.region.aws.neon.tech/neondb
```

### ✅ Правильно:

```env
DATABASE_URL=postgresql://neondb_owner:npg_AbC123XyZ@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## 📋 Чек-лист диагностики

- [ ] DATABASE_URL в Vercel содержит `-pooler`
- [ ] DATABASE_URL в Vercel содержит `?sslmode=require`
- [ ] DATABASE_URL скопирован **целиком** из Neon (включая пароль)
- [ ] В Neon: Settings → IP Allow → "Allow all"
- [ ] Миграции применены к Neon БД (`npx prisma migrate deploy`)
- [ ] После изменения переменных сделан Redeploy
- [ ] В `package.json` есть `"postinstall": "prisma generate"`
- [ ] В логах Vercel нет ошибок Prisma
- [ ] `/api/health` возвращает `{ ok: true }`

---

## 🆘 Если ничего не помогает

### Попробуйте пересоздать базу:

1. В Neon: **Delete project**
2. Создайте новый проект в Neon
3. Скопируйте **новый** DATABASE_URL
4. Обновите в Vercel Environment Variables
5. Примените миграции заново:
   ```bash
   export DATABASE_URL="новый_url"
   npx prisma migrate deploy
   npx prisma db seed
   ```
6. Redeploy на Vercel

---

## 📞 Дополнительная помощь

Если проблема сохраняется:

1. Скопируйте **точную ошибку** из Vercel Function Logs
2. Скопируйте **DATABASE_URL** (без пароля!) для проверки формата
3. Проверьте статус Neon: [https://neon.tech/status](https://neon.tech/status)
4. Создайте Issue с описанием проблемы

---

**Последнее обновление:** 3 октября 2025
