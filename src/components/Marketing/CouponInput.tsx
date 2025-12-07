'use client';

import { useState } from 'react';
import { Tag, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export interface AppliedCoupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed_amount' | 'free_delivery';
  message: string;
}

interface CouponInputProps {
  orderTotal: number;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
  currentCoupon?: AppliedCoupon | null;
}

export function CouponInput({ orderTotal, onApply, onRemove, currentCoupon }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    setError(null);

    try {
      // Симуляция API вызова (замените на реальный API)
      const result = await validateCoupon(code.toUpperCase(), orderTotal);
      
      if (result.valid && result.coupon) {
        onApply(result.coupon);
        setCode('');
      } else {
        setError(result.error || 'Nieprawidłowy kupon');
      }
    } catch (err) {
      setError('Błąd walidacji kuponu');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setCode('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      {/* Заголовок */}
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Masz kupon?</span>
      </div>

      {/* Поле ввода или показ примененного купона */}
      <AnimatePresence mode="wait">
        {currentCoupon ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm text-green-700 dark:text-green-400">
                      {currentCoupon.code}
                    </span>
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-semibold">
                      {currentCoupon.type === 'percentage' 
                        ? `-${currentCoupon.discount}%`
                        : currentCoupon.type === 'free_delivery'
                        ? 'Darmowa dostawa'
                        : `-${currentCoupon.discount.toFixed(2)} zł`
                      }
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    {currentCoupon.message}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors flex-shrink-0"
                aria-label="Usuń kupon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Wprowadź kod kuponu"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  className="uppercase font-mono"
                  disabled={isValidating}
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                onClick={handleApply}
                disabled={!code.trim() || isValidating}
                variant="outline"
                className="px-6"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sprawdzam...
                  </>
                ) : (
                  'Zastosuj'
                )}
              </Button>
            </div>

            {/* Ошибка */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-sm text-destructive"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Доступные купоны (можно показать список) */}
      {!currentCoupon && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <QuickCouponButton code="PIZZA20" onClick={() => setCode('PIZZA20')} />
            <QuickCouponButton code="WELCOME10" onClick={() => setCode('WELCOME10')} />
            <QuickCouponButton code="FREEDEL" onClick={() => setCode('FREEDEL')} />
          </div>
          
          {/* Dev only: Reset button */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => {
                localStorage.removeItem('used_coupons');
                setError(null);
                window.location.reload();
              }}
              className="text-xs text-muted-foreground hover:text-destructive underline"
              title="Usuń wszystkie wykorzystane kupony (tylko dev)"
            >
              🔄 Reset kuponów (DEV)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Быстрая кнопка для популярных купонов
function QuickCouponButton({ code, onClick }: { code: string; onClick: () => void }) {
  const isUsed = isСouponUsed(code);
  
  return (
    <button
      onClick={onClick}
      disabled={isUsed}
      className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
        isUsed
          ? 'bg-muted text-muted-foreground line-through cursor-not-allowed opacity-50'
          : 'bg-primary/10 hover:bg-primary/20 text-primary'
      }`}
      title={isUsed ? 'Kupon już wykorzystany' : `Kliknij aby użyć ${code}`}
    >
      {code}
      {isUsed && ' ✓'}
    </button>
  );
}

// ========================================
// MOCK API - замените на реальный API
// ========================================

interface CouponValidationResult {
  valid: boolean;
  coupon?: AppliedCoupon;
  error?: string;
}

// Проверка использованных купонов (одноразовые)
function isСouponUsed(code: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const usedCoupons = localStorage.getItem('used_coupons');
  if (!usedCoupons) return false;
  
  try {
    const used: string[] = JSON.parse(usedCoupons);
    return used.includes(code);
  } catch {
    return false;
  }
}

// Отметить купон как использованный
function markCouponAsUsed(code: string): void {
  if (typeof window === 'undefined') return;
  
  const usedCoupons = localStorage.getItem('used_coupons');
  let used: string[] = [];
  
  if (usedCoupons) {
    try {
      used = JSON.parse(usedCoupons);
    } catch {
      used = [];
    }
  }
  
  if (!used.includes(code)) {
    used.push(code);
    localStorage.setItem('used_coupons', JSON.stringify(used));
  }
}

async function validateCoupon(code: string, orderTotal: number): Promise<CouponValidationResult> {
  // Симуляция задержки API
  await new Promise(resolve => setTimeout(resolve, 800));

  // ⚠️ ПРОВЕРКА: Купон уже использован?
  if (isСouponUsed(code)) {
    return {
      valid: false,
      error: 'Ten kupon został już wykorzystany',
    };
  }

  // Примеры купонов (замените на реальный API вызов)
  const COUPONS: Record<string, any> = {
    'PIZZA20': {
      type: 'percentage',
      value: 20,
      minOrderAmount: 50,
      applicableCategories: ['pizza'],
      message: '20% zniżki na pizzę',
      oneTimeUse: true, // Одноразовый купон
    },
    'WELCOME10': {
      type: 'percentage',
      value: 10,
      minOrderAmount: 30,
      firstOrderOnly: true,
      message: '10% zniżki na pierwsze zamówienie',
      oneTimeUse: true, // Одноразовый купон
    },
    'FREEDEL': {
      type: 'free_delivery',
      value: 0,
      minOrderAmount: 80,
      message: 'Darmowa dostawa',
      oneTimeUse: true, // Одноразовый купон
    },
    'FIXED15': {
      type: 'fixed_amount',
      value: 15,
      minOrderAmount: 100,
      message: '15 zł zniżki',
      oneTimeUse: true, // Одноразовый купон
    },
    'VIP50': {
      type: 'percentage',
      value: 50,
      minOrderAmount: 200,
      message: '50% zniżki dla VIP',
      oneTimeUse: true, // Одноразовый купон
    },
  };

  const coupon = COUPONS[code];

  if (!coupon) {
    return {
      valid: false,
      error: 'Kupon nie istnieje lub wygasł',
    };
  }

  // Проверка минимальной суммы заказа
  if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
    return {
      valid: false,
      error: `Minimalna kwota zamówienia: ${coupon.minOrderAmount} zł`,
    };
  }

  // TODO: Дополнительные проверки:
  // - firstOrderOnly - проверить, первый ли это заказ пользователя (API)
  // - applicableCategories - проверить категории товаров в корзине
  // - usageLimit - проверить глобальный лимит использований (API)
  // - validUntil - проверить срок действия

  // ✅ Купон валиден - отмечаем как использованный
  markCouponAsUsed(code);

  return {
    valid: true,
    coupon: {
      code,
      discount: coupon.value,
      type: coupon.type,
      message: coupon.message,
    },
  };
}
