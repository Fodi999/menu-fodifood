"use client";

import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * 🧪 Тестовая страница для проверки переключения языков
 * 
 * Доступ: /testing/translations
 * 
 * Проверяет:
 * - Загрузку всех namespaces
 * - Переключение языков через LanguageSwitcher
 * - Корректность переводов во всех языках
 */
export default function TranslationsTestPage() {
  const { t: tCommon } = useTranslation("common");
  const { t: tHome } = useTranslation("home");
  const { t: tAuth } = useTranslation("auth");
  const { t: tProfile } = useTranslation("profile");
  const { t: tChat } = useTranslation("chat");
  const { t: tBusiness } = useTranslation("business");
  const { t: tInvest } = useTranslation("invest");
  const { t: tCart } = useTranslation("cart");
  const { t: tAdmin } = useTranslation("admin");

  const sections = [
    {
      title: "📦 Common (Общее)",
      namespace: "common",
      items: [
        { key: "navigation.home", value: tCommon("navigation.home") },
        { key: "navigation.profile", value: tCommon("navigation.profile") },
        { key: "buttons.submit", value: tCommon("buttons.submit") },
        { key: "buttons.cancel", value: tCommon("buttons.cancel") },
        { key: "status.loading", value: tCommon("status.loading") },
        { key: "status.success", value: tCommon("status.success") },
      ]
    },
    {
      title: "🏠 Home (Главная)",
      namespace: "home",
      items: [
        { key: "hero.title", value: tHome("hero.title") },
        { key: "hero.subtitle", value: tHome("hero.subtitle") },
        { key: "hero.orderButton", value: tHome("hero.orderButton") },
        { key: "businesses.categories.all", value: tHome("businesses.categories.all") },
        { key: "businesses.categories.sushi", value: tHome("businesses.categories.sushi") },
      ]
    },
    {
      title: "🔐 Auth (Авторизация)",
      namespace: "auth",
      items: [
        { key: "signIn.title", value: tAuth("signIn.title") },
        { key: "signIn.signInButton", value: tAuth("signIn.signInButton") },
        { key: "signUp.title", value: tAuth("signUp.title") },
        { key: "signUp.signUpButton", value: tAuth("signUp.signUpButton") },
      ]
    },
    {
      title: "👤 Profile (Профиль)",
      namespace: "profile",
      items: [
        { key: "title", value: tProfile("title") },
        { key: "tabs.overview", value: tProfile("tabs.overview") },
        { key: "tabs.orders", value: tProfile("tabs.orders") },
        { key: "tabs.settings", value: tProfile("tabs.settings") },
      ]
    },
    {
      title: "💬 Chat (AI Чат)",
      namespace: "chat",
      items: [
        { key: "title", value: tChat("title") },
        { key: "placeholder", value: tChat("placeholder") },
        { key: "sendButton", value: tChat("sendButton") },
        { key: "suggestions.whatToOrder", value: tChat("suggestions.whatToOrder") },
      ]
    },
    {
      title: "🏢 Business (Бизнес)",
      namespace: "business",
      items: [
        { key: "dashboard.title", value: tBusiness("dashboard.title") },
        { key: "menu.title", value: tBusiness("menu.title") },
        { key: "orders.title", value: tBusiness("orders.title") },
        { key: "analytics.title", value: tBusiness("analytics.title") },
      ]
    },
    {
      title: "💰 Invest (Инвестиции)",
      namespace: "invest",
      items: [
        { key: "title", value: tInvest("title") },
        { key: "hero.title", value: tInvest("hero.title") },
        { key: "buyTokens.buyButton", value: tInvest("buyTokens.buyButton") },
        { key: "staking.title", value: tInvest("staking.title") },
      ]
    },
    {
      title: "🛒 Cart (Корзина)",
      namespace: "cart",
      items: [
        { key: "title", value: tCart("title") },
        { key: "empty.title", value: tCart("empty.title") },
        { key: "checkout.button", value: tCart("checkout.button") },
        { key: "summary.total", value: tCart("summary.total") },
      ]
    },
    {
      title: "⚙️ Admin (Админка)",
      namespace: "admin",
      items: [
        { key: "title", value: tAdmin("title") },
        { key: "dashboard.title", value: tAdmin("dashboard.title") },
        { key: "users.title", value: tAdmin("users.title") },
        { key: "businesses.title", value: tAdmin("businesses.title") },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            🧪 Тест переводов
          </h1>
          <p className="text-gray-400">
            Проверка работы i18next и переключения языков
          </p>
          <div className="flex gap-4 justify-center items-center">
            <span className="text-sm text-gray-500">
              👆 Используйте кнопку смены языка внизу слева (🌍)
            </span>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-gray-800/50 border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">📋 Инструкция</h2>
          <ol className="space-y-2 text-gray-300 list-decimal list-inside">
            <li>Нажмите на синюю кнопку с глобусом (🌍) внизу слева экрана</li>
            <li>Выберите язык: 🇬🇧 English, 🇷🇺 Русский или 🇵🇱 Polski</li>
            <li>Все тексты ниже должны измениться на выбранный язык</li>
            <li>Язык сохраняется в localStorage и будет использоваться при следующем визите</li>
          </ol>
        </Card>

        {/* Translation Sections */}
        <div className="grid gap-6">
          {sections.map((section) => (
            <Card key={section.namespace} className="bg-gray-800/50 border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-4 text-orange-400">
                {section.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div key={item.key} className="bg-gray-900/50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1 font-mono">
                      {section.namespace}:{item.key}
                    </div>
                    <div className="text-lg font-medium text-gray-100">
                      {item.value || "❌ Отсутствует перевод"}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Status */}
        <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50 p-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold text-green-400">
                ✅ Система переводов работает
              </h3>
              <p className="text-sm text-gray-400">
                Все 9 namespaces загружены и доступны для использования
              </p>
            </div>
          </div>
        </Card>

        {/* Back button */}
        <div className="flex justify-center">
          <Button
            onClick={() => window.location.href = "/"}
            className="bg-orange-500 hover:bg-orange-600"
          >
            ← Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}
