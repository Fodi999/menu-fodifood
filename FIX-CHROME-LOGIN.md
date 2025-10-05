# 🔧 Решение проблемы входа в Chrome

## 🐛 Проблема

Google Chrome блокирует вход в личный кабинет или не сохраняет сессию.

---

## ✅ Решения

### 1️⃣ **Проверьте настройки cookies в Chrome**

#### Шаг 1: Откройте DevTools
- Нажмите `F12` или `Cmd+Option+I` (Mac)
- Перейдите во вкладку **Application** (Приложение)

#### Шаг 2: Проверьте Cookies
- В левой панели: **Storage** → **Cookies** → выберите ваш домен
- Найдите cookie `next-auth.session-token`

#### Что должно быть:
```
Name:     next-auth.session-token
Value:    (длинная строка JWT)
Domain:   localhost (или ваш домен)
Path:     /
Secure:   ✓ (для HTTPS) или ✗ (для localhost)
HttpOnly: ✓
SameSite: Lax
```

### 2️⃣ **Очистите cookies и кэш**

#### Chrome → Настройки → Конфиденциальность:
1. **Очистить данные браузера**
2. Выберите:
   - ✅ Файлы cookie и другие данные сайтов
   - ✅ Кэшированные изображения и файлы
3. Период: **За всё время**
4. Нажмите **Удалить данные**

#### Или используйте Chrome DevTools:
- `F12` → **Application** → **Clear storage**
- Нажмите **Clear site data**

### 3️⃣ **Проверьте блокировку сторонних cookies**

Chrome может блокировать cookies, если они считаются "сторонними".

#### Проверка:
1. Chrome → Настройки → Конфиденциальность и безопасность
2. **Файлы cookie и другие данные сайтов**
3. Убедитесь, что **НЕ** включено:
   - ❌ "Блокировать сторонние файлы cookie"

#### Или для конкретного сайта:
1. Нажмите на иконку 🔒 в адресной строке
2. **Настройки сайта**
3. **Файлы cookie** → **Разрешить**

### 4️⃣ **Отключите расширения**

Некоторые расширения Chrome могут блокировать cookies или JavaScript.

#### Проверка в режиме инкогнито:
1. Откройте **новое окно в режиме инкогнито** (`Cmd+Shift+N` или `Ctrl+Shift+N`)
2. Попробуйте войти

**Если работает в инкогнито** → проблема в расширениях!

#### Отключите расширения:
- `chrome://extensions/`
- Отключите все расширения
- Попробуйте войти снова
- Включайте по одному, чтобы найти виновника

**Частые виновники:**
- 🚫 AdBlock / uBlock Origin
- 🚫 Privacy Badger
- 🚫 Ghostery
- 🚫 Cookie AutoDelete

### 5️⃣ **Проверьте CORS и SameSite**

Если сайт работает на поддомене или разных доменах:

#### Локальная разработка (localhost):
В `src/auth.ts` уже настроено:
```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax', // ✅ Разрешает cookies на том же сайте
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
},
trustHost: true, // ✅ Важно для Vercel
```

#### На продакшене (Vercel):
- `secure: true` автоматически включается для HTTPS
- `sameSite: 'lax'` — разрешает навигацию по сайту

### 6️⃣ **Проверьте переменные окружения**

#### Локально (.env.local):
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

#### На Vercel:
```env
NEXTAUTH_URL=https://ваш-домен.vercel.app
NEXTAUTH_SECRET=your-secret-key
```

**⚠️ ВАЖНО:**
- `NEXTAUTH_URL` должен совпадать с текущим доменом!
- Если открываете через `192.168.x.x` вместо `localhost` — измените

### 7️⃣ **Проверьте консоль на ошибки**

#### Chrome DevTools → Console:
Ищите ошибки типа:
- ❌ `401 Unauthorized`
- ❌ `CORS error`
- ❌ `Cookie blocked`
- ❌ `Failed to fetch`

#### Chrome DevTools → Network:
1. Перейдите во вкладку **Network**
2. Попробуйте войти
3. Проверьте запрос к `/api/auth/callback/credentials`
4. Должен вернуть **200 OK**

### 8️⃣ **Используйте другой браузер для теста**

Попробуйте войти в:
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Brave

**Если работает в другом браузере** → проблема специфична для Chrome!

---

## 🔍 Диагностика шаг за шагом

### Тест 1: Проверка API
```bash
# Откройте в терминале:
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fodisushi.com","password":"admin123"}'
```

**Должен вернуть:** статус 200 или редирект

### Тест 2: Проверка cookies в Chrome
1. Откройте `http://localhost:3000/auth/signin`
2. Войдите (admin@fodisushi.com / admin123)
3. `F12` → **Application** → **Cookies**
4. Должна появиться `next-auth.session-token`

### Тест 3: Проверка сессии
```bash
# После входа проверьте:
curl http://localhost:3000/api/auth/session \
  -H "Cookie: next-auth.session-token=ВАШ_ТОКЕН"
```

**Должен вернуть:** данные пользователя

---

## 🛠️ Экстренные исправления

### Исправление 1: Измените SameSite на None

Только если `lax` не работает (для кросс-доменных запросов):

```typescript
// src/auth.ts
cookies: {
  sessionToken: {
    options: {
      sameSite: 'none', // Изменить на 'none'
      secure: true,     // ОБЯЗАТЕЛЬНО при 'none'
    },
  },
},
```

⚠️ **Требует HTTPS!** Не работает на `http://localhost`

### Исправление 2: Отключите httpOnly (НЕ РЕКОМЕНДУЕТСЯ)

```typescript
// src/auth.ts
cookies: {
  sessionToken: {
    options: {
      httpOnly: false, // Изменить на false
    },
  },
},
```

⚠️ **Снижает безопасность!** Используйте только для отладки.

### Исправление 3: Добавьте debug

```typescript
// src/auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true, // Добавить для логирования
  // ...остальные настройки
});
```

Теперь в консоли будут детальные логи NextAuth.

---

## ✅ Чек-лист решения проблемы

- [ ] Очистил cookies и кэш Chrome
- [ ] Проверил, что cookies не блокируются
- [ ] Отключил расширения
- [ ] Попробовал в режиме инкогнито
- [ ] Проверил NEXTAUTH_URL в .env.local
- [ ] Проверил консоль на ошибки
- [ ] Проверил Network → /api/auth/callback
- [ ] Попробовал в другом браузере
- [ ] Проверил, что `next-auth.session-token` создаётся
- [ ] Перезапустил dev сервер (`npm run dev`)

---

## 🆘 Если ничего не помогло

### 1. Проверьте логи сервера
```bash
npm run dev
# Смотрите на вывод в терминале при попытке входа
```

### 2. Создайте issue
Если проблема сохраняется:
- Скриншот консоли (F12 → Console)
- Скриншот Network (F12 → Network)
- Версия Chrome
- ОС

### 3. Попробуйте альтернативный способ входа
Временно используйте другой провайдер NextAuth:
- Google OAuth
- GitHub OAuth
- Email Magic Links

---

## 📚 Полезные ссылки

- [NextAuth.js Cookies](https://next-auth.js.org/configuration/options#cookies)
- [Chrome SameSite Cookie FAQ](https://www.chromium.org/updates/same-site/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

**Обновлено:** 5 октября 2025 г.
