"use client";

import React from "react";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ingredient, GroupedIngredient } from "../types";
import { BatchSummaryPanel } from "./BatchSummaryPanel";
import { IngredientRow } from "./IngredientRow";
import { BatchDetails } from "./BatchDetails";
import { getUnitLabel, formatVolumeDisplay, calculatePricePerUnit } from "../utils/calculations";

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
  if (groupedIngredients.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-400 text-lg">
          Нет ингредиентов в выбранной категории
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {groupedIngredients.map((group) => {
        const isExpanded = expandedGroups.has(group.name);
        const firstBatch = group.batches[0];
        const categoryLabel = firstBatch.category
          ? categories.find((c) => c.value === firstBatch.category)?.label || firstBatch.category
          : null;
        const unitLabel = getUnitLabel(firstBatch.unit, units);

        return (
          <div key={group.name} className="space-y-0">
            {/* Desktop: Table */}
            <Card className="hidden lg:block bg-gray-800/50 border-gray-700 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-700">
                    <TableRow>
                      <TableHead className="text-gray-200 font-semibold">Название</TableHead>
                      <TableHead className="text-gray-200 font-semibold">Категория</TableHead>
                      <TableHead className="text-gray-200 font-semibold">Партии</TableHead>
                      <TableHead className="text-center text-gray-200 font-semibold">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-700">
                    <IngredientRow
                      group={group}
                      isExpanded={isExpanded}
                      categoryLabel={categoryLabel}
                      onToggle={() => onToggleGroup(group.name)}
                    />

                    {/* Развернутые партии */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <div className="bg-gray-750 border-t border-gray-700">
                            {/* Панель с суммами */}
                            <BatchSummaryPanel batches={group.batches} unit={firstBatch.unit} />

                            {/* Таблица партий */}
                            <Table>
                              <TableHeader className="bg-gray-700/50">
                                <TableRow>
                                  <TableHead className="text-xs text-gray-400">№ Партии</TableHead>
                                  <TableHead className="text-xs text-gray-400">Брутто</TableHead>
                                  <TableHead className="text-xs text-gray-400">Нетто</TableHead>
                                  <TableHead className="text-xs text-gray-400">% отхода</TableHead>
                                  <TableHead className="text-xs text-gray-400">Стоимость</TableHead>
                                  <TableHead className="text-xs text-gray-400">Срок</TableHead>
                                  <TableHead className="text-xs text-gray-400">Поставщик</TableHead>
                                  <TableHead className="text-xs text-gray-400">История</TableHead>
                                  <TableHead className="text-xs text-gray-400">Статус</TableHead>
                                  <TableHead className="text-center text-xs text-gray-400">Действия</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className="divide-y divide-gray-700/50">
                                {group.batches.map((batch) => (
                                  <BatchDetails
                                    key={batch.id}
                                    batch={batch}
                                    unitLabel={unitLabel}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onViewMovements={onViewMovements}
                                    formatVolumeDisplay={formatVolumeDisplay}
                                    calculatePricePerUnit={calculatePricePerUnit}
                                  />
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Mobile: Cards */}
            <div className="lg:hidden space-y-3">
              <IngredientRow
                group={group}
                isExpanded={isExpanded}
                categoryLabel={categoryLabel}
                onToggle={() => onToggleGroup(group.name)}
              />

              {/* Развернутые партии */}
              {isExpanded && (
                <div className="ml-3 space-y-3 border-l-2 border-orange-500/30 pl-3">
                  {/* Панель с суммами */}
                  <BatchSummaryPanel batches={group.batches} unit={firstBatch.unit} />

                  {/* Карточки партий */}
                  {group.batches.map((batch) => (
                    <BatchDetails
                      key={batch.id}
                      batch={batch}
                      unitLabel={unitLabel}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewMovements={onViewMovements}
                      formatVolumeDisplay={formatVolumeDisplay}
                      calculatePricePerUnit={calculatePricePerUnit}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
