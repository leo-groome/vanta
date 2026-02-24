import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esTranslation from './locales/es/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

const savedLang = localStorage.getItem('lang');
const defaultLang = savedLang || (navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
