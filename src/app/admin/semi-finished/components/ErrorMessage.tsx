"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <Card className="mb-6 bg-red-500/10 border-red-500/50">
      <CardContent className="p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-red-200 text-sm sm:text-base">{message}</p>
      </CardContent>
    </Card>
  );
};
