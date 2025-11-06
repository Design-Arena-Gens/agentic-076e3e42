import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import EN from "@/locales/en-IN/common.json";
import HI from "@/locales/hi/common.json";

const resources: Resource = {
  "en-IN": {
    translation: EN
  },
  hi: {
    translation: HI
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "en-IN",
  fallbackLng: "en-IN",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
