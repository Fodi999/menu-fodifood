"use client";

import { motion } from "framer-motion";
import { Network, Lock, Zap, Server, ArrowRight } from "lucide-react";
import { SectionHeader } from "../../components/SectionHeader";
import { BackButton } from "../../components/BackButton";
import { AnimatedSection } from "../../components/AnimatedSection";
import Link from "next/link";

export default function MCPPage() {
  const features = [
    {
      icon: <Network className="w-10 h-10 text-orange-400" />,
      title: "Координация модулей",
      desc: "MCP Server управляет взаимодействием между Rust Gateway, OpenAI, базой данных и фронтендом."
    },
    {
      icon: <Lock className="w-10 h-10 text-green-400" />,
      title: "Безопасность данных",
      desc: "Все запросы проходят через MCP с проверкой прав доступа, шифрованием и аудитом."
    },
    {
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
      title: "Асинхронная обработка",
      desc: "MCP обрабатывает запросы асинхронно, не блокируя UI и поддерживая до 50K req/min."
    },
    {
      icon: <Server className="w-10 h-10 text-blue-400" />,
      title: "Гибкая маршрутизация",
      desc: "Динамическая маршрутизация запросов в зависимости от типа данных и приоритета."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />

        <SectionHeader
          title="MCP Server"
          subtitle="Model Context Protocol — координационный уровень, управляющий взаимодействием между AI-агентами, данными и пользовательским интерфейсом."
        />

        {/* Overview */}
        <AnimatedSection>
          <div className="bg-gradient-to-br from-orange-900/20 to-yellow-900/10 border border-orange-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <Network className="w-16 h-16 text-orange-400 flex-shrink-0" />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Что такое MCP?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Model Context Protocol (MCP) — это middleware-слой, который координирует работу всех компонентов AI-системы.
                  Он получает запросы от фронтенда, маршрутизирует их к нужным сервисам (Rust Gateway, OpenAI, база данных)
                  и возвращает результат клиенту.
                </p>
                <p className="text-gray-400 text-sm">
                  MCP обеспечивает гибкость: если нужно добавить новую AI-модель или изменить логику,
                  достаточно обновить конфигурацию MCP — без изменения кода фронтенда или backend.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Features Grid */}
        <AnimatedSection>
          <section className="grid sm:grid-cols-2 gap-8 mt-16">
            {features.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-8 bg-[#111]/70 border border-gray-800 rounded-xl hover:border-orange-500/40 transition-all"
              >
                <div className="space-y-4">
                  {item.icon}
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </section>
        </AnimatedSection>

        {/* Architecture Flow */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Поток данных через MCP</h3>
            <div className="relative pl-8 before:absolute before:top-2 before:bottom-2 before:left-3 before:w-[1px] before:bg-gradient-to-b before:from-orange-500/50 before:via-yellow-500/50 before:to-green-500/50 space-y-4 text-gray-300 leading-relaxed">
              <p><span className="text-green-400 font-semibold">1. Frontend</span> → отправляет запрос в MCP</p>
              <p className="pl-8">↓</p>
              <p><span className="text-orange-400 font-semibold">2. MCP Server</span> → проверяет права, определяет маршрут</p>
              <p className="pl-8">↓</p>
              <p><span className="text-blue-400 font-semibold">3. Rust Gateway</span> → обрабатывает данные</p>
              <p className="pl-8">↓</p>
              <p><span className="text-purple-400 font-semibold">4. OpenAI API</span> → возвращает AI-ответ</p>
              <p className="pl-8">↓</p>
              <p><span className="text-yellow-400 font-semibold">5. MCP Server</span> → форматирует результат</p>
              <p className="pl-8">↓</p>
              <p><span className="text-green-400 font-semibold">6. Frontend</span> → отображает результат</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Benefits */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/20 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Преимущества MCP</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✅ <span className="font-semibold">Гибкость:</span> легко добавлять новые AI-модели</li>
              <li>✅ <span className="font-semibold">Безопасность:</span> централизованный контроль доступа</li>
              <li>✅ <span className="font-semibold">Масштабируемость:</span> горизонтальное масштабирование</li>
              <li>✅ <span className="font-semibold">Мониторинг:</span> полный аудит всех запросов</li>
            </ul>
          </div>
        </AnimatedSection>

        {/* Navigation */}
        <AnimatedSection>
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-800">
            <Link href="/about/ai/predictions" className="text-gray-400 hover:text-orange-400 transition-colors">
              ← AI-предсказания
            </Link>
            <Link href="/about/ai/anomaly" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
              Следующее: Обнаружение аномалий <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
