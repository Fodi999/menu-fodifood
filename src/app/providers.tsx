"use client";

import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { useUIEvents } from "@/hooks/useUIEvents";
import errorLogger from "@/lib/errorLogger";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Внутренний слой — инициализация UI Events, Role и Business контекстов.
 * Работает только на клиенте.
 */
function ProvidersInner({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { isConnected } = useUIEvents();

  useEffect(() => {
    if (isConnected) console.log("✅ UI Events system active");
  }, [isConnected]);

  return (
    <RoleProvider user={user}>
      <BusinessProvider initialBusinessId={user?.business_id}>
        <I18nextProvider i18n={i18n}>
          {children}
          {/* Global Toast System */}
          <Toaster
            position="top-right"
            theme="dark"
            expand
            richColors
            visibleToasts={3}
          />
        </I18nextProvider>
      </BusinessProvider>
    </RoleProvider>
  );
}

/**
 * Глобальный провайдер приложения
 * — оборачивает Auth, Role, Business, i18n и UI Events
 */
export function Providers({ children }: ProvidersProps) {
  // Инициализация логгера ошибок один раз
  useEffect(() => {
    if (typeof window !== "undefined" && errorLogger) {
      console.log("✅ Error logger initialized");
      console.log(
        "💡 Tip: используйте window.errorLogger.downloadLogs() для скачивания логов"
      );
      // Подключаем логгер в window для быстрого доступа
      (window as any).errorLogger = errorLogger;
    }
  }, []);

  return (
    <AuthProvider>
      <ProvidersInner>{children}</ProvidersInner>
    </AuthProvider>
  );
}
