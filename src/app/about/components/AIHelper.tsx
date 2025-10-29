"use client";

import { motion } from "framer-motion";
import { Brain, Lightbulb, TrendingUp, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AIHelper() {
  const { t } = useTranslation(["about"]);
  const aiHelperFeatures = t("ai.helper.features", { ns: "about", returnObjects: true }) as string[];
  const aiAnalysisItems = t("ai.analysis.items", { ns: "about", returnObjects: true }) as string[];
  const aiResultsItems = t("ai.results.items", { ns: "about", returnObjects: true }) as string[];

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Brain className="w-12 h-12 text-green-400" />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{t("ai.title", { ns: "about" })}</span>
              <Brain className="w-12 h-12 text-green-400" />
            </div>
            <br />
            <span className="text-2xl text-gray-300">{t("ai.subtitle", { ns: "about" })}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{t("ai.description", { ns: "about" })}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-8">
              <Brain className="w-16 h-16 text-green-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{t("ai.helper.title", { ns: "about" })}</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{t("ai.helper.description", { ns: "about" })}</p>
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

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">{t("ai.analysis.title", { ns: "about" })}</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• {aiAnalysisItems[0]}</li>
                <li>• {aiAnalysisItems[1]}</li>
                <li>• {aiAnalysisItems[2]}</li>
                <li>• {aiAnalysisItems[3]}</li>
                <li>• {aiAnalysisItems[4]}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">{t("ai.results.title", { ns: "about" })}</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• {aiResultsItems[0]}</li>
                <li>• {aiResultsItems[1]}</li>
                <li>• {aiResultsItems[2]}</li>
                <li>• {aiResultsItems[3]}</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Promotion block moved into this component for cohesion */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-16">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">{t("ai.promotion.title", { ns: "about" })}</h3>
                <p className="text-gray-400">{t("ai.promotion.subtitle", { ns: "about" })}</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">{t("ai.promotion.description", { ns: "about" })}</p>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-300 italic">
                <strong>{t("ai.promotion.example", { ns: "about" })}</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">{t("ai.promotion.usage.title", { ns: "about" })}</h4>
                <ul className="space-y-2 text-gray-300">
                  { (t("ai.promotion.usage.items", { ns: "about", returnObjects: true }) as string[]).map((it, i) => (
                    <li key={i}>• {it}</li>
                  )) }
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">{t("ai.promotion.businessResults.title", { ns: "about" })}</h4>
                <ul className="space-y-2 text-gray-300">
                  { (t("ai.promotion.businessResults.items", { ns: "about", returnObjects: true }) as string[]).map((it, i) => (
                    <li key={i}>• {it}</li>
                  )) }
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
