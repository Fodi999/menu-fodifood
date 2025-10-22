"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Home, 
  Settings, 
  User, 
  Mail, 
  Shield,
  Package,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleSwitcher } from "@/app/components/RoleSwitcher";
import { useRole } from "@/hooks/useRole";
import { getApiUrl } from "@/lib/utils";
import { ChatWidget } from "@/components/ChatWidget";
import { UserWalletCard } from "@/components/UserWalletCard";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  orders?: Order[];
}

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const { currentRole } = useRole();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔍 Fetching profile with token:", token ? "exists" : "missing");
        
        const response = await fetch(
          `${getApiUrl()}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📡 Profile response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Profile data:", data);
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 flex items-center justify-center">
        <Card className="w-64 bg-gray-900/50 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
              <p className="text-gray-400">Загрузка профиля...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Получаем инициалы для аватара
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  const roleColors = {
    admin: "bg-red-500/10 text-red-500 border-red-500/20",
    user: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    business_owner: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    investor: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  const roleLabels = {
    user: "Пользователь",
    business_owner: "Владелец бизнеса",
    investor: "Инвестор",
    admin: "Администратор",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20 backdrop-blur-xl">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col items-start gap-4 sm:gap-6">
                {/* Mobile: Avatar + Info */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full">
                  <Avatar className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 border-2 sm:border-4 border-orange-500/30 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-lg sm:text-xl md:text-2xl font-bold">
                      {getInitials(profile.name, profile.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 truncate">
                      Добро пожаловать, {profile.name || profile.email.split('@')[0]}!
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2 truncate">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </p>
                  </div>
                </div>
                
                {/* Mobile: Buttons */}
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto sm:ml-auto">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className="border-orange-500/30 hover:bg-orange-500/10 flex-1 sm:flex-none"
                  >
                    <Link href="/">
                      <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Главная</span>
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    variant="destructive"
                    size="sm"
                    className="bg-red-600/90 hover:bg-red-600 flex-1 sm:flex-none"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Выйти</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Wallet Card - FIRST */}
          <div className="xl:col-span-1">
            <UserWalletCard userId={user.id} />
          </div>

          {/* Profile Info Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Информация о профиле
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Ваши личные данные</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-3 rounded-lg bg-gray-800/50 gap-1 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-400">Email</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white truncate ml-6 sm:ml-0">
                    {profile.email}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-3 rounded-lg bg-gray-800/50 gap-1 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-400">Имя</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white ml-6 sm:ml-0">
                    {profile.name || "Не указано"}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-3 rounded-lg bg-gray-800/50 gap-1 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-400">Активная роль</span>
                  </div>
                  <Badge className={`text-xs ${roleColors[currentRole as keyof typeof roleColors] || roleColors.user} ml-6 sm:ml-0`}>
                    {roleLabels[currentRole as keyof typeof roleLabels] || currentRole}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Статистика
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Ваша активность</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 sm:py-6">
                <div className="text-4xl sm:text-5xl font-bold text-orange-500 mb-1 sm:mb-2">
                  {profile.orders?.length || 0}
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Всего заказов</p>
              </div>
              <Separator className="my-3 sm:my-4 bg-gray-800" />
              <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Активных заказов</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span>Завершённых</span>
                  <span className="text-white font-medium">{profile.orders?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur-xl xl:col-span-1">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                Быстрые действия
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Управление аккаунтом</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Button 
                asChild 
                size="sm"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs sm:text-sm h-9 sm:h-10"
              >
                <Link href="/#menu">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Сделать заказ
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto" />
                </Link>
              </Button>
              
              {currentRole === "business_owner" && (
                <Button 
                  asChild 
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-500/30 hover:bg-orange-500/10 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Link href="/business/dashboard">
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Панель ресторана
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto" />
                  </Link>
                </Button>
              )}
              
              {profile.role === "admin" && (
                <Button 
                  asChild 
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-500/30 hover:bg-orange-500/10 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Link href="/admin">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Админ-панель
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Widget - NEW SECTION */}
        <div className="mb-6 sm:mb-8">
          <ChatWidget 
            userId={profile.id}
            userName={profile.name}
            size="compact"
          />
        </div>

        {/* Role Switcher Section */}
        <div className="mb-6 sm:mb-8">
          <RoleSwitcher />
        </div>

        {/* Orders History Card */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  История заказов
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Ваши последние заказы</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!profile.orders || profile.orders.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-800/50 mb-3 sm:mb-4">
                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                  У вас пока нет заказов
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 px-4">
                  Перейдите в меню и выберите понравившиеся блюда
                </p>
                <Button 
                  asChild 
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs sm:text-sm"
                >
                  <Link href="/#menu">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Перейти к меню
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {profile.orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-500/10 flex-shrink-0">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-xs sm:text-sm truncate">
                          Заказ #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base sm:text-lg font-bold text-orange-500 whitespace-nowrap">
                        {order.total} ₽
                      </p>
                      <Badge variant="outline" className="border-gray-700 text-gray-300 text-xs mt-1">
                        {order.status}
                      </Badge>
                    </div>
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
