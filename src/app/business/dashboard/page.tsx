"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ShoppingCart, TrendingUp, Users, MapPin, Tag, ArrowLeft, UtensilsCrossed, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const { currentBusiness, isLoading } = useBusiness();
  const router = useRouter();

  // Проверка доступа
  React.useEffect(() => {
    if (!user) return;
    if (user.role !== UserRole.BUSINESS_OWNER) {
      router.push("/");
    }
  }, [user, router]);

  // Если нет бизнеса, предложить создать
  React.useEffect(() => {
    if (!user) return;
    if (user.role === UserRole.BUSINESS_OWNER && !isLoading && !currentBusiness) {
      console.log("⚠️ No business found, redirecting to onboarding");
      router.push("/auth/onboarding");
    }
  }, [user, currentBusiness, isLoading, router]);

  if (!user || user.role !== UserRole.BUSINESS_OWNER) {
    return null;
  }

  // Показываем лоадер пока загружается бизнес
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  // Если нет бизнеса, показываем заглушку (редирект уже произойдет)
  if (!currentBusiness) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/profile")}
          className="mb-4 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад в профиль
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                👨‍🍳 {currentBusiness.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentBusiness.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{currentBusiness.category}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
              Активен
            </Badge>
          </div>
          {currentBusiness.description && (
            <p className="text-gray-400 mt-4 max-w-2xl">
              {currentBusiness.description}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Товаров в меню
              </CardTitle>
              <Store className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {currentBusiness.products_count || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">активных позиций</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Рейтинг
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {currentBusiness.rating ? currentBusiness.rating.toFixed(1) : "—"}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {currentBusiness.reviews_count || 0} отзывов
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Подписчики
              </CardTitle>
              <Users className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {currentBusiness.subscribers_count || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">активных</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Заказы сегодня
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">0</div>
              <p className="text-xs text-gray-400 mt-1">скоро появятся</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Быстрые действия</CardTitle>
            <CardDescription className="text-gray-400">
              Управление вашим рестораном
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/50 hover:border-orange-500 transition-all text-left justify-start"
            >
              <Link href="/business/menu" className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-orange-400 font-semibold">
                  <UtensilsCrossed className="w-5 h-5" />
                  Меню
                </div>
                <div className="text-sm text-gray-400">Управление блюдами</div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50 hover:border-blue-500 transition-all text-left justify-start"
            >
              <Link href="/business/orders" className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <ShoppingCart className="w-5 h-5" />
                  Заказы
                </div>
                <div className="text-sm text-gray-400">Просмотр и обработка</div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50 hover:border-green-500 transition-all text-left justify-start"
            >
              <Link href="/business/analytics" className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <BarChart3 className="w-5 h-5" />
                  Аналитика
                </div>
                <div className="text-sm text-gray-400">Статистика и отчёты</div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
