'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { useState } from 'react';

export function AboutRestaurant() {
  const { isEditMode } = useRestaurant();
  
  const [aboutData, setAboutData] = useState({
    title: 'О нас',
    description1: 'FodiFood - это аутентичная японская кухня с профессиональным подходом. Наш шеф-повар с 20-летним опытом готовит каждое блюдо с любовью и вниманием к деталям.',
    description2: 'Мы используем только свежие ингредиенты и следуем традиционным японским рецептам, чтобы подарить вам незабываемый вкус настоящей Японии.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop&q=80',
    hours: 'Пн-Вс: 10:00 - 22:00',
    address: 'ul. Przykładowa 123, Warsaw',
    phone: '+48 123 456 789',
  });

  const handleUpdate = (field: string, value: string) => {
    setAboutData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-muted to-muted/50">
              <EditableImage
                src={aboutData.image}
                alt="About Restaurant"
                onSave={(value) => handleUpdate('image', value)}
                variant="portfolio"
                className="w-full h-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                priority={true}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              <EditableText
                value={aboutData.title}
                onSave={(value) => handleUpdate('title', value)}
                
                className="text-3xl sm:text-4xl font-bold"
              />
            </h2>
            <div className={`text-base sm:text-lg text-muted-foreground ${isEditMode ? 'mb-12' : 'mb-4'} sm:mb-6`}>
              <EditableText
                value={aboutData.description1}
                onSave={(value) => handleUpdate('description1', value)}
                
                multiline
                className="text-base sm:text-lg text-muted-foreground"
              />
            </div>
            <div className={`text-base sm:text-lg text-muted-foreground ${isEditMode ? 'mb-14' : 'mb-6'} sm:mb-8`}>
              <EditableText
                value={aboutData.description2}
                onSave={(value) => handleUpdate('description2', value)}
                
                multiline
                className="text-base sm:text-lg text-muted-foreground"
              />
            </div>

            <div className={`${isEditMode ? 'space-y-6' : 'space-y-3'} sm:space-y-4`}>
              <div className={`flex items-start gap-3 sm:gap-4 ${isEditMode ? 'pb-4' : ''}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Часы работы</h4>
                  <p className={`text-sm sm:text-base text-muted-foreground ${isEditMode ? 'mt-2' : ''}`}>
                    <EditableText
                      value={aboutData.hours}
                      onSave={(value) => handleUpdate('hours', value)}
                      
                      className="text-sm sm:text-base text-muted-foreground"
                    />
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-3 sm:gap-4 ${isEditMode ? 'pb-4' : ''}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Адрес</h4>
                  <p className={`text-sm sm:text-base text-muted-foreground ${isEditMode ? 'mt-2' : ''}`}>
                    <EditableText
                      value={aboutData.address}
                      onSave={(value) => handleUpdate('address', value)}
                      
                      className="text-sm sm:text-base text-muted-foreground"
                    />
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-3 sm:gap-4 ${isEditMode ? 'pb-4' : ''}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Телефон</h4>
                  <p className={`text-sm sm:text-base text-muted-foreground ${isEditMode ? 'mt-2' : ''}`}>
                    <EditableText
                      value={aboutData.phone}
                      onSave={(value) => handleUpdate('phone', value)}
                      
                      className="text-sm sm:text-base text-muted-foreground"
                    />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
