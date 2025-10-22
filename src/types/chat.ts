// 💬 Типы для AI чата с коммерческой интеграцией

export interface ChatMessage {
  id: string;
  user_id: string;
  business_id?: string; // Контекст бизнеса (если в чате конкретного бизнеса)
  role: MessageRole;
  content: string;
  product_suggestions?: ProductSuggestion[]; // Рекомендации продуктов от AI
  created_at: string;
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
}

export interface ProductSuggestion {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_image_url?: string;
  reason: string; // Почему AI рекомендует этот продукт
}

export interface ChatRequest {
  user_id?: string; // User ID (автоматически из токена или явно)
  username?: string; // Имя пользователя для персонализации (используется backend)
  message: string;
  business_id?: string; // Контекст бизнеса
  conversation_id?: string; // ID беседы для контекста
}

export interface ChatResponse {
  message: ChatMessage;
  suggestions?: ProductSuggestion[];
}

export interface Conversation {
  id: string;
  user_id: string;
  business_id?: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}
