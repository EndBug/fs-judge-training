"use client";

import { createContext, useContext, type ReactNode } from "react";
import "~/lib/i18n";
import { useTranslation as useI18nextTranslation } from "react-i18next";

const I18nContext = createContext<ReturnType<typeof useI18nextTranslation>>(
  null!,
);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const value = useI18nextTranslation();

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  return useContext(I18nContext);
};
