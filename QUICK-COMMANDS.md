# ⚡ БЫСТРЫЕ КОМАНДЫ

## 🔧 Локальная настройка Neon БД

```bash
# 1. Обновите .env.local со строкой из Neon
# DATABASE_URL="postgresql://neondb_owner:пароль@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# 2. Примените миграции
npx prisma migrate deploy

# 3. Заполните БД тестовыми данными
npx prisma db seed

# 4. Откройте Prisma Studio для просмотра
npx prisma studio

# 5. Запустите dev сервер
npm run dev
```

---

## ✅ Проверка локально

```bash
# API Health
curl http://localhost:3000/api/health

# API Products
curl http://localhost:3000/api/products
```

Или откройте в браузере:
- http://localhost:3000/api/health
- http://localhost:3000/api/products
- http://localhost:3000

---

## 🚀 Настройка Vercel

### Environment Variables (Production):

```env
DATABASE_URL=postgresql://neondb_owner:пароль@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

### Деплой:

```bash
# Push код → Vercel автоматически задеплоит
git push
```

---

## ✅ Проверка на Vercel

```bash
# API Health
curl https://menu-fodifood.vercel.app/api/health

# API Products
curl https://menu-fodifood.vercel.app/api/products
```

Или откройте в браузере:
- https://menu-fodifood.vercel.app/api/health
- https://menu-fodifood.vercel.app/api/products
- https://menu-fodifood.vercel.app

---

## 🔄 Полезные команды Prisma

```bash
# Генерация Prisma Client
npx prisma generate

# Создание новой миграции (локально)
npx prisma migrate dev --name migration_name

# Применение миграций (продакшен)
npx prisma migrate deploy

# Сброс БД и пересоздание (ОСТОРОЖНО! Удалит все данные)
npx prisma migrate reset

# Заполнение БД тестовыми данными
npx prisma db seed

# Открыть Prisma Studio
npx prisma studio

# Просмотр статуса миграций
npx prisma migrate status

# Синхронизация схемы без миграций (dev only)
npx prisma db push
```

---

## 🔧 Полезные Git команды

```bash
# Проверить статус
git status

# Добавить все файлы
git add .

# Коммит с сообщением
git commit -m "Your message"

# Push на GitHub (→ автодеплой на Vercel)
git push

# Посмотреть последние коммиты
git log --oneline -5
```

---

## 📊 Логи и отладка

### Vercel:

```bash
# Установить Vercel CLI (если нет)
npm i -g vercel

# Просмотр логов
vercel logs

# Локальный запуск как на продакшене
vercel dev
```

### Локально:

```bash
# Проверка NODE_ENV
echo $NODE_ENV

# Просмотр переменных окружения
cat .env.local

# Очистка кэша Next.js
rm -rf .next

# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install

# Проверка билда
npm run build
```

---

## 🆘 Быстрые решения проблем

### Проблема: "Can't reach database"

```bash
# Проверьте .env.local
cat .env.local | grep DATABASE_URL

# Перезапустите терминал
# Ctrl+C → npm run dev
```

---

### Проблема: "Prisma Client not found"

```bash
npx prisma generate
npm run dev
```

---

### Проблема: "Migration failed"

```bash
# Сбросьте БД (ОСТОРОЖНО!)
npx prisma migrate reset

# Засеедьте заново
npx prisma db seed
```

---

### Проблема: Vercel деплой падает

```bash
# Проверьте логи
vercel logs

# Проверьте Environment Variables в Vercel Dashboard
# Убедитесь, что все 3 переменные заданы

# Сделайте Redeploy
git commit --allow-empty -m "Redeploy"
git push
```

---

## 🎯 Тестовые аккаунты

**Админ:**
- Email: `admin@fodisushi.com`
- Пароль: `admin123`

**Пользователь:**
- Email: `user@test.com`
- Пароль: `user123`

---

## 📚 Полезные ссылки

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📖 [Prisma Docs](https://www.prisma.io/docs)
- 📖 [Vercel Docs](https://vercel.com/docs)
- 📖 [Neon Docs](https://neon.tech/docs)
- 📖 [NextAuth Docs](https://next-auth.js.org)

---

**Последнее обновление:** 3 октября 2025
