'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Category, RestaurantInfo } from '@/types/restaurant';

interface RestaurantContextType {
  // Edit Mode
  isEditMode: boolean;
  toggleEditMode: () => void;

  // Menu Items
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: number) => void;

  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: number, updates: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  // Restaurant Info
  restaurantInfo: RestaurantInfo | null;
  setRestaurantInfo: (info: RestaurantInfo) => void;
  updateRestaurantInfo: (updates: Partial<RestaurantInfo>) => void;

  // State Management
  saveData: () => Promise<void>;
  loadData: () => Promise<void>;
  resetToDefault: () => void;
  isLoading: boolean;
  hasChanges: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Toggle Edit Mode
  const toggleEditMode = () => {
    console.log('🔄 RestaurantContext - Toggle Edit Mode:', !isEditMode);
    setIsEditMode(!isEditMode);
  };

  // Menu Items Management
  const addMenuItem = (item: MenuItem) => {
    console.log('➕ RestaurantContext - Add MenuItem:', item);
    setMenuItems([...menuItems, item]);
    setHasChanges(true);
  };

  const updateMenuItem = (id: number, updates: Partial<MenuItem>) => {
    console.log('✏️ RestaurantContext - Update MenuItem:', id, updates);
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setHasChanges(true);
  };

  const deleteMenuItem = (id: number) => {
    console.log('🗑️ RestaurantContext - Delete MenuItem:', id);
    setMenuItems(menuItems.filter(item => item.id !== id));
    setHasChanges(true);
  };

  // Categories Management
  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
    setHasChanges(true);
  };

  const updateCategory = (id: number, updates: Partial<Category>) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
    setHasChanges(true);
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setHasChanges(true);
  };

  // Restaurant Info Management
  const updateRestaurantInfo = (updates: Partial<RestaurantInfo>) => {
    if (restaurantInfo) {
      setRestaurantInfo({ ...restaurantInfo, ...updates });
      setHasChanges(true);
    }
  };

  // Save Data to Backend
  const saveData = async () => {
    setIsLoading(true);
    try {
      // Here you would save to backend
      console.log('💾 Saving restaurant data...', { menuItems, categories, restaurantInfo });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      console.log('✅ Data saved successfully');
    } catch (error) {
      console.error('❌ Error saving data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load Data from Backend
  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('📥 Loading restaurant data...');
      
      // TODO: Load from backend API
      // For now, use default data
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setIsLoading(false);
    }
  };

  // Reset to Default
  const resetToDefault = () => {
    if (confirm('Сбросить все изменения? Это действие нельзя отменить.')) {
      loadData();
      setHasChanges(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const value: RestaurantContextType = {
    isEditMode,
    toggleEditMode,
    menuItems,
    setMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    categories,
    setCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    restaurantInfo,
    setRestaurantInfo,
    updateRestaurantInfo,
    saveData,
    loadData,
    resetToDefault,
    isLoading,
    hasChanges,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
