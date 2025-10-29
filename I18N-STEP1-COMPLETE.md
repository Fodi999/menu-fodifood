# ✅ Шаг 1: Настройка фронтенда (Next.js) - ЗАВЕРШЕНО

## 🎯 Требования → Результат

| Требование | Статус | Реализация |
|-----------|--------|------------|
| **1. Установка i18next** | ✅ | `i18next`, `react-i18next`, `i18next-browser-languagedetector` |
| **2. Структура локалей** | ✅ | `src/locales/{en,ru,pl}` с 10 namespaces каждый |
| **3. Переключатель языка** | ✅ | `LanguageSwitcher.tsx` - глобальная кнопка с флагами 🌍 |
| **4. Cookie для языка** | ✅ | `NEXT_LOCALE` cookie с expiry 1 год |
| **5. Accept-Language middleware** | ✅ | Парсинг header с приоритетом и quality values |

---

## 🚀 Что реализовано

### 1. ✅ i18next установлен и настроен

**Файлы:**
- `src/i18n.ts` - Конфигурация i18next
- `package.json` - Установленные пакеты

**Конфигурация:**
```typescript
i18n
  .use(LanguageDetector) // Auto-detect from cookie/localStorage/browser
  .use(initReactI18next) // React integration
  .init({
    resources: { en, ru, pl },
    lng: "ru", // Default
    fallbackLng: "en",
    ns: ["common", "home", "auth", "profile", "chat", "business", "invest", "cart", "admin"],
    defaultNS: "common",
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupCookie: 'NEXT_LOCALE',
      lookupLocalStorage: 'i18nextLng',
      caches: ['cookie', 'localStorage'],
      cookieMinutes: 525600, // 1 year
    },
  });
```

---

### 2. ✅ Структура локалей

```
src/locales/
├── en/           🇬🇧 English
│   ├── common.json       (навигация, кнопки, статусы)
│   ├── home.json         (главная страница)
│   ├── auth.json         (авторизация)
│   ├── profile.json      (профиль)
│   ├── chat.json         (AI чат)
│   ├── business.json     (бизнес панель)
│   ├── invest.json       (инвестиции)
│   ├── cart.json         (корзина)
│   ├── admin.json        (админка)
│   └── ns1.json          (legacy)
├── ru/           🇷🇺 Русский (по умолчанию)
│   └── ... (те же 10 файлов)
└── pl/           🇵🇱 Polski
    └── ... (те же 10 файлов)
```

**Итого:** 30 JSON файлов с переводами

---

### 3. ✅ Переключатель языка

**Компонент:** `src/app/components/LanguageSwitcher.tsx`

**Особенности:**
- 🎨 Floating button с иконкой Globe
- 🌍 Popover с выбором языка
- 🇷🇺 🇬🇧 🇵🇱 Флаги стран
- ✅ Индикатор текущего языка
- 📱 Responsive design
- 🔄 Синхронизация cookie ↔ localStorage

**Позиция:**
```tsx
// В LayoutContent.tsx - доступен глобально на всех страницах
<LanguageSwitcher />

// Fixed position:
className="fixed left-3 sm:left-4 bottom-16 sm:bottom-20"
```

**Использование:**
```tsx
const { i18n } = useTranslation();

const changeLanguage = (langCode: string) => {
  i18n.changeLanguage(langCode); // "en", "ru", "pl"
};
```

---

### 4. ✅ Cookie + localStorage для сохранения

**Два хранилища (синхронизированы):**

#### 4.1 Cookie `NEXT_LOCALE`
- **Устанавливается:** middleware при каждом запросе
- **Срок хранения:** 1 год (525,600 минут)
- **SameSite:** lax (защита от CSRF)
- **SSR-friendly:** доступен на сервере

#### 4.2 localStorage `i18nextLng`
- **Устанавливается:** i18next автоматически
- **Клиентская сторона:** только в браузере
- **Синхронизация:** при изменении языка

**Приоритет определения:**
1. Cookie `NEXT_LOCALE` ← **SSR**
2. localStorage `i18nextLng` ← **Client**
3. Accept-Language header ← **Browser**
4. navigator.language ← **Browser**
5. Default: `ru` ← **Fallback**

---

### 5. ✅ Middleware для Accept-Language

