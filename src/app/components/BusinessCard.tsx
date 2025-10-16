'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Business } from '@/types/business';

interface BusinessCardProps {
  business: Business;
  isSubscribed?: boolean;
  onSubscribe?: (businessId: string) => void;
}

export function BusinessCard({ business, isSubscribed = false, onSubscribe }: BusinessCardProps) {
  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubscribe?.(business.id);
  };

  return (
    <Link href={`/${business.slug}`} className="block group">
      <div className="h-full rounded-xl border border-gray-800 bg-[#0d0d0d] hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden flex flex-col">
        {/* Accent line on top */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Cover Image */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          {business.cover_image_url ? (
            <Image
              src={business.cover_image_url}
              alt={business.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-orange-300/5 flex items-center justify-center relative overflow-hidden">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <Package className="w-20 h-20 text-orange-500/30 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
          )}
          
          {/* Logo Badge with glow */}
          {business.logo_url && (
            <div className="absolute bottom-4 left-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#0d0d0d] shadow-2xl overflow-hidden bg-white group-hover:scale-110 group-hover:shadow-orange-500/50 transition-all duration-300">
              <Image
                src={business.logo_url}
                alt={`${business.name} logo`}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <Badge 
              variant="secondary" 
              className="bg-black/80 backdrop-blur-md border border-gray-700 font-medium shadow-lg text-gray-200 hover:bg-orange-500/90 hover:text-white transition-colors"
            >
              {business.category}
            </Badge>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-4 bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]">
          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
              {business.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {business.description}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-600" />
            <span className="line-clamp-1">{business.city}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm pt-2 border-t border-gray-800/50">
            {business.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-200">{business.rating.toFixed(1)}</span>
                {business.reviews_count && (
                  <span className="text-gray-600">({business.reviews_count})</span>
                )}
              </div>
            )}
            
            {business.subscribers_count !== undefined && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Users className="w-4 h-4" />
                <span className="font-medium">{business.subscribers_count.toLocaleString()}</span>
              </div>
            )}

            {business.products_count !== undefined && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <Package className="w-4 h-4" />
                <span className="font-medium">{business.products_count}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer with CTA */}
        <div className="p-4 border-t border-gray-800/50 bg-[#0a0a0a]">
          <button
            onClick={handleSubscribe}
            className={`w-full font-semibold rounded-lg px-4 py-3 transition-all duration-300 transform hover:scale-[1.02] ${
              isSubscribed 
                ? 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-300' 
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/30'
            }`}
          >
            {isSubscribed ? (
              <span className="flex items-center justify-center gap-2">
                <span className="text-green-400">✓</span> Подписка оформлена
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="text-lg">+</span> Подписаться
              </span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
