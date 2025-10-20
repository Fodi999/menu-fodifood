"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, Eye, Bell, ArrowRight, Target, Layers, Brain, Lock, TrendingDown, MessageSquare, Settings } from "lucide-react";
import { SectionHeader } from "../../components/SectionHeader";
import { BackButton } from "../../components/BackButton";
import { AnimatedSection } from "../../components/AnimatedSection";
import Link from "next/link";

export default function AnomalyPage() {
  const principles = [
    {
      icon: <Layers className="w-10 h-10 text-purple-400" />,
      title: "Многоуровневый анализ данных",
      desc: "AI оценивает не только сам факт транзакции, но и контекст — время, геолокацию, устройство, частоту действий, тип клиента и аномальные паттерны поведения."
    },
    {
      icon: <Eye className="w-10 h-10 text-red-400" />,
      title: "Обнаружение в реальном времени",
      desc: "Потоковые алгоритмы Rust Gateway позволяют системе обрабатывать до 100K событий в минуту, моментально сигнализируя о подозрительной активности."
    },
    {
      icon: <Brain className="w-10 h-10 text-blue-400" />,
      title: "Самообучение (Continuous Learning)",
      desc: "Модели адаптируются к поведению конкретного бизнеса. Если кафе увеличивает поток заказов в сезон праздников — AI понимает, что это не аномалия, а закономерный рост."
    },
    {
      icon: <Target className="w-10 h-10 text-orange-400" />,
      title: "Классификация рисков",
      desc: "Каждое событие получает оценку риска (0–100), а система автоматически уведомляет администратора или инвестора при превышении порога."
    },
  ];

  const tracking = [
    "Фрод при оплатах или токен-трансферах",
    "Ненормальные пики трафика или заказов",
    "Подозрительные операции с бизнес-токенами",
    "Сбои API и неожиданные отклонения в метриках",
    "Подозрительное поведение сотрудников (например, массовое редактирование заказов)",
  ];

  const reactions = [
    {
      title: "Автоматические уведомления",
      desc: "Владельцу бизнеса и команде безопасности"
    },
    {
      title: "Блокировка действий",
      desc: "До подтверждения (если уровень риска >90)"
    },
    {
      title: "Создание отчёта AI Audit",
      desc: "Включающего детали, паттерн и возможную причину"
    },
    {
      title: "Синхронизация с Rust Gateway",
      desc: "Изолирование проблемы без остановки всей сети"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />

        <SectionHeader
          title="Обнаружение аномалий"
          subtitle="AI-модуль, который отслеживает бизнес-активность в реальном времени и автоматически выявляет фрод, сбои и подозрительные операции."
        />

        {/* Overview */}
        <AnimatedSection>
          <div className="bg-gradient-to-br from-red-900/20 to-pink-900/10 border border-red-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-6">
              <Shield className="w-16 h-16 text-red-400 flex-shrink-0" />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Anomaly Watch — цифровой иммунитет FODI</h3>
                <p className="text-gray-300 leading-relaxed">
                  Система "Anomaly Watch" — это встроенный в FODI Market модуль,
                  созданный для предиктивного мониторинга транзакций, заказов и пользовательской активности.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Она использует поведенческие модели, обученные на больших массивах данных,
                  чтобы мгновенно определять любые отклонения от нормы:
                  от фродовых операций до технических аномалий в API.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Principles */}
        <AnimatedSection>
          <div className="mt-16 mb-8 flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">Основные принципы работы</h3>
            </div>
          </div>
        </AnimatedSection>

        {/* Principles Grid */}
        <AnimatedSection>
          <section className="grid sm:grid-cols-2 gap-8">
            {principles.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-8 bg-[#111]/70 border border-gray-800 rounded-xl hover:border-red-500/40 transition-all"
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

        {/* What AI Tracks */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-7 h-7 text-red-400" />
              <h3 className="text-2xl font-bold text-white">Что AI отслеживает</h3>
            </div>
            <ul className="space-y-3">
              {tracking.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </AnimatedSection>

        {/* System Response */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-7 h-7 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Реакция системы</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {reactions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-black/30 rounded-lg border border-blue-500/30"
                >
                  <h4 className="text-blue-400 font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Security */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-7 h-7 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Безопасность данных</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Все операции проходят через анонимизированный фильтр,
              поэтому система анализирует только поведенческие метрики без раскрытия персональных данных.
            </p>
            <div className="p-4 bg-black/30 rounded-lg border-l-4 border-green-500">
              <p className="text-green-400 font-semibold mb-2">Zero-Knowledge AI</p>
              <p className="text-gray-400 text-sm">
                AI понимает, что произошло, не зная, с кем. Алгоритмы построены на принципе полной анонимизации данных.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Results */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-br from-green-900/20 to-blue-900/10 border border-green-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-7 h-7 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Эффект для экосистемы</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400 mb-2">−85%</p>
                <p className="text-gray-400 text-sm">Снижение вероятности фрода</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">−60%</p>
                <p className="text-gray-400 text-sm">Меньше технических сбоев</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-400 mb-2">100%</p>
                <p className="text-gray-400 text-sm">Повышение доверия</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-400 mb-2">Auto</p>
                <p className="text-gray-400 text-sm">AI Audit Logs</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Final Message */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <p className="text-gray-300 leading-relaxed text-lg">
                <span className="text-red-400 font-semibold">AI Anomaly Detection</span> — цифровой иммунитет FODI Market.<br/>
                Он защищает экосистему, обеспечивая прозрачность, доверие и безопасность —
                основные принципы будущей цифровой экономики.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Navigation */}
        <AnimatedSection>
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-800">
            <Link href="/about/ai/mcp" className="text-gray-400 hover:text-orange-400 transition-colors">
              ← MCP Server
            </Link>
            <Link href="/about/web3" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
              Следующее: Web3-интеграция <ArrowRight className="w-4 h-4" />
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
