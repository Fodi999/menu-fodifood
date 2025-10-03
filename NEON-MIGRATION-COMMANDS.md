# ⚡ КОМАНДЫ ДЛЯ ПРИМЕНЕНИЯ МИГРАЦИЙ К NEON

## 🎯 Выполните в терминале VS Code:

### Шаг 1: Экспорт DATABASE_URL для Neon

```bash
# Замените на ВАШУ строку из Neon/Vercel!
export DATABASE_URL="postgresql://neondb_owner:ВАШ_ПАРОЛЬ@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
```

**Где взять строку:**
- Vercel → Settings → Environment Variables → DATABASE_URL (скопируйте значение)
- Или Neon Console → Connection Details → Pooled connection

---

### Шаг 2: Примените миграции

```bash
npx prisma migrate deploy
```

**Ожидается:**
```
✔ All migrations have been successfully applied.
```

---

### Шаг 3: Заполните тестовыми данными

```bash
npx prisma db seed
```

**Ожидается:**
```
🎉 Database seeded successfully!
```

---

### Шаг 4: Проверьте таблицы

```bash
npx prisma studio
```

Откроется браузер → проверьте, что есть таблицы и данные.

---

### Шаг 5: Вернитесь к локальной БД

```bash
unset DATABASE_URL
```

Или просто закройте и откройте новый терминал.

---

### Шаг 6: Redeploy на Vercel

В Vercel Dashboard:
- Deployments → Latest → ⋮ → Redeploy

Или push на GitHub:
```bash
git push
```

---

### Шаг 7: Проверьте продакшен

```bash
curl https://menu-fodifood.vercel.app/api/health
curl https://menu-fodifood.vercel.app/api/products
```

Или откройте в браузере:
- https://menu-fodifood.vercel.app/api/health
- https://menu-fodifood.vercel.app/api/products
- https://menu-fodifood.vercel.app

---

## ✅ Чек-лист

- [ ] Получена строка DATABASE_URL из Neon/Vercel
- [ ] Выполнен `export DATABASE_URL="..."`
- [ ] Выполнен `npx prisma migrate deploy` (успешно)
- [ ] Выполнен `npx prisma db seed` (опционально)
- [ ] Vercel Environment Variables проверены (3 переменные)
- [ ] Redeploy на Vercel выполнен
- [ ] API `/api/health` возвращает `{ ok: true }`
- [ ] API `/api/products` возвращает массив продуктов
- [ ] Главная страница загружается без ошибок 500

---

## 🎉 Готово!

Теперь Vercel может подключиться к базе данных и API работает!
