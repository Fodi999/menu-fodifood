"use client";

import React from "react";
import { Package, Fish, Shell, Salad, Wheat, Leaf, Droplet, Circle, Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES } from "../constants";

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  getCategoryCount: (category: string) => number;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  getCategoryCount,
}) => {
  // Функция для получения иконки по категории
  const getCategoryIcon = (categoryValue: string) => {
    const iconClass = "w-4 h-4 mr-1.5";
    switch (categoryValue) {
      case "fish":
        return <Fish className={iconClass} />;
      case "seafood":
        return <Shell className={iconClass} />;
      case "vegetables":
        return <Salad className={iconClass} />;
      case "rice":
        return <Wheat className={iconClass} />;
      case "nori":
        return <Leaf className={iconClass} />;
      case "sauces":
        return <Droplet className={iconClass} />;
      case "spices":
        return <Circle className={iconClass} />;
      case "cheese":
        return <Circle className={iconClass} />;
      case "other":
        return <Box className={iconClass} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  // Функция для получения текста без эмодзи
  const getCategoryLabel = (label: string) => {
    return label.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, "");
  };

  return (
    <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-xl shadow-xl">
      <CardContent className="p-3 sm:p-4">
        {/* Горизонтальный скролл для мобильных */}
        <div className="relative">
          {/* Градиент справа для индикации скролла */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-800/80 to-transparent pointer-events-none z-10 sm:hidden" />
          
          <ScrollArea className="w-full">
            <div className="flex items-center gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-700">
              {/* Кнопка "Все" */}
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCategory("all")}
                className={`${
                  selectedCategory === "all"
                    ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
                } whitespace-nowrap font-medium transition-all shadow-lg flex-shrink-0`}
              >
                <Package className="w-4 h-4 mr-1.5" />
                <span>Все</span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 ml-2"
                >
                  {getCategoryCount("all")}
                </Badge>
              </Button>

              {/* Категории */}
              {CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat.value);
                if (count === 0) return null;

                return (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectCategory(cat.value)}
                    className={`${
                      selectedCategory === cat.value
                        ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
                    } whitespace-nowrap font-medium transition-all shadow-lg flex-shrink-0`}
                  >
                    {getCategoryIcon(cat.value)}
                    <span>{getCategoryLabel(cat.label)}</span>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 ml-2"
                    >
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
