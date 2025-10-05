# ⚙️ Структура файлов окружения

## 📁 Файлы в проекте

```
menu-fodifood/
├── .env.example          ✅ В Git (шаблон)
├── .env.local           ❌ НЕ в Git (локальная разработка)
└── .env                 ❌ НЕ в Git (устаревший, можно удалить)
```

---

## 🔧 Локальная разработка

### 1. Создайте `.env.local` из шаблона:

```bash
cp .env.example .env.local
```

### 2. Отредактируйте `.env.local`:

```env
# Локальный PostgreSQL
DATABASE_URL="postgresql://dmitrijfomin@localhost:5432/fodisushi"

# Или Docker
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fodisushi"

# Локальный сервер
NEXTAUTH_URL="http://localhost:3000"

# Сгенерируйте секрет: openssl rand -base64 32
NEXTAUTH_SECRET="j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw="
```

### 3. Запустите миграции:

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Запустите проект:

```bash
npm run dev
```

---

## 🚀 Продакшен (Vercel + Neon)

### 1. Создайте базу данных в Neon

1. Зайдите на [neon.tech](https://neon.tech)
2. Создайте проект
3. Скопируйте **"Pooled connection string"**:
   ```
   postgresql://neondb_owner:пароль@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Примените миграции к Neon БД (локально)

```bash
# Временно установите DATABASE_URL от Neon
export DATABASE_URL="postgresql://neondb_owner:пароль@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Примените миграции
npx prisma migrate deploy

# Вернитесь к локальной БД (закройте терминал или unset)
```

### 3. Настройте переменные в Vercel

Зайдите в **Vercel → Settings → Environment Variables** и добавьте:

#### Production:

```env
DATABASE_URL=postgresql://neondb_owner:пароль@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

**⚠️ ВАЖНО:**
- Используйте **один и тот же** `NEXTAUTH_SECRET` везде
- В `DATABASE_URL` должен быть `-pooler` в хосте
- `NEXTAUTH_URL` - ваш реальный домен на Vercel

### 4. Деплой

```bash
git push  # Vercel автоматически задеплоит
```

---

## 🔄 Приоритет загрузки переменных

Next.js загружает переменные окружения в следующем порядке:

1. `.env.local` - **локальная разработка** (высший приоритет)
2. `.env.development` - для `npm run dev`
3. `.env.production` - для `npm run build`
4. `.env` - базовые значения (низший приоритет)

**На Vercel:** используются только **Environment Variables** из настроек проекта.

---

## ❓ Частые вопросы

### Можно ли использовать одну БД для разработки и продакшена?

**Не рекомендуется!** Лучше:
- Локально: свой PostgreSQL или Docker
- На Vercel: Neon БД

Но можно использовать **разные ветки** в Neon для dev/prod.

### Что делать, если .env уже в Git?

```bash
# Удалите из Git (но оставьте локально)
git rm --cached .env
git commit -m "Remove .env from Git"
git push

# Переименуйте в .env.local
mv .env .env.local
```

### Нужно ли коммитить .env.example?

**Да!** Это шаблон для других разработчиков. Но **БЕЗ** реальных паролей!

---

## ✅ Проверка

### Локально:

```bash
# Проверьте, что .env.local не в Git
git status

# Должно быть:
# Untracked files:
#   .env.local

# Запустите проект
npm run dev
```

### На Vercel:

```bash
# Проверьте переменные окружения
vercel env ls

# Должно показать:
# DATABASE_URL (Production)
# NEXTAUTH_URL (Production)
# NEXTAUTH_SECRET (Production)
```

---

## 📚 Полезные ссылки

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Prisma Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)

---

**Последнее обновление:** 3 октября 2025