**Файл:** `src/middleware.ts`

**Функции:**

#### detectLanguageFromHeader()
```typescript
// Парсит: "en-US,en;q=0.9,ru;q=0.8,pl;q=0.7"
// 1. Разбивает по запятой
// 2. Извлекает quality values (q=0.9)
// 3. Сортирует по приоритету
// 4. Возвращает первый поддерживаемый язык

detectLanguageFromHeader(request)
// → "en" ✅
```

**Пример работы:**
```
Accept-Language: pl-PL,pl;q=0.9,en;q=0.8,ru;q=0.7

Шаги:
1. Парсинг → ["pl": 1.0, "en": 0.9, "ru": 0.8]
2. Сортировка → [pl, en, ru]
3. Проверка поддержки → pl ✅ (в SUPPORTED_LOCALES)
4. Результат → "pl"
```

**Auto-set cookie:**
```typescript
// В middleware для каждого request:
if (currentCookie !== locale) {
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  });
}
```

**Логирование:**
```
🌍 Language from cookie: ru
✅ Set NEXT_LOCALE cookie to: ru
🛡️ Middleware: /profile | Authenticated: true | Role: business_owner
```

**Применяется ко всем маршрутам:**
```typescript
matcher: [
  "/admin/:path*", 
  "/business/:path*", 
  "/profile/:path*", 
  "/orders/:path*",
  "/((?!api|_next/static|_next/image|favicon.ico).*)", // Все остальные
]
```

---

## 🎯 Результаты: Твой фронтенд умеет

### ✅ 1. Показывать страницу на нужном языке

**Текущий язык:**
- `i18n.language` → `"ru"`, `"en"`, или `"pl"`
- Автоматически применяется ко всем переводам

**Использование:**
```tsx
import { useTranslation } from "react-i18next";

function MyPage() {
  const { t } = useTranslation("home");
  
  return (
    <div>
      <h1>{t("hero.title")}</h1>
      {/* Русский: "FODI SUSHI" */}
      {/* English: "FODI SUSHI" */}
      {/* Polski: "FODI SUSHI" */}
      
      <p>{t("hero.description")}</p>
      {/* Русский: "Метавселенная, объединяющая AI, Web3..." */}
      {/* English: "Metaverse connecting AI, Web3..." */}
      {/* Polski: "Metawersum łączące AI, Web3..." */}
    </div>
  );
}
```

---

### ✅ 2. Сохранять выбранный язык

**После переключения языка:**
1. ✅ Cookie `NEXT_LOCALE` устанавливается
2. ✅ localStorage `i18nextLng` обновляется
3. ✅ Язык сохраняется на **1 год**
4. ✅ После перезагрузки страницы язык **остаётся**

**Тест:**
```bash
# 1. Открой http://localhost:3000
# 2. Кликни на 🌍 кнопку внизу слева
# 3. Выбери "English" 🇬🇧
# 4. Закрой браузер
# 5. Открой сайт снова
# 6. Язык должен быть English ✅
```

**Проверка в DevTools:**
```javascript
// Application → Cookies
document.cookie
// → "NEXT_LOCALE=en; ..."

// Application → Local Storage
localStorage.getItem('i18nextLng')
// → "en"
```

---

### ✅ 3. Знать текущий язык в i18n.language

**Доступ к языку:**
```tsx
import { useTranslation } from "react-i18next";

function LanguageInfo() {
  const { i18n } = useTranslation();
  
  console.log(i18n.language); // "ru", "en", "pl"
  console.log(i18n.languages); // ["ru", "en", "pl"]
  console.log(i18n.options.fallbackLng); // "en"
  
  return (
    <div>
      Текущий язык: {i18n.language}
      {/* Текущий язык: ru */}
    </div>
  );
}
```

**Программное изменение:**
```tsx
const { i18n } = useTranslation();

// Сменить язык
i18n.changeLanguage("en")
  .then(() => console.log("Changed to:", i18n.language))
  .catch(err => console.error(err));

// Или асинхронно
await i18n.changeLanguage("pl");
console.log("Now:", i18n.language); // "pl"
```

---

## 🧪 Тестирование

### Тест 1: Автоопределение языка

