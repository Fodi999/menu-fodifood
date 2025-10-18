"use client";

import { motion } from "framer-motion";
import { Rocket, Coins, Cpu, Users, Building2, BarChart3, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { InteractiveCard } from "./components/InteractiveCard";

export default function AboutPage() {
  const sections = [
    {
      title: "Миссия FODI",
      description: "Философия, цели и видение будущего",
      icon: <Building2 className="w-12 h-12" />,
      href: "/about/mission",
      color: "orange"
    },
    {
      title: "AI-интеллект",
      description: "OpenAI, Rust Gateway и MCP Server",
      icon: <Cpu className="w-12 h-12" />,
      href: "/about/ai",
      color: "green"
    },
    {
      title: "Web3 и Токенизация",
      description: "NFT, цифровая экономика и блокчейн",
      icon: <Coins className="w-12 h-12" />,
      href: "/about/web3",
      color: "yellow"
    },
    {
      title: "Аналитика и данные",
      description: "AI-анализ, статистика и метрики",
      icon: <BarChart3 className="w-12 h-12" />,
      href: "/about/analytics",
      color: "purple"
    },
    {
      title: "Для бизнеса",
      description: "Витрины, AI-помощники и подписки",
      icon: <Users className="w-12 h-12" />,
      href: "/about/business",
      color: "blue"
    },
    {
      title: "Для инвесторов",
      description: "Токеномика, выгоды и прозрачность",
      icon: <Rocket className="w-12 h-12" />,
      href: "/about/invest",
      color: "pink"
    },
    {
      title: "Для разработчиков",
      description: "API, SDK и open-source инструменты",
      icon: <Code className="w-12 h-12" />,
      href: "/about/developers",
      color: "blue"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>На главную</span>
        </Link>
      </div>

      {/* HEADER */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold mb-6"
        >
          <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
            FODI — Future of Digital Interaction
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          Метавселенная, объединяющая AI, Web3 и реальные бизнесы.<br/>
          Выберите раздел для подробного изучения экосистемы.
        </motion.p>
      </section>

      {/* INTERACTIVE CARDS GRID */}
      <section className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-24">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
          >
            <InteractiveCard {...section} />
          </motion.div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/50 mt-16 py-10 bg-[#0a0a0a]/80 backdrop-blur-sm text-center">
        <p className="text-gray-500 text-sm">
          © 2025{" "}
          <span className="text-orange-400 font-semibold">FODI MARKET</span> •  
          Метавселенная цифровых бизнесов
        </p>
      </footer>
    </div>
  );
}
