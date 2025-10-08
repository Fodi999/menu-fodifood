# 📊 Структура модуля Ingredients - Статус

```
src/app/admin/ingredients/
│
├── 📄 page.tsx                        [1322 строки] ⚠️  БОЛЬШОЙ ФАЙЛ
│   └── Основной компонент страницы
│
├── 📁 types/                          [✅ ГОТОВО - 60 строк]
│   └── index.ts
│       ├── Ingredient
│       ├── GroupedIngredient
│       ├── StockMovement
│       ├── IngredientFormData
│       └── Unit, Category
│
├── 📁 constants/                      [✅ ГОТОВО - 30 строк]
│   └── index.ts
│       ├── UNITS[]
│       ├── CATEGORIES[]
│       ├── DEFAULT_EXPIRY_DAYS
│       └── DEFAULT_UNIT
│
├── 📁 utils/                          [✅ ГОТОВО - 150 строк]
│   ├── calculations.ts
│   │   ├── normalizeNumberInput()
│   │   ├── formatNumber()
│   │   ├── calculateWaste()
│   │   ├── getYieldPercent()
│   │   ├── getExpiryDate()
│   │   ├── getExpiryStatus()
│   │   ├── getUnitLabel()
│   │   └── getCategoryLabel()
│   │
│   ├── grouping.ts
│   │   ├── groupIngredientsByName()
│   │   └── filterIngredients()
│   │
│   └── index.ts (экспорты)
│
└── 📁 components/                     [✅ 2/7 ГОТОВО - 150 строк]
    ├── ✅ BatchSummaryPanel.tsx       [60 строк]
    ├── ✅ IngredientSearch.tsx        [90 строк]
    ├── ⬜ IngredientForm.tsx          [TODO ~400 строк]
    ├── ⬜ IngredientTable.tsx         [TODO ~300 строк]
    ├── ⬜ IngredientBatchRow.tsx      [TODO ~100 строк]
    ├── ⬜ MovementsModal.tsx          [TODO ~100 строк]
    └── index.ts (экспорты)
```

---

## 📈 Прогресс рефакторинга

### ✅ Завершено (390 строк)

| Модуль | Файлов | Строк | Статус |
|--------|--------|-------|--------|
| Types | 1 | 60 | ✅ |
| Constants | 1 | 30 | ✅ |
| Utils | 3 | 150 | ✅ |
| Components | 2 | 150 | ✅ |
| **ИТОГО** | **7** | **390** | **29.5%** |

### ⬜ Осталось (~930 строк)

| Компонент | Строк | Приоритет |
|-----------|-------|-----------|
| IngredientForm.tsx | ~400 | 🔴 HIGH |
| IngredientTable.tsx | ~300 | 🔴 HIGH |
| IngredientBatchRow.tsx | ~100 | 🟡 MEDIUM |
| MovementsModal.tsx | ~100 | 🟢 LOW |
| Hooks (useIngredients) | ~30 | 🟢 LOW |
| **ИТОГО** | **~930** | |

---

## 🎯 Преимущества уже сейчас

✅ **Типобезопасность** - все типы вынесены в отдельный модуль  
✅ **Переиспользование** - утилиты можно использовать в других модулях  
✅ **Тестирование** - легко писать unit-тесты для утилит  
✅ **Читаемость** - понятная структура файлов  
✅ **Поддержка** - легче находить нужный код

---

## 📝 Пример использования

### До рефакторинга:
```tsx
// Всё в page.tsx - 1322 строки
const normalizeNumberInput = (value: string) => { ... }
const formatNumber = (value: string) => { ... }
const calculateWaste = (...) => { ... }
// ... ещё 1300+ строк
```

### После рефакторинга:
```tsx
// page.tsx - чистый и читаемый
import { Ingredient } from './types';
import { UNITS, CATEGORIES } from './constants';
import { calculateWaste, formatNumber, groupIngredientsByName } from './utils';
import { BatchSummaryPanel, IngredientSearch } from './components';

export default function AdminIngredientsPage() {
  // Только логика компонента
  return (
    <>
      <IngredientSearch {...props} />
      <BatchSummaryPanel batches={group.batches} />
    </>
  );
}
```

---

## 🚀 Следующий шаг

Создать `IngredientForm.tsx` - самый большой компонент (~400 строк):
- Форма добавления/редактирования
- Все секции (отходы, срок годности, цены)
- Валидация полей
- Автоматические расчёты
