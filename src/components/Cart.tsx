'use client';

import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function Cart() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, closeCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Cart Slider */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] md:w-[480px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Корзина</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
                    Корзина пуста
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Добавьте блюда из меню
                  </p>
                  <Button onClick={closeCart} asChild className="h-11 sm:h-12">
                    <Link href="/menu">
                      Посмотреть меню
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="bg-card rounded-xl p-3 sm:p-4 border border-border/50"
                    >
                      <div className="flex gap-2 sm:gap-3">
                        {/* Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 64px, 80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-1">
                            {item.weight}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-muted rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center hover:bg-background transition-colors"
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="w-7 sm:w-8 text-center font-semibold text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center hover:bg-background transition-colors"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <p className="font-bold text-sm sm:text-base text-primary">
                              {(item.price * item.quantity).toFixed(2)} zł
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-border bg-muted/30">
                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Товары ({totalItems})</span>
                    <span className="font-semibold">{totalPrice.toFixed(2)} zł</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    <span className="font-semibold">
                      {totalPrice >= 100 ? (
                        <span className="text-green-600">Бесплатно</span>
                      ) : (
                        '10.00 zł'
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base sm:text-lg">Итого</span>
                    <span className="font-bold text-base sm:text-lg text-primary">
                      {(totalPrice + (totalPrice >= 100 ? 0 : 10)).toFixed(2)} zł
                    </span>
                  </div>
                </div>

                {totalPrice < 30 && (
                  <p className="text-xs text-muted-foreground mb-3 text-center">
                    Минимальная сумма заказа - 30 zł
                  </p>
                )}

                <Button
                  size="lg"
                  className="w-full gap-2 h-11 sm:h-12 text-sm sm:text-base"
                  disabled={totalPrice < 30}
                  asChild={totalPrice >= 30}
                  onClick={totalPrice < 30 ? undefined : closeCart}
                >
                  {totalPrice >= 30 ? (
                    <Link href="/checkout">
                      Оформить заказ
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  ) : (
                    <>
                      Минимальный заказ 30 zł
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
