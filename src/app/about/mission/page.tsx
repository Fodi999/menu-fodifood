"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Rocket, Heart, Mail } from "lucide-react";
import { BackButton } from "../components/BackButton";
import { SectionHeader } from "../components/SectionHeader";
import Link from "next/link";

export default function MissionPage() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const blocks = [
    {
      id: 1,
      icon: <Globe2 className="w-10 h-10 text-blue-400" />,
      title: "Объединяем миры",
      text: "FODI связывает цифровую и физическую экономику, создавая пространство для роста брендов и идей.",
      full: (
        <>
          <p className="text-gray-300 leading-relaxed mb-4">
            Цифровая и реальная экономика больше не существуют по отдельности.
            Через FODI бизнес получает цифровую идентичность, токенизированную
            активность и возможность взаимодействовать с клиентами и инвесторами
            в едином пространстве.
          </p>
          <p className="text-gray-400 text-sm">
            Пример: локальный ресторан может выпускать NFT-токены, продавать
            подписку на скидки и участвовать в цифровых маркетах.
          </p>
        </>
      ),
    },
    {
      id: 2,
      icon: <Rocket className="w-10 h-10 text-orange-400" />,
      title: "Ускоряем инновации",
      text: "Через AI и Web3 инструменты бизнес получает аналитику, предсказания и токенизированные возможности.",
      full: (
        <>
          <p className="text-gray-300 leading-relaxed mb-4">
            AI анализирует данные продаж, поведение клиентов и динамику рынка, формируя точные прогнозы.
            Web3-механики превращают активность бизнеса в цифровые токены, создавая новую экономику лояльности и вовлечения.
          </p>
          <div className="text-left max-w-xl mx-auto">
            <p className="text-gray-400 font-semibold mb-3 text-sm">Возможности:</p>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>🔮 Предсказания спроса и оптимизация закупок</li>
              <li>📈 AI-рекомендации по росту выручки</li>
              <li>🎁 Web3-бонусы для клиентов и партнёров</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 3,
      icon: <Heart className="w-10 h-10 text-pink-400" />,
      title: "Возвращаем ценность людям",
      text: "Пользователи становятся инвесторами и партнёрами брендов, получая бонусы за взаимодействие.",
      full: (
        <>
          <p className="text-gray-300 leading-relaxed mb-4">
            Каждый клиент становится не просто покупателем, а частью экосистемы бренда.
            Он может поддержать любимое заведение, стать его соинвестором или партнёром развития,
            получая токены, бонусы и эксклюзивные привилегии за активность.
          </p>
          <div className="text-left max-w-xl mx-auto">
            <p className="text-gray-400 font-semibold mb-3 text-sm">Возможности:</p>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>💎 Инвестируй в бренды, которые любишь</li>
              <li>🗳️ Участвуй в рейтингах и решениях бизнеса</li>
              <li>💰 Зарабатывай, разделяя успех вместе с компанией</li>
            </ul>
          </div>
        </>
      ),
    },
  ];

  const activeBlock = blocks.find((b) => b.id === activeId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <BackButton />
        <SectionHeader
          title="Миссия FODI"
          subtitle="Создать метавселенную, где реальный бизнес, AI и Web3 объединены в единую экосистему."
        />

        {/* Card Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {blocks.map((block) => (
            <motion.div
              key={block.id}
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                setActiveId(activeId === block.id ? null : block.id)
              }
              className={`p-8 rounded-2xl border bg-[#111]/70 shadow-lg cursor-pointer transition-all ${
                activeId === block.id
                  ? "border-orange-500/40 shadow-orange-500/10"
                  : "border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {block.icon}
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {block.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full info section */}
        <AnimatePresence>
          {activeBlock && (
            <motion.section
              key={activeBlock.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="mt-16 bg-[#111]/80 border border-gray-800 rounded-2xl p-10 shadow-xl"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                {activeBlock.icon}
                <h2 className="text-3xl font-bold text-white">
                  {activeBlock.title}
                </h2>
                {activeBlock.full}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Developer Info */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 border-t border-gray-800/50 pt-10 text-center text-gray-400"
        >
          <p className="text-sm">
            Разработано и основано{" "}
            <span className="text-orange-400 font-semibold">Dima Fomin</span> — создателем проекта{" "}
            <span className="text-orange-500 font-semibold">FODI Market</span>.
          </p>
          <p className="text-xs mt-2 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-orange-400" />
            <a
              href="mailto:fodi85999@gmail.com"
              className="hover:text-orange-400 transition-colors"
            >
              fodi85999@gmail.com
            </a>
          </p>
        </motion.section>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/about/ai"
            className="inline-flex items-center gap-3 px-8 py-4
              bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold
              rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            Перейти к разделу <span className="font-bold">AI-интеллект</span>
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
            <span className="text-orange-400 font-semibold">AI-интеллект</span> — OpenAI, Rust Gateway и MCP Server
          </p>
        </motion.div>
      </div>

      <footer className="border-t border-gray-800/50 mt-24 py-10 bg-[#0a0a0a]/80 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 <span className="text-orange-400 font-semibold">FODI MARKET</span> • Метавселенная цифровых бизнесов
        </p>
      </footer>
    </div>
  );
}
