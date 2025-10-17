"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { UserRole } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function BusinessOrdersPage() {
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();
  const router = useRouter();

  React.useEffect(() => {
    if (!user || user.role !== UserRole.BUSINESS_OWNER) {
      router.push("/");
    }
  }, [user, router]);

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
              <ShoppingBag className="w-8 h-8 text-blue-400" />
              Заказы
            </h1>
            <p className="text-gray-400 mt-1">{currentBusiness.name}</p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">Активные заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg mb-2">Нет активных заказов</p>
              <p className="text-sm">Заказы будут отображаться здесь</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
