# 🔧 Переменные окружения для Vercel

## Обязательные переменные

Перейдите: **Vercel Dashboard → Settings → Environment Variables**

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_dz4Gl8ZhPLbX@ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
- **Для окружений:** Production, Preview, Development
- **Описание:** Neon PostgreSQL (Pooled connection)

### 2. NEXTAUTH_URL
```
https://ВАШ-ДОМЕН.vercel.app
```
- **Для окружений:** Production, Preview
- **Описание:** URL вашего приложения на Vercel
- **Пример:** `https://menu-fodifood.vercel.app`

Для **Development** используйте:
```
http://localhost:3000
```

### 3. NEXTAUTH_SECRET
```
j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```
- **Для окружений:** Production, Preview, Development
- **Описание:** Секретный ключ для NextAuth.js

---

## ✅ Чек-лист после обновления

1. ✅ Все три переменные установлены
2. ✅ DATABASE_URL содержит реальный пароль (`npg_dz4Gl8ZhPLbX`)
3. ✅ NEXTAUTH_URL указывает на ваш Vercel домен (для Production)
4. ✅ Переменные установлены для нужных окружений
5. 🔄 Сделан Redeploy после обновления переменных

---

## 🚀 Как сделать Redeploy

1. **Vercel Dashboard** → ваш проект
2. **Deployments** → выберите последний успешный деплой
3. Нажмите **⋯** (три точки) → **Redeploy**
4. Убедитесь, что выбрано **Use existing Build Cache** ❌ (отключено)
5. Нажмите **Redeploy**

---

## 📝 Где взять актуальные значения

### DATABASE_URL:
- **Neon Console** → Connection Details → **Pooled connection**
- Или скопируйте из `.env.local` (локальный файл)

### NEXTAUTH_URL:
- Ваш домен на Vercel (после первого деплоя)
- Формат: `https://[project-name].vercel.app`

### NEXTAUTH_SECRET:
- Уже сгенерирован и находится в `.env.local`
- Или сгенерируйте новый: `openssl rand -base64 32`

---

## ⚠️ Важно

- **Никогда не коммитьте** `.env.local` в Git
- `.env.local` уже в `.gitignore`
- После изменения переменных на Vercel - сделайте Redeploy
- Для локальной разработки используйте `.env.local`
