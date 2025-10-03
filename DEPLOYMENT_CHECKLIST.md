# ✅ Чек-лист готовности к деплою на Vercel

## 📦 Код готов
- [x] ✅ Все ESLint ошибки исправлены
- [x] ✅ Все TypeScript ошибки исправлены
- [x] ✅ Production build проходит успешно
- [x] ✅ Middleware оптимизирован (45.1 kB)
- [x] ✅ Защита от ошибок `.map()` добавлена
- [x] ✅ Все `<a>` теги заменены на `<Link>`
- [x] ✅ NextAuth правильно настроен
- [x] ✅ Prisma схема готова
- [x] ✅ Миграции созданы
- [x] ✅ Код закоммичен и запушен

## 🗄️ База данных (Neon)

### Что нужно сделать:

1. **Создать проект на Neon**
   - [ ] Зарегистрироваться на https://neon.tech
   - [ ] Создать новый PostgreSQL проект
   - [ ] Скопировать `DATABASE_URL` (Prisma connection string)
   - [ ] Сохранить строку подключения

2. **Применить миграции**
   ```bash
   export DATABASE_URL="postgresql://[строка из Neon]"
   ./deploy-db.sh
   ```
   - [ ] Миграции применены успешно
   - [ ] (Опционально) Seed данные загружены

## ☁️ Vercel Settings

### Environment Variables

Нужно добавить в **Vercel → Settings → Environment Variables**:

```bash
# 1. NextAuth URL (замените на ваш домен)
NEXTAUTH_URL=https://menu-fodifood.vercel.app

# 2. NextAuth Secret (можете использовать этот или сгенерировать новый)
NEXTAUTH_SECRET=j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=

# 3. Database URL (из Neon)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Чек-лист:**
- [ ] `NEXTAUTH_URL` добавлен
- [ ] `NEXTAUTH_SECRET` добавлен  
- [ ] `DATABASE_URL` добавлен (из Neon)
- [ ] Все переменные применены ко всем окружениям (Production, Preview, Development)

## 🚀 Деплой

### Вариант 1: Автоматический (рекомендуется)
- [ ] Сделайте `git push` - Vercel автоматически задеплоит

### Вариант 2: Вручную через CLI
```bash
npm i -g vercel
vercel --prod
```
- [ ] Vercel CLI установлен
- [ ] Деплой выполнен

## ✅ Проверка после деплоя

После успешного деплоя проверьте:

- [ ] Сайт открывается: `https://menu-fodifood.vercel.app`
- [ ] Главная страница загружается
- [ ] Продукты отображаются
- [ ] Регистрация работает: `/auth/signup`
- [ ] Вход работает: `/auth/signin`
- [ ] Личный кабинет доступен: `/profile`
- [ ] Админ-панель работает: `/admin` (с admin аккаунтом)

## 🔑 Тестовые аккаунты

После применения seed данных доступны:

**Admin:**
```
Email: admin@fodisushi.com
Password: admin123
```

**User:**
```
Email: user@fodisushi.com
Password: user123
```

## 📝 Известные проблемы и решения

### ❌ "Edge Function too large"
✅ **Решено** - middleware оптимизирован до 45.1 kB

### ❌ "products.map is not a function"
✅ **Решено** - добавлены проверки `Array.isArray()` и фоллбэки

### ❌ Database connection error
🔧 **Решение:**
- Проверьте `DATABASE_URL` в Vercel
- Убедитесь, что строка содержит `?sslmode=require`
- Проверьте, что миграции применены

### ❌ NextAuth errors
🔧 **Решение:**
- Проверьте `NEXTAUTH_SECRET`
- Проверьте `NEXTAUTH_URL` (без слэша в конце)
- Убедитесь, что переменные установлены для Production

## 🎉 Готово к деплою!

Когда все пункты отмечены ✅ - можно деплоить на Vercel!

---

📚 **Дополнительно:**
- [DEPLOYMENT.md](./DEPLOYMENT.md) - подробная инструкция
- [SETUP.md](./SETUP.md) - локальная разработка
- [CREDENTIALS.md](./CREDENTIALS.md) - тестовые аккаунты
- [ICONS.md](./ICONS.md) - работа с иконками
