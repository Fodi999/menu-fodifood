import 'react-i18next';

// import all namespaces (for the default language, only)
import ns1 from './locales/en/ns1.json';
import common from './locales/en/common.json';
import home from './locales/en/home.json';
import auth from './locales/en/auth.json';
import profile from './locales/en/profile.json';
import chat from './locales/en/chat.json';
import business from './locales/en/business.json';
import invest from './locales/en/invest.json';
import cart from './locales/en/cart.json';
import admin from './locales/en/admin.json';
import about from './locales/en/about.json';

declare module 'react-i18next' {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: 'common';
    // custom resources type
    resources: {
      ns1: typeof ns1;
      common: typeof common;
      home: typeof home;
      auth: typeof auth;
      profile: typeof profile;
      chat: typeof chat;
      business: typeof business;
      invest: typeof invest;
      cart: typeof cart;
      admin: typeof admin;
      about: typeof about;
    };
  }
}