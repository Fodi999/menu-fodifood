"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Briefcase, DollarSign, BarChart3 } from "lucide-react";
import DashboardCard from "@/components/ui/DashboardCard";
import Link from "next/link";

export default function InvestDashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            💰 Инвестиционный портал
          </h1>
          <p className="text-gray-400">Управление вашими инвестициями</p>
        </div>

        {/* Статистика портфеля */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Стоимость портфеля"
            value="₽0"
            trend="+0% за месяц"
            icon={Briefcase}
            trendUp={true}
          />
          <DashboardCard
            title="Доход за месяц"
            value="₽0"
            trend="+0%"
            icon={TrendingUp}
            trendUp={true}
          />
          <DashboardCard
            title="Активных инвестиций"
            value="0"
            icon={BarChart3}
          />
          <DashboardCard
            title="ROI"
            value="0%"
            trend="за все время"
            icon={DollarSign}
          />
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-400" />
                Портфель
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Ваши текущие инвестиции и доходность
              </p>
              <Button
                asChild
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Link href="/invest/portfolio">
                  Открыть портфель
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Рынок
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Доступные возможности для инвестирования
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-blue-500/50 hover:border-blue-500 text-blue-400"
              >
                <Link href="/invest/market">
                  Открыть рынок
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Аналитика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Детальная статистика и отчеты
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-500/50 hover:border-purple-500 text-purple-400"
                disabled
              >
                Скоро
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
