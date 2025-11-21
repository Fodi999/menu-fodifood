"use client";

import { Separator } from "@/components/ui/separator";
import { useResume } from "@/contexts/ResumeContext";

export function ResumeFooter() {
  const currentYear = new Date().getFullYear();
  const { resumeData } = useResume();
  const { hero } = resumeData;

  return (
    <footer className="py-8 px-4 border-t">
      <div className="max-w-6xl mx-auto">
        <Separator className="mb-6" />
        <div className="text-center text-sm text-muted-foreground">
          <p>© {currentYear} {hero.name}. Wszelkie prawa zastrzeżone.</p>
          <p className="mt-2">
            Professional Chef | 20 lat doświadczenia
          </p>
        </div>
      </div>
    </footer>
  );
}
