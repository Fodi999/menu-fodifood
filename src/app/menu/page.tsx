"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from "@/components/Navigation/Navigation";
import { ScrollToTop } from "@/components/Resume/ScrollToTop";
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

// Типы данных
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  items: MenuItem[];
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // Load menu data from API
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await fetch('https://portfolio-a4yb.shuttle.app/api/restaurant/categories');
        const categoriesData = await categoriesRes.json();
        
        // Fetch menu items
        const itemsRes = await fetch('https://portfolio-a4yb.shuttle.app/api/restaurant/menu');
        const itemsData = await itemsRes.json();
        
        // Group items by category
        const categoriesWithItems: Category[] = categoriesData.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase(),
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
        
        setCategories(categoriesWithItems);
        setMenuItems(itemsData);
      } catch (error) {
        console.error('Failed to load menu:', error);
        toast.error('Błąd ładowania menu');
      } finally {
        setLoading(false);
      }
    };
    
    loadMenu();
  }, []);

  // Track menu page view
  useEffect(() => {
    analytics.trackMenuView();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (item: MenuItem) => {
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
    toast.success(`${item.name} dodano do koszyka`);
  };

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.slug === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="py-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Ładowanie menu...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">Nasze menu</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Wybierz kategorię i znajdź swoje ulubione danie
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Szukaj dań..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                Wszystkie
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Menu Items by Category */}
          {filteredCategories.map((category) => {
            const items = category.items.filter(item =>
              searchQuery === '' ||
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (items.length === 0) return null;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-8 pb-4 border-b">
                  {category.name}
                  <span className="text-muted-foreground text-lg ml-2">
                    ({items.length})
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-muted">
                          <Image
                            src={item.image_url || '/placeholder.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Favorite */}
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                favorites.includes(item.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                ${item.price}
                              </span>
                            </div>
                          </div>

                          <Button
                            className="w-full gap-2"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Do koszyka
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <ScrollToTop />
    </div>
  );
}
