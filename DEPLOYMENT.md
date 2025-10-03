# 🚀 Инструкция по деплою на Vercel + Neon

## 📋 Чек-лист перед деплоем

### 1️⃣ Настройка базы данных Neon

1. Зайдите на [https://neon.tech](https://neon.tech)
2. Создайте новый проект
3. Скопируйте `DATABASE_URL` (Prisma connection string)
4. Сохраните её - она понадобится для Vercel

### 2️⃣ Настройка переменных окружения в Vercel

Зайдите в **Vercel → Settings → Environment Variables** и добавьте:

```
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

⚠️ **Важно:** Замените `DATABASE_URL` на строку подключения из Neon!

### 3️⃣ Применение миграций к базе данных Neon

Выполните локально (с DATABASE_URL от Neon):

```bash
# Установите DATABASE_URL от Neon временно
export DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Примените миграции
npx prisma migrate deploy

# Или, если миграции не работают:
npx prisma db push

# Засейдите базу тестовыми данными (опционально)
npx prisma db seed
```

### 4️⃣ Деплой на Vercel

```bash
# Если ещё не установлен Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

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
