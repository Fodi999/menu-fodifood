// Типы для продуктов
export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  weight: string | null;
  category: string;
  isVisible: boolean;
  createdAt: string;
};

export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  priceNetto: number | null;
  nettoWeight: number | null;
  category: string | null;
};

export type SemiFinished = {
  id: string;
  name: string;
  description: string | null;
  outputQuantity: number;
  outputUnit: string;
  costPerUnit: number;
  totalCost: number;
  category: string;
  isVisible: boolean;
  isArchived: boolean;
  createdAt: string;
};

export type ProductIngredient = {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
};

export type ProductSemiFinished = {
  semiFinishedId: string;
  semiFinishedName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  weight: string;
  category: string;
  isVisible: boolean;
};

export const CATEGORIES = ["Роллы", "Суши", "Сеты", "Напитки", "Десерты", "Закуски"];
