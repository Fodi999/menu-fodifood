# 🚨 БЫСТРОЕ РЕШЕНИЕ: Vercel 500 Error

## 🎯 Проблема
```
500 Internal Server Error
Products data is not an array
```

## ⚡ РЕШЕНИЕ ЗА 5 МИНУТ

### 1. Проверьте DATABASE_URL в Vercel

**Vercel → Settings → Environment Variables → Production**

Должно быть:
```env
DATABASE_URL=postgresql://neondb_owner:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require
```

✅ **Проверьте:**
- [ ] Есть `-pooler` в URL
- [ ] Есть `?sslmode=require` в конце
- [ ] Скопирован **весь** пароль

---

### 2. Где взять правильный URL

**Neon Console → Dashboard → Connection string → Pooled connection**

Скопируйте **весь URL** и вставьте в Vercel.

---

### 3. Примените миграции (если не сделали)

```bash
# Установите Neon URL временно
export DATABASE_URL="ваш_neon_url_с_pooler"

# Примените миграции
npx prisma migrate deploy

# Засеедьте данными
npx prisma db seed
```

---

### 4. Redeploy

**Vercel → Deployments → ... → Redeploy**

Или:
```bash
git commit --allow-empty -m "Fix DB connection"
git push
```

---

### 5. Проверьте

Откройте:
```
https://menu-fodifood.vercel.app/api/health
```

Должно быть:
```json
{"ok": true}
```

---

## 📖 Подробная инструкция

См. [VERCEL-DB-ERROR.md](./VERCEL-DB-ERROR.md)
