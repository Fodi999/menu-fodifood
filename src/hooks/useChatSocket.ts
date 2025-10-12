import { useEffect, useRef, useState } from "react";

const RUST_BOT_URL = process.env.NEXT_PUBLIC_RUST_BOT_URL!.replace("http", "ws");

export function useChatSocket() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Проверка на клиентской стороне
    if (typeof window === "undefined") return;

    const socket = new WebSocket(`${RUST_BOT_URL}/ws`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to Rust bot");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, `🤖 ${event.data}`]);
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log("❌ Disconnected from Rust bot");
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(text);
      setMessages((prev) => [...prev, `🧑 ${text}`]);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return { messages, sendMessage, isConnected };
}
