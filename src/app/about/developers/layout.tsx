import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Для разработчиков | FODI Market",
  description: "FODI для разработчиков: REST API, SDK, документация, open-source инструменты, плагины и хакатоны. Начните интеграцию с @fodi/sdk.",
  keywords: ["API", "SDK", "разработчики", "документация", "open-source", "интеграция", "FODI"],
  openGraph: {
    title: "Для разработчиков | FODI Market",
    description: "FODI для разработчиков: REST API, SDK, документация и open-source инструменты.",
    type: "website",
  },
};

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
