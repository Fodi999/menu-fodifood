"use client";

import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";
import { ReactNode } from "react";
import i18n from "@/i18n";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      // Обновлять сессию каждые 5 минут
      refetchInterval={5 * 60}
      // Обновлять сессию при фокусе на окне
      refetchOnWindowFocus={true}
    >
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </SessionProvider>
  );
}
