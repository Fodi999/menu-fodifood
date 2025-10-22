// 🏢 Типы для мультитенантной системы бизнесов

export interface Business {
  id: string;
  slug: string; // URL-friendly название (например: "sushi-paradise")
  name: string;
  description: string;
  category: BusinessCategory;
  city: string;
  address: string;
  phone: string;
  email: string;
  website?: string; // Веб-сайт бизнеса
  logo_url?: string;
  cover_image_url?: string;
  is_active: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
  
  // Статистика (для карточки)
  rating?: number;
  reviews_count?: number;
  products_count?: number;
  subscribers_count?: number;
}

export enum BusinessCategory {
  RESTAURANT = "restaurant",
  CAFE = "cafe",
  BAKERY = "bakery",
  SUSHI = "sushi",
  PIZZA = "pizza",
  FASTFOOD = "fastfood",
  HEALTHY = "healthy",
  DESSERTS = "desserts",
  OTHER = "other"
}

export interface CreateBusinessDto {
  name: string;
  slug: string;
  description: string;
  category: BusinessCategory;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
}

export interface UpdateBusinessDto extends Partial<CreateBusinessDto> {
  is_active?: boolean;
  cover_image_url?: string;
}

export interface BusinessFilters {
  category?: BusinessCategory;
  city?: string;
  is_active?: boolean;
  search?: string;
}

// Subscription (подписка пользователя на бизнес)
export interface Subscription {
  id: string;
  user_id: string;
  business_id: string;
  created_at: string;
}
