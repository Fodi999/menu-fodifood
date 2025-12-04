'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { useState } from 'react';
import { ChefHat, Users, Star, Award } from 'lucide-react';

export function OurTeam() {
  const { isEditMode } = useRestaurant();
  
  const [sectionData, setSectionData] = useState({
    title: 'Наша команда',
    subtitle: 'Профессионалы своего дела с многолетним опытом работы в японской кухне',
  });

  const [team, setTeam] = useState([
    {
      id: 1,
      name: 'Хироси Танака',
      position: 'Шеф-повар',
      experience: '20 лет опыта',
      description: 'Обучался в Токио, мастер традиционной японской кухни',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=400&fit=crop',
      icon: ChefHat,
    },
    {
      id: 2,
      name: 'Юки Сато',
      position: 'Су-шеф',
      experience: '15 лет опыта',
      description: 'Специалист по суши и сашими, работал в Осаке',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop',
      icon: Award,
    },
    {
      id: 3,
      name: 'Анна Ковальская',
      position: 'Администратор',
      experience: '8 лет опыта',
      description: 'Координирует работу ресторана и заботится о гостях',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      icon: Users,
    },
    {
      id: 4,
      name: 'Марек Новак',
      position: 'Старший повар',
      experience: '12 лет опыта',
      description: 'Эксперт по роллам и горячим блюдам',
      image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=400&fit=crop',
      icon: ChefHat,
    },
    {
      id: 5,
      name: 'Катажина Вишневска',
      position: 'Официант',
      experience: '5 лет опыта',
      description: 'Профессиональное обслуживание и знание меню',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
      icon: Star,
    },
    {
      id: 6,
      name: 'Павел Зелински',
      position: 'Бармен',
      experience: '7 лет опыта',
      description: 'Специалист по японским напиткам и коктейлям',
      image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop',
      icon: Star,
    },
  ]);

  const handleUpdate = (field: string, value: string) => {
    setSectionData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamUpdate = (id: number, field: string, value: string) => {
    setTeam(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            <EditableText
              value={sectionData.title}
              onSave={(value) => handleUpdate('title', value)}
              
              className="text-3xl sm:text-4xl font-bold"
            />
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            <EditableText
              value={sectionData.subtitle}
              onSave={(value) => handleUpdate('subtitle', value)}
              
              className="text-base sm:text-lg md:text-xl text-muted-foreground"
            />
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-lg sm:rounded-xl overflow-hidden border border-border/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              {/* Square Avatar */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <EditableImage
                  src={member.image}
                  alt={member.name}
                  onSave={(value) => handleTeamUpdate(member.id, 'image', value)}
                  
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                  priority={index < 6}
                />
                {/* Icon Badge */}
                <div className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <member.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>

              {/* Compact Content */}
              <div className="p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-bold mb-0.5 line-clamp-1">
                  <EditableText
                    value={member.name}
                    onSave={(value) => handleTeamUpdate(member.id, 'name', value)}
                    
                    className="text-xs sm:text-sm font-bold"
                  />
                </h3>
                
                <div className="text-xs text-primary font-semibold mb-1 line-clamp-1">
                  <EditableText
                    value={member.position}
                    onSave={(value) => handleTeamUpdate(member.id, 'position', value)}
                    
                    className="text-xs text-primary font-semibold"
                  />
                </div>

                <div className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  <EditableText
                    value={member.experience}
                    onSave={(value) => handleTeamUpdate(member.id, 'experience', value)}
                    
                    className="text-xs text-muted-foreground"
                  />
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  <EditableText
                    value={member.description}
                    onSave={(value) => handleTeamUpdate(member.id, 'description', value)}
                    
                    multiline
                    className="text-xs text-muted-foreground"
                  />
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        >
          <div className="text-center p-4 sm:p-5 lg:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">15+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Сотрудников</div>
          </div>
          <div className="text-center p-4 sm:p-5 lg:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">20+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Лет опыта</div>
          </div>
          <div className="text-center p-4 sm:p-5 lg:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Профессионалы</div>
          </div>
          <div className="text-center p-4 sm:p-5 lg:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">5★</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Рейтинг команды</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
