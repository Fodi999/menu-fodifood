// Константы для страницы управления ингредиентами

import { Unit, Category } from "./types";

export const UNITS: Unit[] = [
  { value: "g", label: "Граммы (г)" },
  { value: "ml", label: "Миллилитры (мл)" },
  { value: "pcs", label: "Штуки (шт)" },
];

export const CATEGORIES: Category[] = [
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
