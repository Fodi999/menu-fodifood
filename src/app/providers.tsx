"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useEffect } from "react";
import i18n from "@/i18n";
import { AuthProvider } from "@/contexts/AuthContext";
import errorLogger from "@/lib/errorLogger";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Инициализируем логгер ошибок
  useEffect(() => {
    if (errorLogger) {
      console.log("✅ Error logger initialized");
      console.log("💡 Tip: используйте window.errorLogger.downloadLogs() для скачивания логов");
    }
  }, []);

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </AuthProvider>
  );
}
