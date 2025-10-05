# ✅ Чек-лист проверки входа в Chrome

## 📋 Перед тестом

- [ ] Сервер запущен: `npm run dev` → http://localhost:3000
- [ ] База данных подключена (см. `.env.local`)
- [ ] Выполнен seed: `npx prisma db seed`
- [ ] Админ создан: admin@fodisushi.com / admin123

---

## 🔍 Шаг 1: Проверка настроек Chrome

### 1.1 Откройте Chrome DevTools
```
F12 (Windows/Linux)
Cmd+Option+I (Mac)
```

### 1.2 Перейдите в Application
- Вкладка **Application** (Приложение)
- В левой панели: **Storage** → **Clear storage**
- Нажмите **Clear site data**

### 1.3 Проверьте настройки cookies
- Chrome → Настройки → Конфиденциальность
- **Файлы cookie и другие данные сайтов**
- Убедитесь: **НЕ** включено "Блокировать сторонние файлы cookie"

---

## 🧪 Шаг 2: Тест входа

### 2.1 Откройте страницу входа
```
http://localhost:3000/auth/signin
```

### 2.2 Введите данные администратора
```
Email:    admin@fodisushi.com
Password: admin123
```

### 2.3 Нажмите "Sign In"

### 2.4 Что должно произойти:
- ✅ Редирект на главную страницу `/`
- ✅ В правом верхнем углу появится кнопка "Admin" или имя пользователя
- ✅ В DevTools → Application → Cookies появится `next-auth.session-token`

---

## 🔎 Шаг 3: Проверка cookies

### 3.1 Откройте DevTools → Application
```
F12 → Application → Cookies → http://localhost:3000
```

### 3.2 Найдите cookie: `next-auth.session-token`

### 3.3 Проверьте параметры:
```
✅ Name:     next-auth.session-token
✅ Value:    (длинная строка JWT, начинается с "eyJ...")
✅ Domain:   localhost
✅ Path:     /
✅ Secure:   ✗ (для localhost) или ✓ (для HTTPS)
✅ HttpOnly: ✓
✅ SameSite: Lax
```

### 3.4 Если cookie НЕТ:
- ❌ Вход не удался
- Перейдите к **Шаг 4: Диагностика**

---

## 🔧 Шаг 4: Диагностика

### 4.1 Проверьте Console на ошибки
```
F12 → Console
```

**Типичные ошибки:**
- ❌ `401 Unauthorized` → Неверный пароль
- ❌ `CORS error` → Проблема с доменом
- ❌ `Failed to fetch` → Сервер не запущен

### 4.2 Проверьте Network
```
F12 → Network → Очистить (🚫) → Попробуйте войти
```

**Проверьте запрос:**
- Найдите: `POST /api/auth/callback/credentials`
- Статус должен быть: **200 OK** или **302 Found** (редирект)
- Если **401** → Неверные данные
- Если **500** → Ошибка сервера

### 4.3 Проверьте логи сервера
В терминале где запущен `npm run dev` должно быть:
```bash
✓ Compiled /api/auth/[...nextauth] in XXXms
POST /api/auth/callback/credentials 200 in XXXms
```

**Если есть ошибки:**
- Скопируйте ошибку
- См. раздел "Типичные ошибки" ниже

---

## 🚨 Типичные проблемы и решения

### Проблема 1: Cookie не создаётся

**Симптомы:**
- После входа cookie `next-auth.session-token` отсутствует
- Редирект на `/auth/signin` сразу после входа

**Решение:**
1. Очистите все cookies: `F12` → Application → Clear storage
2. Перезапустите сервер: `Ctrl+C` → `npm run dev`
3. Попробуйте войти снова

### Проблема 2: Chrome блокирует cookies

**Симптомы:**
- В Console: "Cookie blocked"
- Cookie создаётся, но сразу удаляется

**Решение:**
1. Chrome → Настройки → Конфиденциальность
2. **Файлы cookie** → **Разрешить все файлы cookie**
3. Или добавьте `localhost` в исключения

### Проблема 3: Расширения блокируют вход

**Симптомы:**
- Вход работает в режиме инкогнито
- Не работает в обычном режиме

**Решение:**
1. Откройте инкогнито: `Cmd+Shift+N` (Mac) или `Ctrl+Shift+N` (Windows)
2. Попробуйте войти
3. Если работает → отключите расширения:
   - `chrome://extensions/`
   - Отключите все
   - Включайте по одному для поиска виновника

**Частые виновники:**
- AdBlock / uBlock Origin
- Privacy Badger
- Ghostery
- Cookie AutoDelete

### Проблема 4: NEXTAUTH_URL неверный

**Симптомы:**
- В Network: запросы идут на неверный домен
- Cookie создаётся для другого домена

**Решение:**
Проверьте `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
```

**НЕ ДОЛЖНО быть:**
- ❌ `http://192.168.x.x:3000`
- ❌ `http://0.0.0.0:3000`
- ❌ `https://localhost:3000` (без SSL)

### Проблема 5: База данных недоступна

**Симптомы:**
- В Console: "Prisma error"
- В логах сервера: "Can't reach database"

**Решение:**
```bash
# Проверьте подключение
npx prisma db pull

# Если ошибка - проверьте DATABASE_URL в .env.local
```

---

## ✅ Финальная проверка

После успешного входа проверьте:

### 1. Главная страница
- [ ] URL: `http://localhost:3000/`
- [ ] В шапке есть кнопка "Admin" или имя пользователя
- [ ] Нет редиректа на `/auth/signin`

### 2. Личный кабинет
- [ ] URL: `http://localhost:3000/profile`
- [ ] Показывается имя: "Администратор"
- [ ] Email: admin@fodisushi.com

### 3. Админ-панель
- [ ] URL: `http://localhost:3000/admin`
- [ ] Показывается Dashboard со статистикой
- [ ] Есть ссылки на Users и Orders

---

## 🎯 Всё работает? Следующий шаг!

Если локально всё работает, переходите к деплою на Vercel:

1. **Обновите переменные окружения на Vercel:**
   - См. `VERCEL-ENV-VARS.md`

2. **Проверьте seed на Neon:**
   ```bash
   npx prisma db seed
   ```

3. **Сделайте Redeploy:**
   - Vercel → Deployments → Redeploy

4. **Проверьте на продакшене:**
   ```
   https://ваш-домен.vercel.app/auth/signin
   Email: admin@fodisushi.com
   Password: admin123
   ```

---

## 📚 Дополнительные ресурсы

- 🔐 `ADMIN-ACCESS.md` - Полная документация по админ-панели
- 🔧 `FIX-CHROME-LOGIN.md` - Детальное решение проблем Chrome
- 🌐 `VERCEL-ENV-VARS.md` - Настройка переменных на Vercel
- ⚡ `QUICK-ACCESS.md` - Быстрый доступ к админке

---

**Обновлено:** 5 октября 2025 г.
