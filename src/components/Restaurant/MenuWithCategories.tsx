"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Fish, Package, Soup, Salad, Coffee, Cake } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';

export function MenuWithCategories() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const { addItem } = useCart();
  const { isEditMode } = useRestaurant();
  
  const [sectionData, setSectionData] = useState({
    title: 'Наше меню',
    subtitle: 'Выберите категорию и найдите свое любимое блюдо',
  });

  const handleUpdate = (field: string, value: string) => {
    setSectionData(prev => ({ ...prev, [field]: value }));
  };

  // Данные меню по категориям
  const [menuByCategories, setMenuByCategories] = useState([
  {
    id: 1,
    name: 'Суши',
    slug: 'sushi',
    icon: Fish,
    description: 'Свежие суши и сашими',
    items: [
      { id: 101, name: 'Нигири с лососем', description: 'Свежий лосось на рисе', price: 12, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', weight: '2 шт' },
      { id: 102, name: 'Нигири с тунцом', description: 'Свежий тунец на рисе', price: 14, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop', weight: '2 шт' },
      { id: 103, name: 'Нигири с угрем', description: 'Угорь на рисе с соусом', price: 13, image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=300&fit=crop', weight: '2 шт' },
      { id: 104, name: 'Нигири с креветкой', description: 'Креветка на рисе', price: 11, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', weight: '2 шт' },
    ]
  },
  {
    id: 2,
    name: 'Роллы',
    slug: 'rolls',
    icon: Package,
    description: 'Классические и авторские роллы',
    items: [
      { id: 201, name: 'Калифорния', description: 'Краб, авокадо, огурец, икра тобико', price: 28, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', weight: '8 шт' },
      { id: 202, name: 'Филадельфия', description: 'Лосось, сливочный сыр, огурец', price: 32, image: 'https://images.unsplash.com/photo-1617196034796-ca04dd458c0d?w=400&h=300&fit=crop', weight: '8 шт' },
      { id: 203, name: 'Микс сет', description: 'Ассорти из популярных роллов', price: 85, originalPrice: 95, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', weight: '24 шт', isNew: true },
      { id: 204, name: 'Спайси тунец', description: 'Тунец, огурец, спайси соус', price: 30, image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=300&fit=crop', weight: '8 шт' },
    ]
  },
  {
    id: 3,
    name: 'Супы',
    slug: 'soups',
    icon: Soup,
    description: 'Традиционные японские супы',
    items: [
      { id: 301, name: 'Мисо суп', description: 'Традиционный японский суп', price: 8, image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop', weight: '300 мл' },
      { id: 302, name: 'Том ям', description: 'Острый тайский суп', price: 15, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', weight: '400 мл' },
      { id: 303, name: 'Рамен', description: 'Лапша в бульоне', price: 18, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', weight: '450 мл' },
      { id: 304, name: 'Удон суп', description: 'Суп с лапшой удон', price: 16, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop', weight: '400 мл' },
    ]
  },
  {
    id: 4,
    name: 'Салаты',
    slug: 'salads',
    icon: Salad,
    description: 'Свежие салаты и закуски',
    items: [
      { id: 401, name: 'Чука', description: 'Салат из водорослей', price: 10, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', weight: '150 г' },
      { id: 402, name: 'Кайсо', description: 'Микс водорослей', price: 12, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', weight: '150 г' },
      { id: 403, name: 'Салат с лососем', description: 'Свежий лосось с овощами', price: 18, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', weight: '200 г' },
      { id: 404, name: 'Салат с креветкой', description: 'Креветки с овощами', price: 16, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', weight: '200 г' },
    ]
  },
  {
    id: 5,
    name: 'Напитки',
    slug: 'drinks',
    icon: Coffee,
    description: 'Освежающие напитки',
    items: [
      { id: 501, name: 'Кока-кола', description: 'Классическая кола', price: 5, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop', weight: '330 мл' },
      { id: 502, name: 'Зеленый чай', description: 'Японский зеленый чай', price: 6, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop', weight: '250 мл' },
      { id: 503, name: 'Сок апельсиновый', description: 'Свежевыжатый сок', price: 8, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop', weight: '250 мл' },
      { id: 504, name: 'Лимонад', description: 'Домашний лимонад', price: 7, image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe1f28?w=400&h=300&fit=crop', weight: '300 мл' },
    ]
  },
  {
    id: 6,
    name: 'Десерты',
    slug: 'desserts',
    icon: Cake,
    description: 'Сладкие десерты',
    items: [
      { id: 601, name: 'Моти', description: 'Японские рисовые пирожные', price: 8, image: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=400&h=300&fit=crop', weight: '3 шт' },
      { id: 602, name: 'Тирамису', description: 'Классический итальянский десерт', price: 12, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', weight: '150 г' },
      { id: 603, name: 'Чизкейк', description: 'Нежный чизкейк', price: 11, image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop', weight: '120 г' },
      { id: 604, name: 'Мороженое', description: 'Ванильное мороженое', price: 7, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop', weight: '100 г' },
    ]
  },
  ]);

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
      image: item.image,
      weight: item.weight || '',
      categoryId: 1,
      isPopular: false,
      isAvailable: true,
      isNew: item.isNew || false,
    });
    toast.success(`${item.name} добавлен в корзину`);
  };

  // Get active category data
  const currentCategory = menuByCategories.find(cat => cat.id === activeCategory)!;

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
                        src={item.image}
                        alt={item.name}
                        onSave={(value) => handleItemUpdate(currentCategory.id, item.id, 'image', value)}
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
