import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from '@/i18n/locales/fr.json';
import en from '@/i18n/locales/en.json';
import ar from '@/i18n/locales/ar.json';
import { StorageKeys } from '@/config/constants';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'fr',
    lng: localStorage.getItem(StorageKeys.languageCode) || undefined,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: StorageKeys.languageCode,
      caches: ['localStorage'],
    },
  });

export default i18n;
