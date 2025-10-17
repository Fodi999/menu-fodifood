"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, TrendingUp, Users, DollarSign, ShoppingBag, Clock } from "lucide-react";
import DashboardCard from "@/components/ui/DashboardCard";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getBusinessAnalytics,
  getTopProducts,
  getPeakHours,
  type PeriodType,
  type AnalyticsPeriod,
  type TopProduct,
  type PeakHour,
} from "@/lib/mock-analytics-api";

export default function BusinessAnalyticsPage() {
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();
  const router = useRouter();

  const [period, setPeriod] = useState<PeriodType>("week");
  const [analytics, setAnalytics] = useState<AnalyticsPeriod | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [peakHours, setPeakHours] = useState<PeakHour[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!user || user.role !== UserRole.BUSINESS_OWNER) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (!currentBusiness?.id) return;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [analyticsData, productsData, hoursData] = await Promise.all([
          getBusinessAnalytics(currentBusiness.id, period),
          getTopProducts(currentBusiness.id),
          getPeakHours(currentBusiness.id),
        ]);

        setAnalytics(analyticsData);
        setTopProducts(productsData);
        setPeakHours(hoursData);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [currentBusiness?.id, period]);

  if (!user || !currentBusiness) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/business/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-green-400" />
              Аналитика
            </h1>
            <p className="text-gray-400 mt-1">{currentBusiness.name}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Period Selector */}
            <motion.div variants={item}>
              <Tabs value={period} onValueChange={(v) => setPeriod(v as PeriodType)}>
                <TabsList className="bg-gray-800/50 border border-gray-700/50">
                  <TabsTrigger value="day" className="data-[state=active]:bg-green-500/20">
                    День
                  </TabsTrigger>
                  <TabsTrigger value="week" className="data-[state=active]:bg-green-500/20">
                    Неделя
                  </TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:bg-green-500/20">
                    Месяц
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            {/* Key Metrics */}
            {analytics && (
              <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                  title="Выручка"
                  value={`₽${analytics.total_revenue.toLocaleString()}`}
                  trend={`${analytics.growth_revenue > 0 ? '+' : ''}${analytics.growth_revenue.toFixed(1)}%`}
                  icon={DollarSign}
                  trendUp={analytics.growth_revenue > 0}
                />
                <DashboardCard
                  title="Заказов"
                  value={analytics.total_orders}
                  trend={`${analytics.growth_orders > 0 ? '+' : ''}${analytics.growth_orders.toFixed(1)}%`}
                  icon={ShoppingBag}
                  trendUp={analytics.growth_orders > 0}
                />
                <DashboardCard
                  title="Клиентов"
                  value={analytics.total_customers}
                  icon={Users}
                />
                <DashboardCard
                  title="Средний чек"
                  value={`₽${analytics.avg_order_value.toFixed(0)}`}
                  icon={TrendingUp}
                />
              </motion.div>
            )}

            {/* Revenue Chart */}
            {analytics && (
              <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Динамика выручки</CardTitle>
                    <CardDescription className="text-gray-400">
                      График доходов за выбранный период
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Выручка (₽)"
                          dot={{ fill: "#10b981", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Orders & Customers Chart */}
            {analytics && (
              <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Заказы и клиенты</CardTitle>
                    <CardDescription className="text-gray-400">
                      Сравнение количества заказов и клиентов
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Legend />
                        <Bar dataKey="orders" fill="#3b82f6" name="Заказы" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="customers" fill="#f59e0b" name="Клиенты" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      Топ блюда
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Самые популярные позиции меню
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium">{product.name}</p>
                              <p className="text-sm text-gray-400">{product.sales} продаж</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-semibold">
                              ₽{product.revenue.toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Peak Hours */}
              <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      Пиковые часы
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Время максимальной загрузки
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={peakHours} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis dataKey="hour" type="category" stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#fff" }}
                        />
                        <Bar dataKey="orders" fill="#a855f7" name="Заказов" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
