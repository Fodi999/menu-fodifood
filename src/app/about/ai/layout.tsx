import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-интеллект FODI | FODI Market",
  description: "Архитектура AI-интеллекта FODI: Rust Gateway, MCP Server и OpenAI-интеграция для анализа и рекомендаций в реальном времени.",
  keywords: ["AI", "Rust Gateway", "OpenAI", "MCP Server", "Machine Learning", "FODI", "искусственный интеллект"],
  openGraph: {
    title: "AI-интеллект FODI | FODI Market",
    description: "Архитектура AI-интеллекта FODI: Rust Gateway, MCP Server и OpenAI-интеграция для анализа и рекомендаций в реальном времени.",
    type: "website",
  },
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
