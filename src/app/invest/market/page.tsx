"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Building2, DollarSign, Star, MapPin } from "lucide-react";

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

export default function InvestMarketPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessToken[]>([]);

  React.useEffect(() => {
    if (!user || user.role !== UserRole.INVESTOR) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    // Mock data - TODO: заменить на реальный API
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
        businessName: "Burger House",
        city: "Санкт-Петербург",
        category: "Бургеры",
        tokenPrice: 75,
        totalTokens: 800,
        availableTokens: 320,
        revenue: 98000,
        roi: 12.3,
        rating: 4.5,
      },
      {
        id: "3",
        businessName: "Pizza Italia",
        city: "Казань",
        category: "Пицца",
        tokenPrice: 120,
        totalTokens: 1200,
        availableTokens: 580,
        revenue: 145000,
        roi: 18.2,
        rating: 4.9,
      },
    ];
    setBusinesses(mockBusinesses);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/invest/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              Инвестиционный рынок
            </h1>
            <p className="text-gray-400 mt-1">Доступные возможности</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50 hover:border-gray-700/50 transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <CardTitle className="text-white text-xl mb-1">
                      {business.businessName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {business.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {business.category}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span className="text-sm font-medium">{business.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-green-500/50 text-green-400"
                  >
                    ROI {business.roi}%
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-500/50 text-blue-400"
                  >
                    {business.availableTokens} токенов
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Цена токена</span>
                    <span className="text-white font-semibold">₽{business.tokenPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Выручка</span>
                    <span className="text-white font-semibold">
                      ₽{business.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Доступно</span>
                    <span className="text-white font-semibold">
                      {business.availableTokens} / {business.totalTokens}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{
                      width: `${((business.totalTokens - business.availableTokens) / business.totalTokens) * 100}%`,
                    }}
                  />
                </div>

                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Инвестировать
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
