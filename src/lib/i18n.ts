"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Translation files path
    },

    fallbackLng: "en",
    supportedLngs: ["en", "it"],
    ns: ["common"],
    defaultNS: "common",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
