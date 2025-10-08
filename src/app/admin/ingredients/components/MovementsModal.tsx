"use client";

import React from "react";
import { Package2 } from "lucide-react";
import { StockMovement } from "../types";

interface MovementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientName: string;
  batchNumber: string;
  movements: StockMovement[];
}

export const MovementsModal: React.FC<MovementsModalProps> = ({
  isOpen,
  onClose,
  ingredientName,
  movements,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                📦 История поступлений
              </h2>
              <p className="text-gray-400 mt-1">{ingredientName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {movements.length === 0 ? (
            <div className="text-center py-12">
              <Package2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">История поступлений пуста</p>
            </div>
          ) : (
            <div className="space-y-4">
              {movements.map((movement, index) => {
                const date = new Date(movement.createdAt);
                const formattedDate = date.toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={movement.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-white">
                            #{movements.length - index}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            movement.type === 'addition' 
                              ? 'bg-green-500/20 text-green-400' 
                              : movement.type === 'removal'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {movement.type === 'addition' ? '➕ Добавление' : 
                             movement.type === 'removal' ? '➖ Списание' : 
                             '🔄 Корректировка'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div>
                            <p className="text-gray-400 text-sm">Количество</p>
                            <p className="text-white font-semibold text-lg">
                              {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Дата и время</p>
                            <p className="text-white font-medium">{formattedDate}</p>
                          </div>
                        </div>

                        {movement.notes && (
                          <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
                            <p className="text-gray-400 text-sm mb-1">Примечание</p>
                            <p className="text-white">{movement.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              Всего записей: <span className="text-white font-semibold">{movements.length}</span>
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
