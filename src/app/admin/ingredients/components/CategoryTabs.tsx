"use client";

import React from "react";
import { CATEGORIES } from "../constants/ingredient.constants";

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
  return (
    <div className="mb-6 bg-gray-800 rounded-lg shadow-xl p-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onSelectCategory("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            selectedCategory === "all"
              ? "bg-orange-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <span>📦 Все</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
            {getCategoryCount("all")}
          </span>
        </button>
        
        {CATEGORIES.map((cat) => {
          const count = getCategoryCount(cat.value);
          if (count === 0) return null;
          
          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === cat.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <span>{cat.label}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
