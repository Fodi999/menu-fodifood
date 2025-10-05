"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  orders: Order[];
}

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                Личный кабинет
              </h1>
              <p className="text-gray-400">
                Добро пожаловать, {profile.name || profile.email}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Выйти
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Информация о профиле
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Email:</span>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <span className="text-gray-400">Имя:</span>
                  <p className="font-medium">{profile.name || "Не указано"}</p>
                </div>
                <div>
                  <span className="text-gray-400">Роль:</span>
                  <p className="font-medium capitalize">{profile.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Статистика</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Всего заказов:</span>
                  <p className="text-2xl font-bold text-orange-500">
                    {profile.orders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {profile.role === "admin" && (
            <div className="mb-8">
              <Link
                href="/admin"
                className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition"
              >
                Перейти в админ-панель
              </Link>
            </div>
          )}

          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Последние заказы</h3>
            {profile.orders.length === 0 ? (
              <p className="text-gray-400">У вас пока нет заказов</p>
            ) : (
              <div className="space-y-4">
                {profile.orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-600 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">Заказ #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-500">
                        {order.total} ₽
                      </p>
                      <p className="text-sm text-gray-400">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
