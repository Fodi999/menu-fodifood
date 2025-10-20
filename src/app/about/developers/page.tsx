"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../components/SectionHeader";
import { BackButton } from "../components/BackButton";
import { Code, Terminal, BookOpen, Github, Puzzle, Rocket, Zap, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 py-16 text-gray-100">
        <BackButton />
        <SectionHeader
          title="Для разработчиков"
          subtitle="Интегрируйте FODI API в свои проекты, создавайте плагины и участвуйте в open-source экосистеме."
        />

        {/* MAIN TAGLINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center space-y-4"
        >
          <p className="text-2xl font-semibold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FODI Developer Platform
            </span>{" "}
            — мощные инструменты для создания Web3-приложений нового поколения.
          </p>
        </motion.div>

        {/* MAIN FEATURES */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {/* REST API */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Code className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">REST API</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <span className="text-blue-400 font-semibold">Полнофункциональный RESTful API</span> для управления заказами, продуктами, пользователями и аналитикой.
              Все эндпоинты защищены OAuth 2.0 и поддерживают rate limiting.
            </p>
            <div className="mt-4 p-4 bg-blue-950/30 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                <Zap className="w-4 h-4 inline text-blue-400 mr-2" />
                <strong className="text-white">Endpoints:</strong> /products, /orders, /users, /analytics, /webhooks
              </p>
            </div>
          </motion.div>

          {/* SDK и библиотеки */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Terminal className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">SDK и библиотеки</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Официальные <span className="text-green-400 font-semibold">SDK для JavaScript, Python, Rust</span> с полной типизацией.
              Поддержка TypeScript, async/await, Promise и WebSocket для real-time обновлений.
            </p>
            <div className="mt-4 p-4 bg-green-950/30 border border-green-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                📦 <strong className="text-white">npm install @fodi/sdk</strong> или <strong className="text-white">pip install fodi-python</strong>
              </p>
            </div>
          </motion.div>

          {/* Документация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <BookOpen className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Документация</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              <span className="text-purple-400 font-semibold">Подробные гайды и туториалы</span> с примерами кода.
              Интерактивная документация с возможностью тестирования API прямо в браузере.
            </p>
            <div className="mt-4 p-4 bg-purple-950/30 border border-purple-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                📖 Swagger UI, Postman коллекции, video tutorials и <strong className="text-white">live playground</strong>
              </p>
            </div>
          </motion.div>

          {/* Open Source */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Github className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Open Source</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Часть кода FODI <span className="text-gray-300 font-semibold">открыта на GitHub</span>.
              Вы можете контрибьютить, создавать форки и адаптировать под свои нужды.
            </p>
            <div className="mt-4 p-4 bg-gray-900/50 border border-gray-700/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🌟 <strong className="text-white">github.com/fodi-market</strong> — присоединяйтесь к community
              </p>
            </div>
          </motion.div>

          {/* Плагины */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Puzzle className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Плагины и расширения</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Создавайте <span className="text-orange-400 font-semibold">модули для интеграции</span> с CRM, платёжными системами, мессенджерами.
              Публикуйте в FODI Plugin Marketplace и монетизируйте свои решения.
            </p>
            <div className="mt-4 p-4 bg-orange-950/30 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🔌 Интеграции: Stripe, PayPal, Telegram Bot API, WhatsApp Business, Shopify
              </p>
            </div>
          </motion.div>

          {/* Hackathons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            className="bg-[#111]/70 border border-gray-800 rounded-2xl p-8 hover:border-orange-400/50 hover:shadow-orange-400/20 shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Rocket className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Hackathons и гранты</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Участвуйте в <span className="text-pink-400 font-semibold">хакатонах FODI</span> и получайте гранты за инновационные решения.
              Призовой фонд до $50,000 в токенах FODI для лучших проектов.
            </p>
            <div className="mt-4 p-4 bg-pink-950/30 border border-pink-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🏆 Ежеквартальные конкурсы, менторство от команды FODI, <strong className="text-white">акселерация проектов</strong>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Code Example Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="mt-20 p-10 border border-gray-800 rounded-2xl bg-[#111]/50 hover:border-blue-500/40 hover:shadow-blue-500/10 backdrop-blur-sm transition-all duration-300"
        >
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Быстрый старт
          </h3>
          <div className="bg-[#0a0a0a] p-6 rounded-lg border border-gray-800 overflow-x-auto">
            <pre className="text-sm text-gray-300 leading-relaxed">
              <code>{`// 1. Установка SDK
npm install @fodi/sdk

// 2. Подключение FODI API
import { FodiClient } from '@fodi/sdk';

const client = new FodiClient({
  apiKey: process.env.FODI_API_KEY,
  baseUrl: 'https://api.fodi.market'
});

// 3. Получение списка продуктов
const products = await client.products.list({
  limit: 10,
  category: 'sushi'
});

// 4. Создание заказа
const order = await client.orders.create({
  items: [
    { productId: 'prod_123', quantity: 2 },
    { productId: 'prod_456', quantity: 1 }
  ],
  userId: 'user_abc',
  deliveryAddress: '123 Main St'
});

// 5. WebSocket для real-time обновлений
client.on('order.updated', (data) => {
  console.log('Order status:', data.status);
});`}</code>
            </pre>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 italic">
              ⚡ Полная документация доступна на <span className="text-blue-400 font-semibold">docs.fodi.market</span>
            </p>
          </div>
        </motion.div>

        {/* ARCHITECTURE DIAGRAM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="mt-20 p-10 border border-gray-800 rounded-2xl bg-[#111]/50 hover:border-green-500/40 hover:shadow-green-500/10 backdrop-blur-sm transition-all duration-300"
        >
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Архитектура системы
          </h3>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Flow Diagram */}
              <div className="space-y-6 text-center">
                {/* Layer 1: Client */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex justify-center gap-4"
                >
                  <div className="px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 font-semibold">Next.js / React</p>
                  </div>
                  <div className="px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-400 font-semibold">iOS / Android App</p>
                  </div>
                </motion.div>

                {/* Arrow */}
                <div className="text-gray-500 text-2xl">↓</div>

                {/* Layer 2: API Gateway */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/40 rounded-lg max-w-md mx-auto"
                >
                  <p className="text-orange-400 font-bold text-lg">FODI API Gateway</p>
                  <p className="text-gray-400 text-sm mt-1">OAuth 2.0 + Rate Limiting</p>
                </motion.div>

                {/* Arrow with split */}
                <div className="relative h-12">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 text-gray-500 text-2xl">↓</div>
                  <div className="absolute left-1/4 top-8 text-gray-500 text-xl">↙</div>
                  <div className="absolute right-1/4 top-8 text-gray-500 text-xl">↘</div>
                </div>

                {/* Layer 3: Processing */}
                <div className="flex justify-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="px-6 py-3 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg"
                  >
                    <p className="text-green-400 font-semibold">Rust Gateway</p>
                    <p className="text-gray-400 text-xs mt-1">High Performance</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg"
                  >
                    <p className="text-purple-400 font-semibold">AI Engine</p>
                    <p className="text-gray-400 text-xs mt-1">OpenAI GPT-4</p>
                  </motion.div>
                </div>

                {/* Arrow */}
                <div className="text-gray-500 text-2xl">↓</div>

                {/* Layer 4: Services */}
                <div className="flex justify-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg"
                  >
                    <p className="text-blue-400 font-semibold text-sm">MCP Server</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                    className="px-5 py-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg"
                  >
                    <p className="text-yellow-400 font-semibold text-sm">Blockchain</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="px-5 py-2 bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-lg"
                  >
                    <p className="text-green-400 font-semibold text-sm">Database</p>
                  </motion.div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-900/50 border border-gray-700/30 rounded-lg">
                <p className="text-sm text-gray-400 text-center italic">
                  ⚡ Все компоненты работают асинхронно с latency &lt; 100ms
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECURITY & LIMITS */}
        <div className="mt-20 grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="p-8 border border-gray-800 rounded-2xl bg-[#111]/50 hover:border-green-500/40 hover:shadow-green-500/10 backdrop-blur-sm transition-all duration-300"
          >
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              🔒 Безопасность
            </h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <p>Все запросы выполняются через <strong className="text-white">HTTPS и OAuth 2.0</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <p>Токены доступа действительны <strong className="text-white">24 часа</strong> и обновляются автоматически</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <p>Данные пользователей шифруются <strong className="text-white">end-to-end (AES-256 + Rust Gateway)</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <p>Защита от DDoS, SQL injection и XSS атак</p>
              </div>
            </div>
          </motion.div>

          {/* Limits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-8 border border-gray-800 rounded-2xl bg-[#111]/50 hover:border-orange-500/40 hover:shadow-orange-500/10 backdrop-blur-sm transition-all duration-300"
          >
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              📊 Ограничения
            </h3>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="text-orange-400 mt-1">•</span>
                <p><strong className="text-white">10,000 запросов / месяц</strong> бесплатно</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 mt-1">•</span>
                <p>Rate-limit: <strong className="text-white">100 req/min</strong> (базовый план)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 mt-1">•</span>
                <p>WebSocket updates — <strong className="text-white">5 каналов</strong> одновременно</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 mt-1">•</span>
                <p>Размер payload: <strong className="text-white">максимум 10 MB</strong> на запрос</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DEVELOPER ROADMAP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="mt-20 p-10 border border-gray-800 rounded-2xl bg-[#111]/50 hover:border-purple-500/40 hover:shadow-purple-500/10 backdrop-blur-sm transition-all duration-300"
        >
          <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🗺️ Developer Roadmap
          </h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { quarter: "Q4 2025", items: "Публичный API + SDK v1.0 (JS, Python, Rust)", color: "blue", status: "В процессе" },
              { quarter: "Q1 2026", items: "FODI Plugin Marketplace + WebSocket API v2", color: "green", status: "Планируется" },
              { quarter: "Q2 2026", items: "SDK для Swift (iOS) + GraphQL API", color: "purple", status: "Планируется" },
              { quarter: "Q3 2026", items: "FODI AI Agent Framework + Developer Grants Program", color: "orange", status: "Планируется" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-6 border border-gray-800 rounded-lg bg-[#0a0a0a]/50 hover:border-${item.color}-500/40 transition-all`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold text-${item.color}-400 mb-2`}>{item.quarter}</h4>
                    <p className="text-gray-300">{item.items}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full bg-${item.color}-900/30 text-${item.color}-400 border border-${item.color}-500/20`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
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
            { icon: <BookOpen className="w-6 h-6" />, label: "API Docs", href: "https://docs.fodi.market", color: "blue" },
            { icon: <Github className="w-6 h-6" />, label: "GitHub", href: "https://github.com/fodi-market", color: "gray" },
            { icon: <LinkIcon className="w-6 h-6" />, label: "Discord Community", href: "#", color: "purple" },
          ].map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className={`p-6 border border-gray-800 rounded-xl bg-[#111]/70 hover:border-${link.color}-500/40 text-center font-semibold transition-all flex flex-col items-center gap-3`}
            >
              <div className={`text-${link.color}-400`}>{link.icon}</div>
              <span>{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-blue-500/40 rounded-2xl shadow-2xl text-center"
        >
          <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4 text-white">
            Начните разработку с FODI
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Получите <span className="text-blue-400 font-semibold">бесплатный API ключ</span> и начните интеграцию уже сегодня.
            Полная документация, примеры кода и поддержка community.
          </p>
          
          <div className="space-y-6">
            <Link href="/auth/signup">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-xl px-12 py-5 rounded-2xl shadow-lg hover:shadow-blue-400/30 hover:scale-105 transition-all">
                Получить API ключ
              </button>
            </Link>
            
            <p className="text-sm text-gray-400 italic max-w-xl mx-auto">
              💡 Первые 10,000 запросов в месяц бесплатно. Без привязки карты.
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
