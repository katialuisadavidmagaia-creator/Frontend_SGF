import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from '../resources/pt/translation.json';
import en from '../resources/en/translation.json';

const idiomaGuardado = localStorage.getItem('idioma');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: pt,
      },
      en: {
        translation: en,
      },
    },

    lng: idiomaGuardado || 'pt',

    fallbackLng: 'pt',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;