"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Home, Package, ShoppingCart, Users } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const [statsRes, ordersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/orders/recent`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        
        if (ordersRes.ok) {
          setRecentOrders(await ordersRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user?.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500">
            Админ-панель FODI SUSHI
          </h1>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          >
            <Home className="w-5 h-5" />
            На главную
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-white/80" />
              <BarChart3 className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-white/80 text-sm mb-1">Всего пользователей</p>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-10 h-10 text-white/80" />
              <BarChart3 className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-white/80 text-sm mb-1">Всего заказов</p>
            <p className="text-4xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-10 h-10 text-white/80" />
              <BarChart3 className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-white/80 text-sm mb-1">Товаров</p>
            <p className="text-4xl font-bold">{stats.totalProducts}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-10 h-10 text-white/80" />
              <BarChart3 className="w-6 h-6 text-white/60" />
            </div>
            <p className="text-white/80 text-sm mb-1">Выручка</p>
            <p className="text-4xl font-bold">{stats.totalRevenue} ₽</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/users"
            className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition group"
          >
            <Users className="w-12 h-12 text-blue-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold mb-2">Пользователи</h3>
            <p className="text-gray-400">Управление пользователями системы</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition group"
          >
            <ShoppingCart className="w-12 h-12 text-green-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold mb-2">Заказы</h3>
            <p className="text-gray-400">Просмотр и управление заказами</p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg transition group"
          >
            <Package className="w-12 h-12 text-purple-500 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-semibold mb-2">Товары</h3>
            <p className="text-gray-400">Управление каталогом товаров</p>
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-6">Последние заказы</h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400">Нет заказов</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      Заказ #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order.user.name || order.user.email}
                    </p>
                    <p className="text-xs text-gray-500">
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
  );
}
