"use client";

import React from "react";
import { Edit2, Trash2, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SemiFinished = {
  id: string;
  name: string;
  description: string | null;
  outputQuantity: number;
  outputUnit: string;
  costPerUnit: number;
  category: string;
  createdAt: string;
};

interface SemiFinishedTableProps {
  items: SemiFinished[];
  onEdit: (item: SemiFinished) => void;
  onDelete: (id: string, name: string) => void;
}

export const SemiFinishedTable: React.FC<SemiFinishedTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  if (items.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 p-8 text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-400 text-lg mb-2">
          Нет полуфабрикатов
        </p>
        <p className="text-gray-500 text-sm">
          Полуфабрикаты - это промежуточные продукты, которые используются в приготовлении блюд
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop: Table */}
      <Card className="hidden lg:block bg-gray-800/50 border-gray-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-700">
              <TableRow>
                <TableHead className="text-gray-200 font-semibold">Название</TableHead>
                <TableHead className="text-gray-200 font-semibold">Категория</TableHead>
                <TableHead className="text-right text-gray-200 font-semibold">Выход</TableHead>
                <TableHead className="text-right text-gray-200 font-semibold">Себестоимость/ед</TableHead>
                <TableHead className="text-center text-gray-200 font-semibold">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-700">
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-700/50 transition">
                  <TableCell className="px-4 py-3 sm:px-6 sm:py-4">
                    <p className="font-medium text-white">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 sm:px-6 sm:py-4">
                    <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 font-semibold text-xs px-3 py-1">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 sm:px-6 sm:py-4 text-right">
                    <p className="font-semibold text-purple-400">
                      {item.outputQuantity} {item.outputUnit}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3 sm:px-6 sm:py-4 text-right">
                    <p className="font-semibold text-cyan-500">
                      {item.costPerUnit.toFixed(3)} ₽/{item.outputUnit}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5"
                        title="Редактировать"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onDelete(item.id, item.name)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Mobile: Cards */}
      <div className="lg:hidden space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Название и категория */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white mb-1 break-words">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    )}
                    <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 font-semibold text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Выход и себестоимость */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Выход</p>
                    <p className="font-semibold text-base text-purple-400">
                      {item.outputQuantity} {item.outputUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Себестоимость</p>
                    <p className="font-semibold text-base text-cyan-500">
                      {item.costPerUnit.toFixed(3)} ₽/{item.outputUnit}
                    </p>
                  </div>
                </div>

                {/* Действия */}
                <div className="flex gap-2 pt-3 border-t border-gray-700">
                  <Button
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(item.id, item.name)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-4"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
