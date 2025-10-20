"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Brain, Network, Shield, Zap, Lock, Activity } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { AnimatedSection } from "../components/AnimatedSection";

export default function AIPage() {
  const aiBlocks = [
    {
      icon: <Cpu className="w-10 h-10 text-green-400" />,
      title: "Rust Gateway + OpenAI",
      text: "Высокопроизводительный шлюз, соединяющий AI-модели с реальными бизнес-данными. Обрабатывает миллионы транзакций в секунду.",
      href: "/about/ai/rust-gateway",
      color: "from-green-500/20 to-blue-500/20",
    },
    {
      icon: <Brain className="w-10 h-10 text-blue-400" />,
      title: "AI-предсказания",
      text: "Модель прогнозирует спрос, продажи и тренды. Каждый бизнес получает персональный отчёт и рекомендации для роста.",
      href: "/about/ai/predictions",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <Network className="w-10 h-10 text-orange-400" />,
      title: "MCP Server",
      text: "AI middleware, объединяющий модели OpenAI и аналитические запросы Rust API. Обеспечивает гибкость и безопасность данных.",
      href: "/about/ai/mcp",
      color: "from-orange-500/20 to-yellow-500/20",
    },
    {
      icon: <Shield className="w-10 h-10 text-red-400" />,
      title: "Обнаружение аномалий",
      text: "AI-модуль отслеживает фрод и сбои в реальном времени, уведомляя владельца при подозрительных событиях.",
      href: "/about/ai/anomaly",
      color: "from-red-500/20 to-pink-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />

        <SectionHeader
          title="AI-интеллект FODI"
          subtitle="Интеллектуальная система, анализирующая данные бизнеса в реальном времени и создающая прогнозы, рекомендации и автоматические решения."
        />

        {/* MAIN TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl font-semibold text-white">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              FODI AI Engine
            </span>{" "}
            — мозг экосистемы, превращающий данные в решения.
          </p>
        </motion.div>

        {/* AI FEATURES GRID */}
        <AnimatedSection>
          <section className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-10">
            {aiBlocks.map((block, i) => (
              <Link key={i} href={block.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-8 rounded-2xl border border-gray-800 bg-[#111]/70 
                    hover:border-orange-400/50 hover:bg-gradient-to-br ${block.color} 
                    hover:shadow-orange-400/20 transition-all duration-500 shadow-xl cursor-pointer backdrop-blur-sm`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {block.icon}
                    <h3 className="text-lg font-semibold">{block.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {block.text}
                    </p>
                    <span className="text-orange-400 text-sm font-semibold">
                      Подробнее →
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </section>
        </AnimatedSection>

        {/* AI ARCHITECTURE */}
        <AnimatedSection>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gradient-to-br from-green-900/20 to-blue-900/10 border border-green-500/30 rounded-2xl p-8 mt-20 shadow-xl hover:border-green-500/50 hover:shadow-green-500/20 backdrop-blur-sm transition-all duration-300"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">
              Архитектура AI-системы
            </h2>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Система построена по принципу <span className="text-green-400 font-semibold">гибридного искусственного интеллекта</span> —
              Rust обрабатывает данные, OpenAI анализирует и формирует смысловые выводы,
              а MCP Server управляет взаимодействием модулей.
            </p>

            <div className="relative pl-8 before:absolute before:top-2 before:bottom-2 before:left-3 before:w-[1px] before:bg-gradient-to-b before:from-green-500/50 before:via-blue-500/50 before:to-purple-500/50 space-y-4 text-gray-300 leading-relaxed">
              <p>
                <span className="text-green-400 font-semibold">Frontend (Next.js)</span> → отправляет запросы
              </p>
              <p className="pl-8">↓</p>
              <p>
                <span className="text-orange-400 font-semibold">Rust Gateway</span> → обрабатывает данные
              </p>
              <p className="pl-8">↓</p>
              <p>
                <span className="text-blue-400 font-semibold">MCP Server</span> → координирует модули
              </p>
              <p className="pl-8">↓</p>
              <p>
                <span className="text-purple-400 font-semibold">OpenAI API</span> → формирует выводы
              </p>
              <p className="pl-8">↓</p>
              <p>
                <span className="text-green-400 font-semibold">Dashboard</span> → визуализирует результат
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-yellow-500/40 flex items-center gap-3 transition-all"
              >
                <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  <span className="text-white font-semibold">Время отклика:</span> 0.8–1.5 секунды
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-green-500/40 flex items-center gap-3 transition-all"
              >
                <Lock className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  <span className="text-white font-semibold">Безопасность:</span> полное шифрование
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-blue-500/40 flex items-center gap-3 transition-all"
              >
                <Activity className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  <span className="text-white font-semibold">Масштаб:</span> до 100K req/min
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* FINAL MESSAGE */}
        <AnimatedSection>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl hover:border-gray-600/50 hover:shadow-gray-500/10 backdrop-blur-sm transition-all duration-300"
          >
            <p className="text-gray-300 text-center leading-relaxed text-lg">
              <span className="text-green-400 font-semibold">AI-интеллект</span> — это основа экосистемы FODI Market.<br/>
              Он превращает данные в ценность, делает бизнес предсказуемым и управляемым,<br/>
              и соединяет реальный рынок с цифровой экономикой.
            </p>
          </motion.div>
        </AnimatedSection>

        {/* CTA SECTION */}
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-20 space-y-4"
          >
            <Link href="/auth/signup">
              <button className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold text-xl px-12 py-5 rounded-2xl shadow-lg hover:shadow-orange-400/30 hover:scale-105 transition-all">
                Начать бесплатно
              </button>
            </Link>
            
            <Link
              href="/about/web3"
              className="block"
            >
              <p className="text-orange-400 hover:underline text-sm transition-all">
                Перейти к разделу «Web3 и Токенизация» →
              </p>
            </Link>
            
            <p className="text-sm text-gray-500 mt-3">
              Следующий раздел:{" "}
              <span className="text-orange-400 font-semibold">Web3 и Токенизация</span> — NFT, цифровая экономика и блокчейн
            </p>
          </motion.div>
        </AnimatedSection>
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

