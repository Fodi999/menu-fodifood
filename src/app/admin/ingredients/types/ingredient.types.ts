export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  batchNumber?: string | null;
  category?: string | null;
  supplier?: string | null;
  bruttoWeight?: number | null;
  nettoWeight?: number | null;
  wastePercentage?: number | null;
  expiryDays?: number | null;
  priceBrutto?: number | null;
  priceNetto?: number | null;
  createdAt: string;
  updatedAt: string;
  movementsCount?: number;
};

export type GroupedIngredient = {
  name: string;
  unit: string;
  batches: Ingredient[];
};

export type StockMovement = {
  id: string;
  ingredientId: string;
  quantity: number;
  type: string;
  notes?: string;
  createdAt: string;
};

export type IngredientFormData = {
  name: string;
  unit: string;
  category: string;
  supplier: string;
  bruttoWeight: string;
  nettoWeight: string;
  wastePercentage: string;
  expiryDays: string;
  priceBrutto: string;
  priceNetto: string;
};
