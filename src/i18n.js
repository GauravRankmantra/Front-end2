import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to our website!",
      about: "About Us",
    },
  },
  es: {
    translation: {
      welcome: "¡Bienvenido a nuestro sitio web!",
      about: "Sobre nosotros",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue sur notre site Web!",
      about: "À propos de nous",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
