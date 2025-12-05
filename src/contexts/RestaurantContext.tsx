'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Category, RestaurantInfo } from '@/types/restaurant';
import { categoriesAPI, menuAPI, restaurantInfoAPI } from '@/lib/restaurant-api';
import { toast } from 'sonner';

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
      console.log('💾 Saving restaurant data...', { menuItems, categories, restaurantInfo });
      
      // Save categories
      for (const category of categories) {
        if (category.id < 0) {
          // New category - create
          await categoriesAPI.create({
            name: category.name,
            name_ru: category.name,
            name_pl: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            order: category.order,
          });
        } else {
          // Existing category - update
          await categoriesAPI.update(category.id, {
            name: category.name,
            name_ru: category.name,
            name_pl: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            order: category.order,
            is_active: category.isActive,
          });
        }
      }
      
      // Save menu items
      for (const item of menuItems) {
        if (item.id < 0) {
          // New item - create
          await menuAPI.create({
            category_id: item.categoryId || 1,
            name: item.name,
            name_ru: item.nameRu || item.name,
            name_pl: item.namePl || item.name,
            description: item.description,
            description_ru: item.descriptionRu || item.description,
            description_pl: item.descriptionPl || item.description,
            price: item.price.toString(),
            original_price: item.originalPrice?.toString(),
            image: item.image,
            images: item.images,
            is_vegetarian: item.isVegetarian,
            is_spicy: item.isSpicy,
            allergens: item.allergens,
            weight: item.weight,
            calories: item.calories,
            cooking_time: item.cookingTime,
            ingredients: item.ingredients,
            tags: item.tags,
          });
        } else {
          // Existing item - update
          await menuAPI.update(item.id, {
            category_id: item.categoryId,
            name: item.name,
            name_ru: item.nameRu || item.name,
            name_pl: item.namePl || item.name,
            description: item.description,
            description_ru: item.descriptionRu || item.description,
            description_pl: item.descriptionPl || item.description,
            price: item.price.toString(),
            original_price: item.originalPrice?.toString(),
            image: item.image,
            images: item.images,
            is_available: item.isAvailable,
            is_popular: item.isPopular,
            is_new: item.isNew,
            is_vegetarian: item.isVegetarian,
            is_spicy: item.isSpicy,
            allergens: item.allergens,
            weight: item.weight,
            calories: item.calories,
            cooking_time: item.cookingTime,
            ingredients: item.ingredients,
            tags: item.tags,
          });
        }
      }
      
      // Save restaurant info
      if (restaurantInfo) {
        await restaurantInfoAPI.update({
          name: restaurantInfo.name,
          name_ru: restaurantInfo.name,
          name_pl: restaurantInfo.name,
          description: restaurantInfo.description,
          description_ru: restaurantInfo.description,
          description_pl: restaurantInfo.description,
          logo: restaurantInfo.logo,
          phone: restaurantInfo.phone,
          email: restaurantInfo.email,
          address: restaurantInfo.address,
          city: restaurantInfo.city,
          postal_code: restaurantInfo.postalCode,
        });
      }
      
      setHasChanges(false);
      toast.success('✅ Данные успешно сохранены!');
      console.log('✅ Data saved successfully');
      
      // Reload data to get updated IDs and timestamps
      await loadData();
    } catch (error) {
      console.error('❌ Error saving data:', error);
      toast.error('❌ Ошибка при сохранении данных');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load Data from Backend
  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log('📥 Loading restaurant data from API...');
      
      // Load categories
      try {
        const categoriesData = await categoriesAPI.getAll();
        const mappedCategories: Category[] = categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name_ru || cat.name,
          nameRu: cat.name_ru,
          namePl: cat.name_pl,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          order: cat.order || 0,
          isActive: cat.is_active ?? true,
        }));
        setCategories(mappedCategories);
        console.log('✅ Loaded categories:', mappedCategories.length);
      } catch (error) {
        console.warn('⚠️ Failed to load categories from API, using empty array:', error);
        setCategories([]);
      }
      
      // Load menu items
      try {
        const menuData = await menuAPI.getAll();
        const mappedMenuItems: MenuItem[] = menuData.map(item => ({
          id: item.id,
          categoryId: item.category_id || 1,
          name: item.name_ru || item.name,
          nameRu: item.name_ru,
          namePl: item.name_pl,
          description: item.description_ru || item.description,
          descriptionRu: item.description_ru,
          descriptionPl: item.description_pl,
          price: parseFloat(item.price),
          originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
          image: item.image,
          images: item.images,
          isAvailable: item.is_available ?? true,
          isPopular: item.is_popular ?? false,
          isNew: item.is_new ?? false,
          isVegetarian: item.is_vegetarian ?? false,
          isSpicy: item.is_spicy ?? false,
          allergens: item.allergens,
          weight: item.weight,
          calories: item.calories,
          cookingTime: item.cooking_time,
          ingredients: item.ingredients,
          tags: item.tags,
        }));
        setMenuItems(mappedMenuItems);
        console.log('✅ Loaded menu items:', mappedMenuItems.length);
      } catch (error) {
        console.warn('⚠️ Failed to load menu from API, using empty array:', error);
        setMenuItems([]);
      }
      
      // Load restaurant info
      try {
        const infoData = await restaurantInfoAPI.get();
        const mappedInfo: RestaurantInfo = {
          name: infoData.name_ru || infoData.name,
          nameRu: infoData.name_ru,
          namePl: infoData.name_pl,
          description: infoData.description_ru || infoData.description || '',
          descriptionRu: infoData.description_ru || '',
          descriptionPl: infoData.description_pl || '',
          logo: infoData.logo || '',
          phone: infoData.phone || '',
          email: infoData.email || '',
          address: infoData.address || '',
          city: infoData.city || '',
          postalCode: infoData.postal_code || '',
          openingHours: infoData.opening_hours || {},
          deliveryRadius: infoData.delivery_radius || 10,
          minimumOrder: parseFloat(infoData.minimum_order || '0'),
          deliveryFee: parseFloat(infoData.delivery_fee || '0'),
          freeDeliveryFrom: parseFloat(infoData.free_delivery_from || '0'),
          averageDeliveryTime: infoData.average_delivery_time || 30,
          socialMedia: infoData.social_media,
        };
        setRestaurantInfo(mappedInfo);
        console.log('✅ Loaded restaurant info');
      } catch (error) {
        console.warn('⚠️ No restaurant info found, using default');
      }
      
      setHasChanges(false);
      console.log('✅ Data loading completed');
    } catch (error) {
      console.error('❌ Error loading data:', error);
      // Don't show toast for API errors during initial load
      console.warn('⚠️ API not available, app will work in offline mode');
    } finally {
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
