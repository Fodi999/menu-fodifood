"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { Coins, TrendingUp, Shield, PieChart, Wallet, Award } from "lucide-react";

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Для инвесторов"
          subtitle="Инвестируйте в будущее цифровой экономики через токены FODI и получайте дивиденды."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {[
            {
              icon: <Coins className="w-10 h-10 text-yellow-400" />,
              title: "Токен FODI",
              text: "Utility-токен экосистемы, используемый для транзакций, стейкинга и вознаграждений.",
            },
            {
              icon: <TrendingUp className="w-10 h-10 text-green-400" />,
              title: "Дивиденды",
              text: "Держатели токенов получают процент от выручки платформы пропорционально их доле.",
            },
            {
              icon: <Shield className="w-10 h-10 text-blue-400" />,
              title: "Прозрачность",
              text: "Все финансовые метрики доступны в реальном времени через блокчейн и dashboard.",
            },
            {
              icon: <PieChart className="w-10 h-10 text-purple-400" />,
              title: "Диверсификация",
              text: "Инвестируйте в портфель бизнесов и брендов через токенизированные активы.",
            },
            {
              icon: <Wallet className="w-10 h-10 text-orange-400" />,
              title: "Стейкинг",
              text: "Блокируйте токены для получения дополнительных наград и права голоса в DAO.",
            },
            {
              icon: <Award className="w-10 h-10 text-pink-400" />,
              title: "NFT сертификаты",
              text: "Получите уникальные NFT за инвестиции, дающие доступ к эксклюзивным привилегиям.",
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-pink-500/40 transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {block.icon}
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <p className="text-gray-400 text-sm">{block.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tokenomics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 border border-gray-800 rounded-xl bg-[#111]/50"
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Токеномика FODI
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Общий объём", value: "100M", unit: "FODI" },
              { label: "В обороте", value: "15M", unit: "FODI" },
              { label: "Годовая доходность", value: "12-18%", unit: "APY" },
              { label: "Держателей", value: "5,000+", unit: "" },
            ].map((metric, i) => (
              <div key={i} className="text-center p-6 bg-[#0a0a0a]/50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {metric.value}
                  {metric.unit && <span className="text-xl ml-1">{metric.unit}</span>}
                </div>
                <div className="text-gray-400 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA секция */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-10 border border-yellow-500/30 rounded-xl bg-gradient-to-r from-yellow-900/20 to-orange-900/20 text-center"
        >
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Станьте частью экосистемы FODI
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Приобретите токены FODI и начните получать пассивный доход от растущей цифровой экономики.
          </p>
          <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors">
            Купить токены FODI
          </button>
        </motion.div>
      </div>
    </div>
  );
}
