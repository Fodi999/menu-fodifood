"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const RUST_BOT_URL = process.env.NEXT_PUBLIC_RUST_BOT_URL?.replace("http", "ws") || "ws://127.0.0.1:8000";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("гость");
  const endRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // 👋 Анимация приветствия при загрузке
  useEffect(() => {
    // Загружаем имя из localStorage при монтировании
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("userName");
      if (savedName) {
        setUserName(savedName);
      }
    }

    const greetingTimer = setTimeout(() => {
      setShowGreeting(true);
      
      // Автоматически скрываем приветствие через 5 секунд
      setTimeout(() => {
        setShowGreeting(false);
      }, 5000);
    }, 1500);

    return () => clearTimeout(greetingTimer);
  }, []);

  // 🌐 WebSocket подключение к Rust боту
  useEffect(() => {
    if (typeof window === "undefined") return;

    const connectWebSocket = () => {
      try {
        const token = localStorage.getItem("token");
        const wsUrl = token 
          ? `${RUST_BOT_URL}/ws?token=${encodeURIComponent(token)}`
          : `${RUST_BOT_URL}/ws`;

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("✅ Connected to Rust bot");
          setIsConnected(true);
          
          // Получаем имя из localStorage (если уже авторизован)
          const savedName = localStorage.getItem("userName") || "гость";
          
          setMessages([
            {
              sender: "bot",
              text: `👋 Привет, ${savedName}! Я FodiFood Bot — помогу с меню, заказом или рекомендациями!`,
            },
          ]);
        };

        socket.onmessage = (event) => {
          console.log("📨 Received:", event.data);
          
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === "error") {
              setMessages((prev) => [...prev, { sender: "bot", text: `⚠️ ${data.message}` }]);
            } else if (data.type === "auth_success") {
              // 💾 Сохраняем имя (или id, если имени нет)
              const userName = data.name || data.email || "пользователь";
              localStorage.setItem("userName", userName);
              setUserName(userName); // ✅ обновляем состояние

              setMessages((prev) => [
                ...prev,
                {
                  sender: "bot",
                  text: `🎉 Авторизация успешна! Добро пожаловать, ${userName}!`,
                },
              ]);
            } else if (data.type === "chat_response") {
              setBotTyping(false);
              setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);
              
              // 🔔 Звуковое уведомление при ответе бота
              try {
                new Audio("/sounds/message.mp3").play().catch(() => {
                  console.log("Sound not available");
                });
              } catch (e) {
                console.log("Audio not supported");
              }
            } else if (data.message) {
              setBotTyping(false);
              setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
            }
          } catch (error) {
            setBotTyping(false);
            setMessages((prev) => [...prev, { sender: "bot", text: event.data }]);
          }
        };

        socket.onerror = () => {
          console.error("❌ WebSocket error");
          setIsConnected(false);
        };

        socket.onclose = () => {
          console.log("❌ Disconnected from Rust bot");
          setIsConnected(false);
        };
      } catch (err) {
        console.error("🚨 Connection error:", err);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");

    // Скрываем приветствие при первом сообщении
    setShowGreeting(false);

    // 🚀 Отправка сообщения в Rust WebSocket
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setBotTyping(true);
      socketRef.current.send(JSON.stringify({ type: "chat", text: userMessage }));
      console.log("📤 Sent to bot:", userMessage);
    } else {
      // Fallback если WebSocket не подключен
      setBotTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "⚠️ Подключение к боту отсутствует. Пожалуйста, перезагрузите страницу.",
          },
        ]);
        setBotTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed right-4 bottom-6 z-50">
      {/* 💬 Анимированное приветствие с именем пользователя */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-20 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm px-4 py-3 rounded-xl shadow-xl whitespace-nowrap mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">👋</span>
              <div>
                <div className="font-semibold">
                  Привет, {userName}!
                </div>
                <div className="text-xs text-blue-100">Есть вопросы? Я помогу!</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              boxShadow: "0 0 20px rgba(59,130,246,0.2)" 
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0"
          >
            <Card className="w-80 sm:w-96 backdrop-blur-md bg-gray-900/80 text-white border border-gray-700/50 shadow-2xl rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-blue-600 text-sm py-3 px-4 font-semibold">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>🤖</AvatarFallback>
                  </Avatar>
                  FodiFood Bot
                  <Badge className={`ml-2 ${isConnected ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                    {isConnected ? 'online' : 'offline'}
                  </Badge>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 hover:bg-blue-700 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-0 bg-gradient-to-b from-gray-800/60 to-gray-900/90">
                <ScrollArea className="h-80 px-4 py-3 text-sm">
                  <div className="space-y-3">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.sender === "bot" ? "justify-start" : "justify-end"
                        }`}
                      >
                        {msg.sender === "bot" && (
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>🤖</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[75%] px-3 py-2 rounded-xl ${
                            msg.sender === "bot"
                              ? "bg-gray-800 text-gray-100"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {botTyping && (
                      <div className="flex items-center gap-1 text-gray-400 text-xs pl-8">
                        <motion.span
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}
                        />
                      </div>
                    )}
                    <div ref={endRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="border-t border-gray-700/50 backdrop-blur-sm bg-gray-800/60 p-3 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Введите сообщение..."
                  className="bg-gray-700 text-white border-gray-600 focus-visible:ring-1 focus-visible:ring-blue-500"
                  autoComplete="off"
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-blue-700/40 transition-all duration-200 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="default"
          size="icon"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setShowGreeting(false); // Скрываем приветствие при открытии чата
            }
          }}
          className="h-14 w-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  );
}
