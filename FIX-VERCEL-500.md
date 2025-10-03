# 🚨 КРИТИЧЕСКИ ВАЖНО: Применение миграций к Neon БД

## ⚠️ ПРОБЛЕМА на Vercel

**Ошибка:** `Failed to load resource: 500` и `Products data is not an array: Object`

**Причина:** Миграции НЕ применены к базе данных Neon на продакшене!

---

## ✅ РЕШЕНИЕ: Примените миграции к Neon

### Шаг 1: Получите строку подключения из Neon

1. Зайдите на [https://console.neon.tech](https://console.neon.tech)
2. Откройте ваш проект
3. Скопируйте **"Pooled connection"** строку:
   ```
   postgresql://neondb_owner:AbCdEf123@ep-soft-mud-a1b2c3d4-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

---

### Шаг 2: Примените миграции (выполните В ТЕРМИНАЛЕ)

**В одной команде** (замените URL на свой):

```bash
DATABASE_URL='postgresql://neondb_owner:ВАШ_ПАРОЛЬ@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require' npx prisma migrate deploy
```

**Или в двух командах:**

```bash
# 1. Установите переменную окружения (только для текущего терминала)
export DATABASE_URL='postgresql://neondb_owner:ВАШ_ПАРОЛЬ@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require'

# 2. Примените миграции
npx prisma migrate deploy
```

---

### Ожидаемый результат:

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "neondb" at "ep-xxx-pooler.eu-central-1.aws.neon.tech:5432"

1 migration found in prisma/migrations

Applying migration `20251003085714_init`

The following migration(s) have been applied:

migrations/
  └─ 20251003085714_init/
    └─ migration.sql

Your database is now in sync with your schema.
✔ All migrations have been successfully applied
```

---

### Шаг 3: Засеедьте БД тестовыми данными

```bash
# Используйте тот же DATABASE_URL
DATABASE_URL='postgresql://neondb_owner:ВАШ_ПАРОЛЬ@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require' npx prisma db seed
```

**Ожидаемый результат:**

```
🌱 Starting database seeding...
✅ Admin user created: admin@fodisushi.com
✅ Test user created: user@test.com
✅ Product created: Филадельфия
✅ Product created: Калифорния
...
🎉 Database seeded successfully!
```

---

### Шаг 4: Проверьте Neon БД в Prisma Studio

```bash
DATABASE_URL='postgresql://neondb_owner:ВАШ_ПАРОЛЬ@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require' npx prisma studio
```

Откроется браузер на `http://localhost:5555`

**Проверьте:**
- `User` - должно быть 2 записи (admin, user)
- `Product` - должно быть ~6 записей

---

### Шаг 5: Redeploy на Vercel

Теперь БД готова, нужно передеплоить Vercel:

#### Вариант 1: Push пустой коммит

```bash
git commit --allow-empty -m "Trigger redeploy after Neon migration"
git push
```

#### Вариант 2: Ручной Redeploy в Vercel Dashboard

1. Зайдите на [https://vercel.com](https://vercel.com)
2. Откройте проект `menu-fodifood`
3. **Deployments → Latest Deployment**
4. Нажмите **⋮ (три точки)** → **Redeploy**
5. **Redeploy**

---

### Шаг 6: Проверьте продакшен

Откройте в браузере:

```
https://menu-fodifood.vercel.app/api/health
https://menu-fodifood.vercel.app/api/products
https://menu-fodifood.vercel.app
```

**Ожидаемый результат:**

✅ `/api/health` → `{ "ok": true }`
✅ `/api/products` → Массив продуктов
✅ Главная страница загружается с продуктами
✅ Нет ошибок 500

---

## 🔍 Проверка Environment Variables в Vercel

Убедитесь, что в **Vercel → Settings → Environment Variables** для **Production** есть:

```env
DATABASE_URL=postgresql://neondb_owner:пароль@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

**⚠️ ВАЖНО:**
- `DATABASE_URL` должен быть **точно такой же**, как вы использовали для миграций
- Должен содержать `-pooler` в хосте
- Должен содержать полный пароль

---

## 🆘 Troubleshooting

### ❌ Ошибка: "Can't reach database server"

**Решение:**
1. Проверьте, что скопировали **весь** URL с паролем
2. Убедитесь, что используете **Pooled connection** (с `-pooler`)
3. Проверьте интернет-соединение

---

### ❌ Ошибка: "Migration failed"

**Решение:**
```bash
# Проверьте статус миграций
DATABASE_URL='ваш_url' npx prisma migrate status

# Если БД не пустая, используйте resolve
DATABASE_URL='ваш_url' npx prisma migrate resolve --applied 20251003085714_init
```

---

### ❌ Продукты не загружаются после деплоя

**Решение:**
```bash
# Засеедьте Neon БД
DATABASE_URL='ваш_url' npx prisma db seed

# Redeploy на Vercel
git commit --allow-empty -m "Redeploy"
git push
```

---

## ✅ Чек-лист

- [ ] Строка подключения из Neon скопирована
- [ ] Миграции применены: `npx prisma migrate deploy`
- [ ] БД засеедена: `npx prisma db seed`
- [ ] Prisma Studio показывает данные
- [ ] Vercel Environment Variables проверены
- [ ] Redeploy выполнен
- [ ] https://menu-fodifood.vercel.app/api/health → ✅
- [ ] https://menu-fodifood.vercel.app/api/products → массив
- [ ] Главная страница работает

---

## 🎯 Итого

После выполнения всех шагов:

1. ✅ Neon БД создана и настроена
2. ✅ Миграции применены
3. ✅ Данные загружены
4. ✅ Vercel подключен к Neon
5. ✅ Продакшен работает

**Готово!** 🎉

---

**Последнее обновление:** 3 октября 2025
