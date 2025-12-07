'use client';

import { useCart } from '@/contexts/CartContext';
import { Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface PointsIndicatorProps {
  orderTotal: number;
  userTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export function PointsIndicator({ orderTotal, userTier = 'bronze' }: PointsIndicatorProps) {
  // Рассчет баллов за заказ
  const calculatePoints = (total: number, tier: string): number => {
    if (total < 30) return 0; // Минимальный заказ

    const basePoints = Math.floor(total);

    // Бонусные множители по уровням
    const multipliers: Record<string, number> = {
      bronze: 1,
      silver: 1,
      gold: 1,
      platinum: 2, // x2 баллы для платиновых
    };

    return basePoints * multipliers[tier];
  };

  const pointsToEarn = calculatePoints(orderTotal, userTier);
  const cashbackValue = pointsToEarn; // 1 punkt = 1 grosz (0.01 zł)

  if (orderTotal < 30) {
    return null; // Не показываем если заказ меньше минимального
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Zarobisz {pointsToEarn} punktów
            </p>
            <p className="text-xs text-muted-foreground">
              = {cashbackValue.toFixed(2)} zł cashback
            </p>
          </div>
        </div>

        {userTier === 'platinum' && (
          <div className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
            x2
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface UserPointsBalanceProps {
  currentPoints: number;
  onUsePoints?: () => void;
}

export function UserPointsBalance({ currentPoints, onUsePoints }: UserPointsBalanceProps) {
  const pointsValue = currentPoints / 100; // 100 punktów = 1 zł

  if (currentPoints < 100) {
    return null; // Минимум 100 баллов для использования
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Twoje punkty</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">
              {currentPoints} pkt
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Wartość</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-400">
            {pointsValue.toFixed(2)} zł
          </p>
        </div>
      </div>

      {onUsePoints && (
        <button
          onClick={onUsePoints}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all text-sm"
        >
          Użyj punktów jako rabat
        </button>
      )}

      <p className="text-xs text-center text-muted-foreground mt-2">
        100 punktów = 1 zł rabatu
      </p>
    </motion.div>
  );
}

// Wskaźnik w cart footer
export function CartPointsPreview() {
  const { totalPrice } = useCart();
  const points = Math.floor(totalPrice);

  if (totalPrice < 30) return null;

  return (
    <div className="flex items-center justify-between text-xs sm:text-sm py-2 px-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span className="text-muted-foreground">Zarobisz punkty</span>
      </div>
      <span className="font-bold text-amber-700 dark:text-amber-400">
        +{points} pkt
      </span>
    </div>
  );
}
