"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Fish, Package, Soup, Salad, Coffee, Cake, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

// Типы данных
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: number;
  weight?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: any;
  description: string;
  items: MenuItem[];
}

export function MenuWithCategories() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const [menuByCategories, setMenuByCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isEditMode } = useRestaurant();
  
  const [sectionData, setSectionData] = useState({
    title: 'Наше меню',
    subtitle: 'Выберите категорию и найдите свое любимое блюдо',
  });

  const handleUpdate = (field: string, value: string) => {
    setSectionData(prev => ({ ...prev, [field]: value }));
  };

  // Иконки для категорий
  const categoryIcons: Record<number, any> = {
    1: Fish,
    2: Package,
    3: Soup,
    4: Salad,
    5: Coffee,
    6: Cake,
  };

  // Загрузка данных меню из API
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        
        // Загрузка категорий
        const categoriesRes = await fetch('https://portfolio-a4yb.shuttle.app/api/restaurant/categories');
        const categoriesData = await categoriesRes.json();
        
        // Загрузка блюд
        const itemsRes = await fetch('https://portfolio-a4yb.shuttle.app/api/restaurant/menu');
        const itemsData = await itemsRes.json();
        
        // Группировка блюд по категориям
        const categoriesWithItems: Category[] = categoriesData.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase(),
          icon: categoryIcons[cat.id] || Package,
          description: cat.description || '',
          items: itemsData
            .filter((item: any) => item.category_id === cat.id)
            .map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: parseFloat(item.price),
              image_url: item.image_url || '/placeholder.jpg',
              category_id: item.category_id,
            }))
        }));
        
        setMenuByCategories(categoriesWithItems);
        if (categoriesWithItems.length > 0) {
          setActiveCategory(categoriesWithItems[0].id);
        }
      } catch (error) {
        console.error('Failed to load menu:', error);
        toast.error('Ошибка загрузки меню');
      } finally {
        setLoading(false);
      }
    };
    
    loadMenu();
  }, []);

  // Handlers for updating categories and items
  const handleCategoryUpdate = (categoryId: number, field: string, value: string) => {
    setMenuByCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ));
  };

  const handleItemUpdate = (categoryId: number, itemId: number, field: string, value: string | number) => {
    setMenuByCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map((item: any) =>
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : cat
    ));
  };

  // Add new category
  const handleAddCategory = () => {
    const newId = Math.max(...menuByCategories.map(c => c.id)) + 1;
    const newCategory = {
      id: newId,
      name: 'Новая категория',
      slug: `category-${newId}`,
      icon: Package,
      description: 'Описание категории',
      items: []
    };
    setMenuByCategories(prev => [...prev, newCategory]);
    setActiveCategory(newId);
    toast.success('Категория создана!');
  };

  // Add new item to current category
  const handleAddItem = () => {
    const newItemId = Date.now();
    const newItem = {
      id: newItemId,
      name: 'Новое блюдо',
      description: 'Кликните чтобы изменить описание блюда',
      price: 100,
      originalPrice: undefined,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      weight: '250 г',
      isNew: false
    };
    
    setMenuByCategories(prev => prev.map(cat =>
      cat.id === activeCategory
        ? { ...cat, items: [...cat.items, newItem as any] }
        : cat
    ));
    toast.success('Блюдо создано! Кликните на текст или изображение для редактирования');
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      nameRu: item.name,
      namePl: item.name,
      description: item.description,
      descriptionRu: item.description,
      descriptionPl: item.description,
      price: item.price,
      image: item.image_url || '/placeholder.jpg',
      weight: '',
      categoryId: item.category_id,
      isPopular: false,
      isAvailable: true,
      isNew: false,
    });
    toast.success(`${item.name} добавлен в корзину`);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка меню...</p>
          </div>
        </div>
      </section>
    );
  }

  // Get active category data
  const currentCategory = menuByCategories.find(cat => cat.id === activeCategory);
  
  if (!currentCategory) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <EditableText
              value={sectionData.title}
              onSave={(value) => handleUpdate('title', value)}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            />
          </h2>
          <div className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
            <EditableText
              value={sectionData.subtitle}
              onSave={(value) => handleUpdate('subtitle', value)}
              className="text-lg sm:text-xl text-muted-foreground block w-full max-w-2xl mx-auto"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-12">
            {menuByCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base
                  transition-all duration-300 border-2
                  ${activeCategory === category.id 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                    : 'bg-background border-border hover:border-primary/50'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>
                  <EditableText
                    value={category.name}
                    onSave={(value) => handleCategoryUpdate(category.id, 'name', value)}
                    className="font-semibold inline"
                  />
                </span>
                <span className="text-xs opacity-70">({category.items.length})</span>
              </motion.button>
            ))}
            
            {/* Create Category Button */}
            {isEditMode && (
              <motion.button
                onClick={handleAddCategory}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base
                  transition-all duration-300 border-2 border-dashed border-primary/50 bg-background hover:border-primary hover:bg-primary/5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Создать категорию</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Active Category Section */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b-2 border-primary/20">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <currentCategory.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1 space-y-2 sm:space-y-4 w-full sm:w-auto">
              <h3 className="text-2xl sm:text-3xl font-bold">
                <EditableText
                  value={currentCategory.name}
                  onSave={(value) => handleCategoryUpdate(currentCategory.id, 'name', value)}
                  className="text-2xl sm:text-3xl font-bold"
                />
              </h3>
              <div className="text-sm sm:text-base text-muted-foreground">
                <EditableText
                  value={currentCategory.description}
                  onSave={(value) => handleCategoryUpdate(currentCategory.id, 'description', value)}
                  className="text-sm sm:text-base text-muted-foreground"
                />
              </div>
            </div>
            <div className="ml-auto flex-shrink-0 self-end sm:self-auto">
              <span className="text-xs sm:text-sm text-muted-foreground">
                {currentCategory.items.length} блюд
              </span>
            </div>
          </div>

            {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {currentCategory.items.map((item: any, itemIndex: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: itemIndex * 0.05 }}
                  className="group relative"
                >
                  <div className="bg-card rounded-xl sm:rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                      <EditableImage
                        src={item.image_url || '/placeholder.jpg'}
                        alt={item.name}
                        onSave={(value) => handleItemUpdate(currentCategory.id, item.id, 'image_url', value)}
                        variant="portfolio"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                        priority={itemIndex < 4}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                        {item.isNew && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Новинка
                          </span>
                        )}
                        {item.originalPrice && (
                          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                            Скидка
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            favorites.includes(item.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      <h4 className="font-bold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                        <EditableText
                          value={item.name}
                          onSave={(value) => handleItemUpdate(currentCategory.id, item.id, 'name', value)}
                          className="font-bold text-base sm:text-lg"
                        />
                      </h4>
                      <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                        <EditableText
                          value={item.description}
                          onSave={(value) => handleItemUpdate(currentCategory.id, item.id, 'description', value)}
                          multiline
                          className="text-xs sm:text-sm text-muted-foreground block w-full"
                        />
                      </div>

                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className="text-xs text-muted-foreground">
                          <EditableText
                            value={item.weight}
                            onSave={(value) => handleItemUpdate(currentCategory.id, item.id, 'weight', value)}
                            className="text-xs text-muted-foreground"
                          />
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {item.originalPrice && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              <EditableText
                                value={String(item.originalPrice)}
                                onSave={(value) => handleItemUpdate(currentCategory.id, item.id, 'originalPrice', Number(value))}
                                className="text-xs sm:text-sm text-muted-foreground"
                              /> zł
                            </span>
                          )}
                          <span className="text-lg sm:text-xl font-bold text-primary">
                            <EditableText
                              value={String(item.price)}
                              onSave={(value) => handleItemUpdate(currentCategory.id, item.id, 'price', Number(value))}
                              className="text-lg sm:text-xl font-bold text-primary"
                            /> zł
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        В корзину
                      </Button>
                    </div>
                  </div>
                </motion.div>
            ))}
            
            {/* Create Item Card */}
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <button
                  onClick={handleAddItem}
                  className="w-full h-full min-h-[350px] sm:min-h-[400px] bg-card rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 sm:gap-4 p-6"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-primary">
                    Создать блюдо
                  </span>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
