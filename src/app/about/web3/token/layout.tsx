import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Токен FODI | FODI Market",
  description: "FODI Token — utility-токен экосистемы для транзакций, стейкинга и вознаграждений. Токеномика: 1 млрд FODI, распределение для бизнеса, пользователей и инвесторов.",
  keywords: ["FODI Token", "токеномика", "стейкинг", "криптовалюта", "utility token", "Web3", "инвестиции"],
  openGraph: {
    title: "Токен FODI | FODI Market",
    description: "FODI Token — utility-токен экосистемы для транзакций, стейкинга и вознаграждений.",
    type: "website",
  },
};

export default function TokenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
