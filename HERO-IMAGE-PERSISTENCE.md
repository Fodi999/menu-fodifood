# 🖼️ Hero Image Persistence - Исправление

## Проблема
При редактировании и загрузке изображений (например, hero image или featured dish) изменения **НЕ сохранялись** после перезагрузки страницы.

### Причина:
1. ✅ Изображение успешно загружается в Cloudinary
2. ✅ URL сохраняется в локальном `useState` компонента
3. ❌ **НО** не сохраняется в базу данных
4. ❌ При перезагрузке возвращается к дефолтному значению

---

## Решение

### 1. ✅ Добавлены новые поля в TypeScript типы

**Файл:** `src/types/restaurant.ts`

```typescript
export interface RestaurantInfo {
  // ... существующие поля
  
  // Hero section data
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  
  // Featured dish data
  featuredDishImage?: string;
  featuredDishTitle?: string;
  featuredDishDescription?: string;
  featuredDishPrice?: string;
}
```

---

### 2. ✅ Обновлен компонент RestaurantHero

**Файл:** `src/components/Restaurant/RestaurantHero.tsx`

**Было:**
```typescript
const [featuredDish, setFeaturedDish] = useState({
  image: 'https://...', // Хардкод
  title: 'Popularny zestaw',
  description: '24 szt.',
  price: '85 zł',
});

const handleFeaturedDishUpdate = (field: string, value: string) => {
  setFeaturedDish(prev => ({ ...prev, [field]: value }));
  // ❌ НЕ сохраняется в контекст!
};
```

**Стало:**
```typescript
const [featuredDish, setFeaturedDish] = useState({
  image: restaurantInfo?.featuredDishImage || 'https://...', // ✅ Из БД
  title: restaurantInfo?.featuredDishTitle || 'Popularny zestaw',
  description: restaurantInfo?.featuredDishDescription || '24 szt.',
  price: restaurantInfo?.featuredDishPrice || '85 zł',
});

const handleFeaturedDishUpdate = (field: string, value: string) => {
  setFeaturedDish(prev => ({ ...prev, [field]: value }));
  
  // ✅ Сохраняется в RestaurantContext!
  if (field === 'image') updateRestaurantInfo({ featuredDishImage: value });
  if (field === 'title') updateRestaurantInfo({ featuredDishTitle: value });
  if (field === 'description') updateRestaurantInfo({ featuredDishDescription: value });
  if (field === 'price') updateRestaurantInfo({ featuredDishPrice: value });
};
```

---

### 3. ✅ Обновлен RestaurantContext для сохранения

**Файл:** `src/contexts/RestaurantContext.tsx`

```typescript
// Save restaurant info
if (restaurantInfo) {
  await restaurantInfoAPI.update({
    name: restaurantInfo.name,
    // ... другие поля
    
    // ✅ Новые поля
    hero_image: restaurantInfo.heroImage,
    hero_title: restaurantInfo.heroTitle,
    hero_subtitle: restaurantInfo.heroSubtitle,
    hero_description: restaurantInfo.heroDescription,
    featured_dish_image: restaurantInfo.featuredDishImage,
    featured_dish_title: restaurantInfo.featuredDishTitle,
    featured_dish_description: restaurantInfo.featuredDishDescription,
    featured_dish_price: restaurantInfo.featuredDishPrice,
  });
}
```

---

### 4. ✅ Обновлен Frontend API

**Файл:** `src/lib/restaurant-api.ts`

```typescript
export interface UpdateRestaurantInfo {
  // ... существующие поля
  hero_image?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_description?: string;
  featured_dish_image?: string;
  featured_dish_title?: string;
  featured_dish_description?: string;
  featured_dish_price?: string;
}
```

---

### 5. ✅ SQL миграция

**Файл:** `backend/migrations/007_add_hero_fields.sql`

```sql
ALTER TABLE restaurant_info 
ADD COLUMN IF NOT EXISTS hero_image TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_image TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_title TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_description TEXT,
ADD COLUMN IF NOT EXISTS featured_dish_price TEXT;

-- Дефолтные значения
UPDATE restaurant_info 
SET 
  hero_image = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=1200&fit=crop',
  hero_title = 'Świeże sushi',
  hero_subtitle = 'z dostawą',
  hero_description = 'Autentyczna kuchnia japońska...',
  featured_dish_image = 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=1200&fit=crop',
  featured_dish_title = 'Popularny zestaw',
  featured_dish_description = '24 szt. • California, Philadelphia',
  featured_dish_price = '85 zł'
WHERE hero_image IS NULL;
```

---

### 6. ✅ Обновлены Rust модели

**Файл:** `backend/src/models/restaurant.rs`

