"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { businessesApi } from "@/lib/rust-api";
import { BusinessCategory } from "@/types/business";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Store, MapPin, FileText, Upload, CreditCard, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { setCurrentBusiness, refreshBusiness } = useBusiness();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    category: "",
    description: "",
    logo: null as File | null,
    cover: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: "logo" | "cover", file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("🏪 Creating business:", formData);
      
      // 1. Создать бизнес через API
      const newBusiness = await businessesApi.create({
        name: formData.name,
        city: formData.city,
        category: formData.category as BusinessCategory,
        description: formData.description,
        // TODO: Заполнить обязательные поля
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        address: formData.city, // Временно
        phone: user?.phone || "",
        email: user?.email || "",
        // TODO: Upload logo and cover images
        logo_url: formData.logo ? URL.createObjectURL(formData.logo) : undefined,
      });
      
      console.log("✅ Business created:", newBusiness);
      
      // 2. Обновить текущий бизнес в контексте
      setCurrentBusiness(newBusiness);
      
      // 3. Обновить профиль пользователя (получить business_id)
      await refreshUser();
      
      // 4. Показать уведомление
      toast.success(`Ресторан "${newBusiness.name}" успешно создан!`);
      
      // 5. Редирект в бизнес-дашборд
      router.push("/business/dashboard");
    } catch (error) {
      console.error("❌ Failed to create business:", error);
      toast.error("Ошибка создания ресторана. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const steps = [
    { number: 1, title: "Основная информация", icon: Store },
    { number: 2, title: "Описание и категория", icon: FileText },
    { number: 3, title: "Медиа файлы", icon: Upload },
    { number: 4, title: "Оплата", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              
              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${isActive ? 'border-orange-500 bg-orange-500/20 text-orange-400' : ''}
                    ${isCompleted ? 'border-green-500 bg-green-500/20 text-green-400' : ''}
                    ${!isActive && !isCompleted ? 'border-gray-700 bg-gray-800/50 text-gray-500' : ''}
                  `}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-800'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {steps.map(s => (
              <div key={s.number} className="flex-1 text-center">
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              {steps[step - 1].title}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {step === 1 && "Расскажите о вашем бизнесе"}
              {step === 2 && "Добавьте детали для привлечения клиентов"}
              {step === 3 && "Загрузите логотип и обложку"}
              {step === 4 && "Завершите регистрацию оплатой"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Название бизнеса
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="FODI SUSHI"
                    className="bg-[#0f0f0f] border-gray-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Город
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Москва"
                    className="bg-[#0f0f0f] border-gray-800 text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Description & Category */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Категория
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder="Суши, Пицца, Кофе..."
                    className="bg-[#0f0f0f] border-gray-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Описание
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Расскажите о вашем бизнесе, меню, особенностях..."
                    className="bg-[#0f0f0f] border-gray-800 text-white min-h-32"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Media Files */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-gray-300">
                    Логотип
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("logo", e.target.files?.[0] || null)}
                      className="bg-[#0f0f0f] border-gray-800 text-white"
                    />
                    {formData.logo && (
                      <span className="text-green-400 text-sm">✓ Выбрано</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover" className="text-gray-300">
                    Обложка
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="cover"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("cover", e.target.files?.[0] || null)}
                      className="bg-[#0f0f0f] border-gray-800 text-white"
                    />
                    {formData.cover && (
                      <span className="text-green-400 text-sm">✓ Выбрано</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 mb-4">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Регистрационный взнос
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Единоразовый платёж для активации вашего бизнеса
                    </p>
                  </div>

                  <div className="bg-[#0f0f0f] rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Стоимость регистрации</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        $19
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-300 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      Административная панель
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      Управление меню и заказами
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      Аналитика и метрики
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      Токенизация для инвесторов
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Нажимая "Оплатить", вы будете перенаправлены на безопасную страницу оплаты Stripe
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="border-gray-800 hover:bg-gray-800/50"
                >
                  Назад
                </Button>
              )}
              
              <div className="ml-auto flex gap-3">
                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500"
                  >
                    Далее
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Оплатить $19
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
