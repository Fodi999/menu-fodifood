"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("🔐 Attempting sign in...");
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("📊 Sign in result:", result);

      if (result?.error) {
        console.error("❌ Sign in error:", result.error);
        setError("Неверный email или пароль");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        console.log("✅ Sign in successful!");
        setSuccess("Вход выполнен успешно! Перенаправление...");
        
        // Ждём немного, чтобы сессия точно сохранилась
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Получаем сессию для проверки роли
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        
        console.log("👤 Session after login:", session);
        
        // Определяем куда редиректить
        const redirectPath = session?.user?.role === "admin" ? "/admin" : "/profile";
        console.log(`🔄 Redirecting to: ${redirectPath}`);
        
        // Используем window.location для полной перезагрузки и обновления сессии
        window.location.href = redirectPath;
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      setError("Произошла ошибка при входе");
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
