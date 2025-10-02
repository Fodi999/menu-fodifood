# 🍣 FODI SUSHI - Интернет-магазин доставки суши

Современный веб-сайт для заказа и доставки премиальных суши и роллов, построенный на Next.js 15 с поддержкой мультиязычности.

![FODI SUSHI](https://img.shields.io/badge/FODI-SUSHI-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)

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

### Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🛠️ Технологический стек

- **Framework:** Next.js 15.1.3 (с Turbopack)
- **Язык:** TypeScript
- **Стили:** Tailwind CSS
- **Интернационализация:** i18next, react-i18next
- **Иконки:** Lucide React
- **Изображения:** Next.js Image Optimization

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
