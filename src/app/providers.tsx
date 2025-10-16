"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useEffect } from "react";
import i18n from "@/i18n";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { useUIEvents } from "@/hooks/useUIEvents";
import errorLogger from "@/lib/errorLogger";
import { Toaster } from "sonner"; // Добавляем toast notifications

interface ProvidersProps {
  children: ReactNode;
}

// Внутренний компонент для доступа к AuthContext и UI Events
function ProvidersInner({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { isConnected } = useUIEvents(); // Подключаем UI events

  useEffect(() => {
    if (isConnected) {
      console.log('✅ UI Events system active');
    }
  }, [isConnected]);

  return (
    <RoleProvider user={user}>
      <BusinessProvider initialBusinessId={user?.business_id}>
        <I18nextProvider i18n={i18n}>
          {children}
          <Toaster position="top-right" richColors />
        </I18nextProvider>
      </BusinessProvider>
    </RoleProvider>
  );
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
      <ProvidersInner>
        {children}
      </ProvidersInner>
    </AuthProvider>
  );
}
