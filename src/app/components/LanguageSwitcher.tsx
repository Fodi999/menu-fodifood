"use client";

import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (langCode: string) => {
    console.log("Переключение языка на:", langCode);
    i18n
      .changeLanguage(langCode)
      .then(() => {
        console.log("Язык успешно переключен на:", langCode);
      })
      .catch((err) => {
        console.error("Ошибка при переключении языка:", err);
      });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed left-3 sm:left-4 bottom-16 sm:bottom-20 h-12 w-12 sm:h-14 sm:w-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        >
          <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-48 p-2 bg-gray-800 border-gray-700 text-white" 
        side="top"
        align="start"
      >
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase">
            Выберите язык
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                i18n.language === lang.code
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
              {i18n.language === lang.code && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}









