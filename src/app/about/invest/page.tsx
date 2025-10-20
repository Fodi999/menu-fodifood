"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { Coins, TrendingUp, Shield, PieChart, Wallet, Award, Rocket, Users, GitBranch, Vote } from "lucide-react";
import Link from "next/link";

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Для инвесторов"
          subtitle="Инвестируйте в будущее цифровой экономики через токены FODI и получайте реальную долю от роста метавселенной."
        />

        {/* MAIN TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center space-y-4"
        >
          <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            <span className="text-yellow-400 font-semibold">FODI Market</span> открывает новую форму инвестиций —
            где каждый токен связан с <span className="text-orange-400 font-semibold">реальными бизнесами</span>, их выручкой и репутацией.
          </p>
          <p className="text-lg text-gray-400 italic max-w-3xl mx-auto">
            Вы не просто покупаете актив — вы становитесь частью экосистемы, которая растёт вместе с вами.
          </p>
        </motion.div>

        {/* MAIN FEATURES */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* Токен FODI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Coins className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Токен FODI</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <span className="text-yellow-400 font-semibold">Utility-токен экосистемы</span>, используемый для транзакций, стейкинга, управления и вознаграждений.
              Он лежит в основе всех взаимодействий между бизнесами, клиентами и инвесторами.
            </p>
            <div className="mt-4 p-4 bg-yellow-950/30 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                💡 Каждый FODI-токен <strong className="text-white">подкреплён реальной активностью</strong> внутри экосистемы:
                количеством заказов, выручкой и токенизацией бизнесов.
              </p>
            </div>
          </motion.div>

          {/* Дивиденды */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Дивиденды</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Держатели токенов получают <span className="text-green-400 font-semibold">процент от прибыли экосистемы FODI</span>.
              Чем больше доля — тем выше доход.
            </p>
            <div className="mt-4 p-4 bg-green-950/30 border border-green-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                📊 Распределение происходит <strong className="text-white">автоматически через смарт-контракты</strong>,
                с прозрачным аудитом и данными в реальном времени.
              </p>
            </div>
          </motion.div>

          {/* Прозрачность */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Shield className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Прозрачность</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Все транзакции и метрики доступны инвесторам в <span className="text-blue-400 font-semibold">блокчейне и FODI Dashboard</span>.
              AI-модуль отслеживает динамику токенов, активность бизнесов и отображает отчёты в реальном времени.
            </p>
            <div className="mt-4 p-4 bg-blue-950/30 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🧠 Каждый инвестор видит: <strong className="text-white">ROI, обороты, активность и статус выплат</strong>.
              </p>
            </div>
          </motion.div>

          {/* Диверсификация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <PieChart className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Диверсификация</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Инвестируйте <span className="text-purple-400 font-semibold">не в один бренд — а в портфель токенизированных бизнесов</span>.
              FODI агрегирует активы из ресторанов, школ, магазинов и стартапов.
            </p>
            <div className="mt-4 p-4 bg-purple-950/30 border border-purple-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🌐 Это как <strong className="text-white">ETF фонда, только в мире Web3</strong>: токен отражает долю в нескольких направлениях.
              </p>
            </div>
          </motion.div>

          {/* Стейкинг */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Wallet className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Стейкинг</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Блокируйте токены и получайте <span className="text-orange-400 font-semibold">вознаграждения за участие в экосистеме</span>.
              Стейкинг открывает право голоса в FODI DAO, доступ к внутренним решениям и приоритет в распределении бонусов.
            </p>
            <div className="mt-4 p-4 bg-orange-950/30 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                💰 Доходность — <strong className="text-white">динамическая, от 12% до 18% APY</strong>,
                в зависимости от активности и срока стейкинга.
              </p>
            </div>
          </motion.div>

          {/* NFT-сертификаты */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Award className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">NFT-сертификаты</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Каждый инвестор получает <span className="text-pink-400 font-semibold">NFT-сертификат владения</span>, подтверждающий участие в экосистеме.
              NFT открывает доступ к закрытым встречам, тестам новых функций и бонусам DAO.
            </p>
            <div className="mt-4 p-4 bg-pink-950/30 border border-pink-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🎁 Уровни NFT: <strong className="text-white">Bronze, Silver, Gold, Diamond</strong> —
                чем выше уровень, тем больше прав и дивидендов.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tokenomics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="mt-20 p-10 border border-gray-800 rounded-2xl bg-[#111]/50 hover:border-yellow-500/40 hover:shadow-yellow-500/10 backdrop-blur-sm transition-all duration-300"
        >
          <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Токеномика FODI
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Coins className="w-8 h-8" />, label: "Общий объём эмиссии", value: "100M", unit: "FODI", color: "text-yellow-400" },
              { icon: <TrendingUp className="w-8 h-8" />, label: "В обращении", value: "15M", unit: "FODI", color: "text-green-400" },
              { icon: <PieChart className="w-8 h-8" />, label: "Годовая доходность (APY)", value: "12–18%", unit: "", color: "text-orange-400" },
              { icon: <Users className="w-8 h-8" />, label: "Держателей", value: "5,000+", unit: "", color: "text-blue-400" },
              { icon: <GitBranch className="w-8 h-8" />, label: "Блокчейн", value: "Ethereum", unit: "Layer 2", color: "text-purple-400" },
              { icon: <Vote className="w-8 h-8" />, label: "DAO управление", value: "Голосование", unit: "через стейкинг", color: "text-pink-400" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-[#0a0a0a]/50 rounded-lg border border-gray-800 hover:border-orange-400/40 transition-all"
              >
                <div className={`${metric.color} mb-3 flex justify-center`}>{metric.icon}</div>
                <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                  {metric.value}
                </div>
                {metric.unit && (
                  <div className="text-sm text-gray-400 mb-3">{metric.unit}</div>
                )}
                <div className="text-gray-300 font-semibold text-sm mt-2">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA секция */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-500/40 rounded-2xl shadow-2xl text-center"
        >
          <Rocket className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4 text-white">
            Станьте частью экосистемы FODI
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Приобретите токены FODI и начните получать <span className="text-yellow-400 font-semibold">пассивный доход</span>{" "}
            от растущей цифровой экономики реальных бизнесов.
          </p>
          
          <div className="space-y-6">
            <Link href="/about/web3/token">
              <button className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold text-xl px-12 py-5 rounded-2xl shadow-lg hover:shadow-yellow-400/30 hover:scale-105 transition-all">
                Купить токены FODI
              </button>
            </Link>
            
            <p className="text-sm text-gray-400 italic max-w-xl mx-auto">
              💡 Начните с минимальной суммы и масштабируйте по мере роста экосистемы.
            </p>
          </div>
        </motion.div>

        {/* CTA NAVIGATION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center space-y-4"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-3 px-8 py-4
              bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold
              rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            Вернуться к <span className="font-bold">обзору разделов</span>
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
            Исследуйте все разделы экосистемы FODI
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
