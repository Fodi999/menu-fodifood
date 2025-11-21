"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ResumeProvider } from "@/contexts/ResumeContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ResumeProvider>
        {children}
        <Toaster position="top-right" richColors />
      </ResumeProvider>
    </ThemeProvider>
  );
}
