"use client";

import { motion } from "framer-motion";
import { Target, Utensils, TrendingUp, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProjectGoal() {
  const { t } = useTranslation(["about"]);
  const values = t("goal.values", { ns: "about", returnObjects: true }) as Array<any>;

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center px-2 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <Target className="w-16 h-16 text-orange-400 mx-auto mb-6" />
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Target className="w-12 h-12 text-orange-400" />
              <span>{t("goal.title", { ns: "about" })} </span>
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">{t("goal.subtitle", { ns: "about" })}</span>
              <Target className="w-12 h-12 text-orange-400" />
            </div>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">{t("goal.description", { ns: "about" })}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
              <Utensils className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-white mb-1">{values?.[0]?.title}</h4>
              <p className="text-sm text-gray-400">{values?.[0]?.subtitle}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-white mb-1">{values?.[1]?.title}</h4>
              <p className="text-sm text-gray-400">{values?.[1]?.subtitle}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
              <GraduationCap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-white mb-1">{values?.[2]?.title}</h4>
              <p className="text-sm text-gray-400">{values?.[2]?.subtitle}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
