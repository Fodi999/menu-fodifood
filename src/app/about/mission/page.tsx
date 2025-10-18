"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { Globe, Target, Heart } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Миссия FODI"
          subtitle="Создать метавселенную, где реальный бизнес, AI и Web3 объединены в единую экосистему."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {[
            {
              icon: <Globe className="w-10 h-10 text-orange-500" />,
              title: "Объединяем миры",
              text: "FODI связывает цифровую и физическую экономику, создавая пространство для роста брендов и идей.",
            },
            {
              icon: <Target className="w-10 h-10 text-yellow-400" />,
              title: "Ускоряем инновации",
              text: "Через AI и Web3 инструменты бизнес получает реальную аналитику, предсказания и токенизированные возможности.",
            },
            {
              icon: <Heart className="w-10 h-10 text-pink-400" />,
              title: "Возвращаем ценность людям",
              text: "Пользователи становятся инвесторами и партнёрами брендов, получая бонусы за взаимодействие.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-orange-500/40 transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {item.icon}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
