import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Старые файлы (для обратной совместимости)
import ns1_en from "./locales/en/ns1.json";
import ns1_pl from "./locales/pl/ns1.json";
import ns1_ru from "./locales/ru/ns1.json";

// Модульные файлы переводов - Английский
import common_en from "./locales/en/common.json";
import home_en from "./locales/en/home.json";
import auth_en from "./locales/en/auth.json";
import profile_en from "./locales/en/profile.json";
import chat_en from "./locales/en/chat.json";
import business_en from "./locales/en/business.json";
import invest_en from "./locales/en/invest.json";
import cart_en from "./locales/en/cart.json";
import admin_en from "./locales/en/admin.json";

// Модульные файлы переводов - Русский
import common_ru from "./locales/ru/common.json";
import home_ru from "./locales/ru/home.json";
import auth_ru from "./locales/ru/auth.json";
import profile_ru from "./locales/ru/profile.json";
import chat_ru from "./locales/ru/chat.json";
import business_ru from "./locales/ru/business.json";
import invest_ru from "./locales/ru/invest.json";
import cart_ru from "./locales/ru/cart.json";
import admin_ru from "./locales/ru/admin.json";

// Модульные файлы переводов - Польский
import common_pl from "./locales/pl/common.json";
import home_pl from "./locales/pl/home.json";
import auth_pl from "./locales/pl/auth.json";
import profile_pl from "./locales/pl/profile.json";
import chat_pl from "./locales/pl/chat.json";
import business_pl from "./locales/pl/business.json";
import invest_pl from "./locales/pl/invest.json";
import cart_pl from "./locales/pl/cart.json";
import admin_pl from "./locales/pl/admin.json";

const resources = {
  en: { 
    ns1: ns1_en,
    common: common_en,
    home: home_en,
    auth: auth_en,
    profile: profile_en,
    chat: chat_en,
    business: business_en,
    invest: invest_en,
    cart: cart_en,
    admin: admin_en
  },
  ru: { 
    ns1: ns1_ru,
    common: common_ru,
    home: home_ru,
    auth: auth_ru,
    profile: profile_ru,
    chat: chat_ru,
    business: business_ru,
    invest: invest_ru,
    cart: cart_ru,
    admin: admin_ru
  },
  pl: { 
    ns1: ns1_pl,
    common: common_pl,
    home: home_pl,
    auth: auth_pl,
    profile: profile_pl,
    chat: chat_pl,
    business: business_pl,
    invest: invest_pl,
    cart: cart_pl,
    admin: admin_pl
  },
};

i18n
  .use(LanguageDetector) // Автоматическое определение языка
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru", // Язык по умолчанию (русский для FODI)
    fallbackLng: "en", // Запасной язык
    ns: ["ns1", "common", "home", "auth", "profile", "chat", "business", "invest", "cart", "admin"], // Все пространства имен
    defaultNS: "common", // Namespace по умолчанию (общие переводы)
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Порядок определения языка
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Ключ для хранения языка в localStorage
      lookupLocalStorage: 'i18nextLng',
      // Кэшировать выбранный язык
      caches: ['localStorage'],
    },
  });

export default i18n;















