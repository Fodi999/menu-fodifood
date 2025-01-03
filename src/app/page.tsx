"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { t, i18n } = useTranslation(["ns1", "ns2"]);
  const [isWelcomeHidden, setIsWelcomeHidden] = useState(false);
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLanguage =
      i18n.language === "en"
        ? "ru"
        : i18n.language === "ru"
        ? "pl"
        : "en";
    i18n.changeLanguage(nextLanguage);
  };

  const handleCardClick = () => {
    setIsWelcomeHidden(true);
  };

  const handleNavigate = (num: number) => {
    router.push(`/card${num}`);
  };

  const images = ["/00031.jpg", "/00030.jpg"]; // Массив с путями к изображениям

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white flex flex-col items-center justify-center">
      {/* Welcome Card */}
      {!isWelcomeHidden && (
        <div
          onClick={handleCardClick}
          className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-60"
        >
          <h1 className="text-5xl font-extrabold text-white text-center shadow-md">
            Welcome to Menu-Fodifood
          </h1>
        </div>
      )}

      {/* Language Toggle Button */}
      <button
        className="fixed top-4 right-4 px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 shadow-lg z-30"
        onClick={toggleLanguage}
      >
        {i18n.language === "en"
          ? t("ns2:switchToRussian")
          : i18n.language === "ru"
          ? t("ns2:switchToPolish")
          : t("ns2:switchToEnglish")}
      </button>

      {/* Cards */}
      <div className="relative w-full max-w-6xl py-12 flex flex-wrap gap-8 justify-center px-4 md:px-0 mt-16">
        {[1, 2].map((num) => (
          <section
            key={num}
            className="flex flex-col md:flex-row w-full md:w-[1000px] h-auto md:h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <Image
              src={images[num - 1]} // Используем соответствующее изображение из массива
              alt={`Card ${num}`}
              width={500}
              height={300}
              className="object-cover w-full md:w-[50%] h-[300px] md:h-full"
              priority={num === 1} // Добавляем priority только для первого изображения
            />
            <div className="flex-1 p-6 flex flex-col justify-between">
              {/* Заголовок */}
              <h2 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-700">
                {t(`ns2:card${num}Title`, { defaultValue: `Card ${num}` })}
              </h2>
              {/* Описание */}
              <p className="text-base text-gray-600 mt-2 flex-grow">
                {t(`ns2:card${num}Description`, {
                  defaultValue: `Description for Card ${num}`,
                })}
              </p>
              {/* Кнопка "Далее" */}
              <button
                onClick={() => handleNavigate(num)}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition duration-300 self-start shadow"
              >
                {t("ns2:nextButton", { defaultValue: "Далее" })}
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
























