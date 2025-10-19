import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web3 и Токенизация | FODI Market",
  description: "Экосистема Web3 FODI: NFT, цифровая экономика, блокчейн, FODI Token и децентрализованная биржа для токенизированных бизнесов.",
  keywords: ["Web3", "токенизация", "NFT", "блокчейн", "FODI Token", "криптовалюта", "DeFi"],
  openGraph: {
    title: "Web3 и Токенизация | FODI Market",
    description: "Экосистема Web3 FODI: NFT, цифровая экономика, блокчейн и FODI Token.",
    type: "website",
  },
};

export default function Web3Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
