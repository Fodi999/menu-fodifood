"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLanguage =
      i18n.language === "en"
        ? "ru"
        : i18n.language === "ru"
        ? "pl"
        : "en";

    console.log("Текущий язык:", i18n.language);
    console.log("Следующий язык:", nextLanguage);

    i18n
      .changeLanguage(nextLanguage)
      .then(() => {
        console.log("Язык успешно переключен на:", nextLanguage);
      })
      .catch((err) => {
        console.error("Ошибка при переключении языка:", err);
      });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed left-4 bottom-20 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
    >
      {i18n.language.toUpperCase()}
    </button>
  );
}









