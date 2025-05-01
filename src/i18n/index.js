import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en/translation";
import fr from "./fr/translation";
import hi from "./hi/translation";
import es from "./es/translation";
import pt from "./pt/translation"
import ru from "./ru/translation"
import zh from "./zh/translation"
import de from "./de/translation"


i18n.use(initReactI18next).init({
  fallbackLng: "en",
  supportedLngs: ['en', 'fr', 'es', 'pt', 'hi', 'ru', 'de', 'zh'],
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    hi: { translation: hi },
    es: { translation: es },
    pt: { translation: pt },
    ru: { translation: ru },
    zh: { translation: zh },
    de: { translation: de },

  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
