// Deep partial type helper
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U>
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

export interface ResumeData {
  hero: {
    name: string;
    role: string;
    description: string;
    avatar: string;
    email: string;
    phone: string;
    telegram: string;
  };
  skills: {
    culinary: string[];
    soft: string[];
    certificates: string[];
    technical: string[];
  };
  experience: Array<{
    id: string;
    period: string;
    position: string;
    company: string;
    responsibilities: string[];
    achievements: string[];
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    category: string;
    image: string;
  }>;
  contact: {
    email: string;
    phone: string;
    telegram: string;
    location: string;
  };
}

export const defaultResumeData: ResumeData = {
  hero: {
    name: "Dmytro Fomin",
    role: "Szef Kuchni / Chef",
    description: "Profesjonalny kucharz z 20-letnim doświadczeniem w pracy w restauracjach w różnych krajach: Polsce, Litwie, Estonii, Niemczech, Francji i Kanadzie. Specjalizuję się w tworzeniu nowych produktów, kontroli jakości i szkoleniu personelu.",
    avatar: "/products/california.jpg",
    email: "fodi85999@gmail.com",
    phone: "+48 576 212 418",
    telegram: "@fodifood",
  },
  skills: {
    culinary: [
      "Owoce morza",
      "Kuchnia autorska",
      "Opracowywanie nowych produktów",
      "Badanie jakości produktów",
      "Boulangerie & Patisserie",
      "Konfigurowanie procesów produkcyjnych",
    ],
    soft: [
      "Celowy i towarzyski",
      "Odporny na stres",
      "Pomysłowy i kreatywny",
      "Szkolenie personelu",
      "Zarządzanie zespołem",
      "Znajomość produktów",
    ],
    certificates: [
      "Dyplomowany kucharz z wyróżnieniem",
      "HACCP",
      "Sprawozdanie z badań Nr. 17061/562/2023",
      "Staż w restauracji Charlie's",
    ],
    technical: [
      "Zakup urządzeń produkcyjnych",
      "Zwiększanie trwałości produktów",
      "Kontrola jakości",
      "Optymalizacja procesów",
    ],
  },
  experience: [
    {
      id: "1",
      period: "01.12.2022 — 01.08.2023",
      position: "Kucharz",
      company: "Boulangerie Patisserie WAWEL - Montreal, Canada",
      responsibilities: [
        "Praca w piekarni-cukierni",
        "Produkcja wypieków i deserów",
        "Kontrola jakości produktów",
        "Praca w międzynarodowym zespole",
      ],
      achievements: [
        "Opanowanie technik boulangerie i patisserie",
        "Doświadczenie pracy w Kanadzie",
      ],
    },
    {
      id: "2",
      period: "10.06.2022 — 16.11.2022",
      position: "Kucharz - Owoce morza",
      company: "Restauracja Charlemagne - Agde, Francja",
      responsibilities: [
        "Specjalizacja w owocach morza",
        "Przygotowanie dań z świeżych produktów morskich",
        "Praca w restauracji śródziemnomorskiej",
        "Utrzymanie standardów jakości",
      ],
      achievements: [
        "Doświadczenie w kuchni francuskiej",
        "Specjalizacja w owocach morza",
      ],
    },
    {
      id: "3",
      period: "10.06.2018 — 01.06.2022",
      position: "Szef Kuchni",
      company: "FISH in HOUSE - Dniepr, Ukraina",
      responsibilities: [
        "Opracowywanie nowych produktów",
        "Badanie jakości i zwiększanie trwałości",
        "Zakup urządzeń do procesów produkcyjnych",
        "Szkolenie personelu i HACCP",
        "Konfigurowanie procesów produkcyjnych",
      ],
      achievements: [
        "Zwiększenie wolumenów sprzedaży",
        "Wdrożenie systemu HACCP",
        "Optymalizacja procesów produkcyjnych",
        "Rozwinięcie nowych linii produktowych",
      ],
    },
    {
      id: "4",
      period: "01.05.2017 — 20.05.2018",
      position: "Kucharz",
      company: "Restauracja Autorska Miód Malina - Zgorzelec, Polska",
      responsibilities: [
        "Przygotowanie dań kuchni autorskiej",
        "Praca w restauracji",
        "Współpraca z zespołem kuchennym",
      ],
      achievements: [
        "Doświadczenie w kuchni polskiej",
        "Praca w restauracji autorskiej",
      ],
    },
  ],
  portfolio: [
    {
      id: "1",
      title: "Sushi Philadelphia",
      category: "Sushi",
      image: "/products/philadelphia.jpg",
    },
    {
      id: "2",
      title: "California Roll",
      category: "Sushi",
      image: "/products/california.jpg",
    },
    {
      id: "3",
      title: "Nigiri z łososiem",
      category: "Sushi",
      image: "/products/nigiri-salmon.jpg",
    },
    {
      id: "4",
      title: "Mix Set",
      category: "Sety",
      image: "/products/mix-set.jpg",
    },
    {
      id: "5",
      title: "Napoje",
      category: "Napoje",
      image: "/products/cola.jpg",
    },
    {
      id: "6",
      title: "Danie autorskie",
      category: "Główne",
      image: "/products/california.jpg",
    },
  ],
  contact: {
    email: "fodi85999@gmail.com",
    phone: "+48 576 212 418",
    telegram: "@fodifood",
    location: "Gdańsk, Polska - ul. Wilhelma Stryjewskiego 39A/21, 80-631",
  },
};
