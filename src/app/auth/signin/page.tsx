"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  // Проверяем ошибки из URL
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      console.error("❌ Auth error from URL:", urlError);
      setError("Неверный email или пароль");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("🔐 Attempting sign in...");
      
      // Вызов Go API для входа
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Login failed:", data);
        setError(data.error || data.message || "Неверный email или пароль");
        setLoading(false);
        return;
      }

      console.log("✅ Login successful", data);
      
      // Сохраняем токен в localStorage и cookies (используем единый ключ "token")
      if (data.token) {
        console.log("💾 Saving token to localStorage and cookies");
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("✅ Token and user saved");
      }

      // Показываем успех
      setSuccess("Вход выполнен! Перенаправление...");
      setLoading(false);

      // Определяем куда редиректить
      const callbackUrl = searchParams.get('callbackUrl') || 
                         (data.user?.role === 'admin' ? '/admin' : '/profile');
      
      console.log(`🎯 Will redirect to: ${callbackUrl}`);
      
      // Используем window.location для гарантированного редиректа
      setTimeout(() => {
        console.log(`🚀 Redirecting now to: ${callbackUrl}`);
        window.location.href = callbackUrl;
      }, 1000);

    } catch (err) {
      console.error("💥 Unexpected error:", err);
      setError("Произошла ошибка при входе. Проверьте подключение к серверу.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">
          Вход в FODI SUSHI
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Нет аккаунта?{" "}
            <Link
              href="/auth/signup"
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-400"
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
