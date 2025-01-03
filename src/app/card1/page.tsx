"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function Card1() {
  const { t } = useTranslation(["ns1", "ns2"]);
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white">
      <h1 className="text-5xl font-extrabold mb-8">{t("ns2:card1Title", { defaultValue: "Card 1" })}</h1>
      <button
        onClick={handleBackToHome}
        className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition duration-300 shadow"
      >
        {t("ns2:backToHome", { defaultValue: "Обратно на главную" })}
      </button>
    </div>
  );
}