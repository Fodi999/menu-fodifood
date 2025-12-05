'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, Star, Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useCart } from '@/contexts/CartContext';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { useState } from 'react';
import { toast } from 'sonner';

export function RestaurantHero() {
  const { isEditMode, restaurantInfo, updateRestaurantInfo } = useRestaurant();
  const { addItem } = useCart();
  
  // Local state for hero content
  const [heroData, setHeroData] = useState({
    badge: 'Лучшие суши в городе',
    title: 'Свежие суши',
    titleHighlight: 'суши',
    subtitle: 'с доставкой',
    description: 'Аутентичная японская кухня от профессионального шеф-повара. Только свежие ингредиенты и традиционные рецепты.',
    deliveryTime: '30-45 мин',
    dishCount: '100+ блюд',
    rating: '4.9/5',
  });

  // Featured dish card data
  const [featuredDish, setFeaturedDish] = useState({
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=1200&fit=crop',
    imageAlt: 'Fresh Sushi',
    title: 'Популярный сет',
    description: '24 шт • Калифорния, Филадельфия',
    price: '85 zł',
  });

  const handleUpdate = (field: string, value: string) => {
    setHeroData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeaturedDishUpdate = (field: string, value: string) => {
    setFeaturedDish(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToCart = () => {
    // Извлекаем цену из строки (например "85 zł" -> 85)
    const priceValue = parseFloat(featuredDish.price.replace(/[^0-9.]/g, ''));
    
    const cartItem = {
      id: Date.now(), // Уникальный ID для карточки
      name: featuredDish.title,
      description: featuredDish.description,
      price: priceValue,
      image: featuredDish.image,
      weight: '', // Можно добавить если нужно
    };

    addItem(cartItem as any);
    toast.success(`${featuredDish.title} добавлен в корзину!`);
  };
  
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-12 sm:py-16 lg:py-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6"
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary fill-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                <EditableText
                  value={heroData.badge}
                  onSave={(value) => handleUpdate('badge', value)}
                  
                  className="text-xs sm:text-sm font-medium text-primary"
                />
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
            >
              <span className="block mb-3 sm:mb-6">
                <EditableText
                  value={heroData.title}
                  onSave={(value) => handleUpdate('title', value)}
                  
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
                />
              </span>
              <span className="block text-primary">
                <EditableText
                  value={heroData.subtitle}
                  onSave={(value) => handleUpdate('subtitle', value)}
                  
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary"
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-xl leading-relaxed"
            >
              <EditableText
                value={heroData.description}
                onSave={(value) => handleUpdate('description', value)}
                
                multiline
                className="text-base sm:text-lg md:text-xl text-muted-foreground block w-full"
              />
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`flex flex-col ${isEditMode ? 'gap-6' : 'gap-3'} sm:gap-4 mb-6 sm:mb-10`}
            >
              <div className={`flex items-center gap-3 sm:gap-4 ${isEditMode ? 'pb-4' : ''}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-base sm:text-lg">
                    <EditableText
                      value={heroData.deliveryTime}
                      onSave={(value) => handleUpdate('deliveryTime', value)}
                      
                      className="font-bold text-base sm:text-lg"
                    />
                  </div>
                  <div className={`text-xs sm:text-sm text-muted-foreground ${isEditMode ? 'mt-2' : ''}`}>Доставка</div>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 sm:gap-4 ${isEditMode ? 'pb-4' : ''}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-base sm:text-lg">
                    <EditableText
                      value={heroData.dishCount}
                      onSave={(value) => handleUpdate('dishCount', value)}
                      
                      className="font-bold text-base sm:text-lg"
                    />
                  </div>
                  <div className={`text-xs sm:text-sm text-muted-foreground ${isEditMode ? 'mt-2' : ''}`}>В меню</div>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 sm:gap-4 ${isEditMode ? 'pb-4' : ''}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-base sm:text-lg">
                    <EditableText
                      value={heroData.rating}
                      onSave={(value) => handleUpdate('rating', value)}
                      
                      className="font-bold text-base sm:text-lg"
                    />
                  </div>
                  <div className={`text-xs sm:text-sm text-muted-foreground ${isEditMode ? 'mt-2' : ''}`}>Рейтинг</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/menu" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Заказать сейчас
                </Button>
              </Link>
              <Link href="/menu" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6">
                  Посмотреть меню
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-border/30"
            >
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Свежие продукты</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Бесплатная доставка от 100 zł</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative lg:block"
          >
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-muted to-muted/50">
              <EditableImage
                src={featuredDish.image}
                alt={featuredDish.imageAlt}
                onSave={(value) => handleFeaturedDishUpdate('image', value)}
                variant="portfolio"
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-background/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1">
                      <EditableText
                        value={featuredDish.title}
                        onSave={(value) => handleFeaturedDishUpdate('title', value)}
                        className="font-bold text-sm sm:text-base lg:text-lg"
                      />
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <EditableText
                        value={featuredDish.description}
                        onSave={(value) => handleFeaturedDishUpdate('description', value)}
                        className="text-xs sm:text-sm text-muted-foreground"
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                      <EditableText
                        value={featuredDish.price}
                        onSave={(value) => handleFeaturedDishUpdate('price', value)}
                        className="text-lg sm:text-xl lg:text-2xl font-bold text-primary"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-2 text-xs sm:text-sm"
                      onClick={handleAddToCart}
                    >
                      Заказать
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
