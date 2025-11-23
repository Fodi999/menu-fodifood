"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ResumeData, defaultResumeData, DeepPartial } from "@/types/resume";

export type BackgroundTheme = 
  | "default"      // Стандартная тема
  | "elegant"      // Элегантная (светлая с градиентами)
  | "dark"         // Темная
  | "minimal"      // Минималистичная
  | "gradient"     // Градиентная
  | "warm"         // Теплая
  | "cool";        // Холодная

interface ResumeContextType {
  resumeData: ResumeData;
  updateData: (updates: DeepPartial<ResumeData>) => void;
  resetToDefault: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Deep merge utility function
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      result[key] = deepMerge(
        targetValue as Record<string, any>,
        sourceValue as Record<string, any>
      ) as T[Extract<keyof T, string>];
    } else {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>("default");

  // Загрузить данные из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    const savedTheme = localStorage.getItem("backgroundTheme") as BackgroundTheme;
    
    if (savedTheme) {
      setBackgroundTheme(savedTheme);
    }
    
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Проверяем, есть ли старые данные (Иван Иванов)
        if (parsedData.hero?.name === "Иван Иванов" || parsedData.hero?.email === "ivan@example.com") {
          console.log("Обнаружены старые данные, используем defaultResumeData");
          localStorage.removeItem("resumeData");
          setResumeData(defaultResumeData);
        } else {
          setResumeData(parsedData);
        }
      } catch (error) {
        console.error("Failed to parse saved resume data:", error);
        setResumeData(defaultResumeData);
      }
    }
  }, []);

  // Сохранять данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  // Сохранять тему в localStorage
  useEffect(() => {
    localStorage.setItem("backgroundTheme", backgroundTheme);
    document.body.setAttribute("data-background-theme", backgroundTheme);
  }, [backgroundTheme]);

  const updateData = (updates: DeepPartial<ResumeData>) => {
    setResumeData((prev) => deepMerge(prev, updates as Partial<ResumeData>));
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const resetToDefault = () => {
    setResumeData(defaultResumeData);
    localStorage.removeItem("resumeData");
  };

  return (
    <ResumeContext.Provider 
      value={{ 
        resumeData, 
        updateData, 
        resetToDefault, 
        isEditMode, 
        toggleEditMode,
        backgroundTheme,
        setBackgroundTheme
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within ResumeProvider");
  }
  return context;
}
