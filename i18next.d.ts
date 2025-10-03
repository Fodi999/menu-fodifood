import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: {
        hero: {
          title: string;
          subtitle: string;
          description: string;
          orderButton: string;
          viewMenuButton: string;
        };
        menu: {
          title: string;
          categories: string[];
        };
        products: Array<{
          id: number;
          name: string;
          category: string;
          description: string;
          price: number;
          image: string;
          weight: string;
        }>;
        cart: {
          title: string;
          empty: string;
          total: string;
          checkout: string;
          continueShopping: string;
          addToCart: string;
          remove: string;
          quantity: string;
        };
        order: {
          title: string;
          name: string;
          phone: string;
          address: string;
          comment: string;
          submit: string;
          success: string;
          deliveryTime: string;
          minOrder: string;
        };
        siteMetadata: {
          title: string;
          description: string;
          contactAlert: string;
          deliveryInfo: string;
        };
        buttonLabels: {
          home: string;
          menu: string;
          about: string;
          contact: string;
          language: string;
          cart: string;
          close: string;
          viewDetails: string;
          orderNow: string;
        };
        footer: {
          workingHours: string;
          phone: string;
          email: string;
          social: string;
        };
      };
    };
  }
}




