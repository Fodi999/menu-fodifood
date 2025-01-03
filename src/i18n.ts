import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ns1_en from "./locales/en/ns1.json";
import ns2_en from "./locales/en/ns2.json";
import ns1_ru from "./locales/ru/ns1.json";
import ns2_ru from "./locales/ru/ns2.json";
import ns1_pl from "./locales/pl/ns1.json";
import ns2_pl from "./locales/pl/ns2.json";

const resources = {
  en: { ns1: ns1_en, ns2: ns2_en },
  ru: { ns1: ns1_ru, ns2: ns2_ru },
  pl: { ns1: ns1_pl, ns2: ns2_pl },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: ["ns1", "ns2"], // Указываем все пространства имён
    defaultNS: "ns1",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;












