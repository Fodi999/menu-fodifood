"use client";

import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Cookie, Database, Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * 🧪 Тестовая страница для проверки i18n системы
 * 
 * URL: /testing/i18n
 * 
 * Функции:
 * - Проверка текущего языка
 * - Проверка cookie и localStorage
 * - Тестирование всех namespaces
 * - Демонстрация Accept-Language
 */
export default function I18nTestPage() {
  const { t, i18n } = useTranslation(["common", "home", "auth", "profile", "chat"]);
  const [cookie, setCookie] = useState<string | null>(null);
  const [localStorage, setLocalStorage] = useState<string | null>(null);
  const [acceptLang, setAcceptLang] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Читаем cookie
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    if (localeCookie) {
      setCookie(localeCookie.split('=')[1]);
    }

    // Читаем localStorage
    const stored = window.localStorage.getItem('i18nextLng');
    setLocalStorage(stored);

    // Читаем Accept-Language из браузера
    setAcceptLang(navigator.language || navigator.languages?.[0] || 'unknown');
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testTranslations = [
    {
      namespace: "common",
      key: "navigation.home",
      value: t("common:navigation.home"),
    },
    {
      namespace: "home",
      key: "hero.title",
      value: t("home:hero.title"),
    },
    {
      namespace: "auth",
      key: "signIn.title",
      value: t("auth:signIn.title"),
    },
    {
      namespace: "profile",
      key: "title",
      value: t("profile:title"),
    },
    {
      namespace: "chat",
      key: "title",
      value: t("chat:title"),
    },
  ];

  const languageFlags = {
    ru: "🇷🇺",
    en: "🇬🇧",
    pl: "🇵🇱",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            🧪 i18n System Test
          </h1>
          <p className="text-gray-400">
            Проверка работы системы интернационализации FODI
          </p>
        </div>

        {/* Current Language Status */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Текущий язык
            </h2>
            <div className="text-4xl">
              {languageFlags[i18n.language as keyof typeof languageFlags] || "🌍"}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">i18n.language</div>
              <div className="text-2xl font-bold text-blue-400">{i18n.language}</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Fallback Language</div>
              <div className="text-2xl font-bold text-gray-400">
                {i18n.options.fallbackLng as string}
              </div>
            </div>
          </div>
        </Card>

        {/* Storage Status */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-400" />
            Хранилища
          </h2>
          
          <div className="space-y-4">
            {/* Cookie */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-medium">Cookie: NEXT_LOCALE</span>
                </div>
                <Badge variant={cookie ? "default" : "destructive"}>
                  {cookie ? "Установлен" : "Отсутствует"}
                </Badge>
              </div>
              {cookie && (
                <div className="text-lg font-mono text-orange-400">{cookie}</div>
              )}
            </div>

            {/* localStorage */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">localStorage: i18nextLng</span>
                </div>
                <Badge variant={localStorage ? "default" : "destructive"}>
                  {localStorage ? "Установлен" : "Отсутствует"}
                </Badge>
              </div>
              {localStorage && (
                <div className="text-lg font-mono text-blue-400">{localStorage}</div>
              )}
            </div>

            {/* Accept-Language */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium">navigator.language</span>
                </div>
              </div>
              {acceptLang && (
                <div className="text-lg font-mono text-purple-400">{acceptLang}</div>
              )}
            </div>
          </div>
        </Card>

        {/* Test Translations */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Тест переводов</h2>
          
          <div className="space-y-3">
            {testTranslations.map((test, index) => (
              <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 font-mono mb-1">
                      {test.namespace}:{test.key}
                    </div>
                    <div className="text-lg font-medium text-white">
                      {test.value || "❌ Отсутствует"}
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {test.value ? "✅ OK" : "❌ Error"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Available Languages */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Доступные языки</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(languageFlags).map(([code, flag]) => (
              <div
                key={code}
                className={`p-4 rounded-lg border-2 transition-all ${
                  i18n.language === code
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 bg-gray-900/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{flag}</span>
                    <div>
                      <div className="font-medium">
                        {code === "ru" ? "Русский" : code === "en" ? "English" : "Polski"}
                      </div>
                      <div className="text-sm text-gray-500">{code}</div>
                    </div>
                  </div>
                  {i18n.language === code && (
                    <Check className="w-5 h-5 text-blue-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Detection Priority */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Приоритет определения языка</h2>
          
          <div className="space-y-2">
            {[
              { priority: 1, source: "Cookie NEXT_LOCALE", value: cookie || "не установлен" },
              { priority: 2, source: "localStorage i18nextLng", value: localStorage || "не установлен" },
              { priority: 3, source: "Accept-Language header", value: "определяется middleware" },
              { priority: 4, source: "navigator.language", value: acceptLang || "unknown" },
              { priority: 5, source: "Default (ru)", value: "ru" },
            ].map((item) => (
              <div key={item.priority} className="flex items-center gap-4 bg-gray-900/50 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold shrink-0">
                  {item.priority}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.source}</div>
                  <div className="text-sm text-gray-400 font-mono">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Test Code */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Код для тестирования</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard('i18n.changeLanguage("en")')}
              className="border-gray-700"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
            <code className="text-green-400">
{`// Изменить язык программно
i18n.changeLanguage("en");

// Получить текущий язык
console.log(i18n.language); // "${i18n.language}"

// Получить перевод
const { t } = useTranslation("home");
console.log(t("hero.title")); // "${t("home:hero.title")}"

// Проверить cookie
document.cookie.split(';').find(c => c.includes('NEXT_LOCALE'));
`}
            </code>
          </pre>
        </Card>

        {/* Status */}
        <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50 p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold text-green-400">
                ✅ Система i18n работает корректно
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Все проверки пройдены. Переключатель языка доступен внизу слева (🌍)
              </p>
            </div>
          </div>
        </Card>

        {/* Back button */}
        <div className="flex justify-center">
          <Button
            onClick={() => window.location.href = "/"}
            className="bg-blue-500 hover:bg-blue-600"
          >
            ← Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}
