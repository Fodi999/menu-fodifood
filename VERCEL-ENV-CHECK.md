# ✅ Чек-лист: Проверка переменных окружения на Vercel

## 🎯 Ваши значения для Vercel

### 1. NEXTAUTH_SECRET
```
j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=
```

**Важно:** Это значение ДОЛЖНО быть **точно таким же** на Vercel!

---

### 2. DATABASE_URL
```
postgresql://neondb_owner:npg_dz4Gl8ZhPLbX@ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Проверьте:**
- ✅ Содержит `ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech`
- ✅ Содержит `c-2` в домене
- ✅ Пароль `npg_dz4Gl8ZhPLbX` (не замаскирован звёздочками)

---

### 3. NEXTAUTH_URL

**Для Production:**
```
https://menu-fodifood.vercel.app
```

**Для Preview (опционально):**
```
https://$VERCEL_URL
```

**Для Development (локально):**
```
http://localhost:3000
```

---

## 📋 Пошаговая инструкция

### Шаг 1: Откройте Vercel Dashboard

1. Перейдите: https://vercel.com/dashboard
2. Войдите в свой аккаунт
3. Выберите проект **menu-fodifood**

### Шаг 2: Перейдите в Environment Variables

1. Нажмите **Settings** (верхнее меню)
2. Слева выберите **Environment Variables**

### Шаг 3: Проверьте/обновите переменные

#### NEXTAUTH_SECRET

| Параметр | Значение |
|----------|----------|
| **Name** | `NEXTAUTH_SECRET` |
| **Value** | `j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

**Действия:**
1. Найдите переменную `NEXTAUTH_SECRET`
2. Нажмите **⋯** (три точки) → **Edit**
3. Проверьте, что значение **точно совпадает**
4. Если не совпадает — вставьте правильное значение
5. Убедитесь, что отмечены все окружения
6. Нажмите **Save**

---

#### DATABASE_URL

| Параметр | Значение |
|----------|----------|
| **Name** | `DATABASE_URL` |
| **Value** | `postgresql://neondb_owner:npg_dz4Gl8ZhPLbX@ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require` |
| **Environments** | ✅ Production, ✅ Preview, ✅ Development |

**Действия:**
1. Найдите переменную `DATABASE_URL`
2. Нажмите **⋯** → **Edit**
3. Проверьте:
   - ✅ Пароль не замаскирован (должен быть `npg_dz4Gl8ZhPLbX`)
   - ✅ Хост содержит `c-2` (`...agon8wu3-pooler.c-2.eu-central-1...`)
4. Если неправильно — вставьте правильное значение
5. Нажмите **Save**

---

#### NEXTAUTH_URL

| Параметр | Значение |
|----------|----------|
| **Name** | `NEXTAUTH_URL` |
| **Value (Production)** | `https://menu-fodifood.vercel.app` |
| **Value (Preview)** | `https://$VERCEL_URL` или оставьте пустым |
| **Value (Development)** | `http://localhost:3000` |
| **Environments** | ✅ Production, ⚠️ Preview (опционально), ⚠️ Development (опционально) |

**Действия:**
1. Найдите переменную `NEXTAUTH_URL`
2. Нажмите **⋯** → **Edit**
3. Для **Production** установите: `https://menu-fodifood.vercel.app`
4. Нажмите **Save**

---

### Шаг 4: Проверьте итоговую таблицу

После сохранения у вас должны быть:

| Name | Production | Preview | Development |
|------|------------|---------|-------------|
| `DATABASE_URL` | `postgresql://...c-2.eu...` | `postgresql://...c-2.eu...` | `postgresql://...c-2.eu...` |
| `NEXTAUTH_URL` | `https://menu-fodifood.vercel.app` | (опционально) | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | `j+fkqjtR1v...` | `j+fkqjtR1v...` | `j+fkqjtR1v...` |

---

### Шаг 5: Сделайте Redeploy

**После изменения любой переменной ОБЯЗАТЕЛЬНО сделайте Redeploy!**

1. Перейдите в **Deployments**
2. Выберите последний деплой
3. Нажмите **⋯** (три точки) → **Redeploy**
4. ❌ Убедитесь, что **Use existing Build Cache** отключено
5. Нажмите **Redeploy**

---

## 🐛 Типичные ошибки

### ❌ NEXTAUTH_SECRET не совпадает

**Симптомы:**
- После входа сразу редирект на `/auth/signin`
- Cookie не сохраняется
- Ошибка "Invalid session"

**Решение:**
1. Скопируйте значение из локального `.env.local`
2. Вставьте **точно такое же** на Vercel
3. Redeploy

---

### ❌ DATABASE_URL с замаскированным паролем

**Симптомы:**
- Ошибка "P1001: Can't reach database server"
- "password authentication failed"

**Решение:**
1. Перейдите в Neon Console
2. Connection Details → Pooled connection
3. Скопируйте **полную строку** с реальным паролем
4. Вставьте на Vercel
5. Redeploy

---

### ❌ NEXTAUTH_URL указывает на localhost

**Симптомы:**
- Вход работает локально, но не на Vercel
- Редирект на `http://localhost:3000`

**Решение:**
1. Для Production установите: `https://menu-fodifood.vercel.app`
2. Для Preview можно использовать: `https://$VERCEL_URL`
3. Redeploy

---

### ❌ Отсутствует `c-2` в DATABASE_URL

**Симптомы:**
- "Can't reach database server"
- Timeout при подключении

**Решение:**
1. Убедитесь, что хост содержит `c-2`
2. Правильно: `ep-soft-mud-agon8wu3-pooler.c-2.eu-central-1.aws.neon.tech`
3. Неправильно: `ep-soft-mud-agon8wu3-pooler.eu-central-1.aws.neon.tech`
4. Redeploy

---

## ✅ Финальная проверка

После Redeploy выполните:

```bash
# 1. Проверьте health endpoint
curl https://menu-fodifood.vercel.app/api/health

# Должен вернуть: {"status": "ok"}

# 2. Проверьте debug endpoint
curl https://menu-fodifood.vercel.app/api/debug-auth

# Должен вернуть JSON с environment: "production"

# 3. Попробуйте войти
# https://menu-fodifood.vercel.app/auth/signin
# Email: admin@fodisushi.com
# Password: admin123

# 4. После входа проверьте cookies в DevTools
# Application → Cookies → должен быть next-auth.session-token
```

---

## 🚀 Быстрая команда для проверки локальных значений

```bash
# Запустите в корне проекта
./scripts/check-env.sh
```

Эта команда покажет все ваши локальные переменные и значение для копирования на Vercel.

---

## 📝 Полезные команды

```bash
# Проверить локальные переменные
cat .env.local

# Проверить NEXTAUTH_SECRET
grep NEXTAUTH_SECRET .env.local

# Проверить DATABASE_URL
grep DATABASE_URL .env.local

# Сгенерировать новый NEXTAUTH_SECRET (если нужно)
openssl rand -base64 32
```

---

## 🔗 Ссылки

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Neon Console](https://console.neon.tech/)

---

**Обновлено:** 5 октября 2025 г.
