"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IngredientsSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}

export const IngredientsSearchBar: React.FC<IngredientsSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}) => {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <Card className="mb-6 bg-gray-800/50 border-gray-700 backdrop-blur-xl shadow-xl">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Поле поиска */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск по названию ингредиента..."
              className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base h-10 sm:h-11"
            />
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-600"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </Button>
            )}
          </div>

          {/* Статистика */}
          <div className="flex items-center gap-2 self-center sm:self-auto">
            {searchQuery ? (
              <>
                <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs sm:text-sm px-2 sm:px-3 py-1">
                  Найдено: {filteredCount}
                </Badge>
                <span className="text-gray-600 text-sm hidden sm:inline">/</span>
                <Badge className="bg-gray-600/50 text-gray-300 text-xs sm:text-sm px-2 sm:px-3 py-1 hidden sm:inline-flex">
                  Всего: {totalCount}
                </Badge>
              </>
            ) : (
              <Badge className="bg-gray-600/50 text-gray-300 text-xs sm:text-sm px-2 sm:px-3 py-1">
                Всего: {totalCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Подсказка при активном поиске */}
        {searchQuery && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs sm:text-sm text-gray-400">
              Поиск осуществляется по названию ингредиента
              {filteredCount === 0 && (
                <span className="text-yellow-500 ml-2">
                  • Ничего не найдено
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
