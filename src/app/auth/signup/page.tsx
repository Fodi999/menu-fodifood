"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    try {
      console.log("📝 Attempting registration...");
      
      // Регистрация через Go API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Registration failed:", data);
        setError(data.error || data.message || "Ошибка при регистрации");
        setLoading(false);
        return;
      }

      console.log("✅ Registration successful, logging in...");

      // Показываем успех
      setSuccess("Регистрация успешна! Выполняется вход...");

      // Автоматический вход после регистрации
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        console.error("❌ Auto-login failed:", loginData);
        setError("Регистрация успешна, но не удалось выполнить вход. Попробуйте войти вручную.");
        setLoading(false);
        return;
      }

      console.log("✅ Auto-login successful");
      
      // Сохраняем токен в localStorage и cookies (используем единый ключ "token")
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
        document.cookie = `token=${loginData.token}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      // Редирект на профиль
      setTimeout(() => {
        router.push("/profile");
      }, 500);

    } catch (err) {
      console.error("💥 Registration error:", err);
      setError("Произошла ошибка при регистрации. Проверьте подключение к серверу.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">
          Регистрация в FODI SUSHI
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
              Имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ваше имя"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Минимум 6 символов"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Подтвердите пароль
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Повторите пароль"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Уже есть аккаунт?{" "}
            <Link
              href="/auth/signin"
              className="text-orange-500 hover:text-orange-400 font-medium"
            >
              Войти
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-400">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
