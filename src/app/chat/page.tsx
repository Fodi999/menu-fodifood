"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Wifi, WifiOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const { messages, sendMessage, isConnected } = useChatSocket();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && isConnected) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">
              AI Chat Bot
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Общайтесь с AI помощником на Rust
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                <User className="w-3 h-3 mr-1" />
                {user.name || user.email}
              </Badge>
            )}
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className={`${
                isConnected
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } flex items-center gap-2`}
            >
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  Disconnected
                </>
              )}
            </Badge>
            <Button asChild variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </div>

        {/* Auth Warning */}
        {!loading && !user && (
          <Card className="bg-yellow-500/10 border-yellow-500/20 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <LogIn className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-yellow-500 font-semibold mb-1">Требуется авторизация</p>
                  <p className="text-sm text-yellow-400/80 mb-3">
                    Для использования AI чата необходимо войти в систему
                  </p>
                  <Button asChild size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Link href="/auth/signin">Войти</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-orange-500" />
              Чат с AI
            </CardTitle>
            <CardDescription className="text-gray-400">
              Задавайте вопросы и получайте ответы в реальном времени
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Messages Area */}
            <ScrollArea className="h-[400px] sm:h-[500px] rounded-xl bg-gray-900 p-4 mb-4">
              <div ref={scrollRef} className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-20">
                    <Bot className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p>Начните разговор...</p>
                    <p className="text-sm mt-2">Отправьте сообщение чтобы начать</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isBot = msg.startsWith("🤖");
                    const text = msg.slice(2); // Убираем эмодзи
                    
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 ${
                          isBot ? "" : "flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isBot
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {isBot ? (
                            <Bot className="w-5 h-5 text-white" />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div
                          className={`flex-1 rounded-lg p-3 ${
                            isBot
                              ? "bg-gray-800 text-gray-200"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          <p className="text-sm sm:text-base break-words">{text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!isConnected}
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
                placeholder={
                  isConnected
                    ? "Напишите сообщение..."
                    : "Подключение к серверу..."
                }
              />
              <Button
                type="submit"
                disabled={!isConnected || !input.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>

            {/* Connection Info */}
            {!isConnected && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-500 text-sm flex items-center gap-2">
                  <WifiOff className="w-4 h-4" />
                  Не удалось подключиться к Rust боту. Убедитесь что сервер запущен на {process.env.NEXT_PUBLIC_RUST_BOT_URL}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-lg">ℹ️ Информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-400">
            <p>• WebSocket URL: <code className="text-orange-400">{process.env.NEXT_PUBLIC_RUST_BOT_URL}/ws</code></p>
            <p>• Статус: <span className={isConnected ? "text-green-400" : "text-red-400"}>
              {isConnected ? "Подключено" : "Отключено"}
            </span></p>
            <p>• Сообщений: <span className="text-white">{messages.length}</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
