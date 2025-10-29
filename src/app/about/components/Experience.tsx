"use client";

import { motion } from "framer-motion";
import { Award, Target, Heart, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Experience() {
  const { t } = useTranslation(["about"]);

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              {t("experience.title", { ns: "about" })}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">{t("experience.subtitle", { ns: "about" })}</p>
        </motion.div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
              <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t("experience.stats.experience.title", { ns: "about" })}</h3>
              <p className="text-gray-400 text-sm">{t("experience.stats.experience.subtitle", { ns: "about" })}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t("experience.stats.mission.title", { ns: "about" })}</h3>
              <p className="text-gray-400 text-sm">{t("experience.stats.mission.subtitle", { ns: "about" })}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
              <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t("experience.stats.value.title", { ns: "about" })}</h3>
              <p className="text-gray-400 text-sm">{t("experience.stats.value.subtitle", { ns: "about" })}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
              <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t("experience.stats.goal.title", { ns: "about" })}</h3>
              <p className="text-gray-400 text-sm">{t("experience.stats.goal.subtitle", { ns: "about" })}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
