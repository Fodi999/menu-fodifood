"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Database, Shield, ArrowRight, Brain, Activity, Lock, Rocket, MessageSquare, Wifi } from "lucide-react";
import { SectionHeader } from "../../components/SectionHeader";
import { BackButton } from "../../components/BackButton";
import { AnimatedSection } from "../../components/AnimatedSection";
import Link from "next/link";

export default function RustGatewayPage() {
  const features = [
    {
      icon: <Activity className="w-10 h-10 text-yellow-400" />,
      title: "Реактивная архитектура",
      desc: "Rust Gateway обрабатывает тысячи параллельных соединений и событий в режиме stream, обеспечивая отклик менее чем за 80 мс."
    },
    {
      icon: <Brain className="w-10 h-10 text-blue-400" />,
      title: "Интеллектуальный роутинг",
      desc: "Запросы AI перенаправляются к оптимальным моделям OpenAI (GPT-4, fine-tuned models, embeddings) в зависимости от задачи."
    },
    {
      icon: <Database className="w-10 h-10 text-green-400" />,
      title: "Кэширование и локальные модели",
      desc: "Для ускорения ответов используется in-memory кэш, а также возможность локального обучения моделей на Rust-сервере."
    },
    {
      icon: <Wifi className="w-10 h-10 text-purple-400" />,
      title: "Поддержка WebSocket и REST",
      desc: "Gateway доступен как через WebSocket (реальное время), так и через REST API для интеграции с внешними платформами."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />

        <SectionHeader
          title="Rust Gateway + OpenAI"
          subtitle="Высокопроизводительный шлюз, соединяющий AI-модели с бизнес-данными в режиме реального времени."
        />

        {/* Overview */}
        <AnimatedSection>
          <div className="bg-gradient-to-br from-green-900/20 to-blue-900/10 border border-green-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <Cpu className="w-16 h-16 text-green-400 flex-shrink-0" />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Что такое Rust Gateway?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Rust Gateway — это центральный вычислительный узел FODI Market, написанный на языке Rust для максимальной скорости, безопасности и масштабируемости.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Он объединяет локальные бизнес-данные, запросы пользователей и модели искусственного интеллекта, работающие через OpenAI API, формируя мгновенные интеллектуальные ответы и прогнозы.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Main Functions */}
        <AnimatedSection>
          <div className="mt-16 mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">Основные функции</h3>
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
                className="p-8 bg-[#111]/70 border border-gray-800 rounded-xl hover:border-green-500/40 transition-all"
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

        {/* OpenAI Integration */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-7 h-7 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Связка с OpenAI</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Rust Gateway — это "мозг" на уровне данных, а OpenAI — "интеллект" на уровне смысла.
              Комбинация этих технологий позволяет FODI:
            </p>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>• генерировать динамические отчёты</li>
              <li>• анализировать метрики бизнеса</li>
              <li>• создавать персонализированные рекомендации</li>
              <li>• формировать прогнозы спроса и токен-экономики</li>
            </ul>
            <div className="p-6 bg-black/40 rounded-lg border border-blue-500/30">
              <p className="text-blue-400 font-semibold mb-2">Пример запроса:</p>
              <p className="text-gray-300 text-sm italic mb-4">
                "Проанализируй последние заказы и предложи 3 новых блюда на основе клиентских предпочтений."
              </p>
              <p className="text-gray-400 text-sm">
                Rust Gateway собирает данные, формирует контекст и передаёт их в OpenAI,
                а затем возвращает бизнесу готовые решения в формате отчёта и визуализации.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Security */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-7 h-7 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Безопасность и приватность</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="text-green-400 font-semibold">Шифрование</h4>
                <p className="text-gray-400 text-sm">Все данные передаются через TLS 1.3 с end-to-end шифрованием.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-blue-400 font-semibold">Анонимизация</h4>
                <p className="text-gray-400 text-sm">Персональные данные пользователей не попадают в AI-запросы.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-purple-400 font-semibold">Rust safety</h4>
                <p className="text-gray-400 text-sm">Строгая типизация и система владения памяти гарантируют нулевую вероятность утечек.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Results */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-br from-green-900/20 to-blue-900/10 border border-green-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-7 h-7 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Результаты</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400 mb-2">0.1s</p>
                <p className="text-gray-400 text-sm">Время отклика</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">99.99%</p>
                <p className="text-gray-400 text-sm">Надёжность uptime</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-400 mb-2">50K+</p>
                <p className="text-gray-400 text-sm">Запросов/сек</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-400 mb-2">4</p>
                <p className="text-gray-400 text-sm">Интеграции (OpenAI, LangChain, MCP, Analytics)</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Final Message */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed text-lg">
                <span className="text-green-400 font-semibold">Rust Gateway</span> — это сердце FODI Market.<br/>
                Он делает искусственный интеллект не абстрактным, а прикладным:
                соединяет данные, пользователей и бизнес-решения в единую систему реального времени.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Navigation */}
        <AnimatedSection>
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-800">
            <Link href="/about/ai" className="text-gray-400 hover:text-orange-400 transition-colors">
              ← Назад к AI Overview
            </Link>
            <Link href="/about/ai/predictions" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
              Следующее: AI-предсказания <ArrowRight className="w-4 h-4" />
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
