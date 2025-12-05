'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '@/types/restaurant';
import { analytics } from '@/lib/analytics';
import { toast } from 'sonner';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurant_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        // Validate cart items - clear if any ID is > 100 (old mock data)
        const hasInvalidIds = parsedCart.some((item: CartItem) => item.id > 100);
        
        if (hasInvalidIds) {
          console.warn('🧹 Clearing cart - found old mock data');
          localStorage.removeItem('restaurant_cart');
          setItems([]);
          
          // Show notification to user
          toast.info('Корзина была очищена из-за обновления меню', {
            description: 'Пожалуйста, добавьте товары заново',
            duration: 5000,
          });
        } else {
          setItems(parsedCart);
        }
      } catch (e) {
        console.error('Failed to load cart:', e);
        localStorage.removeItem('restaurant_cart');
      }
    }
  }, []);

  // Additional safety check - validate items before any cart operation
  const validateAndCleanCart = (cartItems: CartItem[]): CartItem[] => {
    const validItems = cartItems.filter(item => item.id <= 100);
    if (validItems.length !== cartItems.length) {
      console.warn('🧹 Removed invalid items from cart');
      toast.warning('Некоторые товары были удалены из корзины', {
        description: 'Устаревшие позиции больше не доступны',
      });
    }
    return validItems;
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('restaurant_cart', JSON.stringify(items));
    
    // Update analytics with current cart count
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    analytics.updateCartItems(totalCount);
  }, [items]);

  const addItem = (item: MenuItem) => {
    // Validate item ID before adding
    if (item.id > 100) {
      console.error('❌ Attempted to add invalid item with ID:', item.id);
      toast.error('Невозможно добавить товар', {
        description: 'Пожалуйста, обновите страницу и попробуйте снова',
      });
      return;
    }
    
    setItems(prevItems => {
      // Clean cart before adding
      const cleanedItems = validateAndCleanCart(prevItems);
      const existingItem = cleanedItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Increment quantity if item already exists
        return cleanedItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Add new item with quantity 1
        return [...cleanedItems, { ...item, quantity: 1 }];
      }
    });
    
    console.log('🛒 CartContext - Add Item:', item.name);
  };

  const removeItem = (itemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    console.log('🗑️ CartContext - Remove Item:', itemId);
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
    console.log('🔄 CartContext - Update Quantity:', itemId, quantity);
  };

  const clearCart = () => {
    setItems([]);
    console.log('🧹 CartContext - Clear Cart');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
