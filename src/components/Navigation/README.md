# Навигация - Инструкция по использованию

## Компоненты

### Header
Главный компонент хедера с навигацией для мобильных и десктопных устройств.

**Возможности:**
- ✅ Адаптивная навигация (мобильная + десктоп)
- ✅ Боковая панель на мобильных
- ✅ Dropdown меню профиля на десктопе
- ✅ Кнопка входа/выхода
- ✅ Корзина
- ✅ Переключатель темы

### MobileNav
Боковая панель для мобильных устройств (< 768px).

**Функции:**
- Навигация по основным страницам
- Информация о пользователе
- Кнопка входа/выхода
- Иконки для каждого пункта меню

### DesktopNav
Горизонтальная навигация для десктопа (>= 768px).

**Функции:**
- Ссылки на основные страницы
- Dropdown меню профиля с аватаром
- Быстрый доступ к профилю и заказам

## Установка зависимостей

```bash
npm install @radix-ui/react-dropdown-menu
```

## Использование

### В Layout (рекомендуется)

```typescript
// src/app/layout.tsx
'use client';

import { Header } from '@/components/Navigation';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    avatar: '/avatar.jpg'
  });

  const handleLogin = () => {
    // Открыть модальное окно входа
    console.log('Open login modal');
    // После успешного входа:
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ name: '', email: '', avatar: '' });
    // Редирект на главную
  };

  return (
    <html lang="ru">
      <body>
        <Header
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
          userName={user.name}
          userEmail={user.email}
          userAvatar={user.avatar}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### С контекстом авторизации

```typescript
// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

Затем в layout:

```typescript
// src/app/layout.tsx
'use client';

import { Header } from '@/components/Navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleLogin = () => {
    // Открыть модальное окно
    // После успешного входа:
    login({
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      avatar: '/avatar.jpg'
    });
  };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={logout}
        userName={user?.name}
        userEmail={user?.email}
        userAvatar={user?.avatar}
      />
      <main>{children}</main>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Навигационные пункты

По умолчанию доступны:
- 🏠 **Главная** (`/`)
- 🍕 **Меню** (`/menu`)
- 📦 **Мои заказы** (`/orders`)
- 👤 **Профиль** (`/profile`)

Можно кастомизировать в файлах:
- `src/components/Navigation/MobileNav.tsx`
- `src/components/Navigation/DesktopNav.tsx`

## Стилизация

Компоненты используют:
- Tailwind CSS
- shadcn/ui компоненты
- Lucide React иконки

Цвета адаптируются к теме (светлая/темная).

## Props

### Header

```typescript
interface HeaderProps {
  isAuthenticated?: boolean;    // Статус авторизации
  onLogin?: () => void;          // Обработчик входа
  onLogout?: () => void;         // Обработчик выхода
  userName?: string;             // Имя пользователя
  userEmail?: string;            // Email (только десктоп)
  userAvatar?: string;           // URL аватара (только десктоп)
}
```

## Мобильная версия

На мобильных устройствах (< 768px):
- Кнопка "бургер" слева
- При нажатии открывается боковая панель слева
- Полноэкранное меню с крупными кнопками
- Информация о пользователе внизу
- Кнопка входа/выхода

## Десктопная версия

На десктопе (>= 768px):
- Горизонтальное меню в центре
- Аватар пользователя справа
- Dropdown меню при клике на аватар
- Быстрый доступ к профилю и заказам

## Готово! 🎉

Навигация полностью настроена и готова к использованию!
