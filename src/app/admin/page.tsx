import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BarChart3, Home, Package, ShoppingCart, Users } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
    }),
  ]);

  const [totalUsers, totalProducts, totalOrders, orderSum] = stats;
  const totalRevenue = orderSum._sum.total || 0;

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500">
              Панель администратора
            </h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            <Home className="w-4 h-4" />
            На главную
          </Link>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-lg shadow-xl">
            <p className="text-sm text-blue-100 mb-2">Всего пользователей</p>
            <p className="text-4xl font-bold">{totalUsers}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-lg shadow-xl">
            <p className="text-sm text-green-100 mb-2">Продукты в меню</p>
            <p className="text-4xl font-bold">{totalProducts}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-lg shadow-xl">
            <p className="text-sm text-purple-100 mb-2">Всего заказов</p>
            <p className="text-4xl font-bold">{totalOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-lg shadow-xl">
            <p className="text-sm text-orange-100 mb-2">Общая выручка</p>
            <p className="text-4xl font-bold">{Number(totalRevenue).toFixed(0)}₽</p>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/products"
            className="bg-gray-800 p-6 rounded-lg shadow-xl hover:bg-gray-700 transition"
          >
            <Package className="w-10 h-10 text-orange-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Управление продуктами</h3>
            <p className="text-gray-400">Добавление, редактирование и удаление товаров</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-gray-800 p-6 rounded-lg shadow-xl hover:bg-gray-700 transition"
          >
            <ShoppingCart className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Заказы</h3>
            <p className="text-gray-400">Управление заказами и статусами</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-gray-800 p-6 rounded-lg shadow-xl hover:bg-gray-700 transition"
          >
            <Users className="w-10 h-10 text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Пользователи</h3>
            <p className="text-gray-400">Управление пользователями</p>
          </Link>
        </div>

        {/* Последние заказы */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Последние заказы</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Заказов пока нет</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Клиент</th>
                    <th className="text-left py-3 px-4">Товары</th>
                    <th className="text-left py-3 px-4">Сумма</th>
                    <th className="text-left py-3 px-4">Статус</th>
                    <th className="text-left py-3 px-4">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4 text-sm">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.user.name || "Гость"}</p>
                          <p className="text-sm text-gray-400">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {order.items.length} товар(ов)
                      </td>
                      <td className="py-3 px-4 font-semibold text-orange-500">
                        {Number(order.total).toFixed(0)}₽
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "delivered"
                              ? "bg-green-500/20 text-green-400"
                              : order.status === "cancelled"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
