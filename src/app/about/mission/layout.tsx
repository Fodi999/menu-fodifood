import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Миссия FODI | FODI Market",
  description: "Философия, цели и видение будущего FODI Market — метавселенной, объединяющей AI, Web3 и реальные бизнесы в единую экосистему.",
  keywords: ["миссия", "философия", "FODI", "цели", "видение", "метавселенная"],
  openGraph: {
    title: "Миссия FODI | FODI Market",
    description: "Философия, цели и видение будущего FODI Market — метавселенной, объединяющей AI, Web3 и реальные бизнесы.",
    type: "website",
  },
};

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
