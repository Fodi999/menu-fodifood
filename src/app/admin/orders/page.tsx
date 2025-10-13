"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { OrderNotificationsContainer } from "@/components/OrderNotificationToast";
import Link from "next/link";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Loader2, 
  Wifi, 
  WifiOff, 
  Bell, 
  ChevronDown, 
  Check, 
  X,
  Phone,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Filter,
  Package
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
      const ordersList = data.orders || [];
      setOrders(ordersList);
      setFilteredOrders(ordersList);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация заказов по статусу
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950/20 flex items-center justify-center">
        <Card className="w-64 bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-gray-400">Загрузка заказов...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950/20 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-green-500/10 backdrop-blur-xl">
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Управление заказами
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Всего: {orders.length} {filteredOrders.length !== orders.length && `• Показано: ${filteredOrders.length}`}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* WebSocket статус */}
            <Badge 
              variant="outline" 
              className={`${
                isConnected 
                  ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                  : 'bg-red-500/10 text-red-500 border-red-500/30'
              } backdrop-blur-xl text-xs sm:text-sm`}
            >
              {isConnected ? <Wifi className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" /> : <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />}
              {isConnected ? 'Онлайн' : 'Оффлайн'}
            </Badge>

            {/* Счётчик уведомлений */}
            {notifications.length > 0 && (
              <Button
                onClick={clearNotifications}
                size="sm"
                className="bg-orange-500/90 hover:bg-orange-600 text-xs sm:text-sm"
              >
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                {notifications.length} новых
              </Button>
            )}

            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="border-green-500/30 bg-gray-900/50 text-white hover:bg-green-500/10 hover:text-green-500 backdrop-blur-xl transition-colors"
            >
              <Link href="/admin">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">Назад</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Фильтр по статусу */}
        <Card className="mb-6 bg-gray-900/50 border-gray-800 backdrop-blur-xl">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[240px] bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">Все заказы</SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-gray-700">🟡 В ожидании</SelectItem>
                  <SelectItem value="confirmed" className="text-white hover:bg-gray-700">🟣 Подтверждён</SelectItem>
                  <SelectItem value="preparing" className="text-white hover:bg-gray-700">🔵 Готовится</SelectItem>
                  <SelectItem value="delivered" className="text-white hover:bg-gray-700">🟢 Доставлен</SelectItem>
                  <SelectItem value="cancelled" className="text-white hover:bg-gray-700">🔴 Отменён</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ошибки */}
        {error && (
          <Card className="mb-6 bg-red-500/10 border-red-500/30">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Список заказов */}
        {filteredOrders.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardContent className="pt-12 pb-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {statusFilter === "all" ? "Заказов пока нет" : "Нет заказов с этим статусом"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filteredOrders.map((order) => {
              const isUpdating = updatingOrderId === order.id;
              const canComplete = !['delivered', 'cancelled'].includes(order.status);
              const canCancel = !['delivered', 'cancelled'].includes(order.status);

              return (
                <AccordionItem 
                  key={order.id}
                  value={order.id}
                  className={`border-2 rounded-xl overflow-hidden bg-gray-800 backdrop-blur-xl transition-all hover:shadow-2xl ${getStatusColor(order.status)}`}
                >
                  <AccordionTrigger className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-start justify-between gap-2 sm:gap-4 w-full pr-2 sm:pr-4">
                      {/* Основная информация - всегда видна */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold truncate">
                            Заказ #{order.id.slice(0, 8)}
                          </h3>
                          <Badge className={`${getStatusBadgeColor(order.status)} text-xs sm:text-sm`}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        
                        {/* Краткая информация с иконками */}
                        <div className="grid grid-cols-1 gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{order.user.name || "Гость"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{order.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{order.address}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(order.createdAt).toLocaleString("ru-RU", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                            <span className="font-semibold text-orange-400 text-sm sm:text-base md:text-lg whitespace-nowrap">
                              {order.total.toFixed(0)}₽
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-2 border-t border-gray-700/50">
                    {/* Детали заказа */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-orange-500 mb-2 sm:mb-3 text-xs sm:text-sm md:text-base">Состав заказа</h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center bg-gray-700/30 p-2 sm:p-3 rounded-lg"
                          >
                            <div className="flex-1 min-w-0 mr-2 sm:mr-4">
                              <p className="font-medium text-xs sm:text-sm md:text-base truncate">{item.product.name}</p>
                              <p className="text-xs text-gray-400">
                                {item.quantity} × {item.price.toFixed(0)}₽
                              </p>
                            </div>
                            <p className="font-semibold text-orange-500 text-xs sm:text-sm md:text-base whitespace-nowrap">
                              {(item.quantity * item.price).toFixed(0)}₽
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                        <p className="text-sm sm:text-base md:text-xl font-bold">ИТОГО:</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500">
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
                    <div className="flex flex-col gap-3">
                      {/* Быстрые действия */}
                      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                        {canComplete && (
                          <Button
                            onClick={() => handleQuickAction(order.id, 'complete')}
                            disabled={isUpdating}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <Check className="w-4 h-4 mr-1.5" />
                            Выполнен
                          </Button>
                        )}
                        
                        {canCancel && (
                          <Button
                            onClick={() => handleQuickAction(order.id, 'cancel')}
                            disabled={isUpdating}
                            variant="destructive"
                            className="flex-1"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-1.5" />
                            Отменить
                          </Button>
                        )}
                      </div>

                      {/* Детальный выбор статуса с использованием shadcn Select */}
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="pending" className="text-white hover:bg-gray-700">
                            🟡 В ожидании
                          </SelectItem>
                          <SelectItem value="confirmed" className="text-white hover:bg-gray-700">
                            🟣 Подтверждён
                          </SelectItem>
                          <SelectItem value="preparing" className="text-white hover:bg-gray-700">
                            🔵 Готовится
                          </SelectItem>
                          <SelectItem value="delivered" className="text-white hover:bg-gray-700">
                            🟢 Доставлен
                          </SelectItem>
                          <SelectItem value="cancelled" className="text-white hover:bg-gray-700">
                            🔴 Отменён
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {isUpdating && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Обновление статуса...
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
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
