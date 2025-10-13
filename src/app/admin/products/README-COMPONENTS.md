# Структура компонентов страницы управления продуктами

## 📁 Файловая структура

```
src/app/admin/products/
├── page.tsx                     # Главный файл с логикой
├── types.ts                     # Типы и константы
└── components/
    ├── index.ts                 # Экспорт всех компонентов
    ├── ProductsHeader.tsx       # Заголовок страницы с кнопками
    ├── ProductsTable.tsx        # Адаптивная таблица/карточки продуктов
    ├── LoadingState.tsx         # Состояние загрузки
    ├── ErrorMessage.tsx         # Отображение ошибок
    └── ProductForm.tsx          # (TODO) Форма добавления/редактирования
```

## ✅ Созданные компоненты

### 1. **types.ts**
- Все TypeScript типы (Product, Ingredient, etc.)
- Константы (CATEGORIES, INGREDIENT_CATEGORIES)
- Централизованное управление типами

### 2. **ProductsHeader**
```tsx
<ProductsHeader 
  productsCount={products.length}
  onAddProduct={() => setShowForm(true)}
/>
```
- Адаптивный заголовок
- Кнопка "Добавить продукт"
- Кнопка "Назад"
- Счётчик продуктов

### 3. **ProductsTable**
```tsx
<ProductsTable
  products={products}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleVisibility={handleToggleVisibility}
/>
```
- **Мобильная версия**: Карточки (< 1024px)
- **Десктопная версия**: Таблица (≥ 1024px)
- Адаптивные размеры и отступы
- Действия: редактировать, удалить, переключить видимость

### 4. **LoadingState**
```tsx
<LoadingState />
```
- Центрированный loader
- Анимация Loader2 от lucide-react
- Текст "Загрузка продуктов..."

### 5. **ErrorMessage**
```tsx
<ErrorMessage message={error} />
```
- Красная карточка с иконкой
- Адаптивный размер текста

## 🎨 Адаптивность

### Breakpoints:
- **xs**: < 640px (очень маленькие экраны)
- **sm**: 640px - 767px (маленькие экраны)
- **md**: 768px - 1023px (планшеты)
- **lg**: 1024px+ (десктоп)

### Responsive Features:
1. **Заголовок**: 
   - Мобильный: колонка, полная ширина кнопок
   - Десктоп: строка, компактные кнопки

2. **Таблица продуктов**:
   - Мобильный: карточки с вертикальной компоновкой
   - Десктоп: полноценная таблица

3. **Размеры иконок**: 
   - Мобильный: `w-3.5 h-3.5`
   - Планшет: `w-4 h-4`
   - Десктоп: `w-8 h-8` (для главной иконки)

## 📝 Следующие шаги

1. **ProductForm.tsx** - Большая форма добавления/редактирования:
   - Основная информация
   - Выбор ингредиентов
   - Выбор полуфабрикатов
   - Расчёт себестоимости
   - Превью изображения

2. **Интеграция в page.tsx**:
   - Импортировать компоненты
   - Упростить главный файл
   - Вынести хуки в отдельные файлы

3. **Дополнительные компоненты**:
   - IngredientSelector
   - SemiFinishedSelector
   - CostCalculator
   - ImagePreview

## 🔧 Как использовать

В файле `page.tsx`:

```tsx
import { ProductsHeader, ProductsTable, LoadingState, ErrorMessage } from "./components";
import type { Product } from "./types";

export default function AdminProductsPage() {
  // ... ваша логика

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <ProductsHeader 
          productsCount={products.length}
          onAddProduct={() => setShowForm(true)}
        />
        
        {error && <ErrorMessage message={error} />}
        
        <ProductsTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
        />
      </div>
    </div>
  );
}
```

## ✨ Преимущества

1. **Модульность**: Каждый компонент независим
2. **Переиспользование**: Компоненты можно использовать в других местах
3. **Тестирование**: Легче писать тесты для отдельных компонентов
4. **Читаемость**: Главный файл стал чище
5. **Масштабируемость**: Легко добавлять новые компоненты
6. **Адаптивность**: Все компоненты responsive из коробки
