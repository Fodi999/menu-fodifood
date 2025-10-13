"use client";

import React from "react";
import { Edit2, Trash2, Package2, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ingredient } from "../types";

interface BatchDetailsProps {
  batch: Ingredient;
  unitLabel: string;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: string, name: string) => void;
  onViewMovements: (id: string, name: string, batchNumber: string) => void;
  formatVolumeDisplay: (value: number, unit: string) => string;
  calculatePricePerUnit: (price: number, weight: number, unit: string) => number;
}

export const BatchDetails: React.FC<BatchDetailsProps> = ({
  batch,
  unitLabel,
  onEdit,
  onDelete,
  onViewMovements,
  formatVolumeDisplay,
  calculatePricePerUnit,
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

  const status = getExpiryStatus(batch.expiryDays);
  const expiryDate = batch.expiryDays
    ? new Date(Date.now() + batch.expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString("ru-RU")
    : null;

  return (
    <>
      {/* Desktop: Table Row */}
      <tr className="hidden lg:table-row hover:bg-gray-700/30 transition">
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          {batch.batchNumber ? (
            <Badge className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 font-mono text-xs px-2 py-1">
              {batch.batchNumber}
            </Badge>
          ) : (
            <span className="text-gray-500 text-sm">—</span>
          )}
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          <span className="font-medium text-sm text-gray-200">
            {batch.bruttoWeight ? formatVolumeDisplay(batch.bruttoWeight, batch.unit) : "—"}
            {batch.bruttoWeight && batch.unit !== "ml" && batch.unit !== "l" && ` ${unitLabel}`}
          </span>
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          <span className="font-medium text-sm text-green-400">
            {batch.nettoWeight ? formatVolumeDisplay(batch.nettoWeight, batch.unit) : "—"}
            {batch.nettoWeight && batch.unit !== "ml" && batch.unit !== "l" && ` ${unitLabel}`}
          </span>
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          <span className="text-sm text-gray-400">
            {batch.wastePercentage ? `${batch.wastePercentage.toFixed(1)}%` : "—"}
          </span>
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          {batch.priceNetto ? (
            <div>
              <p className="font-medium text-base sm:text-lg text-green-400">
                {batch.priceNetto.toFixed(2)} ₽
              </p>
              <p className="text-xs text-gray-500 mt-0.5">общая стоимость</p>
              {batch.pricePerUnit && (
                <div className="mt-1 p-1 bg-blue-500/10 rounded flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-blue-300" />
                  <p className="text-xs text-blue-300">
                    {batch.pricePerUnit.toFixed(2)} ₽/
                    {batch.unit === "g" || batch.unit === "kg" ? "кг" : batch.unit === "ml" || batch.unit === "l" ? "л" : "шт"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">—</span>
          )}
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          {batch.expiryDays ? (
            <div>
              <p className="text-sm font-medium text-gray-200">{batch.expiryDays} дн.</p>
              {expiryDate && <p className="text-xs text-gray-500 mt-0.5">до {expiryDate}</p>}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">—</span>
          )}
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          <span className="text-sm text-gray-400">{batch.supplier || "—"}</span>
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          <Button
            size="sm"
            onClick={() => onViewMovements(batch.id, batch.name, batch.batchNumber || "N/A")}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs px-2 py-1"
            title="Посмотреть историю"
          >
            <Package2 className="w-3 h-3 mr-1" />
            <span className="font-medium">{batch.movementsCount || 0}</span>
          </Button>
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          <Badge className={`${status.bg} ${status.color} text-xs font-medium px-2 py-1`}>
            {status.label}
          </Badge>
        </td>
        <td className="px-4 py-2 sm:px-6 sm:py-3">
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              onClick={() => onEdit(batch)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-1.5"
              title="Редактировать"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={() => onDelete(batch.id, `${batch.name} (${batch.batchNumber})`)}
              className="bg-red-500 hover:bg-red-600 text-white p-1.5"
              title="Удалить"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </td>
      </tr>

      {/* Mobile: Card */}
      <Card className="lg:hidden mb-3 bg-gray-750 border-gray-700">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Номер партии и статус */}
            <div className="flex items-start justify-between gap-2">
              {batch.batchNumber ? (
                <Badge className="bg-purple-500/10 text-purple-400 font-mono text-xs">
                  {batch.batchNumber}
                </Badge>
              ) : (
                <span className="text-gray-500 text-sm">Без номера</span>
              )}
              <Badge className={`${status.bg} ${status.color} text-xs font-medium`}>
                {status.label}
              </Badge>
            </div>

            {/* Веса */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Брутто</p>
                <p className="font-medium text-sm text-gray-200">
                  {batch.bruttoWeight ? formatVolumeDisplay(batch.bruttoWeight, batch.unit) : "—"}
                  {batch.bruttoWeight && batch.unit !== "ml" && batch.unit !== "l" && ` ${unitLabel}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Нетто</p>
                <p className="font-medium text-sm text-green-400">
                  {batch.nettoWeight ? formatVolumeDisplay(batch.nettoWeight, batch.unit) : "—"}
                  {batch.nettoWeight && batch.unit !== "ml" && batch.unit !== "l" && ` ${unitLabel}`}
                </p>
              </div>
            </div>

            {/* Отход и цена */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">% отхода</p>
                <p className="text-sm text-gray-400">
                  {batch.wastePercentage ? `${batch.wastePercentage.toFixed(1)}%` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Стоимость</p>
                {batch.priceNetto ? (
                  <div>
                    <p className="font-medium text-base text-green-400">{batch.priceNetto.toFixed(2)} ₽</p>
                    {batch.pricePerUnit && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <DollarSign className="w-3 h-3 text-blue-300" />
                        <p className="text-xs text-blue-300">
                          {batch.pricePerUnit.toFixed(2)} ₽/
                          {batch.unit === "g" || batch.unit === "kg" ? "кг" : batch.unit === "ml" || batch.unit === "l" ? "л" : "шт"}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">—</span>
                )}
              </div>
            </div>

            {/* Срок и поставщик */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Срок годности</p>
                {batch.expiryDays ? (
                  <div>
                    <p className="text-sm font-medium text-gray-200">{batch.expiryDays} дн.</p>
                    {expiryDate && <p className="text-xs text-gray-500">{expiryDate}</p>}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">—</span>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Поставщик</p>
                <p className="text-sm text-gray-400 truncate">{batch.supplier || "—"}</p>
              </div>
            </div>

            {/* Действия */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
              <Button
                size="sm"
                onClick={() => onViewMovements(batch.id, batch.name, batch.batchNumber || "N/A")}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs flex-1"
              >
                <Package2 className="w-3 h-3 mr-1" />
                История ({batch.movementsCount || 0})
              </Button>
              <Button
                size="sm"
                onClick={() => onEdit(batch)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                onClick={() => onDelete(batch.id, `${batch.name} (${batch.batchNumber})`)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-4"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
