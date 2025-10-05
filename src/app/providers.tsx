"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode } from "react";
import i18n from "@/i18n";
import { AuthProvider } from "@/contexts/AuthContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </AuthProvider>
  );
}
