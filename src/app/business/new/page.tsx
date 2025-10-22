"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { businessesApi } from "@/lib/rust-api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Store, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { BusinessCategory } from "@/types/business";
import type { CreateBusinessDto } from "@/types/business";
import { motion } from "framer-motion";

/**
 * Страница создания нового бизнеса
 * 
 * URL: /business/new
 * 
 * Форма для регистрации нового бизнеса:
 * - Название
 * - Описание
 * - Категория
 * - Город
 */
export default function NewBusinessPage() {
  const router = useRouter();
  const { t } = useTranslation(["business", "common"]);
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<BusinessCategory | "">("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Если пользователь не авторизован, перенаправляем на signup
  if (!user) {
    router.push('/auth/signup?redirect=/business/new');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!name.trim()) {
      setError("Название обязательно");
      return;
    }
    if (!category) {
      setError("Категория обязательна");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const createDto: CreateBusinessDto = {
        name: name.trim(),
        slug: "",  // Backend сгенерирует автоматически
        description: description.trim(),
        category: category as BusinessCategory,
        city: city.trim(),
        address: "",  // Пока не требуем
        phone: "",    // Пока не требуем
        email: "",    // Пока не требуем
      };
      
      console.log('🚀 Creating business:', createDto);
      const newBusiness = await businessesApi.create(createDto);
      console.log('✅ Business created:', newBusiness);

      // Перенаправляем на страницу созданного бизнеса
      router.push(`/business/${newBusiness.id}`);
    } catch (err: any) {
      console.error('❌ Failed to create business:', err);
      setError(err.message || 'Не удалось создать бизнес');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: BusinessCategory.RESTAURANT, label: "Ресторан" },
    { value: BusinessCategory.CAFE, label: "Кафе" },
    { value: BusinessCategory.BAKERY, label: "Пекарня" },
    { value: BusinessCategory.SUSHI, label: "Суши" },
    { value: BusinessCategory.PIZZA, label: "Пицца" },
    { value: BusinessCategory.FASTFOOD, label: "Фастфуд" },
    { value: BusinessCategory.HEALTHY, label: "Здоровое питание" },
    { value: BusinessCategory.DESSERTS, label: "Десерты" },
    { value: BusinessCategory.OTHER, label: "Другое" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common:buttons.back")}
          </Link>
        </Button>

        {/* Header */}
        <motion.div
          className="text-center mb-8 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-2xl">
              <Store className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Создать бизнес-аккаунт
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Зарегистрируйте свой бизнес и начните привлекать клиентов через FODI MARKET
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                Информация о бизнесе
              </CardTitle>
              <CardDescription className="text-gray-400">
                Заполните основную информацию о вашем бизнесе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Название *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Например: Суши Бар Токио"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Категория *
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                    required
                    className="w-full h-10 px-3 rounded-md bg-gray-900/50 border border-gray-600 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">
                    Город
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Например: Москва"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Описание
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Расскажите о вашем бизнесе..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-6 text-lg shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    <>
                      <Store className="w-5 h-5 mr-2" />
                      Создать бизнес
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="mt-8 grid md:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm font-medium text-white">Бесплатно</div>
              <div className="text-xs text-gray-400 mt-1">Без скрытых платежей</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-sm font-medium text-white">Быстрый старт</div>
              <div className="text-xs text-gray-400 mt-1">Запуск за 2 минуты</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-sm font-medium text-white">Больше клиентов</div>
              <div className="text-xs text-gray-400 mt-1">Увеличьте продажи</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
