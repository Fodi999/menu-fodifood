"use client";

import { motion } from "framer-motion";
import { Cpu, Brain, Network, Shield } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";

export default function AIPage() {
  const aiBlocks = [
    {
      icon: <Cpu className="w-10 h-10 text-green-400" />,
      title: "Rust Gateway + OpenAI",
      text: "Высокопроизводительный слой взаимодействия, анализирующий данные в реальном времени.",
    },
    {
      icon: <Brain className="w-10 h-10 text-blue-400" />,
      title: "AI-предсказания",
      text: "Прогнозы выручки, трендов и поведения пользователей с использованием машинного обучения.",
    },
    {
      icon: <Network className="w-10 h-10 text-orange-400" />,
      title: "MCP Server",
      text: "AI middleware, объединяющий модели OpenAI и аналитические запросы Rust API.",
    },
    {
      icon: <Shield className="w-10 h-10 text-red-400" />,
      title: "Обнаружение аномалий",
      text: "Моментально выявляет подозрительные транзакции, фрод и нетипичное поведение пользователей.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />

        <SectionHeader
          title="AI-интеллект FODI"
          subtitle="Искусственный интеллект как движок роста, анализа и персонализации."
        />

        {/* AI FEATURES GRID */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-10">
          {aiBlocks.map((block, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="p-8 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-green-500/40 transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {block.icon}
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{block.text}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* AI ARCHITECTURE */}
        <section className="bg-gradient-to-br from-green-900/20 to-blue-900/10 border border-green-500/30 rounded-2xl p-8 mt-20 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Архитектура AI-системы
          </h2>

          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <span className="text-green-400 font-semibold">Frontend (Next.js)</span> → отправляет запросы через WebSocket
            </p>
            <p className="pl-8">↓</p>
            <p>
              <span className="text-orange-400 font-semibold">Rust Gateway</span> → маршрутизирует запросы к AI-модулям
            </p>
            <p className="pl-8">↓</p>
            <p>
              <span className="text-blue-400 font-semibold">MCP Server</span> → координирует работу AI-агентов
            </p>
            <p className="pl-8">↓</p>
            <p>
              <span className="text-purple-400 font-semibold">OpenAI API</span> → обрабатывает запросы и возвращает результат
            </p>
            <p className="pl-8">↓</p>
            <p>
              <span className="text-green-400 font-semibold">Результат</span> → визуализируется в интерфейсе FODI
            </p>
          </div>

          <div className="mt-8 p-4 bg-black/50 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400">
              ⚡ <span className="text-white font-semibold">Скорость:</span> Ответ от AI генерируется за 0.8–1.5 секунды
            </p>
            <p className="text-sm text-gray-400 mt-2">
              🔒 <span className="text-white font-semibold">Безопасность:</span> Все данные шифруются end-to-end
            </p>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/50 mt-24 py-10 bg-[#0a0a0a]/80 backdrop-blur-sm text-center">
        <p className="text-gray-500 text-sm">
          © 2025{" "}
          <span className="text-orange-400 font-semibold">FODI MARKET</span> •  
          Метавселенная цифровых бизнесов
        </p>
      </footer>
    </div>
  );
}

