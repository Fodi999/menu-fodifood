"use client";

import { motion } from "framer-motion";
import { ChefHat, Award, Users, Code } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TargetAudience() {
  const { t } = useTranslation(["about"]);
  const items = t("audience.items", { ns: "about", returnObjects: true }) as Array<any>;

  const icons = [
    <ChefHat className="w-6 h-6 text-orange-400" key="chef" />,
    <Award className="w-6 h-6 text-blue-400" key="award" />,
    <Users className="w-6 h-6 text-green-400" key="users" />,
    <Code className="w-6 h-6 text-purple-400" key="code" />
  ];

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">{t("audience.title", { ns: "about" })} <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">{t("audience.subtitle", { ns: "about" })}</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((aud: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} whileHover={{ scale: 1.05 }} className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-2xl backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {icons[i]}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{aud.title}</h3>
                <p className="text-sm text-gray-400">{aud.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
