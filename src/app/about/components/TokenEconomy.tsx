"use client";

import { motion } from "framer-motion";
import { Wallet, CreditCard, Gift, ShoppingCart, Users, Building, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TokenEconomy() {
  const { t } = useTranslation(["about"]);
  const tokenWalletFeatures = t("token.wallet.features", { ns: "about", returnObjects: true }) as string[];
  const tokenEconomyItems = t("token.economy.items", { ns: "about", returnObjects: true }) as Array<any>;

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Wallet className="w-12 h-12 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{t("token.title", { ns: "about" })}</span>
              <Wallet className="w-12 h-12 text-yellow-400" />
            </div>
            <br />
            <span className="text-2xl text-gray-300">{t("token.subtitle", { ns: "about" })}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{t("token.description", { ns: "about" })}</p>
        </motion.div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-8">
              <Wallet className="w-16 h-16 text-yellow-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{t("token.wallet.title", { ns: "about" })}</h3>
              <p className="text-gray-300 leading-relaxed mb-6">{t("token.wallet.description", { ns: "about" })}</p>
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

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-3">{t("token.economy.title", { ns: "about" })}</h4>
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
  );
}
