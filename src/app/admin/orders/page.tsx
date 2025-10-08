"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { OrderNotificationsContainer } from "@/components/OrderNotificationToast";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Loader2, Wifi, WifiOff, Bell, ChevronDown, Check, X } from "lucide-react";

type Order = {
  id: string;
  userId: string;
  status: string;
  total: number;
  address: string;
  phone: string;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
    };
  }>;
};

// Вспомогательные функции для работы со статусами
const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 border-green-500/30";
    case "cancelled":
      return "bg-red-500/10 border-red-500/30";
    case "preparing":
      return "bg-blue-500/10 border-blue-500/30";
    case "confirmed":
      return "bg-purple-500/10 border-purple-500/30";
    case "pending":
    default:
      return "bg-yellow-500/10 border-yellow-500/30";
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500/20 text-green-400";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    case "preparing":
      return "bg-blue-500/20 text-blue-400";
    case "confirmed":
      return "bg-purple-500/20 text-purple-400";
    case "pending":
    default:
      return "bg-yellow-500/20 text-yellow-400";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "🟡 В ожидании";
    case "confirmed":
      return "🟣 Подтверждён";
    case "preparing":
      return "🔵 Готовится";
    case "delivered":
      return "🟢 Доставлен";
    case "cancelled":
      return "🔴 Отменён";
    default:
      return status;
  }
};

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // WebSocket для real-time уведомлений
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const { isConnected, notifications, clearNotifications } = useOrderNotifications(token);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/auth/signin?callbackUrl=/admin/orders");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user]);

  // Перезагружаем заказы при получении нового уведомления
  useEffect(() => {
    if (notifications.length > 0) {
      fetchOrders();
    }
  }, [notifications]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Обновляем локальное состояние
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Показываем уведомление об успехе
      const successMsg = newStatus === "delivered" ? "Заказ помечен как доставлен!" : 
                        newStatus === "cancelled" ? "Заказ отменён" :
                        "Статус обновлён!";
      
      // Можно добавить toast-уведомление здесь
      console.log(`✅ ${successMsg}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("❌ Не удалось обновить статус заказа");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Быстрые действия для статусов
  const handleQuickAction = async (orderId: string, action: 'complete' | 'cancel') => {
    const newStatus = action === 'complete' ? 'delivered' : 'cancelled';
    await handleStatusChange(orderId, newStatus);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
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
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500">Управление заказами</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* WebSocket статус */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isConnected ? 'Подключено' : 'Не подключено'}
              </span>
            </div>

            {/* Счётчик новых уведомлений */}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {notifications.length} новых
                </span>
              </button>
            )}

            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-12 text-center">
            <p className="text-gray-400 text-lg">Заказов пока нет</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isUpdating = updatingOrderId === order.id;
              const canComplete = !['delivered', 'cancelled'].includes(order.status);
              const canCancel = !['delivered', 'cancelled'].includes(order.status);

              return (
                <details 
                  key={order.id} 
                  className={`group bg-gray-800 rounded-xl shadow-lg border-2 transition-all hover:shadow-2xl ${getStatusColor(order.status)}`}
                >
                  <summary className="cursor-pointer p-4 sm:p-6 list-none">
                    <div className="flex items-start justify-between gap-4">
                      {/* Основная информация - всегда видна */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold truncate">
                            Заказ #{order.id.slice(0, 8)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusBadgeColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        
                        {/* Краткая информация */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-300">Клиент:</span>
                            <span className="truncate">{order.user.name || "Гость"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-300">Телефон:</span>
                            <span className="truncate">{order.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <span className="font-medium text-gray-300">Адрес:</span>
                            <span className="truncate">{order.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-300">Время:</span>
                            <span className="truncate">
                              {new Date(order.createdAt).toLocaleString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-orange-400 text-base sm:text-lg">
                              Сумма: {order.total.toFixed(0)}₽
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Кнопка раскрытия */}
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0 mt-1" />
                    </div>
                  </summary>

                  {/* Подробная информация - раскрывается */}
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-gray-700/50">
                    {/* Детали заказа */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-orange-500 mb-3 text-sm sm:text-base">Состав заказа</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center bg-gray-700/30 p-3 rounded-lg"
                          >
                            <div className="flex-1 min-w-0 mr-4">
                              <p className="font-medium text-sm sm:text-base truncate">{item.product.name}</p>
                              <p className="text-xs sm:text-sm text-gray-400">
                                {item.quantity} × {item.price.toFixed(0)}₽
                              </p>
                            </div>
                            <p className="font-semibold text-orange-500 text-sm sm:text-base whitespace-nowrap">
                              {(item.quantity * item.price).toFixed(0)}₽
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                        <p className="text-base sm:text-xl font-bold">ИТОГО:</p>
                        <p className="text-xl sm:text-2xl font-bold text-orange-500">
                          {order.total.toFixed(0)}₽
                        </p>
                      </div>
                    </div>

                    {/* Дополнительная информация */}
                    {order.comment && (
                      <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-300">
                          <span className="font-semibold text-orange-500">Комментарий:</span> {order.comment}
                        </p>
                      </div>
                    )}

                    {/* Действия */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Быстрые действия */}
                      {canComplete && (
                        <button
                          onClick={() => handleQuickAction(order.id, 'complete')}
                          disabled={isUpdating}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                        >
                          <Check className="w-4 h-4" />
                          Выполнен
                        </button>
                      )}
                      
                      {canCancel && (
                        <button
                          onClick={() => handleQuickAction(order.id, 'cancel')}
                          disabled={isUpdating}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
                        >
                          <X className="w-4 h-4" />
                          Отменить
                        </button>
                      )}

                      {/* Детальный выбор статуса */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdating}
                        className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 cursor-pointer text-sm sm:text-base"
                      >
                        <option value="pending">🟡 В ожидании</option>
                        <option value="confirmed">� Подтверждён</option>
                        <option value="preparing">� Готовится</option>
                        <option value="delivered">🟢 Доставлен</option>
                        <option value="cancelled">🔴 Отменён</option>
                      </select>
                    </div>

                    {isUpdating && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Обновление статуса...
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>

      {/* Уведомления о новых заказах */}
      <OrderNotificationsContainer
        notifications={notifications}
        onClear={clearNotifications}
      />
    </div>
  );
}
