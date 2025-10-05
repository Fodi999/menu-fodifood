# 📝 Логи аутентификации

## 🔍 Что показывают логи

После добавления логирования в `src/auth.ts`, вы будете видеть следующие сообщения в консоли сервера:

---

## ✅ Успешный вход

При успешном входе вы увидите последовательность:

```bash
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
👤 Session loaded for: admin@fodisushi.com (role: admin)
```

**Что означает:**
1. ✅ Пользователь найден, пароль верный
2. 🔑 Создан JWT токен с ролью пользователя
3. 👤 Загружена сессия с данными пользователя

---

## ❌ Неудачные попытки входа

### 1. Неверный пароль

```bash
❌ Failed login attempt for: admin@fodisushi.com
```

**Причина:** Email существует, но пароль неверный.

**Решение:** Проверьте пароль или сбросьте его в БД.

---

### 2. Пользователь не найден

```bash
❌ User not found: nonexistent@example.com
```

**Причина:** Пользователь с таким email не существует в базе данных.

**Решение:** 
- Проверьте правильность email
- Зарегистрируйте нового пользователя
- Выполните `npx prisma db seed` для создания тестовых пользователей

---

### 3. Отсутствуют учетные данные

```bash
❌ Login attempt without credentials
```

**Причина:** Форма отправлена без email или пароля.

**Решение:** Заполните оба поля формы входа.

---

## 🔧 Где смотреть логи

### Локальная разработка

Логи отображаются в терминале, где запущен `npm run dev`:

```bash
npm run dev

# Вывод:
   ▲ Next.js 15.5.4 (Turbopack)
   - Local: http://localhost:3000

# После попытки входа:
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
```

---

### Production (Vercel)

Логи доступны в **Vercel Dashboard**:

1. Перейдите в ваш проект на Vercel
2. **Runtime Logs** (вкладка)
3. Фильтруйте по функции: `/api/auth/[...nextauth]`

**Пример:**

```
[Function: /api/auth/[...nextauth]]
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
```

---

## 📊 Примеры сценариев

### Сценарий 1: Успешный вход администратора

```bash
# Терминал (npm run dev):
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
👤 Session loaded for: admin@fodisushi.com (role: admin)

# Браузер:
Перенаправление на /admin
```

---

### Сценарий 2: Вход обычного пользователя

```bash
# Терминал:
✅ Successful login: user@test.com (user)
🔑 JWT created for: user@test.com (role: user)
👤 Session loaded for: user@test.com (role: user)

# Браузер:
Перенаправление на /profile
```

---

### Сценарий 3: Неверный пароль

```bash
# Терминал:
❌ Failed login attempt for: admin@fodisushi.com

# Браузер:
Ошибка: Invalid credentials
```

---

### Сценарий 4: Несуществующий пользователь

```bash
# Терминал:
❌ User not found: wrong@email.com

# Браузер:
Ошибка: Invalid credentials
```

---

## 🛡️ Безопасность логов

**⚠️ ВАЖНО для Production:**

### ❌ НЕ логируйте:
- Пароли (даже хешированные)
- Полные токены JWT
- Персональные данные пользователей (телефоны, адреса)
- IP-адреса (без согласия)

### ✅ Можно логировать:
- Email (для диагностики)
- Роль пользователя
- Время входа
- Статус операции (успех/ошибка)

---

## 🔍 Отладка проблем входа

### Проблема: "Chrome не сохраняет сессию"

**Что проверить в логах:**

```bash
# Должно быть:
✅ Successful login: admin@fodisushi.com (admin)
🔑 JWT created for: admin@fodisushi.com (role: admin)
👤 Session loaded for: admin@fodisushi.com (role: admin)

# Если нет "Session loaded" - проблема с cookies
```

**Решение:** См. `FIX-CHROME-LOGIN.md`

---

### Проблема: "Access Denied в админке"

**Что проверить в логах:**

```bash
# Должна быть роль "admin":
👤 Session loaded for: user@test.com (role: admin)
                                           ^^^^^^

# Если role: user - доступ запрещён
```

**Решение:** Измените роль в БД через Prisma Studio.

---

## 📝 Добавление дополнительных логов

Если нужно больше информации, добавьте логи в другие части приложения:

### Пример: Логирование в middleware

```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  console.log(`🔐 Middleware: ${request.nextUrl.pathname}`);
  console.log(`   User: ${token?.email || 'anonymous'}`);
  console.log(`   Role: ${token?.role || 'none'}`);
  
  // ...existing code...
}
```

### Пример: Логирование в API routes

```typescript
// src/app/api/products/route.ts
export async function GET() {
  console.log('📦 API: GET /api/products');
  
  const products = await prisma.product.findMany();
  
  console.log(`   Found: ${products.length} products`);
  
  return Response.json(products);
}
```

---

## 🚀 Быстрая проверка

Чтобы быстро проверить логи аутентификации:

```bash
# 1. Запустите сервер
npm run dev

# 2. Откройте браузер
open http://localhost:3000

# 3. Попробуйте войти
# Email: admin@fodisushi.com
# Password: admin123

# 4. Смотрите логи в терминале
# Должны появиться:
# ✅ Successful login: admin@fodisushi.com (admin)
# 🔑 JWT created for: admin@fodisushi.com (role: admin)
# 👤 Session loaded for: admin@fodisushi.com (role: admin)
```

---

## 📊 Мониторинг на Production

Для продакшена рекомендуется использовать специализированные сервисы:

- **Vercel Analytics** - встроенная аналитика
- **Sentry** - отслеживание ошибок
- **LogRocket** - запись сессий пользователей
- **Datadog** - комплексный мониторинг

---

## 💡 Полезные команды

```bash
# Фильтрация логов в реальном времени
npm run dev | grep "Successful login"

# Подсчет успешных входов
npm run dev | grep -c "Successful login"

# Показать только ошибки
npm run dev | grep "❌"

# Сохранить логи в файл
npm run dev > logs.txt 2>&1
```

---

**Готово!** Теперь у вас есть полное логирование аутентификации! 🎉
