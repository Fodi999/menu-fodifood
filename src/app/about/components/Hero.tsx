"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Sparkles, ArrowLeft, ChefHat } from "lucide-react";

export default function Hero() {
  const { t } = useTranslation(["about", "common"]);

  return (
    <motion.section
      style={{}}
      className="relative min-h-[80vh] flex flex-col sm:flex-row items-center justify-center px-4 sm:px-6 py-12 sm:py-0"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5" />
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-32 h-32 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-xl"
        />
      </div>

      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
        <Link
          href="/"
          aria-label={t("backToHome", { ns: "about" })}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 text-sm sm:text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{t("backToHome", { ns: "about" })}</span>
        </Link>
      </div>

  <div className="max-w-6xl mx-auto text-center relative z-10 px-2 sm:px-0 pt-8 sm:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t("hero.problem", { ns: "about" })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-orange-400/30 shadow-2xl">
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

            <div className="text-left mt-4 sm:mt-0">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-2">
                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  {t("hero.name", { ns: "about" })}
                </span>
              </h1>
              <p className="text-base sm:text-xl text-gray-400 mb-2">{t("hero.role", { ns: "about" })}</p>
              <p className="text-sm sm:text-lg text-orange-400 font-medium">{t("hero.tagline", { ns: "about" })}</p>
              <p className="text-xs sm:text-sm text-gray-500 italic mt-2">{t("hero.mission", { ns: "about" })}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-lg text-green-400 font-semibold text-center">{t("hero.solution", { ns: "about" })}</p>
            <p className="text-sm text-gray-300 text-center mt-2">{t("hero.benefits", { ns: "about" })}</p>
          </div>

          <p className="text-xl sm:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">{t("hero.description", { ns: "about" })}</p>
        </motion.div>
      </div>
    </motion.section>
  );
}
