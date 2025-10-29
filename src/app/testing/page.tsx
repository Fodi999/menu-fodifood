/**
 * 🧪 Testing Dashboard
 * Страница для тестирования всех улучшений API и Providers
 */

"use client";

import { ToasterDemo } from "@/components/ToasterDemo";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function TestingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Language Switcher для тестирования */}
      <LanguageSwitcher />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">{t('testing.title')}</h1>
        <p className="text-muted-foreground mb-8">
          {t('testing.subtitle')}
        </p>

        <div className="grid gap-6">
          {/* Language Testing Section */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{t('testing.languageTesting')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('testing.languageDescription')}
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t('testing.languageInstructions')}
              </p>
            </div>
          </section>

          {/* Toaster Demo Section */}
          <section className="border rounded-lg p-6">
            <ToasterDemo />
          </section>

          {/* API Status Section */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{t('testing.apiStatus')}</h2>
            <div className="space-y-2 text-sm">
              <p>{t('testing.mockApi')}</p>
              <p>{t('testing.rustBackend')}</p>
              <p>{t('testing.sessionCache')}</p>
              <p>{t('testing.gracefulFallback')}</p>
            </div>
          </section>

          {/* Error Logger Section */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{t('testing.errorLogger')}</h2>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
              <div>
                <code className="text-primary">window.errorLogger.getLogs()</code>
                <span className="text-muted-foreground ml-2">{t('testing.viewLogs')}</span>
              </div>
              <div>
                <code className="text-primary">window.errorLogger.downloadLogs()</code>
                <span className="text-muted-foreground ml-2">{t('testing.downloadLogs')}</span>
              </div>
              <div>
                <code className="text-primary">window.errorLogger.clearLogs()</code>
                <span className="text-muted-foreground ml-2">{t('testing.clearLogs')}</span>
              </div>
            </div>
          </section>

          {/* Providers Info Section */}
          <section className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{t('testing.activeProviders')}</h2>
            <ul className="space-y-2">
              <li>{t('testing.authProvider')}</li>
              <li>{t('testing.roleProvider')}</li>
              <li>{t('testing.businessProvider')}</li>
              <li>{t('testing.i18nextProvider')}</li>
              <li>{t('testing.uiEvents')}</li>
              <li>{t('testing.toaster')}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
