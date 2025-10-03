# 🔐 Доступ к админ-панели

## 🎯 Быстрый старт для Vercel

### ✅ Предварительные требования (выполните по порядку):

**1️⃣ Убедитесь, что БД на Neon доступна:**
```bash
npx prisma db pull
# Если успешно - БД подключена ✅
```

**2️⃣ Выполните seed (создание админа):**
```bash
npx prisma db seed

# Должен вывести:
# 🌱 Starting database seeding...
# ✅ Admin user created: admin@fodisushi.com
# ✅ Test user created: user@test.com
# ✅ 5 products created
```

**3️⃣ Проверьте переменные на Vercel:**

Vercel Dashboard → Settings → Environment Variables:

| Переменная | Значение | Окружения |
|------------|----------|-----------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_...@ep-...pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require` | Все |
| `NEXTAUTH_URL` | `https://ваш-домен.vercel.app` | Production, Preview |
| `NEXTAUTH_SECRET` | Секретный ключ из .env.local | Все |

**4️⃣ Сделайте Redeploy:**
- Vercel → Deployments → ⋯ → **Redeploy**
- ❌ Отключите "Use existing Build Cache"

**5️⃣ Готово! Можно входить:**
```
URL:      https://ваш-домен.vercel.app/admin
Email:    admin@fodisushi.com
Password: admin123
```

---

## 📋 Учетные данные администратора

После выполнения `seed` в базе данных создаётся администратор со следующими данными:

```
Email:    admin@fodisushi.com
Password: admin123
Role:     admin
```

---

## 🚀 Как зайти в админ-панель на Vercel

### 1️⃣ **Перейдите на сайт**

```
https://ваш-домен.vercel.app
```

Или ваш кастомный домен.

### 2️⃣ **Нажмите "Войти" (Sign In)**

В правом верхнем углу нажмите на иконку пользователя или кнопку **"Sign In"**.

### 3️⃣ **Введите учетные данные администратора**

```
Email:    admin@fodisushi.com
Password: admin123
```

### 4️⃣ **Перейдите в админ-панель**

После входа в навигации появится кнопка **"Admin"** или перейдите напрямую по URL:

```
https://ваш-домен.vercel.app/admin
```

---

## 🛡️ Защита админ-панели

Админ-панель защищена на уровне:

1. **Middleware** (`src/middleware.ts`):
   - Проверяет авторизацию перед доступом к `/admin/*`
   - Редиректит неавторизованных на `/auth/signin`

2. **Server Component** (`src/app/admin/page.tsx`):
   - Проверяет роль пользователя (`role === "admin"`)
   - Редиректит обычных пользователей на `/auth/signin`

---

## 📊 Разделы админ-панели

После успешного входа доступны следующие разделы:

### 1. **Dashboard** (`/admin`)
- 📈 Статистика:
  - Всего пользователей
  - Всего продуктов
  - Всего заказов
  - Общая выручка
- 📋 Последние заказы

### 2. **Пользователи** (`/admin/users`)
- 👥 Список всех пользователей
- 🔧 Управление ролями (admin/user)
- 📧 Email и имя
- 📅 Дата регистрации

### 3. **Заказы** (`/admin/orders`)
- 🛒 Список всех заказов
- 🔄 Обновление статусов:
  - Pending (Ожидает)
  - Processing (В обработке)
  - Completed (Выполнен)
  - Cancelled (Отменен)
  - Delivered (Доставлен)
- 💰 Сумма заказа
- 📅 Дата создания

---

## 🔑 Создание дополнительных администраторов

### Вариант 1: Через базу данных (рекомендуется)

1. **Подключитесь к Prisma Studio:**

```bash
npx prisma studio
```

2. **Откройте таблицу `User`**

3. **Найдите нужного пользователя**

4. **Измените поле `role` на `admin`**

5. **Сохраните изменения**

### Вариант 2: Через SQL (для продакшена)

1. **Подключитесь к Neon Console:**
   - https://console.neon.tech/
   - Выберите ваш проект
   - SQL Editor

2. **Выполните запрос:**

