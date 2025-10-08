// Компонент панели с общими суммами партий

import React from 'react';
import { Ingredient } from '../types';
import { getUnitLabel } from '../utils';
import { formatVolumeDisplay } from '../utils/calculations';

type BatchSummaryPanelProps = {
  batches: Ingredient[];
  unit: string;
};

export const BatchSummaryPanel: React.FC<BatchSummaryPanelProps> = ({ 
  batches, 
  unit
}) => {
  // Вычисляем общие суммы для всех партий
  const totalBrutto = batches.reduce((sum, b) => sum + (b.bruttoWeight || 0), 0);
  const totalNetto = batches.reduce((sum, b) => sum + (b.nettoWeight || 0), 0);
  // priceNetto теперь хранит общую стоимость партии, а не цену за кг
  const totalPrice = batches.reduce((sum, b) => sum + (b.priceNetto || 0), 0);
  const avgWaste = totalBrutto > 0 ? ((totalBrutto - totalNetto) / totalBrutto * 100) : 0;

  // Вычисляем среднюю цену за единицу (только если есть pricePerUnit)
  const batchesWithPrice = batches.filter(b => b.pricePerUnit && b.pricePerUnit > 0);
  const avgPricePerUnit = batchesWithPrice.length > 0
    ? batchesWithPrice.reduce((sum, b) => sum + (b.pricePerUnit || 0), 0) / batchesWithPrice.length
    : 0;

  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-b-2 border-orange-500/30 px-6 py-4">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-medium">📦 Общий вес:</span>
          <span className="text-white font-bold">
            Брутто: {formatVolumeDisplay(totalBrutto, unit)}
            {unit !== 'ml' && unit !== 'l' && ` ${getUnitLabel(unit)}`}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-green-400 font-bold">
            Нетто: {formatVolumeDisplay(totalNetto, unit)}
            {unit !== 'ml' && unit !== 'l' && ` ${getUnitLabel(unit)}`}
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-orange-400 font-medium">
            Отход: {avgWaste.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2 border-l border-gray-600 pl-6">
          <span className="text-gray-400 font-medium">💰 Стоимость всех партий:</span>
          <span className="text-green-400 font-bold text-lg">
            {totalPrice.toFixed(2)} ₽
          </span>
          {avgPricePerUnit > 0 && (
            <>
              <span className="text-gray-500">|</span>
              <span className="text-blue-400 font-medium">
                ~{avgPricePerUnit.toFixed(2)} ₽/{unit === 'g' || unit === 'kg' ? 'кг' : unit === 'ml' || unit === 'l' ? 'л' : 'шт'}
              </span>
              <span className="text-xs text-gray-500">(средняя)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
