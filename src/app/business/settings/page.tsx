"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { useBusiness } from "@/contexts/BusinessContext";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Settings, Save } from "lucide-react";

export default function BusinessSettingsPage() {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const { currentBusiness } = useBusiness();
  const router = useRouter();

  React.useEffect(() => {
    if (!user || (currentRole !== UserRole.BUSINESS_OWNER && currentRole !== UserRole.ADMIN)) {
      router.push("/");
    }
  }, [user, currentRole, router]);

  if (!user || !currentBusiness) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/business/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Settings className="w-8 h-8 text-purple-400" />
              Настройки
            </h1>
            <p className="text-gray-400 mt-1">{currentBusiness.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-white">Основная информация</CardTitle>
              <CardDescription className="text-gray-400">
                Управление профилем ресторана
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Название</label>
                <Input
                  defaultValue={currentBusiness.name}
                  className="bg-white/5 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Город</label>
                <Input
                  defaultValue={currentBusiness.city}
                  className="bg-white/5 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Категория</label>
                <Input
                  defaultValue={currentBusiness.category}
                  className="bg-white/5 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Описание</label>
                <Textarea
                  defaultValue={currentBusiness.description || ""}
                  className="bg-white/5 border-gray-700 text-white"
                  rows={4}
                />
              </div>
              
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Save className="w-4 h-4 mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
