// Утилиты для работы с ингредиентами

import { UNITS, CATEGORIES } from "./constants";
import { Ingredient, GroupedIngredient, ExpiryStatus } from "./types";

// Нормализация числового ввода - замена запятой на точку
export const normalizeNumberInput = (value: string): string => {
  return value.replace(',', '.');
};

// Форматирование числа при потере фокуса с поддержкой разного количества знаков
export const formatNumber = (value: string, decimals: number = 3): string => {
  if (!value) return '';
  
  const normalized = normalizeNumberInput(value);
  const num = parseFloat(normalized);
  
  if (isNaN(num)) return '';
  
  return num.toFixed(decimals);
};

// Автоматический расчёт процента отхода или нетто
export const calculateWaste = (
  brutto: string, 
  netto: string, 
  wastePercent: string, 
  field: 'netto' | 'waste'
): string => {
  const bruttoNum = parseFloat(normalizeNumberInput(brutto));
  const nettoNum = parseFloat(normalizeNumberInput(netto));
  const wasteNum = parseFloat(normalizeNumberInput(wastePercent));

  if (field === 'netto' && bruttoNum > 0 && wasteNum >= 0 && wasteNum <= 100) {
    const calculatedNetto = bruttoNum - (bruttoNum * wasteNum / 100);
    return calculatedNetto.toFixed(3);
  } else if (field === 'waste' && bruttoNum > 0 && nettoNum > 0 && nettoNum <= bruttoNum) {
    const calculatedWaste = ((bruttoNum - nettoNum) / bruttoNum) * 100;
    return calculatedWaste.toFixed(2);
  }
  return '';
};

// Вычисление даты истечения срока годности
export const getExpiryDate = (days: string): string => {
  if (!days || parseInt(days) <= 0) return 'не указано';
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + parseInt(days));
  
  return expiryDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Вычисление процента выхода продукта
export const getYieldPercent = (brutto: string, netto: string): number => {
  const bruttoNum = parseFloat(brutto);
  const nettoNum = parseFloat(netto);
  
  if (bruttoNum > 0 && nettoNum > 0) {
    return (nettoNum / bruttoNum) * 100;
  }
  return 0;
};

// Статус на основе срока годности
export const getExpiryStatus = (expiryDays: number | null | undefined): ExpiryStatus => {
  if (!expiryDays) {
    return { color: "text-gray-400", bg: "bg-gray-500/20", label: "Не указан" };
  }
  if (expiryDays <= 3) {
    return { color: "text-red-500", bg: "bg-red-500/20", label: "Срочно использовать" };
  } else if (expiryDays <= 7) {
    return { color: "text-yellow-500", bg: "bg-yellow-500/20", label: "Скоро истекает" };
  } else {
    return { color: "text-green-500", bg: "bg-green-500/20", label: "Свежий" };
  }
};

// Получить короткий лейбл единицы измерения
export const getUnitLabel = (unit: string): string => {
  const unitObj = UNITS.find((u) => u.value === unit);
  const match = unitObj?.label.match(/\((.*?)\)/);
  return match ? match[1] : unit;
};

// Получить лейбл категории
export const getCategoryLabel = (category: string | null | undefined): string => {
  if (!category) return "Не указана";
  const categoryObj = CATEGORIES.find((c) => c.value === category);
  return categoryObj?.label || category;
};

// Функция группировки ингредиентов по названию
export const groupIngredientsByName = (ingredients: Ingredient[]): GroupedIngredient[] => {
  const groups = new Map<string, Ingredient[]>();
  
  ingredients.forEach(ingredient => {
    const key = ingredient.name.toLowerCase().trim();
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(ingredient);
  });
  
  return Array.from(groups.entries()).map(([, batches]) => ({
    name: batches[0].name,
    unit: batches[0].unit,
    batches: batches.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }));
};
