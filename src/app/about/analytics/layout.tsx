import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Аналитика и AI-метрики | FODI Market",
  description: "AI-аналитика FODI: статистика, метрики, прогнозирование трендов и поведения пользователей для оптимизации бизнес-решений.",
  keywords: ["аналитика", "AI метрики", "статистика", "прогнозирование", "бизнес-аналитика", "FODI"],
  openGraph: {
    title: "Аналитика и AI-метрики | FODI Market",
    description: "AI-аналитика FODI: статистика, метрики и прогнозирование для оптимизации бизнеса.",
    type: "website",
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
