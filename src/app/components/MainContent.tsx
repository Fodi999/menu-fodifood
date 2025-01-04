"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function MainContent() {
  const { t, i18n } = useTranslation("ns1");

  const pages = t("pages", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    image: string;
    buttonText: string;
  }>;

  const recipesSections = t("recipesSections", { returnObjects: true }) as string[];
  const buttonLabels = t("buttonLabels", { returnObjects: true }) as {
    myRecipes: string;
    close: string;
    contact: string;
    language: string;
    continueReading: string;
    showLess: string;
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
    setIsExpanded(false); // Сбрасываем раскрытие текста при смене страницы
  };

  const toggleRecipes = () => {
    setShowRecipes(!showRecipes);
  };

  const handleContactClick = () => {
    setNotification(t("siteMetadata.contactAlert"));
    setTimeout(() => setNotification(null), 3000); // Убираем уведомление через 3 секунды
  };

  const toggleLanguage = () => {
    const nextLanguage =
      i18n.language === "en"
        ? "ru"
        : i18n.language === "ru"
        ? "pl"
        : "en";

    i18n.changeLanguage(nextLanguage).then(() => {
      setNotification(`Language switched to ${nextLanguage.toUpperCase()}`);
      setTimeout(() => setNotification(null), 3000); // Убираем уведомление через 3 секунды
    });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center">
      <main className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-6 md:px-12 py-24">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            {pages[currentPage].title}
          </h1>
          <div className="text-lg mt-2 transition-opacity duration-300 text-gray-500">
            <p className={`whitespace-pre-line ${isExpanded ? "" : "line-clamp-3"}`}>
              {pages[currentPage].description}
            </p>
            <button
              className="mt-4 text-orange-500 hover:underline"
              onClick={toggleAccordion}
            >
              {isExpanded ? buttonLabels.showLess : buttonLabels.continueReading}
            </button>
          </div>

          <button
            className="mt-6 px-6 py-3 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition"
            onClick={toggleRecipes}
          >
            {buttonLabels.myRecipes}
          </button>
        </div>
        <div className="flex-1 mt-10 md:mt-0">
          <Image
            src={pages[currentPage].image}
            alt={pages[currentPage].title}
            width={400}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
      </main>

      {showRecipes && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 bg-opacity-80 text-white backdrop-blur-lg rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Recipes</h2>
            <ul className="space-y-4">
              {recipesSections.map((section, index) => (
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
              onClick={toggleRecipes}
            >
              {buttonLabels.close}
            </button>
          </div>
        </div>
      )}

      <button
        className="fixed left-4 bottom-8 px-4 py-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 hover:w-32 hover:pl-6 transition-all duration-300 z-50"
        onClick={handleContactClick}
      >
        {buttonLabels.contact}
      </button>
      <button
        className="fixed left-4 bottom-20 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:w-32 hover:pl-6 transition-all duration-300 z-50"
        onClick={toggleLanguage}
      >
        {buttonLabels.language}
      </button>

      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col items-center space-y-2">
        {pages.map((_, index) => (
          <div
            key={index}
            onClick={() => handlePageChange(index)}
            className={`w-2 h-8 cursor-pointer rounded-full transition-colors duration-300 ${
              index === currentPage ? "bg-orange-500" : "bg-gray-600"
            }`}
          ></div>
        ))}
      </div>

      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
          {notification}
        </div>
      )}
    </div>
  );
}







