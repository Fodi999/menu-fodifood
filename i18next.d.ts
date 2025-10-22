import "i18next";
import common_ru from "./src/locales/ru/common.json";
import home_ru from "./src/locales/ru/home.json";
import auth_ru from "./src/locales/ru/auth.json";
import profile_ru from "./src/locales/ru/profile.json";
import chat_ru from "./src/locales/ru/chat.json";
import business_ru from "./src/locales/ru/business.json";
import invest_ru from "./src/locales/ru/invest.json";
import cart_ru from "./src/locales/ru/cart.json";
import admin_ru from "./src/locales/ru/admin.json";
import ns1_ru from "./src/locales/ru/ns1.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common_ru;
      home: typeof home_ru;
      auth: typeof auth_ru;
      profile: typeof profile_ru;
      chat: typeof chat_ru;
      business: typeof business_ru;
      invest: typeof invest_ru;
      cart: typeof cart_ru;
      admin: typeof admin_ru;
      ns1: typeof ns1_ru;
    };
  }
}




