"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function CTA() {
  const { t } = useTranslation(["about"]);
  return (
    <section id="contact" className="py-20 sm:py-32 px-4 sm:px-6 bg-black/20">
      <div className="max-w-4xl mx-auto text-center px-2 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">{t("cta.title", { ns: "about" })}</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">{t("cta.subtitle", { ns: "about" })}</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">{t("cta.description", { ns: "about" })}</p>

          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-6 sm:p-8 mb-8 max-w-2xl mx-auto">
            <p className="text-lg text-orange-400 font-bold mb-4">{t("cta.offer.title", { ns: "about" })}</p>
            <p className="text-gray-300">{t("cta.offer.subtitle", { ns: "about" })}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-2 sm:px-0">
            <Link href="/auth/signup" className="w-full sm:w-auto text-center px-6 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold text-lg sm:text-xl rounded-xl shadow-2xl hover:shadow-orange-400/50 hover:scale-110 transition-all duration-300">{t("cta.buttons.start", { ns: "about" })}</Link>
            <Link href="mailto:fodi85999@gmail.com" className="w-full sm:w-auto text-center px-6 sm:px-12 py-4 sm:py-6 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 font-semibold">{t("cta.buttons.consultation", { ns: "about" })}</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
