import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

let initialized = false;

const initI18n = () => {
  if (!initialized) {
    i18next
      .use(HttpBackend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        backend: {
          loadPath: `https://northamerica-northeast1-node-canada.cloudfunctions.net/public/locales?lang={{lng}}`,
        },
        fallbackLng: 'fr',
        ns: ['translation'],
        defaultNS: 'translation',
        supportedLngs: ['en', 'fr'],
      });

    initialized = true;
  }
};

export default initI18n;
