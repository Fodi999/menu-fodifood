"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Home, Package, ShoppingCart, Users, Package2, Box, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  user?: {
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
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData || []);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-16 sm:py-20 w-full">
          <Skeleton className="h-10 sm:h-12 w-48 sm:w-64 mb-6 sm:mb-8 bg-gray-800/50" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 sm:h-32 bg-gray-800/50" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 sm:h-40 bg-gray-800/50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-1 sm:mb-2">
              Админ-панель
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">FODI SUSHI Dashboard</p>
          </div>
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="border-orange-500/30 bg-gray-900/50 text-white hover:bg-orange-500/10 hover:text-orange-500 backdrop-blur-xl transition-colors"
          >
            <Link href="/">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="text-xs sm:text-sm">На главную</span>
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-600/90 to-blue-700/90 border-none text-white backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/80" />
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                Всего пользователей
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">{stats.totalUsers}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/90 to-green-700/90 border-none text-white backdrop-blur-xl shadow-lg hover:shadow-green-500/20 transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/80" />
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                Всего заказов
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">{stats.totalOrders}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 border-none text-white backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/80" />
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                Товаров
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">{stats.totalProducts}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/90 to-orange-700/90 border-none text-white backdrop-blur-xl shadow-lg hover:shadow-orange-500/20 transition-shadow">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/80" />
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                Выручка
              </CardDescription>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                {(stats.totalRevenue || 0).toLocaleString()} ₽
              </CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:bg-gray-800/60 transition-all group">
            <Link href="/admin/users">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-white">Пользователи</CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Управление пользователями системы
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:bg-gray-800/60 transition-all group">
            <Link href="/admin/orders">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-green-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-white">Заказы</CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Просмотр и управление заказами
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:bg-gray-800/60 transition-all group">
            <Link href="/admin/products">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-purple-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-white">Товары</CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Управление каталогом товаров
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:bg-gray-800/60 transition-all group">
            <Link href="/admin/ingredients">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <Package2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-white">Склад сырья</CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Управление ингредиентами и запасами
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl hover:bg-gray-800/60 transition-all group sm:col-span-2 lg:col-span-1">
            <Link href="/admin/semi-finished">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <Box className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-cyan-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-cyan-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-white">Полуфабрикаты</CardTitle>
                <CardDescription className="text-gray-400 text-xs sm:text-sm">
                  Промежуточные продукты производства
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl text-white">Последние заказы</CardTitle>
            <CardDescription className="text-gray-400 text-xs sm:text-sm">
              Недавно созданные заказы в системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!recentOrders || recentOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-gray-400">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-800/50 mb-3 sm:mb-4">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <p className="text-sm sm:text-base">Нет заказов</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                {/* Mobile: Card View */}
                <div className="block sm:hidden space-y-3">
                  {recentOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white text-sm">
                          #{order.id.slice(0, 8)}
                        </span>
                        <Badge
                          variant={order.status === "completed" ? "default" : "secondary"}
                          className={`text-xs ${
                            order.status === "completed"
                              ? "bg-green-500/90 hover:bg-green-600"
                              : order.status === "pending"
                              ? "bg-yellow-500/90 hover:bg-yellow-600"
                              : "bg-gray-500/90 hover:bg-gray-600"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.user?.name || order.user?.email || "Неизвестный"}
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-700/50">
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </span>
                        <span className="font-bold text-orange-500">
                          {(order.total || 0).toLocaleString()} ₽
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Table View */}
                <ScrollArea className="hidden sm:block h-[300px] md:h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800/50">
                        <TableHead className="text-gray-400 text-xs sm:text-sm">Заказ</TableHead>
                        <TableHead className="text-gray-400 text-xs sm:text-sm">Клиент</TableHead>
                        <TableHead className="text-gray-400 text-xs sm:text-sm hidden md:table-cell">Дата</TableHead>
                        <TableHead className="text-gray-400 text-xs sm:text-sm">Статус</TableHead>
                        <TableHead className="text-gray-400 text-xs sm:text-sm text-right">Сумма</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell className="font-medium text-white text-xs sm:text-sm">
                            #{order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell className="text-gray-300 text-xs sm:text-sm">
                            <div className="truncate max-w-[150px] md:max-w-[200px]">
                              {order.user?.name || order.user?.email || "Неизвестный"}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400 text-xs sm:text-sm hidden md:table-cell">
                            {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={order.status === "completed" ? "default" : "secondary"}
                              className={`text-xs ${
                                order.status === "completed"
                                  ? "bg-green-500/90 hover:bg-green-600"
                                  : order.status === "pending"
                                  ? "bg-yellow-500/90 hover:bg-yellow-600"
                                  : "bg-gray-500/90 hover:bg-gray-600"
                              }`}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-orange-500 text-xs sm:text-sm">
                            {(order.total || 0).toLocaleString()} ₽
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
