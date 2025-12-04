'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartButton() {
  const { totalItems, totalPrice, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {totalItems > 9 ? '9+' : totalItems}
          </motion.span>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {totalItems > 0 && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="font-semibold text-sm overflow-hidden whitespace-nowrap hidden sm:inline-block"
          >
            {totalPrice.toFixed(2)} zł
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
