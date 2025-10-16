# 🎭 Role-Based Access Control (RBAC)

## ✅ Реализовано

### 1️⃣ Роли в системе

```typescript
export enum UserRole {
  USER = "user",               // Обычный пользователь
  BUSINESS_OWNER = "business_owner", // Владелец ресторана
  INVESTOR = "investor",       // Инвестор
  ADMIN = "admin"              // Системный администратор
}
```

### 2️⃣ Дашборды по ролям

| Роль | Маршрут | Описание |
|------|---------|----------|
| 👤 USER | `/` | Главная страница, каталог ресторанов |
| 👨‍🍳 BUSINESS_OWNER | `/business/dashboard` | Управление рестораном |
| 💰 INVESTOR | `/invest` | Инвестиционный портфель |
| 🧠 ADMIN | `/admin/dashboard` | Системное администрирование |

### 3️⃣ Автоматический редирект

**При логине:**
```typescript
// В AuthContext после успешного login/signup:
document.cookie = `role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
```

**При переключении роли:**
```typescript
// В RoleContext.switchRole():
document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`;
router.push(redirect); // Автоматический редирект на нужный дашборд
```

### 4️⃣ Middleware защита

**src/middleware.ts:**
```typescript
// Проверка токена
if (!token) {
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}

// Проверка доступа по ролям
if (pathname.startsWith("/admin") && role !== "admin") {
  // Редирект на соответствующий дашборд
  if (role === "business_owner") {
    return NextResponse.redirect(new URL("/business/dashboard", request.url));
  }
  return NextResponse.redirect(new URL("/", request.url));
}
```

**Защищенные маршруты:**
- `/admin/*` - только ADMIN
- `/business/*` - только BUSINESS_OWNER или ADMIN
- `/profile/*` - любой авторизованный
- `/orders/*` - любой авторизованный

### 5️⃣ Компоненты

**DashboardRedirect** (`src/components/DashboardRedirect.tsx`):
```tsx
<DashboardRedirect user={user} />
```
Автоматически редиректит пользователя на нужный дашборд после логина.

**Использование:**
```tsx
// В любом компоненте после логина
import DashboardRedirect from '@/components/DashboardRedirect';

export default function SomePage() {
  const { user } = useAuth();
  return <DashboardRedirect user={user} />;
}
```

---

## 🔧 Структура дашбордов

### 👨‍🍳 Business Dashboard

**Файл:** `src/app/business/dashboard/page.tsx`

**Статистика:**
- Заказы сегодня
- Выручка
- Клиенты
- Рейтинг

**Быстрые действия:**
- Меню → `/admin/products`
- Заказы → `/admin/orders`
- Аналитика → `/admin/metrics`

**Защита:**
```typescript
React.useEffect(() => {
  if (!user) return;
  if (user.role !== UserRole.BUSINESS_OWNER) {
    router.push("/"); // Редирект на главную
  }
}, [user, router]);
```

### 🧠 Admin Dashboard

**Файл:** `src/app/admin/dashboard/page.tsx`

**Глобальная статистика:**
- Всего ресторанов
- Активные пользователи
- Общая выручка

**Системные метрики:**
- API Health
- Database status
- Security status

**Административные действия:**
- Пользователи → `/admin/users`
- Рестораны → `/admin`
- Аналитика → `/admin/metrics`

**Защита:**
```typescript
React.useEffect(() => {
  if (!user) return;
  if (user.role !== UserRole.ADMIN) {
    router.push("/"); // Редирект на главную
  }
}, [user, router]);
```

---

## 📊 Поток данных

### 1. При логине:
```
1. Пользователь вводит email/password
2. API возвращает { token, user: { role: "business_owner" } }
3. AuthContext сохраняет:
   - localStorage.setItem("token", token)
   - document.cookie = "token=..." 
   - document.cookie = "role=business_owner"
4. Middleware читает cookie при следующем запросе
5. Автоматический редирект на /business/dashboard
```

### 2. При переключении роли:
```
1. Пользователь кликает на роль в RoleSwitcher
2. RoleContext.switchRole() выполняет:
   - localStorage.setItem("active_role", "investor")
   - document.cookie = "role=investor"
   - api.patch("/user/role", { role: "investor" }) → DB update
3. Router.push("/invest")
4. Middleware проверяет cookie при загрузке /invest
5. Страница отображается
```

### 3. При попытке доступа без прав:
```
1. USER пытается открыть /admin/dashboard
2. Middleware читает cookie: role=user
3. Проверка: pathname.startsWith("/admin") && role !== "admin"
4. NextResponse.redirect("/")
5. Пользователь на главной странице
```

---

## 🧪 Тестирование

### Как протестировать систему:

1. **Зарегистрируйся как новый пользователь:**
   ```
   http://localhost:3000/auth/signup
   ```
   По умолчанию роль = USER

2. **Попробуй открыть /admin/dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```
   ❌ Редирект на `/` (нет доступа)

3. **Переключи роль на BUSINESS_OWNER:**
   ```
   Профиль → RoleSwitcher → "Владелец бизнеса"
   ```
   ✅ Редирект на `/business/dashboard`

4. **Попробуй открыть /admin/dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```
   ❌ Редирект на `/business/dashboard` (middleware проверка)

5. **Вручную смени роль в cookie на ADMIN:**
   ```javascript
   document.cookie = "role=admin; path=/; max-age=86400; SameSite=Lax";
   ```
   ✅ Теперь доступ к `/admin/dashboard` есть

---

## 🔐 Безопасность

### Текущая защита:
- ✅ Middleware проверяет наличие токена
- ✅ Middleware проверяет роль из cookie
- ✅ Компоненты проверяют роль из AuthContext.user.role
- ⏳ Backend проверяет роль при API запросах (нужно реализовать)

### Что нужно добавить:
1. **Backend проверка роли:**
   ```rust
   // В Rust API middleware
   if endpoint.starts_with("/admin") && user.role != "admin" {
       return Err(StatusCode::FORBIDDEN);
   }
   ```

2. **JWT с ролью:**
   ```rust
   // В JWT payload включить роль
   Claims {
       sub: user.id,
       role: user.role, // ← Добавить
       exp: ...
   }
   ```

3. **Refresh role при каждом запросе профиля:**
   ```typescript
   // В AuthContext.checkAuth()
   const userData = await api.get<User>("/user/profile");
   document.cookie = `role=${userData.role}; path=/; ...`;
   ```

---

## 📝 Что дальше?

1. ✅ Базовая RBAC система готова
2. ⏳ Нужен Rust endpoint: `PATCH /api/v1/user/role`
3. ⏳ Backend защита эндпоинтов по ролям
4. ⏳ Автоматическое определение business_id для владельцев
5. ⏳ Интеграция со Stripe для upgrade роли

**Дата:** 17 октября 2025  
**Статус:** 🟢 Готово к тестированию
