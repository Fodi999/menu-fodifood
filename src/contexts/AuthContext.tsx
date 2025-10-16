"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";
import { getApiUrl } from "@/lib/utils";
import type { User, AuthTokens } from "@/types/user";

// Экспортируем типы для совместимости
export type { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверка текущего пользователя при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  // Проверить авторизацию
  const checkAuth = async () => {
    try {
      // Проверка на клиентскую сторону (для SSR совместимости)
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.get<User>("/user/profile");
        setUser(userData);
      } catch (error) {
        // Токен невалидный - удаляем
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Вход
  const login = async (email: string, password: string) => {
    const data = await api.post<{ token: string; user: User; tokens?: AuthTokens }>("/auth/login", {
      email,
      password,
    });
    
    // Сохраняем токен и роль в localStorage и cookies (только на клиенте)
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
    }
    
    // Устанавливаем пользователя
    setUser(data.user);
  };

  // Регистрация
  const signup = async (email: string, password: string, name?: string) => {
    const data = await api.post<{ token: string; user: User; tokens?: AuthTokens }>("/auth/register", {
      email,
      password,
      name,
    });
    
    // Сохраняем токен и роль в localStorage и cookies (только на клиенте)
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;
    }
    
    // Устанавливаем пользователя
    setUser(data.user);
  };

  // Выход
  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0";
    }
    setUser(null);
  };

  // Обновить данные пользователя
  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Утилита для получения токена
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// Утилита для API запросов с авторизацией (deprecated - используйте api из @/lib/api)
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Используем новый API клиент
  return fetch(`${getApiUrl()}${url}`, {
    ...options,
    headers,
  });
}
