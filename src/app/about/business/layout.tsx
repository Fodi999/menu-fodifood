import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Для бизнеса | FODI Market",
  description: "FODI для бизнеса: цифровые витрины, AI-помощники, подписки, аналитика продаж, программы лояльности и безопасность. Начните бесплатно!",
  keywords: ["для бизнеса", "цифровая витрина", "AI-помощник", "аналитика продаж", "подписки", "FODI"],
  openGraph: {
    title: "Для бизнеса | FODI Market",
    description: "FODI для бизнеса: цифровые витрины, AI-помощники, аналитика продаж и программы лояльности.",
    type: "website",
  },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
