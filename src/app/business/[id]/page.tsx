"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { businessesApi } from "@/lib/rust-api";
import { useAuth } from "@/contexts/AuthContext";
import type { Business } from "@/types/business";
import { Loader2, Store, MapPin, Phone, Mail, Clock, Edit, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Страница публичного бизнес-профиля
 * 
 * URL: /business/[id]
 * 
 * Показывает:
 * - Информацию о бизнесе
 * - Меню/продукты
 * - Отзывы
 * - Контакты
 * - Кнопку для владельца "Управлять бизнесом"
 */
export default function BusinessProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation(["business", "common"]);
  const { user } = useAuth();
  
  const businessId = params.id as string;
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await businessesApi.getById(businessId);
      console.log('✅ Loaded business:', data);
      setBusiness(data);
    } catch (err: any) {
      console.error('❌ Failed to load business:', err);
      setError(err.message || 'Не удалось загрузить бизнес');
    } finally {
      setLoading(false);
    }
  };

  // Проверка - является ли пользователь владельцем
  const isOwner = user && business && user.id === business.owner_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto" />
          <p className="text-gray-400">{t("common:status.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6 text-center space-y-4">
            <Store className="w-16 h-16 text-gray-600 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Бизнес не найден
              </h2>
              <p className="text-gray-400">
                {error || "Бизнес с таким ID не существует"}
              </p>
            </div>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/">
                {t("common:buttons.back")} {t("common:navigation.home")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header with Banner */}
      <div className="relative h-64 bg-gradient-to-r from-orange-500/20 to-yellow-500/20">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-8 w-full">
            <div className="flex items-end gap-6">
              {/* Business Logo */}
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-2xl border-4 border-gray-900">
                <Store className="w-16 h-16 text-white" />
              </div>

              {/* Business Info */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {business.name}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-300">
                      <Badge variant="outline" className="border-orange-500 text-orange-400">
                        {business.category}
                      </Badge>
                      {business.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{business.city}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>4.8 (234 отзыва)</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <Button
                        asChild
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                      >
                        <Link href="/business/dashboard">
                          <Edit className="w-4 h-4 mr-2" />
                          Управлять
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="about">О бизнесе</TabsTrigger>
            <TabsTrigger value="menu">Меню</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
            <TabsTrigger value="contact">Контакты</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Описание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {business.description || "Описание бизнеса пока не добавлено"}
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Status */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Статус</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Статус</span>
                      <Badge
                        variant={business.is_active ? "default" : "secondary"}
                        className={business.is_active ? "bg-green-500" : ""}
                      >
                        {business.is_active ? "Активен" : "Неактивен"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Создан</span>
                      <span className="text-gray-300">
                        {new Date(business.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Token Info */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Токен бизнеса</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-orange-400">
                      {business.id.slice(0, 8).toUpperCase()}
                    </div>
                    <p className="text-sm text-gray-400">
                      Уникальный токен для инвестиций
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Инвестировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Меню</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Меню скоро будет добавлено</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Отзывы клиентов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Отзывы скоро появятся</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-400 mt-1" />
                    <div>
                      <div className="font-medium text-white">Адрес</div>
                      <div className="text-gray-400">{business.city}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <div className="font-medium text-white">Телефон</div>
                    <div className="text-gray-400">+7 (999) 123-45-67</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <div className="font-medium text-white">Email</div>
                    <div className="text-gray-400">contact@business.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <div className="font-medium text-white">Часы работы</div>
                    <div className="text-gray-400">Пн-Вс: 10:00 - 22:00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
