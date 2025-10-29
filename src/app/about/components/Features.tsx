"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Calculator,
  GraduationCap,
  BarChart3,
  Brain,
  TrendingUp,
  Settings,
} from "lucide-react";

export default function Features() {
  const { t } = useTranslation(["about", "common"]);

  const featuresItems = t("features.items", { ns: "about", returnObjects: true }) as Array<any>;

  const icons = [
    <BookOpen className="w-8 h-8 text-blue-400" key="i0" />,
    <Calculator className="w-8 h-8 text-green-400" key="i1" />,
    <GraduationCap className="w-8 h-8 text-orange-400" key="i2" />,
    <BarChart3 className="w-8 h-8 text-purple-400" key="i3" />,
    <Brain className="w-8 h-8 text-cyan-400" key="i4" />,
    <TrendingUp className="w-8 h-8 text-yellow-400" key="i5" />,
  ];

  const features = featuresItems.map((item, i) => ({
    problem: item?.problem ?? "",
    solution: item?.solution ?? "",
    result: item?.result ?? "",
    icon: icons[i] ?? <BookOpen className="w-8 h-8 text-blue-400" />,
  }));

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-black/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-0">
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
                {t("features.title", { ns: "about" })}
              </span>
              <Settings className="w-12 h-12 text-orange-400" />
            </div>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t("features.subtitle", { ns: "about" })}
          </p>
        </motion.div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
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
                      <p className="text-red-400 text-sm font-medium mb-1">{t("features.problem", { ns: "about" })}</p>
                      <p className="text-gray-300 text-sm">{feature.problem}</p>
                    </div>
                    <div>
                      <p className="text-green-400 text-sm font-medium mb-1">{t("features.solution", { ns: "about" })}</p>
                      <p className="text-white font-medium">{feature.solution}</p>
                    </div>
                    <div>
                      <p className="text-blue-400 text-sm font-medium mb-1">{t("features.result", { ns: "about" })}</p>
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
  );
}
