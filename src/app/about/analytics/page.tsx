"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Аналитика и данные"
          subtitle="AI-анализ, статистика и метрики для принятия умных решений."
        />

        <div className="grid sm:grid-cols-2 gap-8 mt-10">
          {[
            {
              icon: <BarChart3 className="w-10 h-10 text-purple-400" />,
              title: "AI-анализ данных",
              text: "Глубокая аналитика поведения пользователей, трендов и метрик бизнеса в реальном времени.",
            },
            {
              icon: <TrendingUp className="w-10 h-10 text-green-400" />,
              title: "Предиктивная аналитика",
              text: "Прогнозы роста выручки, спроса на товары и оптимизация ценообразования с помощью ML.",
            },
            {
              icon: <PieChart className="w-10 h-10 text-blue-400" />,
              title: "Визуализация метрик",
              text: "Интерактивные дашборды с графиками, диаграммами и KPI для бизнеса и инвесторов.",
            },
            {
              icon: <Activity className="w-10 h-10 text-orange-400" />,
              title: "Real-time мониторинг",
              text: "Отслеживание заказов, транзакций и активности пользователей в режиме реального времени.",
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-purple-500/40 transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {block.icon}
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <p className="text-gray-400 text-sm">{block.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Дополнительная секция с примером метрик */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 border border-gray-800 rounded-xl bg-[#111]/50"
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ключевые метрики платформы
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: "Активных бизнесов", value: "150+" },
              { label: "Обработано заказов", value: "10,000+" },
              { label: "Общий объём токенов", value: "5M FODI" },
            ].map((metric, i) => (
              <div key={i} className="text-center p-6 bg-[#0a0a0a]/50 rounded-lg">
                <div className="text-3xl font-bold text-orange-400 mb-2">{metric.value}</div>
                <div className="text-gray-400 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