```rust
pub struct RestaurantInfo {
    // ... существующие поля
    
    // Hero section fields
    pub hero_image: Option<String>,
    pub hero_title: Option<String>,
    pub hero_subtitle: Option<String>,
    pub hero_description: Option<String>,
    
    // Featured dish fields
    pub featured_dish_image: Option<String>,
    pub featured_dish_title: Option<String>,
    pub featured_dish_description: Option<String>,
    pub featured_dish_price: Option<String>,
}
```

---

### 7. ✅ Обновлен Backend Handler

**Файл:** `backend/src/handlers/restaurant_info.rs`

```rust
// GET - добавлены поля в SELECT
SELECT id, name, ...,
       hero_image, hero_title, hero_subtitle, hero_description,
       featured_dish_image, featured_dish_title, 
       featured_dish_description, featured_dish_price,
       updated_at
FROM restaurant_info

// UPDATE - добавлены поля
UPDATE restaurant_info
SET name = $1, ...,
    hero_image = $20, hero_title = $21, 
    hero_subtitle = $22, hero_description = $23,
    featured_dish_image = $24, featured_dish_title = $25,
    featured_dish_description = $26, featured_dish_price = $27
```

---

## Deployment

### Автоматическое применение миграции:

Миграция будет **автоматически применена** при следующем деплое на Shuttle, потому что:
1. Файл находится в `backend/migrations/007_add_hero_fields.sql`
2. Shuttle запускает миграции при старте приложения

### Деплой:

```bash
# Backend
cd backend
cargo build --release
shuttle deploy

# Frontend
cd ..
npm run build
git add -A
git commit -m "feat: Hero image persistence - save to database"
git push origin main
```

---

## Тестирование

### Как проверить:

1. **Открыть сайт** → https://menu-fodifood.vercel.app
2. **Login** → Dashboard → Edit Mode
3. **Загрузить новое фото**:
   - Навести на hero image
   - Загрузить файл (drag & drop или кнопка)
   - Дождаться "Zdjęcie zostało przesłane!"
4. **Нажать SAVE** в Navigation (важно!)
5. **Перезагрузить страницу** (F5)
6. ✅ **Фото должно остаться** (не вернуться к дефолтному)

### Что проверяем:

| Действие | До исправления | После исправления |
|----------|---------------|-------------------|
| Загрузить фото | ✅ Загружается | ✅ Загружается |
| Сохранить (SAVE) | ❌ Не работало | ✅ Работает |
| Перезагрузить (F5) | ❌ Пропадает | ✅ Остается |
| Закрыть браузер | ❌ Пропадает | ✅ Остается |

---

## Важно! 

### Пользователь ДОЛЖЕН нажать кнопку SAVE:

После загрузки изображения пользователь **обязательно должен**:
1. Увидеть toast: "Zdjęcie zostało przesłane!"
2. **Нажать кнопку SAVE** в Navigation
3. Увидеть toast: "✅ Данные успешно сохранены!"

**Только тогда** изменения сохранятся в базу данных!

---

## Логи для проверки

### Frontend Console:
```
📦 Original: 4500 KB → Compressed: 500 KB
✅ Upload result: { url: "https://res.cloudinary.com/..." }
💾 Saving restaurant data... { restaurantInfo: { featuredDishImage: "..." } }
✅ Data saved successfully
```

### Backend Logs (Shuttle):
```bash
shuttle logs --follow
```

Должно быть:
```
📤 Starting Cloudinary upload: photo.jpg (500 KB)
✅ Upload successful
🔄 Updating restaurant info...
✅ Restaurant info updated
```

---

## Архитектура изменений

```
┌─────────────────────────────────────────┐
│  EditableImage Component                │
│  - Сжимает изображение                  │
│  - Загружает в Cloudinary               │
│  - Вызывает onSave(url)                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  RestaurantHero Component               │
│  - handleFeaturedDishUpdate()           │
│  - updateRestaurantInfo({ ... })        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  RestaurantContext                      │
│  - setRestaurantInfo({ ... })           │
│  - setHasChanges(true) ⚠️               │
└──────────────┬──────────────────────────┘
               │
          User clicks SAVE
               │
               ▼
┌─────────────────────────────────────────┐
│  RestaurantContext.saveData()           │
│  - await restaurantInfoAPI.update(...)  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Backend API                            │
│  PUT /api/restaurant/info               │
│  - UPDATE restaurant_info SET ...       │
└─────────────────────────────────────────┘
```

---

## Итого

### Что сделано:
- ✅ Frontend: TypeScript типы обновлены
- ✅ Frontend: RestaurantHero сохраняет в контекст
- ✅ Frontend: RestaurantContext отправляет на backend
- ✅ Frontend API: Интерфейсы обновлены
- ✅ Backend: SQL миграция создана
- ✅ Backend: Rust модели обновлены
- ✅ Backend: Handler обновлен

### Следующий шаг:
```bash
# Деплой backend
cd backend && shuttle deploy

# Деплой frontend
cd .. && npm run build && git push
```

После деплоя загруженные изображения будут **сохраняться навсегда** в базе данных! 🎉
