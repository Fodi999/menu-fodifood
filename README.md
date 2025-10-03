# 🍣 FODI SUSHI - Интернет-магазин доставки суши

Современный веб-сайт для заказа и доставки премиальных суши и роллов, построенный на Next.js 15 с поддержкой мультиязычности.

![FODI SUSHI](https://img.shields.io/badge/FODI-SUSHI-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0_beta-38bdf8?style=for-the-badge&logo=tailwindcss)
![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-5a67d8?style=for-the-badge)

## ✨ Основные возможности

- 🍱 **Каталог продуктов** - роллы, суши, сеты с подробным описанием
- 🛒 **Корзина покупок** - добавление товаров, управление количеством
- 📝 **Форма заказа** - оформление заказа с указанием данных доставки
- 🌐 **Мультиязычность** - поддержка русского, английского и польского языков
- 📱 **Адаптивный дизайн** - идеально работает на всех устройствах
- 🎨 **Современный UI/UX** - темная тема с оранжевыми акцентами
- ⚡ **Быстрая сборка** - использование Turbopack для ускорения разработки

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Настройка базы данных

1. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Укажите URL вашей PostgreSQL базы данных в `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fodi_sushi"
```

3. Сгенерируйте Prisma Client:
```bash
npx prisma generate
```

4. Примените миграции (создание таблиц):
```bash
npx prisma migrate dev --name init
```

5. (Опционально) Откройте Prisma Studio для просмотра данных:
```bash
npx prisma studio
```

### Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Проверка подключения к БД

Откройте [http://localhost:3000/api/health](http://localhost:3000/api/health) - должен вернуться `{ ok: true }`.

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🛠️ Технологический стек

- **Framework:** Next.js 15.5.4 (с Turbopack)
- **UI Library:** React 19.2.0
- **Язык:** TypeScript 5.x
- **Стили:** Tailwind CSS 4.0 (beta)
- **База данных:** PostgreSQL с Prisma ORM
- **Интернационализация:** i18next 24.x, react-i18next 15.x
- **Иконки:** Lucide React
- **Изображения:** Next.js Image Optimization
- **Сборка:** Turbopack (в dev режиме)

## 📁 Структура проекта

```
menu-fodifood/
├── public/              # Статические файлы (изображения продуктов)
├── src/
│   ├── app/
│   │   ├── components/  # React компоненты
│   │   │   ├── Header.tsx
│   │   │   ├── MainContent.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── globals.css  # Глобальные стили
│   │   ├── layout.tsx   # Основной layout
│   │   └── page.tsx     # Главная страница
│   ├── locales/         # Файлы переводов
│   │   ├── en/
│   │   ├── pl/
│   │   └── ru/
│   └── i18n.ts          # Конфигурация i18next
├── i18next.d.ts         # TypeScript типы для i18next
├── tailwind.config.ts   # Конфигурация Tailwind
└── package.json
```

## 🌍 Мультиязычность

Проект поддерживает 3 языка:

- 🇷🇺 Русский (по умолчанию)
- 🇬🇧 English
- 🇵🇱 Polski

Переключение языка доступно через компонент `LanguageSwitcher` в правом нижнем углу.

## 🎨 Настройка

### Добавление новых продуктов

Отредактируйте файлы в `src/locales/{язык}/ns1.json` в секции `products`:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Название продукта",
      "category": "Роллы",
      "description": "Описание ингредиентов",
      "price": 450,
      "image": "/image.jpg",
      "weight": "250г"
    }
  ]
}
```

### Изменение цветовой схемы

Основной цвет бренда - оранжевый (`orange-500` в Tailwind). Для изменения отредактируйте классы в компонентах или `tailwind.config.ts`.

## 📦 Основные компоненты

### Header
Шапка сайта с навигацией, логотипом и иконкой корзины с счетчиком товаров.

### MainContent
Главный контент с hero-секцией, каталогом продуктов и фильтрацией по категориям.

### CartDrawer
Боковая панель корзины с:
- Списком добавленных товаров
- Управлением количества
- Формой оформления заказа
- Подсчетом итоговой суммы

### LanguageSwitcher
Переключатель языков интерфейса.

## 🔧 Разработка

### Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшена
npm start

# Линтинг
npm run lint
```

## 📱 Адаптивность

Сайт полностью адаптирован для:
- 📱 Мобильных телефонов (320px+)
- 💻 Планшетов (768px+)
- 🖥️ Десктопов (1024px+)

## 🔌 API Endpoints

### Проверка здоровья
- `GET /api/health` - Проверка подключения к базе данных

### Продукты
- `GET /api/products` - Получить все продукты
- `POST /api/products` - Создать новый продукт

### Модели базы данных

#### User
Пользователи системы с ролями (user/admin)

#### Product
Продукты (роллы, суши, сеты) с ценами, описаниями и категориями

#### Order
Заказы пользователей со статусами и адресами доставки

#### Ingredient & StockItem
Ингредиенты и складские остатки для управления запасами

#### TechCard
Технологические карты приготовления блюд

#### ChatMessage
Сообщения чата поддержки

## 📄 Лицензия

© 2025 FODI SUSHI. All rights reserved.

## 🤝 Контакты

- 📞 **Телефон:** +7 (999) 123-45-67
- 📧 **Email:** info@fodisushi.ru
- ⏰ **Режим работы:** 10:00 - 23:00 ежедневно

---

Сделано с ❤️ для любителей суши

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
