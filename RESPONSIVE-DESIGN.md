# 📱 Адаптивный дизайн FODI SUSHI

## Брейкпоинты Tailwind CSS

```
Mobile:     < 640px   (базовые размеры)
sm:         ≥ 640px   (планшеты)
md:         ≥ 768px   (средние экраны)
lg:         ≥ 1024px  (десктоп)
xl:         ≥ 1280px  (большие экраны)
2xl:        ≥ 1536px  (очень большие экраны)
```

## Компоненты

### Header (`src/app/components/Header.tsx`)

**Мобильные устройства:**
- Логотип: 32x32px
- Размер текста: text-base
- Скрыты пункты меню (Меню, О нас, Контакты)
- Кнопка "Войти" показывает только иконку
- Корзина: только иконка
- Отступы: px-3 py-3

**Планшеты и десктоп (sm+):**
- Логотип: 40x40px (sm:w-10 sm:h-10)
- Размер текста: sm:text-xl
- Показаны все пункты меню (hidden md:flex)
- Кнопка "Войти" с текстом
- Корзина: иконка + текст "Корзина"
- Отступы: sm:px-6 sm:py-4

### MainContentDynamic (`src/app/components/MainContentDynamic.tsx`)

**Hero секция:**
- Заголовок: text-4xl → sm:text-6xl → md:text-7xl
- Подзаголовок: text-xl → sm:text-2xl → md:text-3xl
- Описание: text-sm → sm:text-base
- Кнопки: вертикальное размещение (flex-col) → sm:flex-row
- Отступы: mb-12 → sm:mb-20

**Сетка карточек:**
```tsx
// Мобильные: 1 колонка
grid-cols-1

// Планшеты: 2 колонки
sm:grid-cols-2

// Десктоп: 3 колонки
lg:grid-cols-3

// Отступы между карточками
gap-4 sm:gap-8
```

**Карточки продуктов:**
- Изображение: h-48 → sm:h-64
- Заголовок: text-xl → sm:text-2xl
- Иконка Package: w-12 h-12 → sm:w-16 sm:h-16
- Badge: text-xs → sm:text-sm, top-2 right-2 → sm:top-3 sm:right-3
- Описание: text-xs → sm:text-sm
- Цена: text-2xl → sm:text-3xl
- Кнопка "+": h-10 w-10 → sm:h-12 sm:w-12
- Padding: px-4 → sm:px-6

**Табы категорий:**
- Padding: px-4 → sm:px-6
- Размер текста: text-sm → sm:text-base

### CartDrawer (`src/app/components/CartDrawer.tsx`)

**Общий контейнер:**
- Padding: p-4 → sm:p-6
- Использует flexbox для правильного размещения

**Заголовок:**
- Размер текста: text-xl → sm:text-2xl
- Иконка: 24px → sm:w-7 sm:h-7

**Товары в корзине:**
- Миниатюра: w-16 h-16 → sm:w-20 sm:h-20
- Название: text-sm → sm:text-base
- Вес: text-xs → sm:text-sm
- Кнопки +/-: w-7 h-7 → sm:w-8 sm:h-8
- Иконки: 14px → sm:w-4 sm:h-4
- Цена: text-base → sm:text-lg
- Отступы: gap-3 → sm:gap-4

**Форма оформления:**
- Inputs: px-3 py-2 → sm:px-4 sm:py-3
- Размер текста: text-sm → sm:text-base
- Labels: text-xs → sm:text-sm
- Кнопки: вертикальное размещение (flex-col) → sm:flex-row
- Padding: p-3 → sm:p-4

### Footer (`src/app/page.tsx`)

**Структура:**
- Padding: py-8 px-4 → sm:py-12 sm:px-6
- Сетка: grid-cols-1 → md:grid-cols-3
- Отступы: gap-6 → sm:gap-8

**Текст:**
- Заголовки: text-lg → sm:text-xl
- Параграфы: text-sm → sm:text-base
- Копирайт: text-sm → sm:text-base

## Общие паттерны

### Размеры текста
```tsx
// Заголовки
text-xl sm:text-2xl       // H3
text-2xl sm:text-3xl      // H2
text-3xl sm:text-4xl      // H1

// Основной текст
text-sm sm:text-base      // Обычный текст
text-xs sm:text-sm        // Мелкий текст
```

### Отступы
```tsx
px-3 sm:px-6              // Горизонтальные
py-3 sm:py-4              // Вертикальные
gap-3 sm:gap-4            // Между элементами
mb-4 sm:mb-6              // Нижние margin
```

### Кнопки и иконки
```tsx
// Иконочные кнопки
h-10 w-10 sm:h-12 sm:w-12

// Иконки
size={20} className="sm:w-6 sm:h-6"

// Padding кнопок
px-3 sm:px-4 py-2 sm:py-3
```

### Flexbox направления
```tsx
// Вертикально на мобильных, горизонтально на планшетах
flex flex-col sm:flex-row
```

## Тестирование

### Браузер
1. Откройте DevTools (F12)
2. Включите режим устройства (Ctrl+Shift+M / Cmd+Shift+M)
3. Проверьте на разных размерах:
   - iPhone SE (375px)
   - iPhone 12/13 (390px)
   - iPad (768px)
   - Desktop (1280px+)

### Что проверять
- ✅ Все элементы видны и кликабельны
- ✅ Текст читаемый (не слишком мелкий)
- ✅ Изображения не обрезаются
- ✅ Формы удобно заполнять
- ✅ Кнопки достаточно большие (минимум 44x44px)
- ✅ Нет горизонтального скролла
- ✅ Анимации работают плавно

## Известные проблемы

### iOS Safari
- Может потребоваться `-webkit-overflow-scrolling: touch` для плавного скролла
- `100vh` иногда работает некорректно из-за адресной строки

### Android Chrome
- Масштабирование input при фокусе (решено: font-size минимум 16px)

## Будущие улучшения

- [ ] Hamburger меню для мобильных вместо скрытия пунктов
- [ ] Свайп-жесты для карточек
- [ ] Pull-to-refresh для обновления меню
- [ ] Оптимизация изображений (WebP, AVIF)
- [ ] Ленивая загрузка изображений
- [ ] PWA поддержка (Add to Home Screen)
