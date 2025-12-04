'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, UtensilsCrossed } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { EditableText } from '@/components/EditableText';
import { useState } from 'react';

export function RestaurantFooter() {
  const { isEditMode } = useRestaurant();
  
  const [footerData, setFooterData] = useState({
    brandName: 'FodiFood',
    brandDescription: 'Аутентичная японская кухня с доставкой. Свежие ингредиенты, традиционные рецепты.',
    address: 'ul. Przykładowa 123, Warsaw, Poland',
    phone: '+48 123 456 789',
    email: 'orders@fodifood.pl',
    hours: 'Пн-Вс: 10:00 - 22:00',
    copyright: 'FodiFood. All rights reserved.',
  });

  const handleUpdate = (field: string, value: string) => {
    setFooterData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <footer className="bg-muted/50 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold mb-4">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              <EditableText
                value={footerData.brandName}
                onSave={(value) => handleUpdate('brandName', value)}
                
                className="text-2xl font-bold"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              <EditableText
                value={footerData.brandDescription}
                onSave={(value) => handleUpdate('brandDescription', value)}
                
                multiline
                className="text-sm text-muted-foreground"
              />
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="font-bold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <EditableText
                    value={footerData.address}
                    onSave={(value) => handleUpdate('address', value)}
                    
                    multiline
                    className="text-sm text-muted-foreground"
                  />
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${footerData.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                  <EditableText
                    value={footerData.phone}
                    onSave={(value) => handleUpdate('phone', value)}
                    
                    className="text-sm text-muted-foreground"
                  />
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${footerData.email}`} className="hover:text-primary transition-colors">
                  <EditableText
                    value={footerData.email}
                    onSave={(value) => handleUpdate('email', value)}
                    
                    className="text-sm text-muted-foreground"
                  />
                </a>
              </li>
            </ul>
            <div className="mt-4 text-sm">
              <p className="font-semibold mb-1">Часы работы:</p>
              <p className="text-muted-foreground">
                <EditableText
                  value={footerData.hours}
                  onSave={(value) => handleUpdate('hours', value)}
                  
                  className="text-sm text-muted-foreground"
                />
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <EditableText
              value={footerData.copyright}
              onSave={(value) => handleUpdate('copyright', value)}
              
              className="text-sm text-muted-foreground inline"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
