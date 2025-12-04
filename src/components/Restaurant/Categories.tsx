'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { useState } from 'react';
import { Fish, Package, Soup, Salad, Coffee, Cake } from 'lucide-react';

export function Categories() {
  const { isEditMode } = useRestaurant();
  
  const [sectionData, setSectionData] = useState({
    title: 'Категории',
    subtitle: 'Выберите категорию и найдите свое любимое блюдо'
  });

  const [categories, setCategories] = useState([
    { id: 1, name: 'Суши', icon: Fish, slug: 'sushi', count: 12 },
    { id: 2, name: 'Роллы', icon: Package, slug: 'rolls', count: 24 },
    { id: 3, name: 'Супы', icon: Soup, slug: 'soups', count: 8 },
    { id: 4, name: 'Салаты', icon: Salad, slug: 'salads', count: 10 },
    { id: 5, name: 'Напитки', icon: Coffee, slug: 'drinks', count: 15 },
    { id: 6, name: 'Десерты', icon: Cake, slug: 'desserts', count: 6 },
  ]);

  const handleSectionUpdate = (field: string, value: string) => {
    setSectionData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryUpdate = (id: number, field: string, value: string | number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <EditableText
              value={sectionData.title}
              onSave={(value) => handleSectionUpdate('title', value)}
              
              className="text-4xl font-bold"
            />
          </h2>
          <p className="text-xl text-muted-foreground">
            <EditableText
              value={sectionData.subtitle}
              onSave={(value) => handleSectionUpdate('subtitle', value)}
              
              className="text-xl text-muted-foreground"
            />
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/menu?category=${category.slug}`}>
                <div className="group bg-card rounded-2xl p-6 text-center hover:shadow-xl hover:shadow-primary/10 border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-center mb-3 text-primary group-hover:scale-110 transition-transform">
                    <category.icon className="w-12 h-12" />
                  </div>
                  <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                    <EditableText
                      value={category.name}
                      onSave={(value) => handleCategoryUpdate(category.id, 'name', value)}
                      
                      className="font-bold"
                    />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <EditableText
                      value={category.count.toString()}
                      onSave={(value) => handleCategoryUpdate(category.id, 'count', parseInt(value) || 0)}
                      
                      className="text-sm text-muted-foreground"
                    /> блюд
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
