"use client";

import { motion } from "framer-motion";
import { Code, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Technologies() {
  const { t } = useTranslation(["about"]);
  const items = t("tech.items", { ns: "about", returnObjects: true }) as string[];

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-black/20">
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Code className="w-12 h-12 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t("tech.title", { ns: "about" })}</span>
              <Code className="w-12 h-12 text-purple-400" />
            </div>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">{t("tech.subtitle", { ns: "about" })}</p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12">{t("tech.stack", { ns: "about" })}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {items.map((tech, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="flex items-center gap-4 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl">
              <Wrench className="w-8 h-8 text-orange-400 flex-shrink-0" />
              <span className="text-gray-300 font-medium">{tech}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
