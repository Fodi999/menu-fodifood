"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, Eye, Bell, ArrowRight } from "lucide-react";
import { SectionHeader } from "../../components/SectionHeader";
import { BackButton } from "../../components/BackButton";
import { AnimatedSection } from "../../components/AnimatedSection";
import Link from "next/link";

export default function AnomalyPage() {
  const features = [
    {
      icon: <Eye className="w-10 h-10 text-red-400" />,
      title: "Мониторинг 24/7",
      desc: "AI следит за всеми транзакциями, заказами и действиями пользователей в режиме реального времени."
    },
    {
      icon: <AlertTriangle className="w-10 h-10 text-yellow-400" />,
      title: "Детекция фрода",
      desc: "Система выявляет подозрительные паттерны: массовые заказы с одного IP, фейковые аккаунты, накрутку рейтинга."
    },
    {
      icon: <Bell className="w-10 h-10 text-blue-400" />,
      title: "Мгновенные уведомления",
      desc: "При обнаружении аномалии владелец бизнеса получает push-уведомление с деталями инцидента."
    },
    {
      icon: <Shield className="w-10 h-10 text-green-400" />,
      title: "Автоматическая защита",
      desc: "В критических случаях система автоматически блокирует подозрительные транзакции до проверки."
    },
  ];

  const examples = [
    {
      type: "Фрод",
      desc: "20 заказов за 5 минут с одного IP-адреса",
      action: "Автоматически заблокирован, владелец уведомлён"
    },
    {
      type: "Накрутка рейтинга",
      desc: "5 новых аккаунтов оставили идентичные отзывы",
      action: "Отзывы скрыты, аккаунты отмечены как подозрительные"
    },
    {
      type: "Технический сбой",
      desc: "API не отвечает более 30 секунд",
      action: "Переключение на резервный сервер, уведомление DevOps"
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
                <h3 className="text-2xl font-bold text-white">Как работает система обнаружения?</h3>
                <p className="text-gray-300 leading-relaxed">
                  AI-модель обучена на миллионах транзакций и знает, как выглядит "нормальное" поведение.
                  Когда происходит что-то необычное — массовый заказ, странная активность, технический сбой —
                  система мгновенно реагирует.
                </p>
                <p className="text-gray-400 text-sm">
                  Модель использует алгоритмы машинного обучения (Isolation Forest, Autoencoders)
                  и анализирует до 100 параметров каждой транзакции.
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

        {/* Examples */}
        <AnimatedSection>
          <div className="mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Примеры обнаруженных аномалий</h3>
            <div className="space-y-4">
              {examples.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-black/30 rounded-lg border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-red-400 font-semibold text-sm">{item.type}</p>
                      <p className="text-gray-300 text-sm mt-1">{item.desc}</p>
                      <p className="text-gray-500 text-xs mt-2">→ {item.action}</p>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection>
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-red-900/20 to-pink-900/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-3xl font-bold text-red-400">99.8%</p>
              <p className="text-gray-400 text-sm mt-2">Точность детекции фрода</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-500/20 rounded-xl text-center">
              <p className="text-3xl font-bold text-yellow-400">&lt;500ms</p>
              <p className="text-gray-400 text-sm mt-2">Время реакции на аномалию</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-900/20 to-blue-900/10 border border-green-500/20 rounded-xl text-center">
              <p className="text-3xl font-bold text-green-400">24/7</p>
              <p className="text-gray-400 text-sm mt-2">Непрерывный мониторинг</p>
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
