"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  ChefHat,
  Brain,
  BookOpen,
  Users,
  Code,
  Target,
  Mail,
  ArrowRight,
  Sparkles,
  Award,
  Lightbulb,
  Settings,
  TrendingUp,
  Heart,
  Star,
  Coffee,
  Utensils,
  Calculator,
  BarChart3,
  GraduationCap,
  Wrench,
  Instagram,
  Wallet,
  CreditCard,
  Gift,
  ShoppingCart,
  Building,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

export default function AboutPage() {
  const { t } = useTranslation(["about", "common"]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Load translation arrays as objects (avoids numeric dotted key typing issues)
  const featuresItems = t('features.items', { ns: 'about', returnObjects: true }) as Array<any>;
  const aiHelperFeatures = t('ai.helper.features', { ns: 'about', returnObjects: true }) as string[];
  const tokenWalletFeatures = t('token.wallet.features', { ns: 'about', returnObjects: true }) as string[];
  const aiAnalysisItems = t('ai.analysis.items', { ns: 'about', returnObjects: true }) as string[];
  const aiResultsItems = t('ai.results.items', { ns: 'about', returnObjects: true }) as string[];
  const aiPromotionUsage = t('ai.promotion.usage.items', { ns: 'about', returnObjects: true }) as string[];
  const aiPromotionBusinessResults = t('ai.promotion.businessResults.items', { ns: 'about', returnObjects: true }) as string[];
  const tokenEconomyItems = t('token.economy.items', { ns: 'about', returnObjects: true }) as Array<any>;

  const icons = [
    <BookOpen className="w-8 h-8 text-blue-400" key="i0" />,
    <Calculator className="w-8 h-8 text-green-400" key="i1" />,
    <GraduationCap className="w-8 h-8 text-orange-400" key="i2" />,
    <BarChart3 className="w-8 h-8 text-purple-400" key="i3" />,
    <Brain className="w-8 h-8 text-cyan-400" key="i4" />,
    <TrendingUp className="w-8 h-8 text-yellow-400" key="i5" />
  ];

  const features = featuresItems.map((item, i) => ({
    problem: item?.problem ?? '',
    solution: item?.solution ?? '',
    result: item?.result ?? '',
    icon: icons[i] ?? <BookOpen className="w-8 h-8 text-blue-400" />
  }));

  const services = [
    "Настройка онлайн-меню и учёта",
    "Разработка техкарт",
    "Обучение персонала",
    "Оптимизация процессов кухни",
    "Консалтинг для новых ресторанов"
  ];

  const targetAudience = [
    {
      icon: <ChefHat className="w-6 h-6 text-orange-400" />,
      title: "Владельцы ресторанов и служб доставки",
      description: "Управление бизнесом и оптимизация процессов"
    },
    {
      icon: <Award className="w-6 h-6 text-blue-400" />,
      title: "Шеф-повара и управляющие",
      description: "Профессиональное развитие и стандартизация"
    },
    {
      icon: <Users className="w-6 h-6 text-green-400" />,
      title: "Обучающие центры и франшизы",
      description: "Масштабирование обучения и стандартов"
    },
    {
      icon: <Code className="w-6 h-6 text-purple-400" />,
      title: "Разработчики решений для HoReCa",
      description: "Интеграция и развитие платформенных решений"
    }
  ];

  const technologies = [
    "Next.js + Rust AI Gateway",
    "Интеграция OpenAI",
    "Web3-модуль токенизации для программ лояльности",
    "Мобильные и веб-интерфейсы"
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      {/* HERO SECTION */}
      <motion.section
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5" />
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-xl"
          />
        </div>

        {/* Кнопка вернуться на главную */}
        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome', { ns: 'about' })}
          </Link>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('hero.problem', { ns: 'about' })}
            </div>

            <div className="flex items-center justify-center gap-8 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-400/30 shadow-2xl">
                  <Image
                    src="https://i.postimg.cc/V5QZwGRX/IMG-4239.jpg"
                    alt="Дмитрий Фомин"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-black" />
                </div>
              </motion.div>

              <div className="text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2">
                  <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    {t('hero.name', { ns: 'about' })}
                  </span>
                </h1>
                <p className="text-xl text-gray-400 mb-2">
                  {t('hero.role', { ns: 'about' })}
                </p>
                <p className="text-lg text-orange-400 font-medium">
                  {t('hero.tagline', { ns: 'about' })}
                </p>
                <p className="text-sm text-gray-500 italic mt-2">
                  {t('hero.mission', { ns: 'about' })}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-lg text-green-400 font-semibold text-center">
                {t('hero.solution', { ns: 'about' })}
              </p>
              <p className="text-sm text-gray-300 text-center mt-2">
                {t('hero.benefits', { ns: 'about' })}
              </p>
            </div>

            <p className="text-xl sm:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
              {t('hero.description', { ns: 'about' })}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* EXPERIENCE & MISSION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                {t('experience.title', { ns: 'about' })}
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              {t('experience.subtitle', { ns: 'about' })}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
                <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">22+ года опыта</h3>
                <p className="text-gray-400 text-sm">в японской кухне и ресторанном бизнесе</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
                <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Миссия</h3>
                <p className="text-gray-400 text-sm">объединить практический опыт с современными технологиями</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Ценность</h3>
                <p className="text-gray-400 text-sm">помочь бизнесам расти и развиваться</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
                <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Цель</h3>
                <p className="text-gray-400 text-sm">создать умные инструменты для ресторанов</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT FOODI.AI DOES */}
      <section className="py-32 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Settings className="w-12 h-12 text-orange-400" />
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  {t('features.title', { ns: 'about' })}
                </span>
                <Settings className="w-12 h-12 text-orange-400" />
              </div>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('features.subtitle', { ns: 'about' })}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-red-400 text-sm font-medium mb-1">{t('features.problem', { ns: 'about' })}</p>
                        <p className="text-gray-300 text-sm">{feature.problem}</p>
                      </div>
                      <div>
                        <p className="text-green-400 text-sm font-medium mb-1">{t('features.solution', { ns: 'about' })}</p>
                        <p className="text-white font-medium">{feature.solution}</p>
                      </div>
                      <div>
                        <p className="text-blue-400 text-sm font-medium mb-1">{t('features.result', { ns: 'about' })}</p>
                        <p className="text-gray-300 text-sm">{feature.result}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI HELPER */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Brain className="w-12 h-12 text-green-400" />
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {t('ai.title', { ns: 'about' })}
                </span>
                <Brain className="w-12 h-12 text-green-400" />
              </div>
              <br />
              <span className="text-2xl text-gray-300">{t('ai.subtitle', { ns: 'about' })}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('ai.description', { ns: 'about' })}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-8">
                <Brain className="w-16 h-16 text-green-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('ai.helper.title', { ns: 'about' })}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {t('ai.helper.description', { ns: 'about' })}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">{aiHelperFeatures[0]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{aiHelperFeatures[1]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-300">{aiHelperFeatures[2]}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">{t('ai.analysis.title', { ns: 'about' })}</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• {aiAnalysisItems[0]}</li>
                  <li>• {aiAnalysisItems[1]}</li>
                  <li>• {aiAnalysisItems[2]}</li>
                  <li>• {aiAnalysisItems[3]}</li>
                  <li>• {aiAnalysisItems[4]}</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">{t('ai.results.title', { ns: 'about' })}</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• {aiResultsItems[0]}</li>
                  <li>• {aiResultsItems[1]}</li>
                  <li>• {aiResultsItems[2]}</li>
                  <li>• {aiResultsItems[3]}</li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* NEW FEATURE: CLIENT PROMOTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{t('ai.promotion.title', { ns: 'about' })}</h3>
                  <p className="text-gray-400">{t('ai.promotion.subtitle', { ns: 'about' })}</p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                {t('ai.promotion.description', { ns: 'about' })}
              </p>

              {/* Пример сценария */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300 italic">
                  <strong>{t('ai.promotion.example', { ns: 'about' })}</strong>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">{t('ai.promotion.usage.title', { ns: 'about' })}</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• {aiPromotionUsage[0]}</li>
                    <li>• {aiPromotionUsage[1]}</li>
                    <li>• {aiPromotionUsage[2]}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">{t('ai.promotion.businessResults.title', { ns: 'about' })}</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• {aiPromotionBusinessResults[0]}</li>
                    <li>• {aiPromotionBusinessResults[1]}</li>
                    <li>• {aiPromotionBusinessResults[2]}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TOKEN ECONOMY */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Wallet className="w-12 h-12 text-yellow-400" />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {t('token.title', { ns: 'about' })}
                </span>
                <Wallet className="w-12 h-12 text-yellow-400" />
              </div>
              <br />
              <span className="text-2xl text-gray-300">{t('token.subtitle', { ns: 'about' })}</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('token.description', { ns: 'about' })}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-8">
                <Wallet className="w-16 h-16 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{t('token.wallet.title', { ns: 'about' })}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {t('token.wallet.description', { ns: 'about' })}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">{tokenWalletFeatures[0]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">{tokenWalletFeatures[1]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">{tokenWalletFeatures[2]}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">{t('token.economy.title', { ns: 'about' })}</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-medium">{tokenEconomyItems[0]?.title}</p>
                      <p className="text-gray-400 text-sm">{tokenEconomyItems[0]?.subtitle || tokenEconomyItems[0]?.description}</p>
                      <p className="text-green-400 text-sm font-semibold">{tokenEconomyItems[0]?.benefit}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-medium">{tokenEconomyItems[1]?.title}</p>
                      <p className="text-gray-400 text-sm">{tokenEconomyItems[1]?.subtitle || tokenEconomyItems[1]?.description}</p>
                      <p className="text-green-400 text-sm font-semibold">{tokenEconomyItems[1]?.benefit}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 font-medium">{tokenEconomyItems[2]?.title}</p>
                      <p className="text-gray-400 text-sm">{tokenEconomyItems[2]?.subtitle || tokenEconomyItems[2]?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRAINING & CONSULTING */}
      <section className="py-32 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <GraduationCap className="w-12 h-12 text-blue-400" />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Обучение и консультации
                </span>
                <GraduationCap className="w-12 h-12 text-blue-400" />
              </div>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              FOODI.AI — не просто софт. Мы сопровождаем ваш ресторан на каждом этапе: от настройки процессов до обучения команды.
            </p>

            {/* Социальное доказательство */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-400">5+</p>
                    <p className="text-sm text-gray-400">ресторанов внедрено</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-400">98%</p>
                    <p className="text-sm text-gray-400">довольны обучением</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"FOODI.AI помог нам оптимизировать процессы и обучить персонал. Результаты превзошли ожидания!"</p>
                <p className="text-sm text-gray-400 mt-2">— Владелец ресторана, внедривший систему</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
                <GraduationCap className="w-16 h-16 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Профессиональные услуги</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Моя команда помогает внедрять FOODI.AI и адаптировать решения под конкретный бизнес.
                </p>
                <div className="space-y-3">
                  {services.map((service, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">Для ресторанов:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Внедрение системы учёта</li>
                  <li>• Стандартизация рецептов</li>
                  <li>• Обучение персонала</li>
                  <li>• Оптимизация процессов</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-500/10 to-green-500/10 border border-teal-500/20 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3">Для новых проектов:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Консультации по запуску</li>
                  <li>• Разработка концепции</li>
                  <li>• Подбор оборудования</li>
                  <li>• Формирование команды</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Для кого это <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">подходит</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((audience, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {audience.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{audience.title}</h3>
                  <p className="text-sm text-gray-400">{audience.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPMENT & TECHNOLOGIES */}
      <section className="py-32 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Code className="w-12 h-12 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Технологии
                </span>
                <Code className="w-12 h-12 text-purple-400" />
              </div>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Создано на современных технологиях для стабильной, быстрой и безопасной работы.
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12">
              Next.js + Rust AI Gateway • Интеграция OpenAI • Web3-модуль токенизации • Мобильные и веб-интерфейсы
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {technologies.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl"
              >
                <Wrench className="w-8 h-8 text-orange-400 flex-shrink-0" />
                <span className="text-gray-300 font-medium">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT GOAL */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Target className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Target className="w-12 h-12 text-orange-400" />
                <span>Цель </span>
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">проекта</span>
                <Target className="w-12 h-12 text-orange-400" />
              </div>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Создать понятные, доступные и полезные инструменты, которые помогают ресторанам работать эффективно,
              а поварам — развиваться профессионально.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
                <Utensils className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">Эффективность</h4>
                <p className="text-sm text-gray-400">Работать проще и быстрее</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">Рост</h4>
                <p className="text-sm text-gray-400">Увеличивать прибыль</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <GraduationCap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">Развитие</h4>
                <p className="text-sm text-gray-400">Профессиональный рост</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="contact" className="py-32 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Не теряйте прибыль!</span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Начните использовать FOODI.AI прямо сейчас
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к ресторанам, которые уже увеличили прибыль на 30% с помощью нашего AI
            </p>

            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
              <p className="text-lg text-orange-400 font-bold mb-4">
                Ограниченное предложение: Бесплатный тестовый период + персональная консультация
              </p>
              <p className="text-gray-300">
                Первые 10 ресторанов получат бесплатную настройку системы и обучение команды
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="px-12 py-6 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold text-xl rounded-xl shadow-2xl hover:shadow-orange-400/50 hover:scale-110 transition-all duration-300"
              >
                Начать БЕСПЛАТНО
              </Link>
              <Link
                href="mailto:fodi85999@gmail.com"
                className="px-12 py-6 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 rounded-xl transition-all duration-300 text-lg flex items-center gap-2 font-semibold"
              >
                Получить консультацию
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/50 py-12 px-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                FOODI.AI
              </h3>
              <p className="text-gray-400 text-sm">
                Умные инструменты для ресторанов и доставки еды
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>© 2025 FOODI.AI</span>
              <span>•</span>
              <a
                href="mailto:fodi85999@gmail.com"
                className="hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                fodi85999@gmail.com
              </a>
              <span>•</span>
              <a
                href="https://www.instagram.com/fodifood?igsh=aXZqbjZmNWhsNzNn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors flex items-center gap-1"
              >
                <Instagram className="w-4 h-4" />
                @fodifood
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500 text-sm">
            <p>
              Разработано и создано{" "}
              <span className="text-orange-400 font-semibold">Дмитрием Фоминым</span> — поваром и разработчиком с{" "}
              <span className="text-orange-500 font-semibold">22-летним опытом</span> в ресторанном деле
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
