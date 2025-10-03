# 🚀 ПОШАГОВАЯ ИНСТРУКЦИЯ: НАСТРОЙКА NEON БД

## ✅ ЧТО НУЖНО СДЕЛАТЬ СЕЙЧАС

### **Шаг 1: Получите строку подключения из Neon**

1. Зайдите на [https://console.neon.tech](https://console.neon.tech)
2. Откройте ваш проект `fodi-sushi` (или создайте новый)
3. В разделе **Connection Details** найдите **"Pooled connection"**
4. Скопируйте строку вида:
   ```
   postgresql://neondb_owner:AbCdEf123@ep-soft-mud-a1b2c3d4-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

---

### **Шаг 2: Обновите `.env.local` с Neon URL**

Откройте файл `.env.local` в корне проекта и **замените** `DATABASE_URL`:

```bash
# Database - Neon PostgreSQL (для разработки И продакшена)
DATABASE_URL="postgresql://neondb_owner:ВАШ_ПАРОЛЬ@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth - локальный сервер
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw="
```

**⚠️ Важно:** Вставьте **полную** строку подключения с паролем!

---

### **Шаг 3: Примените миграции к Neon БД**

В терминале VS Code выполните:

```bash
npx prisma migrate deploy
```

**Ожидаемый результат:**

```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "neondb", schema "public" at "ep-xxx-pooler.eu-central-1.aws.neon.tech:5432"

1 migration found in prisma/migrations

Applying migration `20251003085714_init`

The following migration(s) have been applied:

migrations/
  └─ 20251003085714_init/
    └─ migration.sql

Your database is now in sync with your schema.
✔ All migrations have been successfully applied
```

**✅ Что произошло:**
- В Neon созданы все таблицы: `User`, `Product`, `Order`, `OrderItem`, `Ingredient`, `StockItem`, `ProductIngredient`, `TechCard`, `ChatMessage`

---

### **Шаг 4: Проверьте структуру БД**

Запустите Prisma Studio:

```bash
npx prisma studio
```

**Откроется браузер** по адресу `http://localhost:5555`

**✅ Проверьте:**
- Слева в меню должны быть все 9 таблиц
- Таблицы пустые (пока нет данных) - это нормально

**Скриншот того, что должно быть:**
```
Models
├── User (0 records)
├── Product (0 records)
├── Order (0 records)
├── OrderItem (0 records)
├── Ingredient (0 records)
├── StockItem (0 records)
├── ProductIngredient (0 records)
├── TechCard (0 records)
└── ChatMessage (0 records)
```

Закройте Prisma Studio (`Ctrl+C` в терминале).

---

### **Шаг 5: Заполните БД тестовыми данными**

Выполните seed скрипт:

```bash
npx prisma db seed
```

**Ожидаемый результат:**

```
Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...
🌱 Starting database seeding...
✅ Admin user created: admin@fodisushi.com
✅ Test user created: user@test.com
✅ Product created: Филадельфия
✅ Product created: Калифорния
✅ Product created: Дракон
✅ Product created: Сет Премиум
✅ Product created: Нигири лосось
✅ Product created: Том Ям
🎉 Database seeded successfully!

🌱 The seed command has been executed.
```

**✅ Что произошло:**
- Создано 2 пользователя (admin и user)
- Создано ~6 продуктов (роллы, суши, супы)

---

### **Шаг 6: Проверьте данные в Prisma Studio**

Снова запустите:

```bash
npx prisma studio
```

**✅ Теперь должны быть:**
- `User` - 2 записи (admin и user)
- `Product` - 6-10 записей (продукты)

**Тестовые аккаунты** (см. `CREDENTIALS.md`):

**Админ:**
- Email: `admin@fodisushi.com`
- Пароль: `admin123`

**Пользователь:**
- Email: `user@test.com`
- Пароль: `user123`

---

### **Шаг 7: Запустите локальный dev сервер**

```bash
npm run dev
```

**Откройте браузер:**

1. **API Health:** http://localhost:3000/api/health
   ```json
   { "ok": true, "timestamp": "..." }
   ```

2. **API Products:** http://localhost:3000/api/products
   ```json
   [
     { "id": "...", "name": "Филадельфия", "price": 450, ... },
     ...
   ]
   ```

3. **Главная страница:** http://localhost:3000
   - ✅ Продукты отображаются
   - ✅ Корзина работает
   - ✅ Нет ошибок в консоли

4. **Вход в систему:** http://localhost:3000/auth/signin
   - Войдите с `admin@fodisushi.com` / `admin123`
   - Перейдите в `/profile` и `/admin`

---

## 🚀 Настройка Vercel Environment Variables

Теперь, когда локально всё работает, настроим продакшен.

### **Шаг 8: Добавьте переменные окружения в Vercel**

1. Зайдите на [https://vercel.com](https://vercel.com)
2. Откройте проект `menu-fodifood`
3. Перейдите в **Settings → Environment Variables**
4. Добавьте **3 переменные** для **Production**:

```env
DATABASE_URL
postgresql://neondb_owner:ВАШ_ПАРОЛЬ@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_URL
https://menu-fodifood.vercel.app

NEXTAUTH_SECRET
j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

**⚠️ Критически важно:**
- `DATABASE_URL` - **точно такая же** строка, как в `.env.local`
- `NEXTAUTH_URL` - **ваш реальный URL** на Vercel
- `NEXTAUTH_SECRET` - **тот же секрет**, что в `.env.local`

---

### **Шаг 9: Сделайте Redeploy на Vercel**

#### Вариант 1: Автоматический деплой

```bash
git push
```

Vercel автоматически задеплоит новую версию.

#### Вариант 2: Ручной Redeploy

В Vercel Dashboard:
1. **Deployments → Latest Deployment**
2. Нажмите **⋮ (три точки)** → **Redeploy**
3. Выберите **Use existing Build Cache** → **Redeploy**

---

### **Шаг 10: Проверьте продакшен**

Откройте в браузере:

1. **API Health:** https://menu-fodifood.vercel.app/api/health
   ```json
   { "ok": true }
   ```

2. **API Products:** https://menu-fodifood.vercel.app/api/products
   ```json
   [{ "id": "...", "name": "Филадельфия", ... }]
   ```

3. **Главная:** https://menu-fodifood.vercel.app
   - ✅ Продукты загружаются
   - ✅ Корзина работает
   - ✅ Нет ошибок

4. **Вход:** https://menu-fodifood.vercel.app/auth/signin
   - Войдите с `admin@fodisushi.com` / `admin123`
   - Проверьте `/profile` и `/admin`

---

## ✅ ФИНАЛЬНЫЙ ЧЕК-ЛИСТ

- [ ] Neon БД создана
- [ ] Строка подключения скопирована
- [ ] `.env.local` обновлен с Neon URL
- [ ] Миграции применены (`npx prisma migrate deploy`)
- [ ] БД заполнена данными (`npx prisma db seed`)
- [ ] Локально: `http://localhost:3000/api/health` → ✅
- [ ] Локально: Продукты отображаются → ✅
- [ ] Vercel: Environment Variables настроены (3 штуки)
- [ ] Vercel: Redeploy выполнен
- [ ] Vercel: `https://menu-fodifood.vercel.app/api/health` → ✅
- [ ] Vercel: Продукты отображаются → ✅
- [ ] Vercel: Аутентификация работает → ✅

---

## 🎉 ГОТОВО!

Ваш проект полностью настроен и работает в продакшене!

**Ссылки:**
- 🌐 Production: https://menu-fodifood.vercel.app
- 📊 Vercel Dashboard: https://vercel.com/dashboard
- 🗄️ Neon Console: https://console.neon.tech

---

## 🆘 Помощь при ошибках

### ❌ "Environment variable not found: DATABASE_URL"

**Решение:**
```bash
# Проверьте .env.local
cat .env.local

# Убедитесь, что DATABASE_URL есть
# Перезапустите терминал VS Code
```

---

### ❌ "Can't reach database server"

**Решение:**
1. Проверьте строку подключения (должна быть с `-pooler`)
2. Убедитесь, что скопировали **весь** URL с паролем
3. Проверьте интернет-соединение

---

### ❌ "Migration failed"

**Решение:**
```bash
# Сбросьте БД и создайте заново
npx prisma migrate reset

# Засеедьте данными
npx prisma db seed
```

---

**Последнее обновление:** 3 октября 2025
