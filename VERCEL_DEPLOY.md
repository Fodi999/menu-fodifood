# 🚀 Инструкция по деплою на Vercel

## Шаг 1: Настройка переменных окружения в Vercel

Перейдите в **Vercel → Settings → Environment Variables** и добавьте:

```env
DATABASE_URL=postgresql://neondb_owner:пароль@ep-xxx.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

### Как получить DATABASE_URL:
1. Зайдите в [Neon Console](https://console.neon.tech)
2. Выберите ваш проект
3. Скопируйте **Connection String** (Pooled connection)
4. Должна быть в формате: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

### Генерация NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Шаг 2: Локальная настройка .env

Создайте файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://neondb_owner:пароль@ep-xxx.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw="
```

## Шаг 3: Применить миграции к базе данных Neon

```bash
# Применить существующие миграции
npx prisma migrate deploy

# Или создать схему напрямую (если миграции еще нет)
npx prisma db push

# Заполнить БД тестовыми данными
npx prisma db seed
```

## Шаг 4: Проверка локально

```bash
npm run build
npm start
```

Откройте http://localhost:3000 и проверьте:
- ✅ Загрузка главной страницы
- ✅ Регистрация нового пользователя
- ✅ Вход в систему
- ✅ Личный кабинет
- ✅ Админ-панель (для admin@example.com)

## Шаг 5: Redeploy в Vercel

```bash
git add -A
git commit -m "Final fixes for production deployment"
git push
```

Или в Vercel Dashboard: **Deployments → Redeploy**

## Шаг 6: Проверка на Vercel

После деплоя проверьте:
- ✅ https://menu-fodifood.vercel.app загружается
- ✅ Регистрация работает
- ✅ Вход работает
- ✅ Админ-панель доступна

## 🔐 Тестовые учетные записи

После выполнения `npx prisma db seed`:

**Администратор:**
- Email: admin@example.com
- Password: admin123

**Пользователь:**
- Email: user@example.com
- Password: user123

## ❗ Важные замечания

1. **Не коммитить .env файл!** (уже в .gitignore)
2. **Использовать одинаковый NEXTAUTH_SECRET** локально и на Vercel
3. **DATABASE_URL должен быть Pooled connection** от Neon
4. **Миграции** применять через `prisma migrate deploy`, не через `db push` в продакшене

## 🐛 Troubleshooting

### Ошибка: "Invalid `prisma.user.findUnique()`"
```bash
npx prisma generate
npx prisma migrate deploy
```

### Ошибка: "NEXTAUTH_URL is not defined"
Проверьте, что переменная добавлена в Vercel Environment Variables

### Ошибка: "Can't reach database server"
- Проверьте DATABASE_URL
- Убедитесь, что используете Pooled connection
- Проверьте, что `?sslmode=require` добавлен в конец URL
