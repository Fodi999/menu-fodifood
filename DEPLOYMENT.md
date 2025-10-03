# 🚀 Инструкция по деплою на Vercel + Neon

Полное руководство по деплою FODI SUSHI на Vercel с базой данных Neon PostgreSQL.

## 📋 Чек-лист перед деплоем

- [ ] Проект собирается локально без ошибок (`npm run build`)
- [ ] Все изменения закоммичены в Git
- [ ] Создан аккаунт на [Vercel](https://vercel.com)
- [ ] Создан аккаунт на [Neon](https://neon.tech)

---

## 1️⃣ Настройка базы данных Neon

### Шаг 1: Создание проекта в Neon

1. Перейдите на [https://neon.tech](https://neon.tech)
2. Зарегистрируйтесь или войдите
3. Нажмите **"Create a project"**
4. Выберите:
   - **Region:** EU (Europe) - для минимальной задержки
   - **PostgreSQL version:** 16 (рекомендуется)
   - **Project name:** `fodi-sushi` или любое другое

### Шаг 2: Получение строки подключения

После создания проекта:

1. В дашборде Neon найдите **"Connection Details"**
2. Скопируйте **"Pooled connection string"** (для Prisma)
   
   Пример:
   ```
   postgresql://neondb_owner:AbCdEfGh12345@ep-soft-mud-a1b2c3d4-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

3. Сохраните эту строку - она понадобится дальше

---

## 2️⃣ Настройка локального окружения

### Создайте файл `.env` в корне проекта:

```bash
# Database (используйте строку из Neon)
DATABASE_URL="postgresql://neondb_owner:пароль@ep-soft-mud-agon8wu3-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ваш_сгенерированный_секрет"
```

### Сгенерируйте NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Скопируйте результат и вставьте в `.env` как значение `NEXTAUTH_SECRET`.

**⚠️ Важно:** Используйте **один и тот же** `NEXTAUTH_SECRET` локально и на продакшене!

---

## 3️⃣ Применение миграций к Neon БД

**Локально** выполните:

```bash
# DATABASE_URL уже настроен в .env, просто примените миграции
npx prisma migrate deploy

# (Опционально) Заполните тестовыми данными
npx prisma db seed
```

Или используйте готовый скрипт:

```bash
chmod +x deploy-db.sh
./deploy-db.sh
```

**✅ Результат:** В Neon созданы все таблицы из Prisma Schema

---

## 4️⃣ Настройка Vercel

### Шаг 1: Импорт проекта

1. Перейдите на [https://vercel.com](https://vercel.com)
2. Нажмите **"Add New Project"**
3. Выберите **"Import Git Repository"**
4. Подключите GitHub и выберите репозиторий `menu-fodifood`

### Шаг 2: Настройка Environment Variables

В разделе **"Environment Variables"** добавьте:

#### Production (обязательно)

```env
DATABASE_URL=postgresql://neondb_owner:пароль@host-pooler.region.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=тот_же_секрет_что_и_в_локальном_env
```

**⚠️ Критически важно:**
- `DATABASE_URL` - строка из Neon (Pooled connection)
- `NEXTAUTH_URL` - URL вашего деплоя на Vercel (замените на свой домен)
- `NEXTAUTH_SECRET` - используйте **точно такой же** секрет, как в локальном `.env`!

Или просто сделайте `git push` - Vercel автоматически задеплоит из GitHub!

## 🔧 Важные изменения в коде

### ✅ Уже исправлено:

1. ✅ Middleware оптимизирован (45.1 kB вместо 1.02 MB)
2. ✅ Все ESLint/TypeScript ошибки исправлены
3. ✅ Добавлены проверки массивов в `.map()`
4. ✅ Все `<a>` теги заменены на `<Link>`
5. ✅ Типизация исправлена для NextAuth

### 🛡️ Защита от ошибок:

```typescript
// В MainContentDynamic.tsx и admin/products/page.tsx
const categories = ["All", ...Array.from(new Set((products || []).map(p => p.category)))];
const filteredProducts = (products || []).filter(...);

// Проверка в fetchProducts:
if (Array.isArray(data)) {
  setProducts(data);
} else {
  setProducts([]);
}
```

## 📝 После деплоя

1. Проверьте работу приложения: `https://menu-fodifood.vercel.app`
2. Попробуйте зарегистрироваться и войти
3. Проверьте админ-панель: `https://menu-fodifood.vercel.app/admin`

## 🔑 Тестовые учетные данные

См. файл `CREDENTIALS.md` для тестовых аккаунтов.

## 🆘 Решение проблем

### Ошибка "Edge Function too large"
✅ **Решено**: Middleware оптимизирован до 45.1 kB

### Ошибка "products.map is not a function"
✅ **Решено**: Добавлены проверки `Array.isArray()` и `|| []`

### Ошибка подключения к БД
- Проверьте `DATABASE_URL` в Vercel Environment Variables
- Убедитесь, что строка подключения включает `?sslmode=require`
- Проверьте, что миграции применены: `npx prisma migrate deploy`

### Ошибки NextAuth
- Проверьте `NEXTAUTH_SECRET` в Environment Variables
- Проверьте `NEXTAUTH_URL` (должен быть без слэша в конце)

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет доступно на Vercel с полной функциональностью!
