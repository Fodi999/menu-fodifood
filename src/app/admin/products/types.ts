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

export const INGREDIENT_CATEGORIES = [
  { value: "all", label: "📦 Все категории" },
  { value: "fish", label: "🐟 Рыба" },
  { value: "seafood", label: "🦐 Морепродукты" },
  { value: "vegetables", label: "🥬 Овощи" },
  { value: "rice", label: "🍚 Рис" },
  { value: "nori", label: "🌿 Нори и водоросли" },
  { value: "sauces", label: "🥫 Соусы" },
  { value: "spices", label: "🧂 Специи" },
  { value: "cheese", label: "🧀 Сыр" },
  { value: "other", label: "📦 Прочее" },
];
