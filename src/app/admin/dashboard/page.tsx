"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, TrendingUp, Shield, Database, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Проверка доступа
  React.useEffect(() => {
    if (!user) return;
    if (user.role !== UserRole.ADMIN) {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 Панель системного администратора
          </h1>
          <p className="text-gray-400">
            Управление всей сетью ресторанов, пользователями и аналитикой
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Всего ресторанов
              </CardTitle>
              <Store className="w-4 h-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">42</div>
              <p className="text-xs text-green-400 mt-1">+3 за месяц</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Активные пользователи
              </CardTitle>
              <Users className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">8,245</div>
              <p className="text-xs text-green-400 mt-1">+12% рост</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Общая выручка
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">₽2.4M</div>
              <p className="text-xs text-green-400 mt-1">+18% за месяц</p>
            </CardContent>
          </Card>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                API Health
              </CardTitle>
              <Activity className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Healthy</div>
              <p className="text-xs text-gray-400 mt-1">99.9% uptime</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Database
              </CardTitle>
              <Database className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">Active</div>
              <p className="text-xs text-gray-400 mt-1">2.1GB используется</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Security
              </CardTitle>
              <Shield className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">Secure</div>
              <p className="text-xs text-gray-400 mt-1">Нет угроз</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Административные действия</CardTitle>
            <CardDescription className="text-gray-400">
              Управление системой
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/admin/users")}
              className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 hover:border-blue-500 transition-all text-left"
            >
              <div className="text-blue-400 font-semibold mb-1">Пользователи</div>
              <div className="text-sm text-gray-400">Управление аккаунтами</div>
            </button>

            <button
              onClick={() => router.push("/admin")}
              className="p-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50 hover:border-orange-500 transition-all text-left"
            >
              <div className="text-orange-400 font-semibold mb-1">Рестораны</div>
              <div className="text-sm text-gray-400">Управление сетью</div>
            </button>

            <button
              onClick={() => router.push("/admin/metrics")}
              className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 hover:border-green-500 transition-all text-left"
            >
              <div className="text-green-400 font-semibold mb-1">Аналитика</div>
              <div className="text-sm text-gray-400">Общая статистика</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
