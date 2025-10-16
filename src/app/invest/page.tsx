"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Building2, DollarSign, BarChart3, ArrowUpRight, Star, MapPin } from "lucide-react";

interface BusinessToken {
  id: string;
  businessName: string;
  city: string;
  category: string;
  tokenPrice: number;
  totalTokens: number;
  availableTokens: number;
  revenue: number;
  roi: number;
  rating: number;
}

export default function InvestPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessToken[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // TODO: Fetch businesses with tokenization from API
    const mockBusinesses: BusinessToken[] = [
      {
        id: "1",
        businessName: "FODI SUSHI",
        city: "Москва",
        category: "Суши",
        tokenPrice: 100,
        totalTokens: 1000,
        availableTokens: 450,
        revenue: 125000,
        roi: 15.5,
        rating: 4.8,
      },
      {
        id: "2",
        businessName: "Pizza Palace",
        city: "Санкт-Петербург",
        category: "Пицца",
        tokenPrice: 85,
        totalTokens: 800,
        availableTokens: 320,
        revenue: 98000,
        roi: 12.3,
        rating: 4.6,
      },
      {
        id: "3",
        businessName: "Coffee House",
        city: "Казань",
        category: "Кофе",
        tokenPrice: 50,
        totalTokens: 500,
        availableTokens: 150,
        revenue: 45000,
        roi: 18.2,
        rating: 4.9,
      },
    ];

    setTimeout(() => {
      setBusinesses(mockBusinesses);
      setLoadingData(false);
    }, 500);
  }, []);

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center">
        <Card className="w-64 bg-[#0d0d0d] border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
              <p className="text-gray-400">Загрузка...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-400 bg-clip-text text-transparent mb-2">
            Портал инвестора
          </h1>
          <p className="text-gray-400 text-lg">
            Инвестируйте в перспективные рестораны и получайте доход
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Ваш портфель</p>
                  <p className="text-3xl font-bold text-white">$0</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Средний ROI</p>
                  <p className="text-3xl font-bold text-white">0%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Активных инвестиций</p>
                  <p className="text-3xl font-bold text-white">0</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Businesses */}
        <Card className="bg-[#0d0d0d] border-gray-800/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Доступные для инвестиций</CardTitle>
            <CardDescription className="text-gray-400">
              Выберите бизнес для покупки токенов и получения части прибыли
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card 
                  key={business.id}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-1">
                          {business.businessName}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          {business.city}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-sm font-semibold">
                          {business.rating}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 w-fit">
                      {business.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Цена токена</span>
                        <span className="text-white font-semibold">${business.tokenPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Доступно</span>
                        <span className="text-white font-semibold">
                          {business.availableTokens}/{business.totalTokens}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(business.availableTokens / business.totalTokens) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">ROI</span>
                        <div className="flex items-center gap-1 text-green-400 font-bold">
                          <ArrowUpRight className="w-4 h-4" />
                          {business.roi}%
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-400">Выручка</span>
                        <span className="text-white font-semibold">
                          ${business.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Инвестировать
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Как это работает?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Выберите бизнес</h3>
                <p className="text-sm text-gray-400">
                  Изучите метрики, рейтинг и ROI доступных ресторанов
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Купите токены</h3>
                <p className="text-sm text-gray-400">
                  Приобретите токены и станьте совладельцем бизнеса
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Получайте доход</h3>
                <p className="text-sm text-gray-400">
                  Ежемесячно получайте часть прибыли пропорционально вашей доле
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
