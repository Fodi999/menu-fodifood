"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { Store, Bot, CreditCard, TrendingUp, Users, Shield } from "lucide-react";

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Для бизнеса"
          subtitle="Создайте цифровую витрину, подключите AI-помощника и монетизируйте свой бренд."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {[
            {
              icon: <Store className="w-10 h-10 text-blue-400" />,
              title: "Цифровая витрина",
              text: "Создайте онлайн-магазин за минуты с интеграцией каталога, заказов и доставки.",
            },
            {
              icon: <Bot className="w-10 h-10 text-green-400" />,
              title: "AI-помощник",
              text: "Автоматизируйте поддержку клиентов с помощью AI-чата, который знает ваш бизнес.",
            },
            {
              icon: <CreditCard className="w-10 h-10 text-purple-400" />,
              title: "Гибкие подписки",
              text: "Выбирайте тарифный план под ваши нужды — от базового до премиум с AI-аналитикой.",
            },
            {
              icon: <TrendingUp className="w-10 h-10 text-orange-400" />,
              title: "Аналитика продаж",
              text: "Отслеживайте выручку, популярные товары и прогнозы спроса в реальном времени.",
            },
            {
              icon: <Users className="w-10 h-10 text-yellow-400" />,
              title: "Программы лояльности",
              text: "Вознаграждайте клиентов токенами FODI за покупки и привлечение новых клиентов.",
            },
            {
              icon: <Shield className="w-10 h-10 text-pink-400" />,
              title: "Безопасность и прозрачность",
              text: "Все транзакции защищены, а метрики доступны через прозрачный dashboard.",
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-blue-500/40 transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {block.icon}
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <p className="text-gray-400 text-sm">{block.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA секция */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-10 border border-blue-500/30 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 text-center"
        >
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Готовы запустить ваш бизнес на FODI?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Зарегистрируйтесь сегодня и получите 30 дней бесплатного доступа к премиум-функциям.
          </p>
          <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors">
            Начать бесплатно
          </button>
        </motion.div>
      </div>
    </div>
  );
}