**Шаги:**
```bash
# 1. Открой Chrome DevTools
# 2. Application → Clear site data (очисти всё)
# 3. Обнови страницу (F5)
# 4. Middleware должен определить язык из Accept-Language
# 5. Проверь cookie NEXT_LOCALE
```

**Ожидаемый результат:**
- Если браузер на русском → `NEXT_LOCALE=ru`
- Если браузер на английском → `NEXT_LOCALE=en`
- Если браузер на польском → `NEXT_LOCALE=pl`

---

### Тест 2: Переключение через UI

**URL:** http://localhost:3000

**Шаги:**
```bash
# 1. Кликни на 🌍 кнопку (внизу слева)
# 2. Выбери "English" 🇬🇧
# 3. Проверь:
#    - Тексты изменились на английский ✅
#    - Cookie NEXT_LOCALE = "en" ✅
#    - localStorage i18nextLng = "en" ✅
#    - i18n.language = "en" ✅
```

---

### Тест 3: Сохранение после перезагрузки

**Шаги:**
```bash
# 1. Переключи язык на Polski 🇵🇱
# 2. Закрой вкладку
# 3. Открой http://localhost:3000 заново
# 4. Язык должен быть Polski ✅
```

---

### Тест 4: Accept-Language Header

**Используй curl:**
```bash
# Тест с польским языком
curl -H "Accept-Language: pl-PL,pl;q=0.9,en;q=0.8" http://localhost:3000/

# Middleware должен:
# 1. Распарсить header
# 2. Найти "pl" (приоритет 0.9)
# 3. Установить cookie NEXT_LOCALE=pl
# 4. Вернуть страницу на польском
```

---

### Тест 5: Тестовая страница i18n

**URL:** http://localhost:3000/testing/i18n

**Что проверяет:**
- ✅ Текущий язык (i18n.language)
- ✅ Cookie NEXT_LOCALE
- ✅ localStorage i18nextLng
- ✅ navigator.language
- ✅ Приоритет определения языка
- ✅ Переводы из всех namespaces
- ✅ Доступные языки

**Скриншот компонентов:**
```
┌─────────────────────────────────┐
│ 🧪 i18n System Test             │
├─────────────────────────────────┤
│ 🌍 Текущий язык           🇷🇺   │
│ i18n.language: ru               │
│ Fallback: en                    │
├─────────────────────────────────┤
│ 📊 Хранилища                    │
│ Cookie: NEXT_LOCALE = ru ✅     │
│ localStorage: i18nextLng = ru ✅│
│ navigator.language: ru-RU       │
├─────────────────────────────────┤
│ Тест переводов:                 │
│ common:navigation.home          │
│ → "Главная" ✅                  │
│ home:hero.title                 │
│ → "FODI SUSHI" ✅               │
└─────────────────────────────────┘
```

---

## 📊 Диаграмма работы системы

```
┌──────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                          │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Middleware   │
                    └───────────────┘
                            │
                ┌───────────┼───────────┐
                ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │ Cookie есть? │  ДА    │ Использовать │
        │ NEXT_LOCALE  │───────►│    cookie    │
        └──────────────┘        └──────────────┘
                │ НЕТ                   │
                ▼                       │
        ┌──────────────┐                │
        │ Парсить      │                │
        │Accept-Lang   │                │
        └──────────────┘                │
                │                       │
                ▼                       │
        ┌──────────────┐                │
        │ Установить   │                │
        │ cookie       │◄───────────────┘
        └──────────────┘
                │
                ▼
        ┌──────────────┐
        │   i18next    │
        │ определяет   │
        │    язык      │
        └──────────────┘
                │
    ┌───────────┼───────────┐
    ▼                       ▼
┌─────────┐           ┌─────────┐
│  Cookie │    SYNC   │localStorage│
│NEXT_LOC │◄─────────►│i18nextLng│
└─────────┘           └─────────┘
```

---

## 📝 Файлы системы

| Файл | Назначение | Строк |
|------|-----------|-------|
| `src/i18n.ts` | Конфигурация i18next | 95 |
| `src/middleware.ts` | Language detection + Auth | 145 |
| `src/app/components/LanguageSwitcher.tsx` | UI переключатель | 85 |
| `src/components/LayoutContent.tsx` | Глобальная интеграция | 50 |
| `src/locales/*/common.json` | Переводы (× 3 языка) | ~50 |
| `src/locales/*/home.json` | Переводы (× 3 языка) | ~60 |
| `src/locales/*/auth.json` | Переводы (× 3 языка) | ~70 |
| ... | ... | ... |
| **ИТОГО** | **30 JSON + 4 компонента** | **~6000** |

