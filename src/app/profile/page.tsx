import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                Личный кабинет
              </h1>
              <p className="text-gray-400">Добро пожаловать, {user?.name || user?.email}!</p>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Выйти
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Информация профиля</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Имя</p>
                  <p className="text-white">{user?.name || "Не указано"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Роль</p>
                  <p className="text-white">
                    {user?.role === "admin" ? "Администратор" : "Пользователь"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Зарегистрирован</p>
                  <p className="text-white">
                    {new Date(user?.createdAt || "").toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Статистика</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Всего заказов</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {user?.orders.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {session.user.role === "admin" && (
            <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-5 h-5 text-orange-500" />
                <p className="text-orange-500 font-semibold">Панель администратора</p>
              </div>
              <Link
                href="/admin"
                className="mt-2 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Перейти в админ-панель
              </Link>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">Последние заказы</h2>
            {user?.orders && user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleString("ru-RU")}
                      </p>
                      <p className="text-white">Заказ #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-400">Статус: {order.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">
                        {order.total.toString()}₽
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                У вас пока нет заказов
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Вернуться в меню
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
