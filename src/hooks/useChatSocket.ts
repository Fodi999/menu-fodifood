import { useEffect, useRef, useState } from "react";

const RUST_BOT_URL = process.env.NEXT_PUBLIC_RUST_BOT_URL!.replace("http", "ws");

export function useChatSocket() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Проверка на клиентской стороне
    if (typeof window === "undefined") return;

    async function connect() {
      try {
        console.log("🔌 Attempting to connect to:", `${RUST_BOT_URL}/ws`);

        // 🔑 Получаем JWT токен из localStorage (наша система авторизации)
        const token = localStorage.getItem("token");
        
        console.log("🔑 Token status:", {
          exists: !!token,
          length: token?.length || 0,
          preview: token ? token.substring(0, 20) + "..." : "null"
        });

        // 🌐 Подключаемся к Rust WebSocket серверу с токеном
        const wsUrl = token 
          ? `${RUST_BOT_URL}/ws?token=${encodeURIComponent(token)}`
          : `${RUST_BOT_URL}/ws`;

        console.log("🌐 WebSocket URL:", wsUrl.replace(/token=[^&]+/, "token=***"));

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("✅ Connected to Rust bot at", wsUrl.replace(/token=[^&]+/, "token=***"));
          setIsConnected(true);
          setMessages((prev) => [...prev, "🤖 Подключено к FodiFood Bot"]);
        };

        socket.onmessage = (event) => {
          console.log("📨 Received raw:", event.data);
          
          try {
            const data = JSON.parse(event.data);
            console.log("📦 Parsed JSON:", data);
            
            if (data.type === "error") {
              console.error("❌ Error from bot:", data.message);
              setMessages((prev) => [...prev, `⚠️ Ошибка: ${data.message}`]);
              
              // Если ошибка аутентификации, показываем подсказку
              if (data.message.includes("authenticated")) {
                console.error("🔐 Authentication failed. Please login first!");
                setMessages((prev) => [...prev, `💡 Совет: Войдите в систему через /auth/signin`]);
              }
            } else if (data.type === "auth_success") {
              console.log("✅ Auth success:", data);
              
              // 💾 Сохраняем имя пользователя
              const userName = data.name || data.email || "пользователь";
              localStorage.setItem("userName", userName);
              
              setMessages((prev) => [
                ...prev,
                `🎉 Успешная авторизация! Добро пожаловать, ${userName}!`
              ]);
            } else if (data.type === "chat_response") {
              console.log("🤖 AI response:", data.text);
              const prefix = data.from_ai ? "🤖" : "👤";
              setMessages((prev) => [...prev, `${prefix} ${data.text}`]);
            } else if (data.type === "message" || data.message) {
              const text = data.message || data.text || JSON.stringify(data);
              console.log("✅ Bot message:", text);
              setMessages((prev) => [...prev, `🤖 ${text}`]);
            } else {
              // Неизвестный формат JSON
              console.warn("⚠️ Unknown JSON format:", data);
              setMessages((prev) => [...prev, `🤖 ${JSON.stringify(data)}`]);
            }
          } catch (error) {
            // Если не JSON, просто добавляем как текст
            console.log("📝 Plain text message:", event.data);
            setMessages((prev) => [...prev, `🤖 ${event.data}`]);
          }
        };

        socket.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          console.error("🔍 URL was:", wsUrl.replace(/token=[^&]+/, "token=***"));
          console.error("💡 Make sure Rust bot is running on port 8000");
          setIsConnected(false);
          setMessages((prev) => [...prev, "⚠️ Ошибка соединения с ботом"]);
        };

        socket.onclose = (event) => {
          console.log("❌ Disconnected from Rust bot");
          console.log("🔍 Close code:", event.code, "Reason:", event.reason);
          setIsConnected(false);
          setMessages((prev) => [...prev, "⚠️ Соединение закрыто"]);
        };
      } catch (err) {
        console.error("🚨 Ошибка подключения:", err);
        setMessages((prev) => [...prev, "⚠️ Ошибка при инициализации WebSocket"]);
        setIsConnected(false);
      }
    }

    connect();

    // 🔌 Закрываем сокет при размонтировании компонента
    return () => {
      console.log("🔌 Closing WebSocket connection");
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      // Отправляем как JSON с явным типом "chat" (IncomingMessage::Chat)
      const message = JSON.stringify({ type: "chat", text });
      console.log("📤 Sending:", message);
      socketRef.current.send(message);
      setMessages((prev) => [...prev, `🧑 ${text}`]);
    } else {
      console.error("WebSocket is not connected");
      setMessages((prev) => [...prev, "⚠️ Соединение не активно"]);
    }
  };

  return { messages, sendMessage, isConnected };
}
