"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { BarChart3, TrendingUp, PieChart, Activity, Brain, Target, Zap, Rocket } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Аналитика и данные"
          subtitle="AI-анализ, статистика и метрики, которые превращают цифры в действия."
        />

        {/* INTRO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/10 border border-purple-500/30 rounded-2xl shadow-xl hover:shadow-purple-500/20 transition-all"
        >
          <p className="text-2xl font-bold text-white mb-2 text-center">
            FODI Analytics — это не просто статистика.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Это искусственный интеллект, который видит, анализирует и предсказывает развитие вашего бизнеса.
            </span>
          </p>
          <p className="text-center text-orange-400 font-semibold text-lg mb-4 mt-3">
            От данных к действию. От анализа — к росту.
          </p>
          <p className="text-gray-300 leading-relaxed text-lg mt-4">
            Система аналитики FODI Market использует искусственный интеллект, чтобы обрабатывать огромные объёмы данных —
            от заказов и транзакций до поведения пользователей и динамики токенов.
            Каждое действие в экосистеме становится частью <span className="text-purple-400 font-semibold">интеллектуальной модели</span>,
            которая помогает бизнесу и инвесторам принимать умные, обоснованные решения.
          </p>
          <div className="mt-6 p-4 bg-purple-950/30 border border-purple-500/20 rounded-lg">
            <p className="text-gray-300 text-center leading-relaxed">
              В отличие от традиционных CRM и BI-платформ,
              FODI объединяет <span className="text-purple-400 font-semibold">AI и Web3</span> —
              данные анализируются, токенизируются и превращаются в цифровую ценность.
            </p>
          </div>
        </motion.div>

        {/* MAIN FEATURES */}
        <div className="grid sm:grid-cols-2 gap-8 mt-16">
          {/* AI-анализ данных */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="p-8 border border-orange-400/30 hover:border-orange-400/50 rounded-xl bg-[#111]/70 hover:shadow-orange-500/20 shadow-lg transition-all"
          >
            <BarChart3 className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">🧠 AI-анализ данных</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Глубокая аналитика поведения пользователей, трендов и метрик бизнеса в реальном времени.
              AI обрабатывает миллионы сигналов — от покупательской активности до откликов клиентов —
              и формирует гибкие отчёты, которые помогают увидеть неочевидные закономерности.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>Автоматически выявляет слабые и сильные стороны бизнеса</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>Оценивает маркетинговые кампании по ROI</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>Строит модели удержания клиентов и оттока</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>Обеспечивает сегментацию по поведению и интересам</span>
              </p>
            </div>
          </motion.div>

          {/* Предиктивная аналитика */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="p-8 border border-orange-400/30 hover:border-orange-400/50 rounded-xl bg-[#111]/70 hover:shadow-orange-500/20 shadow-lg transition-all"
          >
            <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">📈 Предиктивная аналитика</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              FODI использует machine learning (ML) для прогнозирования динамики выручки,
              спроса на товары и оптимизации стратегий.
              AI способен заранее подсказать, какие продукты будут в тренде,
              а какие лучше заменить или ребрендировать.
            </p>
            <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-400 mb-3">Примеры прогнозов:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p className="flex items-center gap-2">
                  <span>💰</span>
                  <span>Рост выручки при изменении цен на 5–10%</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>🕓</span>
                  <span>Лучшее время для акций и скидок</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>🧍‍♂️</span>
                  <span>Вероятность возвращения клиента</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>🏪</span>
                  <span>Потенциал открытия новой локации</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Визуализация метрик */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="p-8 border border-orange-400/30 hover:border-orange-400/50 rounded-xl bg-[#111]/70 hover:shadow-orange-500/20 shadow-lg transition-all"
          >
            <PieChart className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">📊 Визуализация метрик</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Интерактивные дашборды FODI Analytics — это не просто цифры.
              Это живая визуальная экосистема, где AI сам расставляет приоритеты.
              Метрики обновляются в реальном времени, с поддержкой WebSocket и Rust Gateway.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span><strong className="text-white">Финансовая</strong> (доход, прибыль, конверсия)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span><strong className="text-white">Клиентская</strong> (удержание, активность, отток)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span><strong className="text-white">Web3</strong> (токенизация, стейкинг, обмены)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span><strong className="text-white">AI-инсайты</strong> (рекомендации, аномалии, прогнозы)</span>
              </p>
            </div>
          </motion.div>

          {/* Real-time мониторинг */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            className="p-8 border border-orange-400/30 hover:border-orange-400/50 rounded-xl bg-[#111]/70 hover:shadow-orange-500/20 shadow-lg transition-all"
          >
            <Activity className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">⚡ Real-time мониторинг</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Весь поток данных доступен в режиме реального времени.
              Система фиксирует изменения мгновенно: заказы, транзакции, рекламные клики, активность пользователей.
            </p>
            <p className="text-gray-400 leading-relaxed">
              AI реагирует на аномалии — например, резкое падение продаж или всплеск запросов —
              и отправляет уведомления владельцам бизнеса прямо в панель управления.
            </p>
          </motion.div>
        </div>

        {/* INSIGHT QUOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-500/40 rounded-2xl text-center"
        >
          <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-lg text-gray-300 leading-relaxed italic">
            💡 Представьте, что ваш бизнес может предсказать день, когда лучше всего запустить акцию или изменить меню — 
            это уже делает <span className="text-purple-400 font-semibold">FODI</span>.
          </p>
        </motion.div>

        {/* METRICS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 border border-gray-800 rounded-xl bg-[#111]/50"
        >
          <h3 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            📌 Ключевые метрики платформы
          </h3>
          <p className="text-center text-gray-400 mb-8 text-sm">
            Эти данные формируются на основе реальной активности пользователей и AI-аналитики,
            <br />обновляясь <span className="text-purple-400 font-semibold">каждую секунду</span> через Rust Gateway.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🏪", label: "Активных бизнесов", value: "150+", desc: "Подключены к экосистеме FODI" },
              { icon: "🛒", label: "Обработано заказов", value: "10,000+", desc: "В реальном времени через Rust Gateway" },
              { icon: "💰", label: "Общий объём токенов", value: "5M FODI", desc: "В обращении в экосистеме" },
              { icon: "📈", label: "Средний рост бизнеса", value: "27%", desc: "После интеграции с AI и Web3" },
              { icon: "👥", label: "Удержание клиентов", value: "82%", desc: "Благодаря AI-предикции и бонусам" },
              { icon: "🔎", label: "Точность прогноза", value: "94%", desc: "На основе машинного обучения" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-[#0a0a0a] to-[#151515] rounded-xl border border-gray-800 hover:border-orange-500/40 transition-all"
              >
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">{metric.value}</div>
                <div className="text-white font-semibold text-sm mb-1">{metric.label}</div>
                <div className="text-gray-500 text-xs">{metric.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* TRANSITION TO AI INSIGHTS */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-300 italic">
            Когда цифры становятся решениями — именно так работает{" "}
            <span className="text-purple-400 font-semibold">интеллектуальная аналитика FODI</span>.
          </p>
        </motion.div>

        {/* AI INSIGHTS IN ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="mt-12 p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-orange-400/30 hover:border-orange-400/50 rounded-2xl shadow-xl hover:shadow-orange-500/20 transition-all"
        >
          <div className="flex items-center gap-4 mb-6">
            <Target className="w-12 h-12 text-blue-400" />
            <h3 className="text-3xl font-bold text-white">🧩 AI-инсайты в действии</h3>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg mb-4">
            FODI не просто анализирует — он <span className="text-blue-400 font-semibold">подсказывает</span>.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Когда AI замечает падение конверсии, он предлагает маркетинговое решение:
            скидку, акцию или push-уведомление.
            Всё это происходит <span className="text-blue-400 font-semibold">автоматически</span>, без участия оператора.
          </p>
          <div className="mt-6 p-5 bg-blue-950/30 border border-blue-500/20 rounded-xl">
            <p className="text-gray-300 italic text-center">
              <Zap className="w-5 h-5 inline text-blue-400 mr-2" />
              Это усиливает ощущение, что FODI — это не "панель данных", а{" "}
              <span className="text-blue-400 font-semibold">"умный партнёр по бизнесу"</span>.
            </p>
          </div>
        </motion.div>

        {/* FINAL QUOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 border-l-4 border-purple-500/50 bg-purple-950/20 rounded-r-xl"
        >
          <p className="text-gray-300 text-lg italic mb-4">
            💬 Аналитика FODI — это ваш <span className="text-purple-400 font-semibold">цифровой советник</span>.
            Она не просто показывает данные — она объясняет, что с ними делать.
          </p>
          <p className="text-gray-300 text-lg font-semibold mt-4 text-center">
            FODI делает аналитику не просто инструментом,
            а <span className="text-purple-400">интеллектуальной системой роста</span>,
            где каждая метрика — это <span className="text-orange-400">рекомендация к действию</span>.
          </p>
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-orange-900/30 to-yellow-900/20 border border-orange-500/40 rounded-2xl text-center shadow-2xl"
        >
          <Rocket className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <p className="text-2xl font-bold text-white mb-6">
            🚀 Откройте свой бизнес через AI-аналитику FODI — 
            <br />
            <span className="text-orange-400">и вы больше никогда не будете принимать решения вслепую.</span>
          </p>
        </motion.div>

        {/* CTA NAVIGATION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/about/business"
            className="inline-flex items-center gap-3 px-8 py-4
              bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold
              rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            Перейти к разделу <span className="font-bold">Для бизнеса</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            Следующий раздел:{" "}
            <span className="text-orange-400 font-semibold">Для бизнеса</span> — Витрины, AI-помощники и подписки
          </p>
        </motion.div>
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
