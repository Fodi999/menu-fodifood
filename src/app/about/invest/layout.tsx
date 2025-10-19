import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Для инвесторов | FODI Market",
  description: "FODI для инвесторов: FODI Token, дивиденды, прозрачность, диверсификация, стейкинг до 18% APY и NFT-сертификаты. Купить токены FODI.",
  keywords: ["инвестиции", "FODI Token", "стейкинг", "дивиденды", "APY", "NFT", "токеномика"],
  openGraph: {
    title: "Для инвесторов | FODI Market",
    description: "FODI для инвесторов: токены, дивиденды, стейкинг до 18% APY и NFT-сертификаты.",
    type: "website",
  },
};

export default function InvestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
