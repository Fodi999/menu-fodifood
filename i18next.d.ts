import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: {
        welcome: string;
      };
      ns2: {
        button: string;
        switchToRussian: string;
        switchToPolish: string;
        switchToEnglish: string;
      };
    };
  }
}




