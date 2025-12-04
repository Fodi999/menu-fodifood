'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useCart } from '@/contexts/CartContext';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { toast } from 'sonner';
import type { MenuItem } from '@/types/restaurant';

const popularDishes = [
  {
    id: 1,
    name: 'Калифорния',
    nameEn: 'California',
    description: 'Краб, авокадо, огурец, икра тобико',
    price: 28,
    image: '/placeholder.jpg',
    weight: '8 шт',
    isNew: false,
  },
  {
    id: 2,
    name: 'Филадельфия',
    nameEn: 'Philadelphia',
    description: 'Лосось, сливочный сыр, огурец',
    price: 32,
    image: '/placeholder.jpg',
    weight: '8 шт',
    isNew: false,
  },
  {
    id: 3,
    name: 'Микс сет',
    nameEn: 'Mix Set',
    description: 'Ассорти из популярных роллов',
    price: 85,
    originalPrice: 95,
    image: '/placeholder.jpg',
    weight: '24 шт',
    isNew: true,
    hasDiscount: true,
  },
];

export function PopularDishes() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const { isEditMode, menuItems, updateMenuItem, deleteMenuItem } = useRestaurant();
  const { addItem } = useCart();

  // Use menuItems from context if available, otherwise use hardcoded data
  const dishes = menuItems.length > 0 ? menuItems.filter(item => item.isPopular) : popularDishes;

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleUpdateDish = (id: number, field: string, value: any) => {
    updateMenuItem(id, { [field]: value });
  };

  const handleDeleteDish = (id: number) => {
    if (confirm('Удалить это блюдо?')) {
      deleteMenuItem(id);
    }
  };

  const handleAddToCart = (dish: MenuItem | typeof popularDishes[0]) => {
    // Convert to MenuItem format
    const menuItem: MenuItem = {
      id: dish.id,
      name: dish.name,
      nameRu: dish.name,
      namePl: dish.name,
      description: dish.description,
      descriptionRu: dish.description,
      descriptionPl: dish.description,
      price: dish.price,
      image: dish.image,
      weight: dish.weight || '',
      categoryId: 1,
      isPopular: true,
      isAvailable: true,
      isNew: 'isNew' in dish ? dish.isNew : false,
    };
    addItem(menuItem);
    toast.success(`${dish.name} добавлен в корзину!`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">Популярное</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Любимые блюда наших гостей
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Попробуйте наши самые популярные позиции
          </p>
        </motion.div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-muted">
                  {isEditMode ? (
                    <EditableImage
                      src={dish.image}
                      alt={dish.name}
                      onSave={(newSrc) => handleUpdateDish(dish.id, 'image', newSrc)}
                      width={400}
                      height={224}
                      variant="portfolio"
                      
                    />
                  ) : (
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {dish.isNew && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        Новинка
                      </span>
                    )}
                    {dish.originalPrice && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        Скидка
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(dish.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(dish.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    {isEditMode ? (
                      <EditableText
                        value={dish.name}
                        onSave={(newName) => handleUpdateDish(dish.id, 'name', newName)}
                        className="font-bold text-lg mb-1"
                        
                      />
                    ) : (
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {dish.name}
                      </h3>
                    )}
                    {isEditMode ? (
                      <EditableText
                        value={dish.description}
                        onSave={(newDesc) => handleUpdateDish(dish.id, 'description', newDesc)}
                        multiline
                        className="text-sm text-muted-foreground"
                        
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    {isEditMode ? (
                      <EditableText
                        value={dish.weight || ''}
                        onSave={(newWeight) => handleUpdateDish(dish.id, 'weight', newWeight)}
                        className="text-xs text-muted-foreground"
                        
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">{dish.weight}</span>
                    )}
                    <div className="flex items-center gap-2">
                      {dish.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {dish.originalPrice} zł
                        </span>
                      )}
                      {isEditMode ? (
                        <EditableText
                          value={dish.price.toString()}
                          onSave={(newPrice) => handleUpdateDish(dish.id, 'price', parseFloat(newPrice))}
                          className="text-2xl font-bold text-primary"
                          
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {dish.price} zł
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  {!isEditMode && (
                    <Button 
                      className="w-full gap-2" 
                      size="lg"
                      onClick={() => handleAddToCart(dish)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      В корзину
                    </Button>
                  )}
                </div>
              </div>

              {/* Delete Button in Edit Mode */}
              {isEditMode && (
                <button
                  onClick={() => handleDeleteDish(dish.id)}
                  className="absolute top-2 right-2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/menu">
            <Button size="lg" variant="outline" className="gap-2">
              Посмотреть все меню
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
