import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: {
        pages: Array<{
          title: string;
          description: string;
          image: string;
          buttonText: string;
        }>;
        recipesSections: string[];
        siteMetadata: {
          title: string;
          description: string;
          contactAlert: string;
          languageSwitchAlert: string;
        };
        buttonLabels: {
          home: string;
          blog: string;
          contact: string;
          language: string;
          myRecipes: string;
          close: string;
          continueReading: string;
          showLess: string;
        };
      };
    };
  }
}




