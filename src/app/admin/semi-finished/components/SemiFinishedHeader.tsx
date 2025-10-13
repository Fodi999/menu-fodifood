"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SemiFinishedHeaderProps {
  itemsCount: number;
  showForm: boolean;
  onToggleForm: () => void;
}

export const SemiFinishedHeader: React.FC<SemiFinishedHeaderProps> = ({
  itemsCount,
  showForm,
  onToggleForm,
}) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 border-gray-700 shadow-2xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Верхняя строка: Назад + Заголовок */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col gap-3">
              {/* Кнопка "Назад" */}
              <Link href="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700 transition-all w-fit"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="text-sm">Назад в админ панель</span>
                </Button>
              </Link>

              {/* Заголовок + счётчик */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Управление полуфабрикатами
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                    Создание и управление полуфабрикатами из ингредиентов
                  </p>
                </div>
              </div>
            </div>

            {/* Кнопка добавления */}
            <Button
              onClick={onToggleForm}
              size="default"
              className={`${
                showForm
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-purple-500 hover:bg-purple-600"
              } text-white font-semibold shadow-lg transition-all whitespace-nowrap`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">
                {showForm ? "Скрыть форму" : "Добавить полуфабрикат"}
              </span>
            </Button>
          </div>

          {/* Нижняя строка: Статистика */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-300">
                Всего полуфабрикатов:
              </span>
              <span className="text-sm sm:text-base font-bold text-purple-500">
                {itemsCount}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-lg">
              <Package className="w-3 h-3 text-green-500" />
              <span className="text-xs sm:text-sm text-gray-300">
                Производство активно
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
