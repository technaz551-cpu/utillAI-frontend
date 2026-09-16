"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultLanguage,
  getTranslations,
  languageNames,
  type Language,
} from "@/i18n";

type TranslationObject = ReturnType<typeof getTranslations>;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationObject;
  languageNames: typeof languageNames;
};

const LanguageContext =
  createContext<LanguageContextType | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] =
    useState<Language>(defaultLanguage);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage =
        localStorage.getItem("utilai-language");

      if (
        savedLanguage &&
        Object.prototype.hasOwnProperty.call(
          languageNames,
          savedLanguage
        )
      ) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error(
        "Could not load saved language:",
        error
      );
    }

    setMounted(true);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    if (
      !Object.prototype.hasOwnProperty.call(
        languageNames,
        newLanguage
      )
    ) {
      return;
    }

    setLanguageState(newLanguage);

    try {
      localStorage.setItem(
        "utilai-language",
        newLanguage
      );
    } catch (error) {
      console.error(
        "Could not save language:",
        error
      );
    }
  };

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.lang = language;

    document.documentElement.dir =
      language === "ur" || language === "ar"
        ? "rtl"
        : "ltr";
  }, [language, mounted]);

  const t = useMemo(
    () => getTranslations(language),
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languageNames,
    }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}