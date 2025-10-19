"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, Users, BarChart3, ArrowRight, Search, Settings, Rocket, MessageSquare } from "lucide-react";
import { SectionHeader } from "../../components/SectionHeader";
import { BackButton } from "../../components/BackButton";
import { AnimatedSection } from "../../components/AnimatedSection";
import Link from "next/link";

export default function PredictionsPage() {
  const useCases = [
    {
      icon: <TrendingUp className="w-10 h-10 text-blue-400" />,
      title: "Рестораны",
      desc: "Прогноз продаж по блюдам и временным слотам — оптимизация меню и графика работы персонала."
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-green-400" />,
      title: "Магазины",
      desc: "Оценка спроса и управление запасами — снижение издержек на хранение и предотвращение дефицита."
    },
    {
      icon: <Users className="w-10 h-10 text-purple-400" />,
      title: "Онлайн-школы",
      desc: "Прогноз посещаемости и интереса к курсам — планирование программы и оптимизация расписания."
    },
    {
      icon: <Brain className="w-10 h-10 text-orange-400" />,
      title: "Инвесторы",
      desc: "Анализ трендов в экосистеме FODI и ROI-оценка токенов бизнеса — принятие инвестиционных решений."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />

        <SectionHeader
          title="AI-предсказания"
          subtitle="Модели машинного обучения, прогнозирующие спрос, продажи, отток клиентов и тренды на основе больших данных."
        />

        {/* Overview */}
        <AnimatedSection>
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <Brain className="w-16 h-16 text-blue-400 flex-shrink-0" />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Как работает система предсказаний?</h3>
                <p className="text-gray-300 leading-relaxed">
                  AI-система FODI анализирует динамику заказов, активность пользователей, сезонные колебания и макроэкономические показатели,
                  формируя точные прогнозы по каждому бизнесу внутри экосистемы.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Благодаря интеграции OpenAI моделей с Rust Gateway, обработка данных происходит в реальном времени, без потери производительности.
                  Каждый владелец бизнеса получает персональные прогнозы и рекомендации действий — когда запускать акции, как корректировать цены
                  и какие продукты станут популярными в ближайшие недели.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Use Cases Grid */}
        <AnimatedSection>
          <div className="mt-16 mb-8 flex items-center gap-3">
            <Search className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">Примеры применения</h3>
              <p className="text-gray-400">AI-предсказания адаптируются под специфику каждого бизнеса</p>
            </div>
          </div>
          <section className="grid sm:grid-cols-2 gap-8">
            {useCases.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-8 bg-[#111]/70 border border-gray-800 rounded-xl hover:border-blue-500/40 transition-all"
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

        {/* Technologies */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-7 h-7 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Технологии</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="text-blue-400 font-semibold">Time-series forecasting</h4>
                <p className="text-gray-400 text-sm">LSTM, Prophet, Rust-optimized models — анализ временных рядов для предсказания роста или спада.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-purple-400 font-semibold">Behavioral AI</h4>
                <p className="text-gray-400 text-sm">Модели поведения пользователей, обученные на реальных метриках заказов и отзывов.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-green-400 font-semibold">Adaptive models</h4>
                <p className="text-gray-400 text-sm">Самообучающиеся модели, подстраивающиеся под регион, сезон и категорию бизнеса.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Results */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-7 h-7 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Результат</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">92%</p>
                <p className="text-gray-400 text-sm">Точность прогнозов</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400 mb-2">−15%</p>
                <p className="text-gray-400 text-sm">Снижение потерь выручки</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-400 mb-2">+25%</p>
                <p className="text-gray-400 text-sm">Рост эффективности маркетинга</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-400 mb-2">Auto</p>
                <p className="text-gray-400 text-sm">Визуализация в панели FODI Analytics</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Final Message */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed text-lg">
                <span className="text-blue-400 font-semibold">AI-предсказания</span> — это не просто аналитика.<br/>
                Это инструмент, который помогает владельцам бизнеса принимать решения быстрее, чем рынок,<br/>
                и соединяет искусственный интеллект с реальной экономикой Web3.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Navigation */}
        <AnimatedSection>
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-800">
            <Link href="/about/ai/rust-gateway" className="text-gray-400 hover:text-orange-400 transition-colors">
              ← Rust Gateway
            </Link>
            <Link href="/about/ai/mcp" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
              Следующее: MCP Server <ArrowRight className="w-4 h-4" />
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
