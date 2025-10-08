// Утилиты для группировки ингредиентов

import { Ingredient, GroupedIngredient } from '../types';

/**
 * Группировка ингредиентов по названию
 */
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
    name: batches[0].name, // Используем оригинальное название первой партии
    unit: batches[0].unit,
    batches: batches.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }));
};

/**
 * Фильтрация ингредиентов по поисковому запросу
 */
export const filterIngredients = (
  ingredients: Ingredient[], 
  searchQuery: string
): Ingredient[] => {
  const query = searchQuery.toLowerCase();
  return ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(query) ||
    (ing.category && ing.category.toLowerCase().includes(query)) ||
    (ing.supplier && ing.supplier.toLowerCase().includes(query))
  );
};
