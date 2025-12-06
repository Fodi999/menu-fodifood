'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Truck, Clock, CreditCard, Shield } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { useState } from 'react';

export function Delivery() {
  const { isEditMode } = useRestaurant();
  
  const [deliveryData, setDeliveryData] = useState({
    title: 'Dostawa i płatność',
    subtitle: 'Dbamy o to, aby zamówienie dotarło szybko i w idealnym stanie',
    promoTitle: 'Darmowa dostawa od 100 zł',
    promoDescription: 'Minimalna wartość zamówienia - 30 zł. Koszt dostawy - 10 zł.',
  });

  const [features, setFeatures] = useState([
    {
      id: 1,
      icon: Truck,
      title: 'Szybka dostawa',
      description: 'Dostarczymy zamówienie w 30-45 minut',
    },
    {
      id: 2,
      icon: Clock,
      title: 'Czynne do 22:00',
      description: 'Zamawiaj w dogodnym dla Ciebie czasie',
    },
    {
      id: 3,
      icon: CreditCard,
      title: 'Wygodna płatność',
      description: 'Gotówką, kartą lub online',
    },
    {
      id: 4,
      icon: Shield,
      title: 'Gwarancja jakości',
      description: 'Świeże produkty i bezpieczne opakowanie',
    },
  ]);

  const handleUpdate = (field: string, value: string) => {
    setDeliveryData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureUpdate = (id: number, field: string, value: string) => {
    setFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <EditableText
              value={deliveryData.title}
              onSave={(value) => handleUpdate('title', value)}
              
              className="text-4xl font-bold"
            />
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <EditableText
              value={deliveryData.subtitle}
              onSave={(value) => handleUpdate('subtitle', value)}
              
              multiline
              className="text-xl text-muted-foreground"
            />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                <EditableText
                  value={feature.title}
                  onSave={(value) => handleFeatureUpdate(feature.id, 'title', value)}
                  
                  className="font-bold text-lg"
                />
              </h3>
              <p className="text-muted-foreground">
                <EditableText
                  value={feature.description}
                  onSave={(value) => handleFeatureUpdate(feature.id, 'description', value)}
                  
                  multiline
                  className="text-muted-foreground"
                />
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 sm:p-12 border border-border/50 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            <EditableText
              value={deliveryData.promoTitle}
              onSave={(value) => handleUpdate('promoTitle', value)}
              
              className="text-2xl sm:text-3xl font-bold"
            />
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            <EditableText
              value={deliveryData.promoDescription}
              onSave={(value) => handleUpdate('promoDescription', value)}
              
              multiline
              className="text-lg text-muted-foreground"
            />
          </p>
          <Button size="lg" className="gap-2">
            Złóż zamówienie
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
