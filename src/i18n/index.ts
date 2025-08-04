import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-PT',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    supportedLngs: ['pt-PT', 'pt-BR', 'en', 'es', 'de', 'it', 'fr'],
    
    // Mapear códigos de idioma do navegador para nossos códigos suportados
    load: 'languageOnly',
    cleanCode: true,
  });

export default i18n;