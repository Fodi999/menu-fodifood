'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { BusinessCategory } from '@/types/business';

interface FiltersProps {
  category?: BusinessCategory;
  city?: string;
  search?: string;
  onCategoryChange: (category?: BusinessCategory) => void;
  onCityChange: (city: string) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

// Список популярных городов (можно расширить)
const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Нижний Новгород',
  'Екатеринбург',
  'Новосибирск',
  'Краснодар',
];

// Перевод категорий
const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.RESTAURANT]: '🍽️ Ресторан',
  [BusinessCategory.CAFE]: '☕ Кафе',
  [BusinessCategory.BAKERY]: '🥖 Пекарня',
  [BusinessCategory.SUSHI]: '🍣 Суши',
  [BusinessCategory.PIZZA]: '🍕 Пицца',
  [BusinessCategory.FASTFOOD]: '🍔 Фастфуд',
  [BusinessCategory.HEALTHY]: '🥗 Здоровое питание',
  [BusinessCategory.DESSERTS]: '🍰 Десерты',
  [BusinessCategory.OTHER]: '🍴 Другое',
};

export function Filters({
  category,
  city,
  search,
  onCategoryChange,
  onCityChange,
  onSearchChange,
  onReset,
}: FiltersProps) {
  const hasActiveFilters = category || city || search;

  return (
    <div className="space-y-6 mb-10">
      {/* Search Bar with premium styling */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <Input
          placeholder="Поиск бизнесов..."
          value={search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-12 h-12 bg-[#0f0f0f] border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all shadow-inner"
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-800 rounded-lg"
            onClick={() => onSearchChange('')}
          >
            <X className="w-4 h-4 text-gray-500" />
          </Button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Category Filter */}
        <Select
          value={category || 'all'}
          onValueChange={(value) => onCategoryChange(value === 'all' ? undefined : value as BusinessCategory)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City Filter */}
        <Select
          value={city || 'all'}
          onValueChange={(value) => onCityChange(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Город" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все города</SelectItem>
            {CITIES.map((cityName) => (
              <SelectItem key={cityName} value={cityName}>
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={onReset}
            className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all rounded-lg"
          >
            <X className="w-4 h-4 mr-2" />
            Сбросить фильтры
          </Button>
        )}
      </div>
    </div>
  );
}
