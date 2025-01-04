import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ns1_en from "./locales/en/ns1.json";
import ns1_pl from "./locales/pl/ns1.json";
import ns1_ru from "./locales/ru/ns1.json";

const resources = {
  en: { ns1: ns1_en },
  pl: { ns1: ns1_pl },
  ru: { ns1: ns1_ru },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Язык по умолчанию
    fallbackLng: "en", // Запасной язык
    ns: ["ns1"], // Пространства имен
    defaultNS: "ns1",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;















