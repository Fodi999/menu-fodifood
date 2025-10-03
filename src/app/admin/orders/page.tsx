import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const orders = await prisma.order.findMany({
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
            <ShoppingCart className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500">Управление заказами</h1>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center">
            <p className="text-gray-400 text-lg">Заказов пока нет</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Заказ #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "cancelled"
                        ? "bg-red-500/20 text-red-400"
                        : order.status === "preparing"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-orange-500 mb-2">Клиент</h4>
                    <p className="text-white">{order.user.name || "Гость"}</p>
                    <p className="text-gray-400 text-sm">{order.user.email}</p>
                    <p className="text-gray-400 text-sm">{order.phone}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-orange-500 mb-2">Доставка</h4>
                    <p className="text-white">{order.address}</p>
                    {order.comment && (
                      <p className="text-gray-400 text-sm mt-2">
                        Комментарий: {order.comment}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-semibold text-orange-500 mb-3">Состав заказа</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-gray-700/50 p-3 rounded"
                      >
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-400">
                            {item.quantity} x {Number(item.price).toFixed(0)}₽
                          </p>
                        </div>
                        <p className="font-semibold text-orange-500">
                          {(item.quantity * Number(item.price)).toFixed(0)}₽
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xl font-bold">ИТОГО:</p>
                    <p className="text-2xl font-bold text-orange-500">
                      {Number(order.total).toFixed(0)}₽
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Изменить статус
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                    Детали
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
