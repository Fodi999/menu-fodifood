# ⚡ Быстрый старт деплоя

## 🎯 Что нужно сделать СЕЙЧАС:

### 1️⃣ В Vercel → Settings → Environment Variables добавить:

```env
DATABASE_URL=postgresql://neondb_owner:пароль@ep-xxx.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

**Где взять DATABASE_URL:**
- Зайти в [Neon Console](https://console.neon.tech)
- Скопировать **Pooled Connection String**

### 2️⃣ Локально создать файл `.env`:

```bash
# В корне проекта menu-fodifood/.env
DATABASE_URL="postgresql://neondb_owner:пароль@ep-xxx.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw="
```

**💡 Генерация нового NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3️⃣ Применить миграции к базе Neon:

```bash
npx prisma migrate deploy
# или
npx prisma db push

# Заполнить тестовыми данными
npx prisma db seed
```

### 4️⃣ Проверить локально:

```bash
npm run build
npm start
```

Открыть: http://localhost:3000

### 5️⃣ Redeploy в Vercel:

```bash
git push
```

Или в Vercel: **Deployments → Redeploy**

---

## ✅ Чек-лист готовности:

- [ ] DATABASE_URL добавлен в Vercel Environment Variables
- [ ] NEXTAUTH_URL добавлен в Vercel Environment Variables
- [ ] NEXTAUTH_SECRET добавлен в Vercel Environment Variables
- [ ] Локальный `.env` файл создан
- [ ] Миграции применены (`npx prisma migrate deploy`)
- [ ] Тестовые данные загружены (`npx prisma db seed`)
- [ ] Локальная сборка успешна (`npm run build`)
- [ ] Код запушен на GitHub
- [ ] Vercel deployment успешен

---

## 🔐 Тестовые аккаунты (после seed):

**Админ:**
- Email: `admin@example.com`
- Password: `admin123`

**Пользователь:**
- Email: `user@example.com`
- Password: `user123`

---

📚 **Подробная документация:** [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)
