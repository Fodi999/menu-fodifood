// 🍱 Типы продуктов с привязкой к бизнесу

export interface Product {
  id: string;
  business_id: string; // 🆕 Привязка к бизнесу (мультитенант)
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
  ingredients?: string[];
  calories?: number;
  weight?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  business_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  ingredients?: string[];
  calories?: number;
  weight?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  is_available?: boolean;
}
