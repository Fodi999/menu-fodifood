"use client";

import { motion } from "framer-motion";
import { Coins, Wallet, BarChart3, Shield, Zap, Store } from "lucide-react";
import { SectionHeader } from "../../components/SectionHeader";
import { BackButton } from "../../components/BackButton";

export default function TokenPage() {
  const features = [
    {
      icon: <Wallet className="w-10 h-10 text-yellow-400" />,
      title: "Транзакции внутри экосистемы",
      desc: "Оплата подписок, маркетплейс, AI-аналитика и бизнес-инструменты — всё через FODI Token.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-blue-400" />,
      title: "Стейкинг и вознаграждения",
      desc: "Пользователи блокируют токены, поддерживая сеть и получая бонусы за активность и участие.",
    },
    {
      icon: <Store className="w-10 h-10 text-orange-400" />,
      title: "Цифровая витрина бизнесов",
      desc: "Каждое заведение получает свой FODI Business Token (FBT), отражающий выручку и рейтинг.",
    },
    {
      icon: <Shield className="w-10 h-10 text-green-400" />,
      title: "Безопасность и прозрачность",
      desc: "Все транзакции записываются в децентрализованный реестр с защитой Rust Gateway.",
    },
    {
      icon: <Zap className="w-10 h-10 text-pink-400" />,
      title: "AI-интеграция",
      desc: "AI-интеллект анализирует динамику токенов и предлагает оптимальные стратегии инвестиций.",
    },
  ];

  const tokenomics = [
    { label: "Общий объем эмиссии", value: "1 000 000 000 FODI" },
    { label: "Распределение для бизнеса", value: "40%" },
    { label: "Вознаграждения пользователям", value: "25%" },
    { label: "Фонд развития AI и Web3", value: "20%" },
    { label: "Инвесторы и ликвидность", value: "10%" },
    { label: "Команда и резерв", value: "5%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />
        <SectionHeader
          title="Токен FODI"
          subtitle="Utility-токен экосистемы, используемый для транзакций, стейкинга и вознаграждений."
        />

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/20 rounded-2xl p-8 shadow-xl mb-16"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-1 space-y-4">
              <p className="text-gray-300 leading-relaxed">
                <span className="text-yellow-400 font-semibold">FODI Token</span> — это 
                цифровая единица экосистемы, обеспечивающая прозрачные и безопасные транзакции 
                между пользователями, бизнесами и AI-инфраструктурой.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Благодаря Web3 и Rust Gateway, токен интегрируется во все процессы — от аналитики и 
                стейкинга до прямых платежей за сервисы и рекламу.
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex justify-center items-center bg-gradient-to-br from-yellow-400/10 to-orange-500/5 rounded-full p-10 border border-yellow-500/30"
            >
              <Coins className="w-20 h-20 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Features */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="p-8 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-yellow-400/40 transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {item.icon}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Tokenomics Table */}
        <section className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-yellow-500/20 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Токеномика FODI</h2>
          <div className="divide-y divide-gray-800 text-gray-300">
            {tokenomics.map((row, i) => (
              <div
                key={i}
                className="flex justify-between py-3 px-2 hover:bg-yellow-500/5 rounded transition-colors"
              >
                <span>{row.label}</span>
                <span className="text-yellow-400 font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/50 mt-24 py-10 bg-[#0a0a0a]/80 backdrop-blur-sm text-center">
        <p className="text-gray-500 text-sm">
          © 2025{" "}
          <span className="text-yellow-400 font-semibold">FODI TOKEN</span> •  
          Utility Web3 Asset of the Future Economy
        </p>
      </footer>
    </div>
  );
}
