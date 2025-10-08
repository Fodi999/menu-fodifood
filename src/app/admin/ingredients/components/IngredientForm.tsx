"use client";

import React from "react";
import { Ingredient, IngredientFormData } from "../types";
import { UNITS, CATEGORIES } from "../constants";
import { 
  normalizeNumberInput, 
  formatNumber, 
  calculateWaste, 
  getExpiryDate, 
  getYieldPercent,
  getUnitLabel,
  calculateTotalCost
} from "../utils/calculations";

interface IngredientFormProps {
  formData: IngredientFormData;
  setFormData: React.Dispatch<React.SetStateAction<IngredientFormData>>;
  editingIngredient: Ingredient | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  filteredIngredients: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({
  formData,
  setFormData,
  editingIngredient,
  onSubmit,
  onCancel,
  searchQuery,
  setSearchQuery,
  showSearchResults,
  setShowSearchResults,
  filteredIngredients,
  onSelectIngredient,
}) => {
  const isNoWaste = formData.wastePercentage === '0' && formData.bruttoWeight === formData.nettoWeight && formData.bruttoWeight !== '';

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingIngredient ? "Редактировать ингредиент" : "Добавить новый ингредиент"}
      </h2>
      
      {/* Поиск существующего ингредиента */}
      {!editingIngredient && (
        <div className="mb-6 relative">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Быстрое добавление новой партии
            </h3>
            <p className="text-xs text-gray-400 mb-3">Найдите существующий ингредиент, чтобы добавить к нему новую партию с обновлёнными данными</p>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => setShowSearchResults(searchQuery.length > 0)}
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
                          {ing.bruttoWeight && ` | ⚖️ ${ing.bruttoWeight}${getUnitLabel(ing.unit, UNITS)}`}
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
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Название и единица измерения */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="Лосось"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Единица измерения *</label>
            <select
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            >
              {UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Категория и поставщик */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">Не выбрана</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Для удобства поиска и фильтрации</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Поставщик</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="ООО Рыбный Двор"
            />
          </div>
        </div>

        {/* Секция учёта отходов или упрощенная форма */}
        {formData.unit === 'pcs' ? (
          // Упрощенная форма для штучных товаров
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2 text-orange-400">📦 Учёт штучного товара</h3>
            <p className="text-xs text-gray-400 mb-4">
              💡 Для штучных товаров укажите количество и цену за 1 штуку
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Количество (шт) *
                </label>
                <input
                  type="text"
                  required
                  inputMode="decimal"
                  value={formData.nettoWeight}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                      setFormData({ ...formData, nettoWeight: value, bruttoWeight: value, wastePercentage: '0' });
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = formatNumber(e.target.value, 0);
                      setFormData({ ...formData, nettoWeight: formatted, bruttoWeight: formatted });
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="40"
                />
                <p className="text-xs text-gray-400 mt-1">Количество штук в партии</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Цена за 1 штуку (₽) *
                </label>
                <input
                  type="text"
                  required
                  inputMode="decimal"
                  value={formData.pricePerUnit || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                      const pricePerUnit = value.replace(',', '.');
                      setFormData({ ...formData, pricePerUnit });
                      
                      const qty = parseFloat(formData.nettoWeight) || 0;
                      const price = parseFloat(pricePerUnit) || 0;
                      if (qty > 0 && price > 0) {
                        const total = (qty * price).toFixed(2);
                        setFormData(prev => ({ 
                          ...prev, 
                          pricePerUnit,
                          priceNetto: total,
                          priceBrutto: total 
                        }));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = formatNumber(e.target.value, 2);
                      setFormData(prev => ({ ...prev, pricePerUnit: formatted }));
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="1.45"
                />
                <p className="text-xs text-gray-400 mt-1">Стоимость одной штуки</p>
                {formData.pricePerUnit && formData.nettoWeight && (
                  <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-xs text-green-400">
                      ✅ Общая стоимость партии: <span className="font-bold">
                        {(parseFloat(formData.pricePerUnit) * parseFloat(formData.nettoWeight)).toFixed(2)} ₽
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : formData.unit === 'ml' || formData.unit === 'l' ? (
          // Упрощенная форма для жидкостей
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2 text-orange-400">💧 Учёт жидкости</h3>
            <p className="text-xs text-gray-400 mb-4">
              💡 Для жидкостей укажите объем и цену за 1 литр (1000 мл)
            </p>
            <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs font-semibold text-yellow-400 mb-1">📖 Как правильно заполнить:</p>
              <ul className="text-xs text-gray-300 space-y-1 ml-4 list-disc">
                <li><strong>Для мл:</strong> укажите объем в миллилитрах (например, 20000 мл = 20 литров)</li>
                <li><strong>Для л:</strong> укажите объем в литрах (например, 20 л)</li>
                <li><strong>Цена</strong> всегда за 1 литр, независимо от единицы измерения</li>
              </ul>
              <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-xs text-blue-300">
                  <strong>Пример:</strong> 20 литров по 2.30₽/л<br />
                  → Введите: <span className="font-bold">20000 мл</span> или <span className="font-bold">20 л</span> + цена <span className="font-bold">2.30₽</span> = <span className="font-bold text-green-400">46.00₽</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Объем ({formData.unit === 'ml' ? 'мл' : 'л'}) *
                </label>
                <input
                  type="text"
                  required
                  inputMode="decimal"
                  value={formData.nettoWeight}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                      const normalizedValue = value.replace(',', '.');
                      setFormData({ ...formData, nettoWeight: normalizedValue, bruttoWeight: normalizedValue, wastePercentage: '0' });
                      
                      const volume = parseFloat(normalizedValue) || 0;
                      const pricePerLiter = parseFloat(formData.pricePerUnit || '0') || 0;
                      if (volume > 0 && pricePerLiter > 0) {
                        const volumeInLiters = formData.unit === 'ml' ? volume / 1000 : volume;
                        const total = (volumeInLiters * pricePerLiter).toFixed(2);
                        setFormData(prev => ({ 
                          ...prev, 
                          nettoWeight: normalizedValue,
                          bruttoWeight: normalizedValue,
                          wastePercentage: '0',
                          priceNetto: total,
                          priceBrutto: total 
                        }));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = formatNumber(e.target.value, 3);
                      setFormData(prev => ({ ...prev, nettoWeight: formatted, bruttoWeight: formatted }));
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder={formData.unit === 'ml' ? "20000 (для 20 литров)" : "20.000"}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.unit === 'ml' ? 'Объем в миллилитрах' : 'Объем в литрах'}
                </p>
                {formData.nettoWeight && formData.unit === 'ml' && (
                  <p className={`text-xs mt-1 font-medium ${
                    parseFloat(formData.nettoWeight) < 1000 
                      ? 'text-yellow-400' 
                      : 'text-cyan-400'
                  }`}>
                    💧 Это равно: {(parseFloat(formData.nettoWeight) / 1000).toFixed(3)} литров
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Цена за 1 литр (₽) *
                </label>
                <input
                  type="text"
                  required
                  inputMode="decimal"
                  value={formData.pricePerUnit || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                      const pricePerUnit = value.replace(',', '.');
                      setFormData({ ...formData, pricePerUnit });
                      
                      const volume = parseFloat(formData.nettoWeight) || 0;
                      const pricePerLiter = parseFloat(pricePerUnit) || 0;
                      if (volume > 0 && pricePerLiter > 0) {
                        const volumeInLiters = formData.unit === 'ml' ? volume / 1000 : volume;
                        const total = (volumeInLiters * pricePerLiter).toFixed(2);
                        setFormData(prev => ({ 
                          ...prev, 
                          pricePerUnit,
                          priceNetto: total,
                          priceBrutto: total 
                        }));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = formatNumber(e.target.value, 2);
                      setFormData(prev => ({ ...prev, pricePerUnit: formatted }));
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="150.00"
                />
                <p className="text-xs text-gray-400 mt-1">Стоимость 1000 мл (1 литра)</p>
                {formData.pricePerUnit && formData.nettoWeight && (
                  <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-xs text-green-400">
                      ✅ Общая стоимость партии: <span className="font-bold">
                        {(() => {
                          const volume = parseFloat(formData.nettoWeight);
                          const pricePerLiter = parseFloat(formData.pricePerUnit);
                          const volumeInLiters = formData.unit === 'ml' ? volume / 1000 : volume;
                          return (volumeInLiters * pricePerLiter).toFixed(2);
                        })()} ₽
                      </span>
                    </p>
                    <p className="text-xs text-cyan-400 mt-1">
                      💡 Цена за {formData.unit === 'ml' ? '1 мл' : '1 л'}: <span className="font-bold">
                        {(() => {
                          const pricePerLiter = parseFloat(formData.pricePerUnit);
                          const pricePerUnit = formData.unit === 'ml' ? pricePerLiter / 1000 : pricePerLiter;
                          return pricePerUnit.toFixed(3);
                        })()} ₽
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Стандартная форма для весовых товаров
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2 text-orange-400">📊 Учёт отходов (Брутто/Нетто)</h3>
            <p className="text-xs text-gray-400 mb-4">
              💡 Введите брутто и либо процент отхода, либо нетто — остальное пересчитается автоматически
            </p>
            
            {/* Чекбокс "Нет отходов" */}
            <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNoWaste}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({ 
                        ...prev, 
                        nettoWeight: prev.bruttoWeight, 
                        wastePercentage: '0' 
                      }));
                    } else {
                      setFormData(prev => ({ 
                        ...prev, 
                        nettoWeight: '', 
                        wastePercentage: '' 
                      }));
                    }
                  }}
                  className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                />
                <div>
                  <span className="text-sm font-semibold text-white">✅ Нет отходов (брутто = нетто)</span>
                  <p className="text-xs text-gray-400 mt-1">
                    Для продуктов без обработки и потерь (например, готовые соусы, консервы, сыпучие продукты)
                  </p>
                </div>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Вес брутто ({getUnitLabel(formData.unit, UNITS)})
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.bruttoWeight}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                    const normalizedValue = value.replace(',', '.');
                    setFormData({ ...formData, bruttoWeight: normalizedValue });
                    
                    if (isNoWaste) {
                      setFormData(prev => ({ ...prev, bruttoWeight: normalizedValue, nettoWeight: normalizedValue }));
                    } else if (formData.wastePercentage && value) {
                      const calculatedNetto = calculateWaste(normalizedValue, formData.nettoWeight, formData.wastePercentage, 'netto');
                      if (calculatedNetto) {
                        setFormData(prev => ({ ...prev, bruttoWeight: normalizedValue, nettoWeight: calculatedNetto }));
                      }
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    const formatted = formatNumber(e.target.value, 3);
                    setFormData(prev => ({ ...prev, bruttoWeight: formatted }));
                  }
                }}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="3,650 или 3.650"
              />
              <p className="text-xs text-gray-400 mt-1">Вес с отходами (можно вводить через запятую или точку)</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Процент отхода (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.wastePercentage}
                onChange={(e) => {
                  const newWaste = e.target.value;
                  setFormData({ ...formData, wastePercentage: newWaste });
                  if (formData.bruttoWeight) {
                    const calculatedNetto = calculateWaste(formData.bruttoWeight, formData.nettoWeight, newWaste, 'netto');
                    if (calculatedNetto) {
                      setFormData(prev => ({ ...prev, wastePercentage: newWaste, nettoWeight: calculatedNetto }));
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    const formatted = parseFloat(e.target.value).toFixed(1);
                    setFormData(prev => ({ ...prev, wastePercentage: formatted }));
                  }
                }}
                disabled={isNoWaste}
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 ${
                  isNoWaste ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="15.0"
              />
              <p className="text-xs text-gray-400 mt-1">% потерь при обработке (0-100%)</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Вес нетто ({getUnitLabel(formData.unit, UNITS)})
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.nettoWeight}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                    const nettoWeight = parseFloat(value.replace(',', '.')) || 0;
                    const pricePerUnit = parseFloat(formData.pricePerUnit || '0') || 0;
                    
                    // Пересчитываем общую стоимость партии при изменении веса
                    if (nettoWeight > 0 && pricePerUnit > 0) {
                      const totalPrice = calculateTotalCost(nettoWeight, pricePerUnit, formData.unit);
                      
                      setFormData(prev => ({ 
                        ...prev, 
                        nettoWeight: value,
                        priceNetto: totalPrice.toFixed(2)
                      }));
                      
                      console.log(`💰 Вес изменён: ${nettoWeight} ${formData.unit} × ${pricePerUnit} ₽ = ${totalPrice.toFixed(2)} ₽`);
                    } else {
                      setFormData({ ...formData, nettoWeight: value });
                    }
                    
                    if (formData.bruttoWeight && value) {
                      const calculatedWaste = calculateWaste(formData.bruttoWeight, value, formData.wastePercentage, 'waste');
                      if (calculatedWaste) {
                        setFormData(prev => ({ ...prev, nettoWeight: value, wastePercentage: calculatedWaste }));
                      }
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    const formatted = formatNumber(e.target.value, 3);
                    setFormData(prev => ({ ...prev, nettoWeight: formatted }));
                  }
                }}
                disabled={isNoWaste}
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 ${
                  isNoWaste ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="0,560 или 24.567"
              />
              <p className="text-xs text-gray-400 mt-1">Чистый вес без отходов (можно вводить через запятую или точку)</p>
            </div>
          </div>

          {formData.bruttoWeight && formData.nettoWeight && (
            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">
                ✅ Выход продукта: <span className="font-bold">
                  {getYieldPercent(formData.bruttoWeight, formData.nettoWeight).toFixed(1)}%
                </span> | 
                🗑️ Потери: <span className="font-bold">
                  {formData.wastePercentage || '0'}%
                </span> | 
                📦 Чистый вес: <span className="font-bold">
                  {parseFloat(formData.nettoWeight).toFixed(2)} {getUnitLabel(formData.unit, UNITS)}
                </span>
              </p>
            </div>
          )}
        </div>
        )}

        {/* Секция срока годности */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold mb-4 text-orange-400">📅 Срок годности</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Срок годности (дней)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.expiryDays}
                onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="7"
              />
              <p className="text-xs text-gray-400 mt-1">Количество дней до истечения срока</p>
            </div>
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg w-full">
                <p className="text-sm text-blue-400">
                  ⏰ Использовать до: <span className="font-bold">
                    {getExpiryDate(formData.expiryDays)}
                  </span>
                </p>
                {formData.expiryDays && parseInt(formData.expiryDays) > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Срок хранения: {formData.expiryDays} {parseInt(formData.expiryDays) === 1 ? 'день' : parseInt(formData.expiryDays) < 5 ? 'дня' : 'дней'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Секция цены - только для весовых товаров */}
        {formData.unit !== 'pcs' && formData.unit !== 'ml' && formData.unit !== 'l' && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold mb-4 text-orange-400">💰 Стоимость</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Цена брутто за {formData.unit === 'g' ? 'кг (1000 г)' : getUnitLabel(formData.unit, UNITS)} (₽)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.priceBrutto}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                    const price = parseFloat(value.replace(',', '.')) || 0;
                    
                    if (isNoWaste) {
                      // Если нет отходов, pricePerUnit = priceBrutto
                      const nettoWeight = parseFloat(formData.nettoWeight) || 0;
                      
                      if (nettoWeight > 0 && price > 0) {
                        const totalPrice = calculateTotalCost(nettoWeight, price, formData.unit);
                        
                        console.log(`💰 [Брутто] Расчет: ${nettoWeight} ${formData.unit} × ${price} ₽ = ${totalPrice.toFixed(2)} ₽`);
                        
                        setFormData(prev => ({ 
                          ...prev, 
                          priceBrutto: value,
                          pricePerUnit: value,
                          priceNetto: totalPrice.toFixed(2)
                        }));
                      } else {
                        setFormData(prev => ({ ...prev, priceBrutto: value, pricePerUnit: value }));
                      }
                    } else if (value && formData.wastePercentage) {
                      // Есть отходы - рассчитываем цену нетто
                      const bruttoPrice = parseFloat(normalizeNumberInput(value));
                      const wastePercent = parseFloat(normalizeNumberInput(formData.wastePercentage));
                      if (bruttoPrice > 0 && wastePercent >= 0 && wastePercent <= 100) {
                        const nettoPrice = bruttoPrice / (1 - wastePercent / 100);
                        setFormData(prev => ({ ...prev, priceBrutto: value, pricePerUnit: nettoPrice.toFixed(2) }));
                        
                        // Пересчитываем общую стоимость партии
                        const nettoWeight = parseFloat(formData.nettoWeight) || 0;
                        if (nettoWeight > 0) {
                          const totalPrice = calculateTotalCost(nettoWeight, nettoPrice, formData.unit);
                          setFormData(prev => ({ 
                            ...prev, 
                            priceBrutto: value, 
                            pricePerUnit: nettoPrice.toFixed(2),
                            priceNetto: totalPrice.toFixed(2)
                          }));
                        }
                      }
                    } else {
                      setFormData(prev => ({ ...prev, priceBrutto: value }));
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    const formatted = formatNumber(e.target.value, 2);
                    setFormData(prev => ({ ...prev, priceBrutto: formatted }));
                  }
                }}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="10.23"
              />
              <p className="text-xs text-gray-400 mt-1">Цена за {formData.unit === 'g' ? 'килограмм' : 'единицу'} с отходами</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Цена за {formData.unit === 'g' ? 'кг (1000 г)' : getUnitLabel(formData.unit, UNITS)} (₽) *
                {isNoWaste && <span className="ml-2 text-xs text-green-400">✅ = Цена брутто</span>}
              </label>
              <input
                type="text"
                required
                inputMode="decimal"
                value={formData.pricePerUnit || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9]+([.,][0-9]*)?$/.test(value)) {
                    const pricePerUnit = value.replace(',', '.');
                    
                    // Автоматически рассчитываем общую стоимость партии
                    const nettoWeight = parseFloat(formData.nettoWeight) || 0;
                    const price = parseFloat(pricePerUnit) || 0;
                    
                    if (nettoWeight > 0 && price > 0) {
                      let totalPrice = 0;
                      if (formData.unit === 'g') {
                        // Для граммов: вес в кг × цена за кг
                        totalPrice = (nettoWeight / 1000) * price;
                        console.log(`💰 [Нетто] Расчет стоимости: ${nettoWeight} г / 1000 × ${price} ₽/кг = ${totalPrice.toFixed(2)} ₽`);
                      } else if (formData.unit === 'kg') {
                        // Для кг: вес × цена
                        totalPrice = nettoWeight * price;
                        console.log(`💰 [Нетто] Расчет стоимости: ${nettoWeight} кг × ${price} ₽/кг = ${totalPrice.toFixed(2)} ₽`);
                      }
                      
                      setFormData(prev => ({ 
                        ...prev, 
                        pricePerUnit,
                        priceNetto: totalPrice.toFixed(2)
                      }));
                      
                      console.log('📊 Обновлен FormData:', {
                        pricePerUnit,
                        priceNetto: totalPrice.toFixed(2),
                        nettoWeight,
                        unit: formData.unit
                      });
                    } else {
                      setFormData({ ...formData, pricePerUnit });
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    const formatted = formatNumber(e.target.value, 2);
                    setFormData(prev => ({ ...prev, pricePerUnit: formatted }));
                  }
                }}
                disabled={isNoWaste}
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500 ${
                  isNoWaste ? 'opacity-60 cursor-not-allowed bg-gray-600' : ''
                }`}
                placeholder="10.23"
              />
              <div className="mt-1 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                {isNoWaste ? (
                  <p className="text-xs text-green-400">
                    ✅ <span className="font-semibold">Нет отходов:</span> Цена автоматически равна цене брутто ({formData.priceBrutto ? `${parseFloat(formData.priceBrutto).toFixed(2)} ₽` : '—'})
                  </p>
                ) : (
                  <p className="text-xs text-blue-400">
                    💡 <span className="font-semibold">Важно:</span> Укажите цену за <span className="font-bold">{formData.unit === 'g' ? '1 кг (1000 г)' : getUnitLabel(formData.unit, UNITS)}</span>
                  </p>
                )}
                {formData.pricePerUnit && formData.nettoWeight && (
                  <p className="text-xs text-green-400 mt-1">
                    ✅ Общая стоимость партии: <span className="font-bold">
                      {(() => {
                        const pricePerUnit = parseFloat(formData.pricePerUnit);
                        const nettoWeight = parseFloat(formData.nettoWeight);
                        if (formData.unit === 'g') {
                          return ((nettoWeight / 1000) * pricePerUnit).toFixed(2);
                        }
                        return (nettoWeight * pricePerUnit).toFixed(2);
                      })()} ₽
                    </span>
                    {formData.unit === 'g' && (
                      <span className="text-gray-400"> ({parseFloat(formData.nettoWeight).toFixed(3)} г × {parseFloat(formData.pricePerUnit).toFixed(2)} ₽/кг)</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {formData.priceBrutto && formData.pricePerUnit && formData.nettoWeight && (
            <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-sm text-purple-400">
                � Цена брутто: <span className="font-bold">{parseFloat(formData.priceBrutto).toFixed(2)} ₽/{formData.unit === 'g' ? 'кг' : getUnitLabel(formData.unit, UNITS)}</span>
                {" | "}
                💎 Цена нетто: <span className="font-bold">{parseFloat(formData.pricePerUnit).toFixed(2)} ₽/{formData.unit === 'g' ? 'кг' : getUnitLabel(formData.unit, UNITS)}</span>
                {" | "}
                � Стоимость партии: <span className="font-bold text-green-400">
                  {(() => {
                    const pricePerUnit = parseFloat(formData.pricePerUnit);
                    const nettoWeight = parseFloat(formData.nettoWeight);
                    if (formData.unit === 'g') {
                      return ((nettoWeight / 1000) * pricePerUnit).toFixed(2);
                    }
                    return (nettoWeight * pricePerUnit).toFixed(2);
                  })()} ₽
                </span>
              </p>
            </div>
          )}
        </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            {editingIngredient ? "Сохранить изменения" : "Добавить ингредиент"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
