// Компонент поиска существующих ингредиентов

import React from 'react';
import { Ingredient } from '../types';
import { getUnitLabel } from '../utils/calculations';

type IngredientSearchProps = {
  searchQuery: string;
  showSearchResults: boolean;
  filteredIngredients: Ingredient[];
  units: Array<{value: string, label: string}>;
  onSearchChange: (value: string) => void;
  onSearchFocus: () => void;
  onSelectIngredient: (ingredient: Ingredient) => void;
};

export const IngredientSearch: React.FC<IngredientSearchProps> = ({
  searchQuery,
  showSearchResults,
  filteredIngredients,
  units,
  onSearchChange,
  onSearchFocus,
  onSelectIngredient,
}) => {
  return (
    <div className="mb-6 relative">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          Быстрое добавление новой партии
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Найдите существующий ингредиент, чтобы добавить к нему новую партию с обновлёнными данными
        </p>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onSearchFocus}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="🔍 Поиск по названию, категории или поставщику..."
        />
        
        {/* Результаты поиска */}
        {showSearchResults && filteredIngredients.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            {filteredIngredients.slice(0, 5).map((ing) => (
              <button
                key={ing.id}
                type="button"
                onClick={() => onSelectIngredient(ing)}
                className="w-full px-4 py-3 text-left hover:bg-gray-700 transition border-b border-gray-700 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{ing.name}</p>
                    <p className="text-xs text-gray-400">
                      {ing.category && `📦 ${ing.category}`}
                      {ing.supplier && ` | 🏪 ${ing.supplier}`}
                      {ing.bruttoWeight && ` | ⚖️ ${ing.bruttoWeight}${getUnitLabel(ing.unit, units)}`}
                    </p>
                  </div>
                  <div className="text-xs text-orange-400">➕ Добавить партию</div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {showSearchResults && searchQuery && filteredIngredients.length === 0 && (
          <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 text-center text-gray-400">
            Ничего не найдено. Создайте новый ингредиент ниже.
          </div>
        )}
      </div>
    </div>
  );
};
