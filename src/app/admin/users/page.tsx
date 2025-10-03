import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500">👥 Управление пользователями</h1>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Назад
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left py-4 px-6">Пользователь</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Роль</th>
                  <th className="text-left py-4 px-6">Заказов</th>
                  <th className="text-left py-4 px-6">Регистрация</th>
                  <th className="text-left py-4 px-6">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold">{user.name || "Без имени"}</p>
                        <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {user.role === "admin" ? "Администратор" : "Пользователь"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{user._count.orders}</td>
                    <td className="py-4 px-6 text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        Редактировать
                      </button>
                      {user.role !== "admin" && (
                        <button className="text-red-400 hover:text-red-300">Удалить</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
