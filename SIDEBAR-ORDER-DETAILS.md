# Боковая панель для деталей заказа

## ✅ Реализовано

Вместо модального окна теперь используется **современная боковая панель (sidebar)** для отображения деталей заказа.

### Основные возможности

1. **Анимация выезда справа** - плавное появление панели
2. **Затемнённый фон** (backdrop) с blur эффектом
3. **Адаптивная ширина**:
   - Мобильные устройства: 100% ширины экрана
   - Планшеты (sm): 500px
   - Десктоп (lg): 600px
4. **Закрытие несколькими способами**:
   - Клик по кнопке X
   - Клик по затемнённому фону
   - Клавиша Escape

### Дизайн

```
┌─────────────────────────────────────────────┐
│ ← Основной контент дашборда                 │
│                                             │
│  [Список заказов]                           │
│                                             │
│  #ORD-123 [Детали] ←──┐                     │
│                        │                     │
└────────────────────────┼─────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │ Заказ #ORD-123               [X]   │ ← Header
        │ 05.12.2025, 23:04:44               │
        ├────────────────────────────────────┤
        │                                    │
        │ Статус заказа                      │
        │ [🕐 Ожидает подтверждения]         │
        │                                    │
        │ Информация о клиенте               │
        │ Имя: Максим                        │
        │ Телефон: +48576212418              │
        │                                    │
        │ Адрес доставки                     │
        │ ...                                │
        │                                    │
        │ Состав заказа                      │
        │ • Philadelphia Roll - $55          │
        │ • California Roll - $45            │
        │                                    │
        │ Особые пожелания                   │
        │ 👥 Количество персон: 3            │
        │                                    │
        │ Итого: $240                        │
        │                                    │
        └────────────────────────────────────┘
                      Sidebar (600px)
```

## 🎨 CSS классы

### Sidebar container
```tsx
className="fixed inset-y-0 right-0 z-50 
           w-full sm:w-[500px] lg:w-[600px] 
           bg-background/95 backdrop-blur-sm 
           shadow-2xl border-l 
           transform transition-transform duration-300 ease-in-out
           translate-x-0 | translate-x-full"
```

**Объяснение:**
- `fixed inset-y-0 right-0` - фиксированная позиция справа, на всю высоту
- `z-50` - над всем контентом
- `w-full sm:w-[500px]` - адаптивная ширина
- `bg-background/95 backdrop-blur-sm` - полупрозрачный фон с блюром
- `shadow-2xl border-l` - тень и левая граница
- `translate-x-full` - скрыто за правым краем (когда закрыто)
- `translate-x-0` - на месте (когда открыто)

### Overlay (фон)
```tsx
className="fixed inset-0 
           bg-black/50 backdrop-blur-sm 
           z-40 
           transition-opacity duration-300"
```

**Объяснение:**
- `fixed inset-0` - на весь экран
- `bg-black/50` - полупрозрачный чёрный
- `backdrop-blur-sm` - эффект размытия
- `z-40` - под sidebar (z-50), но над контентом

### Header
```tsx
className="flex items-center justify-between 
           p-6 border-b 
           bg-primary/5"
```

**Объяснение:**
- `bg-primary/5` - лёгкий цветной оттенок
- `border-b` - разделитель от контента

## 🔧 Код

### State
```typescript
const [selectedOrder, setSelectedOrder] = useState<any>(null);
const [orderDetails, setOrderDetails] = useState<any>(null);
const [isLoadingDetails, setIsLoadingDetails] = useState(false);
```

### Функции
```typescript
const handleOrderClick = (order: any) => {
  setSelectedOrder(order);
  loadOrderDetails(order.id);
};

const closeOrderModal = () => {
  setSelectedOrder(null);
  setOrderDetails(null);
};

const loadOrderDetails = async (orderId: number) => {
  setIsLoadingDetails(true);
  try {
    const details = await ordersAPI.getByIdAdmin(orderId);
    setOrderDetails(details);
  } catch (error) {
    console.error('Failed to load order details:', error);
    toast.error('Ошибка загрузки деталей заказа');
  } finally {
    setIsLoadingDetails(false);
  }
};
```

### Escape key handler
```typescript
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedOrder) {
      closeOrderModal();
    }
  };
  
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, [selectedOrder]);
```

## 🎯 Условный рендеринг

Sidebar **всегда** присутствует в DOM, но скрыт через `translate-x-full`:

```tsx
<div className={`... ${
  selectedOrder ? 'translate-x-0' : 'translate-x-full'
}`}>
```

Overlay рендерится **условно**:

```tsx
{selectedOrder && (
  <div className="overlay" onClick={closeOrderModal} />
)}
```

## 📱 Адаптивность

| Размер экрана | Ширина sidebar | Класс |
|---------------|----------------|-------|
| Mobile (<640px) | 100% | `w-full` |
| Tablet (≥640px) | 500px | `sm:w-[500px]` |
| Desktop (≥1024px) | 600px | `lg:w-[600px]` |

## 🚀 Анимация

### Tailwind transition классы
- `transition-transform` - анимация трансформации
- `duration-300` - длительность 300ms
- `ease-in-out` - плавное начало и конец

### Состояния
1. **Закрыто**: `translate-x-full` (справа за экраном)
2. **Открыто**: `translate-x-0` (на месте)
3. **Анимация**: автоматически между состояниями

## ✨ Улучшения дизайна

### Backdrop blur
```css
bg-background/95 backdrop-blur-sm
```
- Полупрозрачный фон (95% opacity)
- Размытие контента позади

### Header highlight
```css
bg-primary/5
```
- Лёгкий цветной оттенок для акцента

### Shadow
```css
shadow-2xl border-l
```
- Глубокая тень для объёма
- Левая граница для разделения

## 🎨 Структура компонента

```tsx
<>
  {/* Main content */}
  <main>
    {/* Dashboard content */}
    <Card>
      <Button onClick={() => handleOrderClick(order)}>
        Детали
      </Button>
    </Card>
  </main>

  {/* Sidebar (always in DOM) */}
  <div className={selectedOrder ? 'show' : 'hide'}>
    <div className="header">
      <h2>Заказ #{order.number}</h2>
      <Button onClick={closeOrderModal}>X</Button>
    </div>
    <div className="content">
      {/* Order details */}
    </div>
  </div>

  {/* Overlay (conditional) */}
  {selectedOrder && (
    <div onClick={closeOrderModal} />
  )}
</>
```

## 🐛 Отладка

### Проверка состояния
```javascript
// В консоли браузера
window.selectedOrder = null; // Закрыть sidebar
```

### CSS Inspector
```css
/* Открыть DevTools -> Elements -> найти sidebar */
.translate-x-0 /* Открыто */
.translate-x-full /* Закрыто */
```

## 📊 Производительность

- ✅ Sidebar всегда в DOM (нет re-mount)
- ✅ CSS transitions (hardware-accelerated)
- ✅ Условный рендеринг только overlay
- ✅ Escape listener очищается при unmount

## 🔮 Будущие улучшения

- [ ] Drag-to-close жестом
- [ ] Изменение размера sidebar
- [ ] Кнопки "Предыдущий/Следующий заказ"
- [ ] Печать чека прямо из sidebar
- [ ] Редактирование статуса inline
- [ ] Звук при открытии
