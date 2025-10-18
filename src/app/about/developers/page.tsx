"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { Code, Terminal, BookOpen, Github, Puzzle, Rocket } from "lucide-react";

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Для разработчиков"
          subtitle="Интегрируйте FODI API в свои проекты, создавайте плагины и участвуйте в open-source."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {[
            {
              icon: <Code className="w-10 h-10 text-blue-400" />,
              title: "REST API",
              text: "Полнофункциональный API для управления заказами, продуктами, пользователями и аналитикой.",
            },
            {
              icon: <Terminal className="w-10 h-10 text-green-400" />,
              title: "SDK и библиотеки",
              text: "Официальные SDK для JavaScript, Python, Rust с примерами интеграции.",
            },
            {
              icon: <BookOpen className="w-10 h-10 text-purple-400" />,
              title: "Документация",
              text: "Подробные гайды, туториалы и примеры кода для быстрого старта.",
            },
            {
              icon: <Github className="w-10 h-10 text-gray-300" />,
              title: "Open Source",
              text: "Часть кода FODI открыта на GitHub — вы можете контрибьютить и создавать форки.",
            },
            {
              icon: <Puzzle className="w-10 h-10 text-orange-400" />,
              title: "Плагины и расширения",
              text: "Создавайте модули для интеграции с CRM, платёжными системами и мессенджерами.",
            },
            {
              icon: <Rocket className="w-10 h-10 text-pink-400" />,
              title: "Hackathons и гранты",
              text: "Участвуйте в хакатонах FODI и получайте гранты за инновационные решения.",
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

        {/* Code Example Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 border border-gray-800 rounded-xl bg-[#111]/50"
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Быстрый старт
          </h3>
          <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              <code>{`// Подключение FODI API
import { FodiClient } from '@fodi/sdk';

const client = new FodiClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.fodi.market'
});

// Получение списка продуктов
const products = await client.products.list();

// Создание заказа
const order = await client.orders.create({
  items: [{ productId: '123', quantity: 2 }],
  userId: 'user_abc'
});`}</code>
            </pre>
          </div>
        </motion.div>

        {/* Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid sm:grid-cols-3 gap-6"
        >
          {[
            { label: "📚 API Docs", href: "#" },
            { label: "💻 GitHub", href: "#" },
            { label: "💬 Discord Community", href: "#" },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="p-6 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-blue-500/40 text-center font-semibold transition-all hover:scale-105"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
