"use client";

import { useTranslation } from "react-i18next";

interface RecipesDrawerProps {
  sections: string[]; // Массив секций передаётся извне
  onClose: () => void; // Функция для закрытия модального окна
}

export default function RecipesDrawer({ sections, onClose }: RecipesDrawerProps) {
  const { t } = useTranslation("ns1");

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 bg-opacity-80 text-white backdrop-blur-lg rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{t("siteMetadata.title")}</h2>
        <ul className="space-y-4">
          {sections.map((section, index) => (
            <li
              key={index}
              className="text-lg font-medium cursor-pointer hover:text-orange-500"
            >
              {section}
            </li>
          ))}
        </ul>
        <button
          className="mt-6 px-6 py-3 w-full bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          onClick={onClose}
        >
          {t("buttonLabels.close")}
        </button>
      </div>
    </div>
  );
}






