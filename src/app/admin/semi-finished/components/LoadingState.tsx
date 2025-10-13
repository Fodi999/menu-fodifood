"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Загрузка полуфабрикатов...</p>
        </CardContent>
      </Card>
    </div>
  );
};
