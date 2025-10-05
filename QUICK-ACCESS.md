# 🔑 Быстрый доступ - Шпаргалка

## Админ-панель на Vercel

### 🌐 URL
```
https://ваш-домен.vercel.app/admin
```

### 👤 Учетные данные
```
Email:    admin@fodisushi.com
Password: admin123
```

### 📍 Шаги
1. Откройте сайт на Vercel
2. Нажмите **"Sign In"** (Войти)
3. Введите email и пароль администратора
4. Перейдите на `/admin` или нажмите кнопку **"Admin"**

---

## Тестовый пользователь

### 👤 Учетные данные
```
Email:    user@test.com
Password: user123
Role:     user (обычный пользователь)
```

**⚠️ Не имеет доступа к админ-панели!**

---

## Быстрые команды

```bash
# Создать администратора (seed)
npx prisma db seed

# Открыть Prisma Studio
npx prisma studio

# Локальный сервер
npm run dev
# http://localhost:3000/admin

# Проверить переводы
npm run translations:check
```

---

## Разделы админки

| URL | Описание |
|-----|----------|
| `/admin` | Dashboard - статистика |
| `/admin/users` | Управление пользователями |
| `/admin/orders` | Управление заказами |

---

## ⚠️ Безопасность

**ВАЖНО:** Перед использованием на продакшене:

1. Измените пароль `admin123`
2. Используйте реальный email вместо `admin@fodisushi.com`
3. Настройте 2FA (если нужно)

---

## 🐛 Проблемы?

- **"Access Denied"** → Проверьте роль в БД (`role = "admin"`)
- **Не могу войти** → Выполните `npx prisma db seed`
- **Редирект на signin** → Убедитесь, что авторизованы как admin
- **Chrome не сохраняет сессию** → См. `FIX-CHROME-LOGIN.md`

### 🔧 Быстрое решение для Chrome:
1. Очистите cookies: `F12` → Application → Clear storage
2. Попробуйте в режиме инкогнито
3. Отключите расширения (AdBlock, Privacy Badger и т.д.)
4. Проверьте, что NEXTAUTH_URL в .env.local = `http://localhost:3000`

---

**Подробная документация:** См. `ADMIN-ACCESS.md` и `FIX-CHROME-LOGIN.md`
