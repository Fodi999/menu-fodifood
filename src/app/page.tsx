import type { Metadata } from "next";
import { HeroSection } from "@/components/Resume/HeroSection";
import { SkillsSection } from "@/components/Resume/SkillsSection";
import { ExperienceSection } from "@/components/Resume/ExperienceSection";
import { PortfolioSection } from "@/components/Resume/PortfolioSection";
import { ContactSection } from "@/components/Resume/ContactSection";
import { ResumeNavbar } from "@/components/Resume/ResumeNavbar";
import { ResumeFooter } from "@/components/Resume/ResumeFooter";
import { ScrollToTop } from "@/components/Resume/ScrollToTop";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Dmytro Fomin - Szef Kuchni | Professional Chef",
  description:
    "Profesjonalny kucharz z 20-letnim doświadczeniem w pracy w restauracjach w Polsce, Litwie, Estonii, Niemczech, Francji i Kanadzie. Specjalizacja: owoce morza, kuchnia autorska, boulangerie.",
  keywords: [
    "kucharz",
    "szef kuchni",
    "chef",
    "owoce morza",
    "kuchnia autorska",
    "Gdańsk",
    "Dmytro Fomin",
    "FodiFood",
  ],
  openGraph: {
    title: "Dmytro Fomin - Professional Chef",
    description:
      "Profesjonalny kucharz z 20-letnim międzynarodowym doświadczeniem",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <StructuredData />
      <ResumeNavbar />
      <main>
        <HeroSection />
        <SkillsSection />
        <ExperienceSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <ResumeFooter />
      <ScrollToTop />
    </div>
  );
}
