# 🎉 FODI SUSHI - Система доставки суши

## ✅ Успешно настроено

### 🔐 Аутентификация и роли

**NextAuth v5 (beta)** полностью интегрирован с:
- ✅ Prisma Adapter для работы с PostgreSQL
- ✅ Credentials Provider (email + password)
- ✅ Система ролей (user / admin)
- ✅ JWT стратегия сессий
- ✅ Защита роутов через middleware

### 👥 Тестовые пользователи

База данных заполнена тестовыми данными:

#### Администратор
- **Email:** admin@fodisushi.com
- **Пароль:** admin123
- **Доступ:** Админ-панель + личный кабинет

#### Обычный пользователь
- **Email:** user@test.com
- **Пароль:** user123
- **Доступ:** Личный кабинет

### 📁 Структура проекта

```
src/
├── app/
│   ├── admin/                    # Админ-панель (защищено middleware)
│   │   ├── page.tsx             # Дашборд с статистикой
│   │   ├── products/page.tsx    # Управление продуктами
│   │   ├── orders/page.tsx      # Управление заказами
│   │   └── users/page.tsx       # Управление пользователями
│   ├── auth/
│   │   ├── signin/page.tsx      # Страница входа
│   │   └── signup/page.tsx      # Страница регистрации
│   ├── profile/page.tsx          # Личный кабинет
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth endpoints
│   │   │   └── register/route.ts       # Регистрация
│   │   ├── health/route.ts       # Проверка БД
│   │   └── products/route.ts     # CRUD для продуктов
│   └── components/
│       ├── Header.tsx            # С интеграцией auth
│       ├── MainContentDynamic.tsx # Продукты из БД
│       ├── CartDrawer.tsx
│       └── LanguageSwitcher.tsx
├── auth.ts                       # NextAuth конфигурация
├── middleware.ts                 # Защита роутов
├── lib/
│   └── prisma.ts                # Prisma Client
└── types/
    └── next-auth.d.ts           # Типы для NextAuth
```

### 🗄️ База данных

**Prisma + PostgreSQL** со следующими моделями:
- User (с ролями user/admin)
- Product
- Order
- OrderItem
- Ingredient
- StockItem
- ProductIngredient
- TechCard
- ChatMessage
- Account, Session, VerificationToken (для NextAuth)

### 🚀 Быстрый старт

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Настройка базы данных:**
   ```bash
   # База данных уже создана: fodisushi
   # Миграции уже применены
   
   # Чтобы пересоздать данные:
   npm run db:seed
   ```

3. **Запуск dev-сервера:**
   ```bash
   npm run dev
   ```

4. **Открыть в браузере:**
   ```
   http://localhost:3000
   ```

### 🔑 Основные URL

- **Главная:** http://localhost:3000
- **Вход:** http://localhost:3000/auth/signin
- **Регистрация:** http://localhost:3000/auth/signup
- **Профиль:** http://localhost:3000/profile (требует авторизации)
- **Админка:** http://localhost:3000/admin (только для admin)
- **API продуктов:** http://localhost:3000/api/products
- **Health check:** http://localhost:3000/api/health

### 🛠️ API Endpoints

#### GET /api/products
Получить все продукты
```bash
curl http://localhost:3000/api/products
```

#### POST /api/products
Создать новый продукт
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый ролл",
    "description": "Описание",
    "price": 500,
    "category": "Роллы",
    "weight": "300г",
    "imageUrl": "/products/roll.jpg"
  }'
```

#### POST /api/auth/register
Регистрация нового пользователя
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123",
    "name": "Новый пользователь"
  }'
```

### 📱 Функции

#### Для всех пользователей:
- ✅ Просмотр меню с продуктами из БД
- ✅ Добавление в корзину
- ✅ Регистрация и вход
- ✅ Мультиязычность (RU/EN/PL)

#### Для авторизованных пользователей:
- ✅ Личный кабинет
- ✅ История заказов
- ✅ Редактирование профиля

#### Для администраторов:
- ✅ Админ-панель с дашбордом
- ✅ Управление продуктами (создание, просмотр)
- ✅ Просмотр заказов
- ✅ Управление пользователями
- ✅ Статистика (пользователи, продукты, заказы, выручка)

### 🔐 Middleware защита

Файл `src/middleware.ts` защищает следующие роуты:
- `/admin/*` - только для роли admin
- `/profile/*` - только для авторизованных пользователей
- `/orders/*` - только для авторизованных пользователей

### 🎨 Технологический стек

- **Framework:** Next.js 15.5.4 (App Router + Turbopack)
- **React:** 19.2.0
- **Styling:** Tailwind CSS 4.0 (beta)
- **Database:** PostgreSQL + Prisma ORM 6.16.3
- **Auth:** NextAuth v5 (beta 29)
- **Password:** bcryptjs
- **i18n:** react-i18next
- **Icons:** lucide-react

### 📝 TODO / Дальнейшее развитие

- [ ] Добавить редактирование и удаление продуктов в админке
- [ ] Реализовать изменение статусов заказов
- [ ] Добавить создание заказов из корзины
- [ ] Реализовать API для заказов
- [ ] Добавить загрузку изображений продуктов
- [ ] Интегрировать платежную систему
- [ ] Добавить уведомления в реальном времени
- [ ] Реализовать чат с поддержкой
- [ ] Добавить управление ингредиентами и складом
- [ ] Создать мобильную версию (Progressive Web App)
- [ ] Настроить деплой на Vercel + Neon PostgreSQL

### 🐛 Известные проблемы

Нет критических проблем! Все основные функции работают.

### 📞 Контакты

Проект готов к дальнейшей разработке и кастомизации.
