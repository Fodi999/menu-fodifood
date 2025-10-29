"use client";

import { Mail, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutFooter() {
  const { t } = useTranslation(["about"]);

  return (
    <footer className="border-t border-gray-800/50 py-8 sm:py-12 px-4 sm:px-6 bg-black/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-2 sm:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">{t("footer.brand", { ns: "about" })}</h3>
            <p className="text-gray-400 text-sm">{t("footer.subtitle", { ns: "about" })}</p>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>{t("footer.copyright", { ns: "about" })}</span>
            <span>•</span>
            <a href="mailto:fodi85999@gmail.com" className="hover:text-orange-400 transition-colors flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {t("footer.email", { ns: "about" })}
            </a>
            <span>•</span>
            <a href="https://www.instagram.com/fodifood?igsh=aXZqbjZmNWhsNzNn" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">
              <Instagram className="w-4 h-4" />
              {t("footer.instagram", { ns: "about" })}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-500 text-sm">
          <p>{t("footer.credits", { ns: "about" })}</p>
        </div>
      </div>
    </footer>
  );
}
