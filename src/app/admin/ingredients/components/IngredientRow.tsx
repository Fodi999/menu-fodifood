"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GroupedIngredient } from "../types";

interface IngredientRowProps {
  group: GroupedIngredient;
  isExpanded: boolean;
  categoryLabel: string | null;
  onToggle: () => void;
}

export const IngredientRow: React.FC<IngredientRowProps> = ({
  group,
  isExpanded,
  categoryLabel,
  onToggle,
}) => {
  const totalBatches = group.batches.length;
  
  const getBatchLabel = (count: number) => {
    if (count === 1) return "партия";
    if (count < 5) return "партии";
    return "партий";
  };

  return (
    <>
      {/* Desktop: Table Row */}
      <tr className="hidden lg:table-row hover:bg-gray-700/50 transition cursor-pointer group">
        <td className="px-4 py-3 sm:px-6 sm:py-4">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 sm:gap-3 text-left w-full"
          >
            <ChevronRight
              className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform text-orange-500 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
            <span className="font-bold text-base sm:text-lg text-white truncate">
              {group.name}
            </span>
          </button>
        </td>
        <td className="px-4 py-3 sm:px-6 sm:py-4">
          <span className="text-sm text-gray-300">{categoryLabel || "—"}</span>
        </td>
        <td className="px-4 py-3 sm:px-6 sm:py-4">
          <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 font-semibold text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5">
            {totalBatches} {getBatchLabel(totalBatches)}
          </Badge>
        </td>
        <td className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex justify-center">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs sm:text-sm px-3 sm:px-4"
            >
              {isExpanded ? "Скрыть" : "Показать"} партии
            </Button>
          </div>
        </td>
      </tr>

      {/* Mobile: Card */}
      <Card className="lg:hidden mb-3 bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-all">
        <button
          onClick={onToggle}
          className="w-full p-4 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <ChevronRight
                className={`w-5 h-5 mt-0.5 flex-shrink-0 transform transition-transform text-orange-500 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-white mb-2 break-words">
                  {group.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-400">{categoryLabel || "—"}</span>
                  <span className="text-gray-600">•</span>
                  <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 font-semibold text-xs">
                    {totalBatches} {getBatchLabel(totalBatches)}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs whitespace-nowrap flex-shrink-0"
            >
              {isExpanded ? "Скрыть" : "Показать"}
            </Button>
          </div>
        </button>
      </Card>
    </>
  );
};
