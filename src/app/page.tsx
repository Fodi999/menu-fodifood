"use client";

import Head from "next/head";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import RecipesDrawer from "./components/RecipesDrawer";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation("ns1"); // Указываем пространство имён
  const [showRecipes, setShowRecipes] = useState(false);

  const toggleRecipes = () => {
    setShowRecipes(!showRecipes);
  };

  // Логи для проверки
  console.log("Текущий язык в i18n:", i18n.language);
  console.log("Переводы:", {
    title: t("siteMetadata.title"),
    recipesSections: t("recipesSections", { returnObjects: true }),
  });

  return (
    <>
      <Head>
        <title>{t("siteMetadata.title")}</title>
      </Head>
      <div className="relative w-full min-h-screen bg-gray-900 text-white">
        <Header />
        <MainContent />
        {showRecipes && (
          <RecipesDrawer
            sections={t("recipesSections", { returnObjects: true }) as string[]}
            onClose={toggleRecipes}
          />
        )}
        <LanguageSwitcher />
      </div>
    </>
  );
}



























