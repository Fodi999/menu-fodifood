"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { useBusiness } from "@/contexts/BusinessContext";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, UtensilsCrossed } from "lucide-react";

export default function BusinessMenuPage() {
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
                <UtensilsCrossed className="w-8 h-8 text-orange-400" />
                Меню ресторана
              </h1>
              <p className="text-gray-400 mt-1">{currentBusiness.name}</p>
            </div>
          </div>
          
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Добавить блюдо
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Ваши блюда</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-400">
              <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg mb-2">Меню пока пусто</p>
              <p className="text-sm">Добавьте первое блюдо, чтобы начать</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
