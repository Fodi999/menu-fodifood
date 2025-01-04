"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation("ns1"); // Указываем пространство имён

  // Логи для отладки
  console.log("Текущий язык:", i18n.language); // Текущий язык из i18n
  console.log("Переводы:", {
    home: t("buttonLabels.home"),
    blog: t("buttonLabels.blog"),
    contact: t("buttonLabels.contact"),
  });

  return (
    <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4">
      <div className="flex items-center space-x-4">
        <Image src="/svg%201.svg" alt="Logo" width={40} height={40} />
        <div className="text-xl font-bold underline decoration-sky-500/30">
          <span className="text-blue-400">Fomin</span>{" "}
          <span className="text-green-400">Dmitry</span>{" "}
          <span className="text-orange-500">Chef</span>
        </div>
      </div>
      <nav className="flex space-x-8 text-sm">
        <a
          href="#"
          className="px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-full transition hover:bg-orange-500"
        >
          {t("buttonLabels.home")}
        </a>
        <a
          href="#"
          className="px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-full transition hover:bg-orange-500"
        >
          {t("buttonLabels.blog")}
        </a>
        <a
          href="#"
          className="px-4 py-2 bg-gray-800 bg-opacity-50 text-white rounded-full transition hover:bg-orange-500"
        >
          {t("buttonLabels.contact")}
        </a>
      </nav>
    </header>
  );
}





