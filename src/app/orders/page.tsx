"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад в профиль
        </Link>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="mb-6">
            <ShoppingBag className="w-20 h-20 text-orange-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">История заказов</h1>
            <p className="text-gray-400">
              Эта страница находится в разработке
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6 mb-6">
            <p className="text-gray-300 mb-4">
              Временно вы можете просмотреть свои последние заказы на странице профиля
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/profile"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition font-semibold"
            >
              Перейти в профиль
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-semibold"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
