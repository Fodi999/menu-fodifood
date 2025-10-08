import React from 'react';
import { Edit2, Trash2, Package2 } from 'lucide-react';
import { Ingredient, GroupedIngredient } from '../types';
import { BatchSummaryPanel } from './BatchSummaryPanel';
import { getUnitLabel, formatVolumeDisplay, calculatePricePerUnit } from '../utils/calculations';

interface IngredientsTableProps {
  groupedIngredients: GroupedIngredient[];
  expandedGroups: Set<string>;
  categories: Array<{ value: string; label: string }>;
  units: Array<{ value: string; label: string }>;
  onToggleGroup: (name: string) => void;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string, name: string) => void;
  onViewMovements: (id: string, name: string, batchNumber: string) => void;
}

export const IngredientsTable: React.FC<IngredientsTableProps> = ({
  groupedIngredients,
  expandedGroups,
  categories,
  units,
  onToggleGroup,
  onEdit,
  onDelete,
  onViewMovements,
}) => {
  const getExpiryStatus = (expiryDays: number | null | undefined) => {
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

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Название</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Категория</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Партии</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {groupedIngredients.map((group) => {
              const isExpanded = expandedGroups.has(group.name);
              const totalBatches = group.batches.length;
              const firstBatch = group.batches[0];
              const categoryLabel = firstBatch.category 
                ? categories.find(c => c.value === firstBatch.category)?.label || firstBatch.category
                : null;
              
              return (
                <React.Fragment key={group.name}>
                  {/* Основная строка с названием ингредиента */}
                  <tr className="hover:bg-gray-700/50 transition cursor-pointer">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleGroup(group.name)}
                        className="flex items-center gap-3 text-left w-full"
                      >
                        <span className={`transform transition-transform text-orange-500 ${isExpanded ? 'rotate-90' : ''}`}>
                          ▶
                        </span>
                        <span className="font-bold text-lg text-white">{group.name}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{categoryLabel || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg font-semibold text-sm">
                        {totalBatches} {totalBatches === 1 ? 'партия' : totalBatches < 5 ? 'партии' : 'партий'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleGroup(group.name);
                          }}
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-sm"
                        >
                          {isExpanded ? 'Скрыть' : 'Показать'} партии
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Развернутые партии */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={4} className="px-0 py-0">
                        <div className="bg-gray-750 border-t border-gray-700">
                          {/* Панель с общими суммами */}
                          <BatchSummaryPanel batches={group.batches} unit={group.batches[0].unit} />
                          
                          <table className="w-full">
                            <thead className="bg-gray-700/50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">№ Партии</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Брутто</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Нетто</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">% отхода</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Стоимость партии</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Срок годности</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Поставщик</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">История</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400">Статус</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-400">Действия</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                              {group.batches.map((batch) => {
                                const status = getExpiryStatus(batch.expiryDays);
                                const expiryDate = batch.expiryDays 
                                  ? new Date(Date.now() + batch.expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
                                  : null;
                                
                                return (
                                  <tr key={batch.id} className="hover:bg-gray-700/30 transition">
                                    <td className="px-6 py-3">
                                      {batch.batchNumber ? (
                                        <p className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded inline-block">
                                          {batch.batchNumber}
                                        </p>
                                      ) : (
                                        <p className="text-gray-500 text-sm">—</p>
                                      )}
                                    </td>
                                    <td className="px-6 py-3">
                                      <p className="font-medium text-sm text-gray-200">
                                        {batch.bruttoWeight ? formatVolumeDisplay(batch.bruttoWeight, batch.unit) : "—"}
                                        {batch.bruttoWeight && batch.unit !== 'ml' && batch.unit !== 'l' && ` ${getUnitLabel(batch.unit, units)}`}
                                      </p>
                                    </td>
                                    <td className="px-6 py-3">
                                      <p className="font-medium text-sm text-green-400">
                                        {batch.nettoWeight ? formatVolumeDisplay(batch.nettoWeight, batch.unit) : "—"}
                                        {batch.nettoWeight && batch.unit !== 'ml' && batch.unit !== 'l' && ` ${getUnitLabel(batch.unit, units)}`}
                                      </p>
                                    </td>
                                    <td className="px-6 py-3">
                                      <p className="text-sm text-gray-400">
                                        {batch.wastePercentage ? `${batch.wastePercentage.toFixed(1)}%` : "—"}
                                      </p>
                                    </td>
                                    <td className="px-6 py-3">
                                      {batch.priceNetto ? (
                                        <div>
                                          <p className="font-medium text-lg text-green-400">
                                            {batch.priceNetto.toFixed(2)} ₽
                                          </p>
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            общая стоимость партии
                                          </p>
                                          {/* Показываем цену за единицу из сохранённого pricePerUnit */}
                                          {batch.pricePerUnit && (
                                            <div className="mt-1 p-1 bg-blue-500/10 rounded">
                                              <p className="text-xs text-blue-300">
                                                💰 {batch.pricePerUnit.toFixed(2)} ₽/{batch.unit === 'g' || batch.unit === 'kg' ? 'кг' : batch.unit === 'ml' || batch.unit === 'l' ? 'л' : 'шт'}
                                              </p>
                                              {batch.unit === 'g' && batch.nettoWeight && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                  ({(batch.nettoWeight / 1000).toFixed(3)} кг × {batch.pricePerUnit.toFixed(2)} ₽/кг)
                                                </p>
                                              )}
                                            </div>
                                          )}
                                          {/* Если pricePerUnit не сохранён (старые записи), рассчитываем обратно */}
                                          {!batch.pricePerUnit && batch.nettoWeight && batch.priceNetto && (
                                            <div className="mt-1 p-1 bg-blue-500/10 rounded">
                                              <p className="text-xs text-blue-300">
                                                ~{calculatePricePerUnit(batch.priceNetto, batch.nettoWeight, batch.unit).toFixed(2)} ₽/{batch.unit === 'g' || batch.unit === 'kg' ? 'кг' : batch.unit === 'ml' || batch.unit === 'l' ? 'л' : 'шт'} (расчётная)
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-gray-500 text-sm">—</p>
                                      )}
                                    </td>
                                    <td className="px-6 py-3">
                                      {batch.expiryDays ? (
                                        <div>
                                          <p className="text-sm font-medium text-gray-200">{batch.expiryDays} дн.</p>
                                          {expiryDate && (
                                            <p className="text-xs text-gray-500 mt-0.5">до {expiryDate}</p>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-gray-500 text-sm">—</p>
                                      )}
                                    </td>
                                    <td className="px-6 py-3">
                                      <p className="text-sm text-gray-400">{batch.supplier || "—"}</p>
                                    </td>
                                    <td className="px-6 py-3">
                                      <button
                                        onClick={() => onViewMovements(batch.id, batch.name, batch.batchNumber || "N/A")}
                                        className="flex items-center gap-2 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded transition text-sm"
                                        title="Посмотреть историю поступлений"
                                      >
                                        <Package2 className="w-3 h-3" />
                                        <span className="font-medium">{batch.movementsCount || 0}</span>
                                      </button>
                                    </td>
                                    <td className="px-6 py-3">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                        {status.label}
                                      </span>
                                    </td>
                                    <td className="px-6 py-3">
                                      <div className="flex justify-center gap-2">
                                        <button
                                          onClick={() => onEdit(batch)}
                                          className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                          title="Редактировать"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => onDelete(batch.id, `${batch.name} (${batch.batchNumber})`)}
                                          className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                          title="Удалить"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
