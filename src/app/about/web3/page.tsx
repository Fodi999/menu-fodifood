"use client";

import { motion } from "framer-motion";
import { Coins, Lock, TrendingUp, Users, Zap, Shield, ArrowRight } from "lucide-react";
import { BackButton } from "../components/BackButton";
import { SectionHeader } from "../components/SectionHeader";
import Link from "next/link";

export default function Web3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <BackButton />
        
        <SectionHeader
          title="Web3 и токенизация FODI"
          subtitle="Каждый бизнес в экосистеме FODI получает уникальный цифровой токен — отражение его реальной активности, выручки и репутации."
        />

        {/* MAIN CONTENT */}
        <div className="space-y-12 mt-16">
          {/* TOKEN ECONOMY */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white">Токеномика FODI</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-6 border border-gray-800 rounded-xl bg-[#111]/70"
              >
                <Coins className="w-10 h-10 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">FODI Token</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Основной цифровой актив экосистемы. Его стоимость формируется на основе 
                  метрик активности бизнеса: выручки, количества заказов и репутации.
                </p>
                <Link 
                  href="/about/web3/token"
                  className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors"
                >
                  Подробнее о токене
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-6 border border-gray-800 rounded-xl bg-[#111]/70"
              >
                <TrendingUp className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Биржа FODI Exchange</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  В будущем пользователи смогут покупать, обменивать и стейкать бизнес-токены 
                  через встроенный Web3-маркетплейс с прозрачной торговлей.
                </p>
              </motion.div>
            </div>
          </section>

          {/* KEY FEATURES */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white">Ключевые возможности</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: <Lock className="w-8 h-8 text-blue-400" />,
                  title: "Безопасность",
                  desc: "Смарт-контракты на блокчейне гарантируют прозрачность всех транзакций"
                },
                {
                  icon: <Users className="w-8 h-8 text-purple-400" />,
                  title: "Инвестиции",
                  desc: "Инвестируйте в реальные бизнесы через покупку их токенов"
                },
                {
                  icon: <Zap className="w-8 h-8 text-orange-400" />,
                  title: "Ликвидность",
                  desc: "Мгновенная конвертация токенов в другие активы через DEX"
                },
                {
                  icon: <Shield className="w-8 h-8 text-green-400" />,
                  title: "NFT сертификаты",
                  desc: "Каждый бизнес получает уникальный NFT-сертификат владения"
                },
                {
                  icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
                  title: "Дивиденды",
                  desc: "Держатели токенов получают долю от прибыли бизнеса"
                },
                {
                  icon: <Coins className="w-8 h-8 text-pink-400" />,
                  title: "Стейкинг",
                  desc: "Зарабатывайте пассивный доход, блокируя токены в пуле"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-yellow-500/30 transition-all"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-500/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Как это работает?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Регистрация бизнеса</h4>
                  <p className="text-gray-400 text-sm">Владелец создаёт витрину и подключает аналитику</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Токенизация</h4>
                  <p className="text-gray-400 text-sm">AI-система генерирует уникальный токен на основе метрик</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Торговля</h4>
                  <p className="text-gray-400 text-sm">Инвесторы покупают токены через FODI Exchange</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                  4
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Доход</h4>
                  <p className="text-gray-400 text-sm">Держатели получают дивиденды от прибыли бизнеса</p>
                </div>
              </div>
            </div>
          </section>
        </div>
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
