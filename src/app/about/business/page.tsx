"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { Store, Bot, CreditCard, TrendingUp, Users, Shield, Sparkles, Rocket } from "lucide-react";
import Link from "next/link";

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Для бизнеса"
          subtitle="Создайте цифровую витрину, подключите AI-помощника и монетизируйте свой бренд в метавселенной FODI."
        />

        {/* MAIN TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl font-semibold text-white">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              FODI Business Hub
            </span>{" "}
            — это ваш инструмент для роста, продаж и токенизации.
          </p>
        </motion.div>

        {/* MAIN FEATURES */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* Цифровая витрина */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Store className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">🏪 Цифровая витрина</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Создайте онлайн-витрину <span className="text-blue-400 font-semibold">за минуты</span>.
              Добавляйте меню, товары, услуги и акции без сложной настройки.
              FODI автоматически подключает оплату, доставку и аналитику.
            </p>
            <div className="mt-4 p-4 bg-blue-950/30 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                <Sparkles className="w-4 h-4 inline text-blue-400 mr-2" />
                <strong className="text-white">Пример:</strong> кофейня может запустить собственный мини-маркет с доставкой
                и системой токенов для постоянных клиентов.
              </p>
            </div>
          </motion.div>

          {/* AI-помощник */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Bot className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">🤖 AI-помощник</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Ваш <span className="text-green-400 font-semibold">цифровой консультант 24/7</span>.
              AI-чат обучается на данных вашего бизнеса и отвечает на запросы клиентов,
              принимает заказы, предлагает товары и собирает обратную связь.
            </p>
            <div className="mt-4 p-4 bg-green-950/30 border border-green-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                ⚙️ Работает на базе <strong className="text-white">OpenAI + Rust Gateway</strong>,
                обеспечивая мгновенные ответы и адаптацию под тон вашего бренда.
              </p>
            </div>
          </motion.div>

          {/* Гибкие подписки */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <CreditCard className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">💳 Гибкие подписки</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Выберите тариф, который <span className="text-purple-400 font-semibold">подходит именно вам</span>.
              От базового плана (витрина + токены) до премиум-уровня с аналитикой,
              AI-предсказаниями и маркетинговыми инструментами.
            </p>
            <div className="mt-4 p-4 bg-purple-950/30 border border-purple-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🧠 Все подписки включают базовую <strong className="text-white">AI-аналитику</strong> и
                доступ к <strong className="text-white">FODI Marketplace</strong>.
              </p>
            </div>
          </motion.div>

          {/* Аналитика продаж */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <TrendingUp className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">📊 Аналитика продаж</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Следите за выручкой, топ-товарами и клиентскими трендами <span className="text-orange-400 font-semibold">в реальном времени</span>.
              FODI показывает, какие продукты растут, когда стоит запустить скидку и где можно увеличить прибыль.
            </p>
            <div className="mt-4 p-4 bg-orange-950/30 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                📈 Дашборды обновляются <strong className="text-white">каждые 2 секунды</strong> через
                Rust Gateway и AI-предиктивный модуль.
              </p>
            </div>
          </motion.div>

          {/* Программы лояльности */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Users className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">🎁 Программы лояльности</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Вознаграждайте клиентов <span className="text-yellow-400 font-semibold">за активность</span>.
              Покупки, отзывы, рекомендации — всё конвертируется в токены FODI.
              Клиенты могут использовать их для скидок, NFT-призов или обмена на другие активы.
            </p>
            <div className="mt-4 p-4 bg-yellow-950/30 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🔗 Интеграция с <strong className="text-white">Web3-кошельками</strong> обеспечивает
                мгновенное начисление бонусов.
              </p>
            </div>
          </motion.div>

          {/* Безопасность */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Shield className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">🔒 Безопасность и прозрачность</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Все данные и транзакции защищены <span className="text-pink-400 font-semibold">блокчейном и AI-аудитом</span>.
              Вы видите всё — заказы, токенизацию, доход — через прозрачный dashboard.
            </p>
            <div className="mt-4 p-4 bg-pink-950/30 border border-pink-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🛡️ FODI гарантирует честную аналитику и защиту клиентских данных на уровне{" "}
                <strong className="text-white">enterprise-security</strong>.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA секция */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-gradient-to-r from-orange-900/30 to-yellow-900/20 border border-orange-500/40 rounded-2xl shadow-2xl text-center"
        >
          <Rocket className="w-16 h-16 text-orange-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4 text-white">
            🚀 Готовы запустить ваш бизнес на FODI?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Начните <span className="text-orange-400 font-semibold">бесплатно</span> —
            создайте цифровую витрину, подключите AI-помощника и получите{" "}
            <strong className="text-white">30 дней премиум</strong> для полного тестирования.
          </p>
          
          <div className="space-y-6">
            <Link href="/auth/signup">
              <button className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold text-xl px-12 py-5 rounded-2xl shadow-lg hover:shadow-orange-400/30 transition-all hover:scale-105">
                Начать бесплатно
              </button>
            </Link>
            
            <p className="text-sm text-gray-400 italic max-w-xl mx-auto">
              💡 Не нужно быть технарём — всё подключается в 3 шага, без кода и интеграций.
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
            href="/about/invest"
            className="inline-flex items-center gap-3 px-8 py-4
              bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold
              rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            Перейти к разделу <span className="font-bold">Для инвесторов</span>
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
            <span className="text-orange-400 font-semibold">Для инвесторов</span> — Токеномика, выгоды и прозрачность
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
