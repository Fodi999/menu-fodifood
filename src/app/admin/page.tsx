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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <Skeleton className="h-12 w-64 mb-8 bg-gray-800" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 bg-gray-800" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-40 bg-gray-800" />
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
    <div className="min-h-screen bg-gray-900 text-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">
              Админ-панель
            </h1>
            <p className="text-sm sm:text-base text-gray-400">FODI SUSHI Dashboard</p>
          </div>
          <Button asChild variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              На главную
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-xs sm:text-sm mb-1">
                Всего пользователей
              </CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-bold">{stats.totalUsers}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-none text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-xs sm:text-sm mb-1">
                Всего заказов
              </CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-bold">{stats.totalOrders}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-none text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-xs sm:text-sm mb-1">
                Товаров
              </CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-bold">{stats.totalProducts}</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-none text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80 text-xs sm:text-sm mb-1">
                Выручка
              </CardDescription>
              <CardTitle className="text-3xl sm:text-4xl font-bold">
                {(stats.totalRevenue || 0).toLocaleString()} ₽
              </CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group">
            <Link href="/admin/users">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg sm:text-xl mb-2">Пользователи</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Управление пользователями системы
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group">
            <Link href="/admin/orders">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-green-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg sm:text-xl mb-2">Заказы</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Просмотр и управление заказами
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group">
            <Link href="/admin/products">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg sm:text-xl mb-2">Товары</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Управление каталогом товаров
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group">
            <Link href="/admin/ingredients">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Package2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg sm:text-xl mb-2">Склад сырья</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Управление ингредиентами и запасами
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors group">
            <Link href="/admin/semi-finished">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Box className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-500 group-hover:scale-110 transition-transform" />
                  <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg sm:text-xl mb-2">Полуфабрикаты</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Промежуточные продукты производства
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Последние заказы</CardTitle>
            <CardDescription className="text-gray-400">
              Недавно созданные заказы в системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!recentOrders || recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>Нет заказов</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-750">
                      <TableHead className="text-gray-400">Заказ</TableHead>
                      <TableHead className="text-gray-400 hidden sm:table-cell">Клиент</TableHead>
                      <TableHead className="text-gray-400 hidden md:table-cell">Дата</TableHead>
                      <TableHead className="text-gray-400">Статус</TableHead>
                      <TableHead className="text-gray-400 text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-gray-700 hover:bg-gray-750">
                        <TableCell className="font-medium text-white">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="text-gray-300 hidden sm:table-cell">
                          {order.user?.name || order.user?.email || "Неизвестный"}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm hidden md:table-cell">
                          {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={order.status === "completed" ? "default" : "secondary"}
                            className={
                              order.status === "completed"
                                ? "bg-green-500 hover:bg-green-600"
                                : order.status === "pending"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-gray-500 hover:bg-gray-600"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-orange-500">
                          {(order.total || 0).toLocaleString()} ₽
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
