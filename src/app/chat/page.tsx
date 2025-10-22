"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { chatApi, businessesApi } from "@/lib/rust-api";
import type { ChatMessage, ProductSuggestion, Conversation } from "@/types/chat";
import type { Business } from "@/types/business";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Loader2, 
  Home, 
  Bot, 
  User as UserIcon, 
  Store,
  ShoppingCart,
  MessageSquare,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadInitialData = async () => {
    try {
      // Load businesses for context selection
      const businessData = await businessesApi.getAll();
      setBusinesses(businessData);

      // Load conversations history
      const convos = await chatApi.getConversations();
      setConversations(convos);

      // Load quick suggestions
      const quickSuggestions = await chatApi.getSuggestions();
      setSuggestions(quickSuggestions);
    } catch (error) {
      console.error("Failed to load chat data:", error);
      toast.error("Не удалось загрузить данные чата");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    // Add user message to UI
    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      user_id: user?.id || "",
      role: "user" as any,
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      // Send to AI
      const response = await chatApi.sendMessage({
        user_id: user?.id,
        username: user?.name || undefined,
        message: userMessage,
        business_id: selectedBusiness?.id,
      });

      // Add AI response
      setMessages((prev) => [...prev, response.message]);

      // Update product suggestions if any
      if (response.suggestions && response.suggestions.length > 0) {
        setProductSuggestions(response.suggestions);
      }

      toast.success("Сообщение отправлено");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Не удалось отправить сообщение");
      
      // Add error message
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        user_id: "system",
        role: "assistant" as any,
        content: "Извините, произошла ошибка. Попробуйте снова.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
              <Bot className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                AI Помощник FODI
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </h1>
              <p className="text-gray-400 text-sm">Задайте любой вопрос о бизнесах и продуктах</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Главная
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Business Selection & History */}
          <div className="lg:col-span-1 space-y-4">
            {/* Business Context */}
            <Card className="bg-[#0d0d0d] border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Store className="w-4 h-4 text-orange-400" />
                  Контекст бизнеса
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={!selectedBusiness ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedBusiness(null)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Общий чат
                </Button>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {businesses.slice(0, 5).map((business) => (
                    <Button
                      key={business.id}
                      variant={selectedBusiness?.id === business.id ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setSelectedBusiness(business)}
                    >
                      {business.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            {conversations.length > 0 && (
              <Card className="bg-[#0d0d0d] border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">История бесед</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs text-gray-400">
                    {conversations.slice(0, 3).map((conv) => (
                      <div key={conv.id} className="p-2 rounded bg-gray-800/50 hover:bg-gray-800 cursor-pointer">
                        {conv.title || "Беседа"}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-[#0d0d0d] border-gray-800 h-[calc(100vh-180px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Начните разговор с AI</h3>
                      <p className="text-gray-400 text-sm">Выберите подсказку ниже или задайте свой вопрос</p>
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-orange-500"
                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                    }`}>
                      {msg.role === "user" ? (
                        <UserIcon className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message */}
                    <div className={`flex-1 max-w-[80%] ${msg.role === "user" ? "items-end" : ""}`}>
                      <div className={`rounded-2xl p-4 ${
                        msg.role === "user"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {new Date(msg.created_at).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {sending && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Product Suggestions */}
              {productSuggestions.length > 0 && (
                <div className="border-t border-gray-800 p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-orange-400" />
                    Рекомендованные продукты
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {productSuggestions.map((product) => (
                      <div
                        key={product.product_id}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-orange-500/50 transition-all"
                      >
                        <div className="flex gap-3">
                          {product.product_image_url && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.product_image_url}
                                alt={product.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-semibold text-white truncate">{product.product_name}</h5>
                            <p className="text-xs text-gray-400 line-clamp-2">{product.reason}</p>
                            <p className="text-orange-400 font-bold mt-1">₽{product.product_price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Suggestions */}
              {messages.length === 0 && suggestions.length > 0 && (
                <div className="border-t border-gray-800 p-4">
                  <p className="text-xs text-gray-400 mb-2">Быстрые вопросы:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-500/20 hover:border-orange-500 transition-all"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t border-gray-800 p-4">
                <div className="flex gap-3">
                  <Input
                    placeholder={selectedBusiness ? `Спросите о ${selectedBusiness.name}...` : "Задайте вопрос AI..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={sending}
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || sending}
                    className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 text-black"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
