'use client';

import React from 'react';
import type { Business } from '@/types/business';
import { BusinessCard } from './BusinessCard';

interface BusinessGridProps {
  businesses: Business[];
  subscribedBusinessIds?: Set<string>;
  onSubscribe?: (businessId: string) => void;
}

export function BusinessGrid({ 
  businesses, 
  subscribedBusinessIds = new Set(), 
  onSubscribe 
}: BusinessGridProps) {
  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl font-semibold text-muted-foreground">
          Нет доступных бизнесов
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Попробуйте изменить фильтры или вернитесь позже
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          isSubscribed={subscribedBusinessIds.has(business.id)}
          onSubscribe={onSubscribe}
        />
      ))}
    </div>
  );
}
