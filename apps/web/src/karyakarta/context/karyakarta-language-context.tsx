"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageType } from "../types/karyakarta.types";
import { I18N_DICTIONARY } from "../data/karyakarta-i18n-dictionary";

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string, fallback?: string) => string;
}

const KaryakartaLanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function KaryakartaLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageType>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("indiata_karyakarta_lang") as LanguageType;
      if (saved && (saved === "en" || saved === "mr" || saved === "hi")) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("indiata_karyakarta_lang", lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const dict = I18N_DICTIONARY[language] || I18N_DICTIONARY.en;
    return dict[key] || fallback || key;
  };

  return (
    <KaryakartaLanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </KaryakartaLanguageContext.Provider>
  );
}

export function useKaryakartaLanguage() {
  const context = useContext(KaryakartaLanguageContext);
  if (!context) {
    throw new Error("useKaryakartaLanguage must be used within a KaryakartaLanguageProvider");
  }
  return context;
}
