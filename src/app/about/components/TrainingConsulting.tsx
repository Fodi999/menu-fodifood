"use client";

import { motion } from "framer-motion";
import { GraduationCap, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrainingConsulting() {
  const { t } = useTranslation(["about"]);
  const services = t("consulting.services.items", { ns: "about", returnObjects: true }) as string[];
  const forRestaurants = t("consulting.forRestaurants.items", { ns: "about", returnObjects: true }) as string[];
  const forProjects = t("consulting.forProjects.items", { ns: "about", returnObjects: true }) as string[];

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-black/20">
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <GraduationCap className="w-12 h-12 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t("consulting.title", { ns: "about" })}</span>
              <GraduationCap className="w-12 h-12 text-blue-400" />
            </div>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">{t("consulting.subtitle", { ns: "about" })}</p>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div>
                  <p className="text-3xl font-bold text-blue-400">{t("consulting.stats.restaurants", { ns: "about" })}</p>
                  <p className="text-sm text-gray-400">{t("consulting.stats.subtitle1", { ns: "about" })}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">{t("consulting.stats.satisfaction", { ns: "about" })}</p>
                  <p className="text-sm text-gray-400">{t("consulting.stats.subtitle2", { ns: "about" })}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">{t("consulting.testimonial", { ns: "about" })}</p>
              <p className="text-sm text-gray-400 mt-2">{t("consulting.author", { ns: "about" })}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
              <GraduationCap className="w-16 h-16 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{t("consulting.services.title", { ns: "about" })}</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{t("consulting.services.subtitle", { ns: "about" })}</p>
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

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">{t("consulting.forRestaurants.title", { ns: "about" })}</h4>
              <ul className="space-y-2 text-gray-300">
                {forRestaurants.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-teal-500/10 to-green-500/10 border border-teal-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">{t("consulting.forProjects.title", { ns: "about" })}</h4>
              <ul className="space-y-2 text-gray-300">
                {forProjects.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
