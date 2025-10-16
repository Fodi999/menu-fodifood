"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/hooks/useBusiness";
import { fetchMetrics, fetchInsights } from "@/lib/rust-api";
import { UserRole } from "@/types/user";
import type { BusinessMetrics, AIInsight } from "@/types/metrics";
import { MetricsPeriod } from "@/types/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Lightbulb,
  RefreshCw,
  Home
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MetricsPage() {
  const { user, loading: authLoading } = useAuth();
  const { currentBusiness } = useBusiness();
  const router = useRouter();

  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [period, setPeriod] = useState<MetricsPeriod>(MetricsPeriod.MONTH);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== UserRole.BUSINESS_OWNER)) {
      router.push("/auth/signin?callbackUrl=/admin/metrics");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (currentBusiness) {
      loadData();
    }
  }, [currentBusiness, period]);

  const loadData = async () => {
    if (!currentBusiness) {
      setError("Бизнес не выбран");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [metricsData, insightsData] = await Promise.all([
        fetchMetrics(currentBusiness.id, period),
        fetchInsights(currentBusiness.id),
      ]);

      setMetrics(metricsData);
      setInsights(insightsData);
    } catch (err) {
      console.error("Failed to load metrics:", err);
      setError("Rust API недоступен (http://127.0.0.1:8000). Показаны демо-данные.");
      
      // Mock data for development
      setMetrics({
        revenue: { total: 125000, growth: 15.5, chart_data: [] },
        orders: { total: 342, completed: 320, cancelled: 22, average_value: 365 },
        conversion: { rate: 93.5, completed: 320, total: 342 },
        products: { total: 45, active: 42, out_of_stock: 3 },
      });
      
      setInsights([
        {
          id: "1",
          title: "📈 Рост продаж суши-сетов",
          description: "Суши-сеты показывают рост продаж на 25% за последний месяц. Рекомендуется увеличить запас риса и лосося.",
          priority: "high",
          category: "sales",
          actions: ["Увеличить закупку", "Создать акцию"],
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "⚠️ Низкий запас васаби",
          description: "Текущий запас васаби рассчитан на 3 дня при текущем темпе продаж.",
          priority: "medium",
          category: "inventory",
          actions: ["Заказать васаби"],
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user || user.role !== UserRole.BUSINESS_OWNER) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📊 Аналитика и Метрики</h1>
            <p className="text-gray-400">
              {currentBusiness?.name || "Выберите бизнес"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-gray-800 border-gray-700">
              <Link href="/admin">
                <Home className="w-4 h-4 mr-2" />
                Админ
              </Link>
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-6 bg-yellow-500/20 border-yellow-500">
            <CardContent className="p-4">
              <p className="text-yellow-200">⚠️ {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Period Selector */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as MetricsPeriod)} className="mb-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value={MetricsPeriod.DAY}>День</TabsTrigger>
            <TabsTrigger value={MetricsPeriod.WEEK}>Неделя</TabsTrigger>
            <TabsTrigger value={MetricsPeriod.MONTH}>Месяц</TabsTrigger>
            <TabsTrigger value={MetricsPeriod.YEAR}>Год</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Выручка
                </CardTitle>
                <DollarSign className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${metrics.revenue.total.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.revenue.growth > 0 ? "+" : ""}
                  {metrics.revenue.growth}% к предыдущему периоду
                </p>
              </CardContent>
            </Card>

            {/* Orders */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Заказы
                </CardTitle>
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {metrics.orders.total}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Средний чек: ${metrics.orders.average_value}
                </p>
              </CardContent>
            </Card>

            {/* Conversion */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Конверсия
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {metrics.conversion.rate.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.conversion.completed} из {metrics.conversion.total}
                </p>
              </CardContent>
            </Card>

            {/* Products */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Продукты
                </CardTitle>
                <Users className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {metrics.products?.total || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Активных: {metrics.products?.active || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Insights */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-xl text-white">
                🤖 AI Инсайты и Рекомендации
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Инсайты будут доступны после анализа данных
              </p>
            ) : (
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{insight.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        insight.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        insight.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{insight.description}</p>
                    {insight.actions && insight.actions.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {insight.actions.map((action, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant="outline"
                            className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