```sql
UPDATE "User"
SET role = 'admin'
WHERE email = 'новый-админ@example.com';
```

### Вариант 3: Добавить в seed.ts

Отредактируйте `prisma/seed.ts` и добавьте нового администратора:

```typescript
const admin2 = await prisma.user.upsert({
  where: { email: "admin2@fodisushi.com" },
  update: {},
  create: {
    email: "admin2@fodisushi.com",
    name: "Второй администратор",
    password: await bcrypt.hash("password123", 10),
    role: "admin",
  },
});
```

Затем выполните:

```bash
npx prisma db seed
```

---

## 🔒 Безопасность

### ⚠️ ВАЖНО для продакшена:

1. **Смените пароль администратора!**

После первого входа обязательно смените пароль `admin123` на более безопасный:

```sql
-- Через Neon SQL Editor
UPDATE "User"
SET password = '$2a$10$НОВЫЙ_ХЕШ_ПАРОЛЯ'
WHERE email = 'admin@fodisushi.com';
```

Или создайте функцию смены пароля в админ-панели.

2. **Создайте надёжный пароль:**
   - Минимум 12 символов
   - Большие и маленькие буквы
   - Цифры и спецсимволы
   - Пример: `MyS3cur3P@ssw0rd!2024`

3. **Используйте уникальный email:**
   - Не используйте `admin@fodisushi.com` в продакшене
   - Создайте реальный рабочий email

---

## 🧪 Тестовые пользователи

Кроме администратора, seed создаёт тестового пользователя:

```
Email:    user@test.com
Password: user123
Role:     user (обычный пользователь)
```

Этот пользователь **НЕ** имеет доступа к админ-панели.

---

## 🐛 Проблемы и решения

### ❌ "Access Denied" при попытке входа в админку

**Причина:** Пользователь не является администратором.

**Решение:**
1. Проверьте роль пользователя в базе данных
2. Убедитесь, что `role = "admin"`

### ❌ Не могу войти с admin@fodisushi.com

**Возможные причины:**

1. **Seed не был выполнен на продакшене**

Выполните на Vercel через команду:

```bash
# Локально с DATABASE_URL от Vercel
npx prisma db seed
```

2. **Неверный пароль**

Попробуйте сбросить пароль через SQL:

```sql
-- Пароль: admin123
UPDATE "User"
SET password = '$2a$10$YourBcryptHashHere'
WHERE email = 'admin@fodisushi.com';
```

### ❌ Страница /admin редиректит на /auth/signin

**Причина:** Не авторизован или не является администратором.

**Решение:**
1. Войдите с учетными данными администратора
2. Проверьте, что в сессии `user.role === "admin"`

---

## 📝 Чек-лист перед использованием на продакшене

- [ ] Выполнен `npx prisma migrate deploy` на Neon
- [ ] Выполнен `npx prisma db seed` на Neon
- [ ] Проверено, что администратор создан в БД
- [ ] Изменён пароль администратора на безопасный
- [ ] Изменён email администратора на реальный
- [ ] Проверен доступ к `/admin`
- [ ] Проверена работа всех разделов админки

---

## 🚀 Быстрый старт на локальной машине

```bash
# 1. Применить миграции
npx prisma migrate deploy

# 2. Создать администратора
npx prisma db seed

# 3. Запустить сервер
npm run dev

# 4. Открыть в браузере
open http://localhost:3000

# 5. Войти как администратор
# Email: admin@fodisushi.com
# Password: admin123

# 6. Перейти в админку
open http://localhost:3000/admin
```

---

## 📚 Дополнительные ресурсы

- [NextAuth.js документация](https://next-auth.js.org/)
- [Prisma документация](https://www.prisma.io/docs)
- [Neon Console](https://console.neon.tech/)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## 💡 Полезные команды

```bash
# Открыть Prisma Studio
npx prisma studio

# Проверить роль пользователя
# В Prisma Studio → User → найти по email → проверить role

# Пересоздать seed данные
npx prisma db seed

# Проверить подключение к БД
npx prisma db pull
```

---

**Готово!** Теперь вы можете войти в админ-панель на Vercel! 🎉
