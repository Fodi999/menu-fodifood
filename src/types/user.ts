// 👤 Типы пользователей с ролями

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  
  // Для бизнес-владельцев
  business_id?: string; // ID бизнеса, которым владеет
  subscription_tier?: SubscriptionTier;
  subscription_expires_at?: string;
}

export enum UserRole {
  USER = "user",               // Обычный пользователь (бесплатно)
  BUSINESS_OWNER = "business_owner", // Владелец бизнеса ($19/mo)
  INVESTOR = "investor",       // Инвестор (доступ к портфолио)
  ADMIN = "admin"              // Системный администратор (полный доступ)
}

export enum SubscriptionTier {
  FREE = "free",               // Бесплатный план (просмотр + заказы)
  BUSINESS = "business"        // Business план ($19/mo)
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  avatar_url?: string;
}
