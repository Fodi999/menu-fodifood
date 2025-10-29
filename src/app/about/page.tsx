"use client";

import Features from "./components/Features";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import AIHelper from "./components/AIHelper";
import TokenEconomy from "./components/TokenEconomy";
import TrainingConsulting from "./components/TrainingConsulting";
import TargetAudience from "./components/TargetAudience";
import Technologies from "./components/Technologies";
import ProjectGoal from "./components/ProjectGoal";
import CTA from "./components/CTA";
import AboutFooter from "./components/Footer";

export default function AboutPage() {
  // sections moved to components under ./components

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] text-gray-100">
      <Hero />

      <Experience />

      {/* WHAT FOODI.AI DOES (moved to component) */}
      <Features />

      <AIHelper />

      <TokenEconomy />

      <TrainingConsulting />

      <TargetAudience />

      <Technologies />

      <ProjectGoal />

      <CTA />

      <AboutFooter />
    </div>
  );
}
