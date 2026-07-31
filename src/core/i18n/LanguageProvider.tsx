"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { usePersistentState } from "../hooks";

export type AdminLanguage = "ar" | "en";

type LanguageContextValue = {
  language: AdminLanguage;
  direction: "rtl" | "ltr";
  setLanguage: (language: AdminLanguage) => void;
  toggleLanguage: () => void;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
};

export default function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguage] =
    usePersistentState<AdminLanguage>(
      "admin-language",
      "ar",
    );

  const direction: "rtl" | "ltr" =
  language === "ar" ? "rtl" : "ltr";

 const contextValue =
  useMemo<LanguageContextValue>(
    () => ({
      language,
      direction,
      setLanguage,
      toggleLanguage: () => {
        setLanguage((currentLanguage) =>
          currentLanguage === "ar" ? "en" : "ar",
        );
      },
    }),
    [direction, language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <div
        dir={direction}
        lang={language}
        className={`nr-admin-language nr-admin-language--${language}`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider.",
    );
  }

  return context;
}