# ✅ ФИНАЛЬНЫЙ ЧЕК-ЛИСТ ДЕПЛОЯ

## 🎯 Что нужно сделать ПРЯМО СЕЙЧАС для успешного деплоя

### 1. Локальная настройка (ОБЯЗАТЕЛЬНО)

#### 1.1 Создайте файл `.env` в корне проекта

```bash
touch .env
```

#### 1.2 Заполните `.env` следующими данными:

```env
# Database (строка подключения из Neon)
DATABASE_URL="postgresql://neondb_owner:ВАША_ПАРОЛЬ@ep-soft-mud-XXXXX-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ваш_сгенерированный_секрет"
```

#### 1.3 Сгенерируйте NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

**Скопируйте результат** и вставьте в `.env` вместо `ваш_сгенерированный_секрет`

⚠️ **СОХРАНИТЕ этот секрет** - он понадобится для Vercel!

---

### 2. Neon Database (ОБЯЗАТЕЛЬНО)

#### 2.1 Зайдите на [https://neon.tech](https://neon.tech)

- [ ] Создайте аккаунт (если нет)
- [ ] Создайте новый проект
- [ ] Выберите регион: **EU (Europe)**

#### 2.2 Скопируйте строку подключения

- [ ] Найдите **"Connection Details"**
- [ ] Выберите **"Pooled connection"** (для Prisma)
- [ ] Скопируйте строку типа:
  ```
  postgresql://neondb_owner:AbC123...@ep-soft-mud-XXXXX-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
  ```
- [ ] Вставьте её в `.env` как `DATABASE_URL`

---

### 3. Применение миграций (ОБЯЗАТЕЛЬНО)

#### 3.1 Запустите миграции локально:

```bash
# Сгенерируйте Prisma Client
npx prisma generate

# Примените миграции к Neon БД
npx prisma migrate deploy
```

**Альтернатива** - используйте готовый скрипт:

```bash
chmod +x deploy-db.sh
./deploy-db.sh
```

#### 3.2 (Опционально) Заполните тестовыми данными:

```bash
npx prisma db seed
```

---

### 4. Vercel Environment Variables (ОБЯЗАТЕЛЬНО)

#### 4.1 Зайдите в Vercel:

- [ ] Откройте ваш проект на [https://vercel.com](https://vercel.com)
- [ ] Перейдите в **Settings → Environment Variables**

#### 4.2 Добавьте 3 переменные для **Production**:

```env
DATABASE_URL=postgresql://neondb_owner:пароль@host-pooler.region.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://menu-fodifood.vercel.app
NEXTAUTH_SECRET=тот_же_секрет_из_локального_env
```

**⚠️ ВАЖНО:**
- `DATABASE_URL` - **точная** строка из Neon (с `-pooler` в хосте)
- `NEXTAUTH_URL` - **ваш реальный URL** на Vercel
- `NEXTAUTH_SECRET` - **точно такой же**, как в локальном `.env`

---

### 5. Защита map() в коде (РЕКОМЕНДУЕТСЯ)

В файле `src/app/components/MainContentDynamic.tsx` уже добавлены проверки:

```typescript
// Проверка, что products это массив
const filteredProducts = Array.isArray(products) 
  ? (selectedCategory === "All" ? products : products.filter(...))
  : [];
```

✅ **Уже сделано** - можно пропустить

---

### 6. Финальный деплой (ОБЯЗАТЕЛЬНО)

#### 6.1 Закоммитьте все изменения:

```bash
git add .
git commit -m "Production ready: fix all ESLint errors and optimize middleware"
git push
```

#### 6.2 Vercel автоматически задеплоит

- [ ] Дождитесь завершения деплоя (2-3 минуты)
- [ ] Проверьте логи на наличие ошибок

---

### 7. Проверка деплоя (ОБЯЗАТЕЛЬНО)

#### 7.1 Проверьте API Health:

```
https://menu-fodifood.vercel.app/api/health
```

**Ожидается:**
```json
{
  "ok": true,
  "timestamp": "2025-01-03T..."
}
```

#### 7.2 Проверьте API Products:

```
https://menu-fodifood.vercel.app/api/products
```

**Ожидается:** Массив продуктов из БД

#### 7.3 Проверьте главную страницу:

```
https://menu-fodifood.vercel.app
```

- [ ] Страница загружается
- [ ] Продукты отображаются
- [ ] Корзина работает
- [ ] Нет ошибок в консоли браузера

---

## 🚨 Частые ошибки и решения

### ❌ "Failed to connect to database"

**Причина:** Неверный `DATABASE_URL` в Vercel

**Решение:**
1. Проверьте строку подключения в Neon (должна быть с `-pooler`)
2. Убедитесь, что скопировали **весь** URL с паролем
3. Redeploy проекта после изменения переменных

---

### ❌ "NextAuth: NEXTAUTH_URL missing"

**Причина:** Не указан `NEXTAUTH_URL` в Vercel

**Решение:**
1. Добавьте в Environment Variables:
   ```
   NEXTAUTH_URL=https://menu-fodifood.vercel.app
   ```
2. Замените URL на ваш реальный
3. Redeploy проекта

---

### ❌ "Invalid session" или "JWT verification failed"

**Причина:** Разные `NEXTAUTH_SECRET` локально и на продакшене

**Решение:**
1. Убедитесь, что используете **один и тот же** секрет
2. Обновите секрет в Vercel Environment Variables
3. Redeploy проекта
4. Очистите cookies браузера

---

### ❌ "Edge Function size exceeds limit"

**Причина:** Middleware слишком большой

**Решение:**
✅ **Уже исправлено** - middleware оптимизирован до 45 kB

---

### ❌ "Products is not iterable" или ".map is not a function"

**Причина:** API вернул не массив

**Решение:**
✅ **Уже исправлено** - добавлена проверка `Array.isArray(products)`

---

## 📊 После деплоя

### Мониторинг:

- [ ] Настройте Vercel Analytics
- [ ] Настройте Neon Monitoring
- [ ] Проверяйте логи регулярно

### Безопасность:

- [ ] Включите 2FA в Vercel
- [ ] Включите 2FA в Neon
- [ ] Регулярно обновляйте зависимости (`npm audit fix`)

### Оптимизация:

- [ ] Настройте Edge Caching
- [ ] Оптимизируйте изображения через Next.js Image
- [ ] Включите Compression в Vercel

---

## ✅ ГОТОВО!

Если все пункты выполнены - ваш проект успешно задеплоен! 🎉

**Ваш сайт доступен по адресу:**
```
https://menu-fodifood.vercel.app
```

---

## 📞 Помощь

**Проблемы?**

1. Проверьте логи: Vercel → Deployments → View Function Logs
2. Проверьте БД: Neon → Monitoring → Logs
3. Создайте Issue в GitHub
4. См. подробную инструкцию: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Последнее обновление:** 3 октября 2025
