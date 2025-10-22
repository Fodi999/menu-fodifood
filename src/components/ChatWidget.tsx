"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  Maximize2,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { chatApi } from "@/lib/rust-api";

interface ChatWidgetProps {
  userId: string;
  userName?: string | null;
  size?: 'compact' | 'full';
  className?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatWidget({ 
  userId, 
  userName, 
  size = 'compact',
  className = '' 
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    "Что бы вы порекомендовали на сегодня?",
    "Найди мне что-то новое",
    "Покажи популярные блюда",
    "Какие у вас акции?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage({
        user_id: userId,
        username: userName || undefined, // Передаем имя для персонализации
        message: textToSend,
        business_id: undefined // Personal recommendations
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: typeof response.message === 'string' 
          ? response.message 
          : response.message?.content || "Извините, не могу ответить прямо сейчас.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Произошла ошибка. Попробуйте ещё раз.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (size === 'compact' && !isExpanded) {
    return (
      <Card className={`bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-orange-500/10 border-purple-500/30 backdrop-blur-xl overflow-hidden ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-5 h-5 text-purple-400 animate-ping opacity-20">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            AI Рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Welcome Message */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20">
            <p className="text-sm text-gray-300 mb-2">
              Привет{userName ? `, ${userName}` : ''}! 👋
            </p>
            <p className="text-xs text-gray-400">
              Я могу помочь найти идеальное блюдо, учитывая твои предпочтения и историю заказов.
            </p>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-400 mb-2">
              Быстрые вопросы:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setIsExpanded(true);
                    setTimeout(() => handleQuickSuggestion(suggestion), 100);
                  }}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 text-xs text-gray-300"
                >
                  <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0 text-purple-400" />
                  <span className="truncate">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Expand Button */}
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Открыть чат
          </Button>

          {/* Link to Full Chat */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
          >
            <Link href="/chat">
              Полная версия чата
              <ArrowRight className="w-3 h-3 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Expanded or Full Size View
  return (
    <Card className={`bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-orange-500/10 border-purple-500/30 backdrop-blur-xl overflow-hidden ${className}`}>
      <CardHeader className="pb-3 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-5 h-5 text-purple-400 animate-ping opacity-20">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            AI Ассистент
          </CardTitle>
          {size === 'compact' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white"
            >
              Свернуть
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-3">
                <MessageCircle className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Задайте мне вопрос или выберите<br />быстрое предложение ниже
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-gray-200 border border-purple-500/30'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg px-3 py-2 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick Suggestions */}
        {messages.length === 0 && (
          <div className="px-4 pb-3 border-t border-purple-500/20">
            <div className="flex flex-wrap gap-2 pt-3">
              {quickSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 text-xs transition-all"
                  onClick={() => handleQuickSuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-purple-500/20 bg-gray-900/30">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Спросите что-нибудь..."
              disabled={isLoading}
              className="flex-1 bg-gray-800/50 border-purple-500/30 focus:border-purple-500/60 text-white placeholder:text-gray-500"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Link to Full Chat */}
          <Button
            asChild
            variant="link"
            size="sm"
            className="w-full mt-2 text-purple-400 hover:text-purple-300"
          >
            <Link href="/chat">
              <ArrowRight className="w-3 h-3 mr-1" />
              Перейти к полной версии чата
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