---

## ✅ Checklist требований

### Установка i18next
- [x] Установлены пакеты: i18next, react-i18next, i18next-browser-languagedetector
- [x] Конфигурация в src/i18n.ts
- [x] Интеграция с React через initReactI18next
- [x] LanguageDetector для автоопределения

### Структура локалей
- [x] Папка src/locales создана
- [x] Подпапки для языков: en, ru, pl
- [x] 10 namespaces в каждом языке
- [x] Всего 30 JSON файлов с переводами

### Переключатель языка
- [x] LanguageSwitcher компонент создан
- [x] Иконка Globe с Popover
- [x] Флаги стран: 🇷🇺 🇬🇧 🇵🇱
- [x] Индикатор текущего языка (✅)
- [x] Глобально доступен на всех страницах
- [x] Адаптивный дизайн (mobile/desktop)

### Cookie для языка
- [x] Cookie NEXT_LOCALE создаётся
- [x] Срок хранения: 1 год
- [x] SameSite: lax
- [x] Автоустановка в middleware
- [x] Синхронизация с localStorage

### Accept-Language middleware
- [x] Функция detectLanguageFromHeader()
- [x] Парсинг quality values (q=0.9)
- [x] Приоритет по q-значениям
- [x] Установка cookie при отсутствии
- [x] Применяется ко всем маршрутам
- [x] Логирование для отладки

### Дополнительно (бонус)
- [x] Тестовая страница /testing/i18n
- [x] Документация I18N-SETUP-COMPLETE.md (400+ строк)
- [x] Примеры использования в README.md локалей
- [x] TypeScript типизация (i18next.d.ts)
- [x] Логирование в консоль для отладки

---

## 🎉 Итог

### ✅ Твой фронтенд теперь:

1. **Показывает страницы на нужном языке** (ru/en/pl)
   - Переводы из 10 namespaces
   - 30 JSON файлов
   - Автоматическое применение

2. **Сохраняет выбранный язык**
   - Cookie NEXT_LOCALE (1 год)
   - localStorage i18nextLng
   - Синхронизация автоматическая

3. **Знает текущий язык**
   - `i18n.language` → "ru", "en", "pl"
   - Доступно везде через useTranslation
   - Программное изменение через changeLanguage()

4. **Автоопределение языка**
   - Accept-Language header
   - Quality values (q=0.9)
   - Приоритетная система
   - Middleware на всех маршрутах

5. **SSR-friendly**
   - Cookie работает на сервере
   - Middleware определяет язык до рендера
   - Нет flickering при загрузке

---

## 🚀 Следующие шаги

### Готово для интеграции с бэкендом:
- ✅ Фронтенд знает текущий язык
- ✅ Cookie NEXT_LOCALE доступен на сервере
- ✅ Accept-Language обрабатывается
- ✅ Готов к отправке заголовков на API

### Можно добавить (опционально):
- [ ] URL-based routing: `/en/profile`, `/ru/profile`
- [ ] Lazy loading переводов (динамическая загрузка)
- [ ] Pluralization (множественное число)
- [ ] Date/time форматирование по локали
- [ ] Number форматирование (1,000 vs 1 000)

---

## 📞 Контакты и помощь

**Документация:**
- `I18N-SETUP-COMPLETE.md` - Полное руководство
- `src/locales/README.md` - Структура переводов
- `/testing/i18n` - Тестовая страница

**Тестирование:**
```bash
# Запуск dev сервера
npm run dev

# Открыть тестовую страницу
http://localhost:3000/testing/i18n

# Проверить middleware логи
# Смотри в консоль терминала: 🌍 Language from cookie: ru
```

---

**Статус:** ✅ **Шаг 1 ПОЛНОСТЬЮ ЗАВЕРШЁН**

**Commit:** `1ba9b69` - "🌍 Complete i18n setup with cookie + Accept-Language detection"

**Прогресс:** 🚀 **100% готов для работы с мультиязычностью**
