"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Типы для пользователя и контекста
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL вашего Go API (измените на свой)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
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
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    
    // Сохраняем токен в localStorage и cookies
    localStorage.setItem("token", data.token);
    document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
    
    // Устанавливаем пользователя
    setUser(data.user);
  };

  // Регистрация
  const signup = async (email: string, password: string, name?: string) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const data = await response.json();
    
    // Сохраняем токен в localStorage и cookies
    localStorage.setItem("token", data.token);
    document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
    
    // Устанавливаем пользователя
    setUser(data.user);
  };

  // Выход
  const logout = async () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
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

// Утилита для API запросов с авторизацией
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}
