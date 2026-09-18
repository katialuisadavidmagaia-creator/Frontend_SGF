import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Reaproveita os seus arquivos de tradução já existentes
import pt from './resources/pt/translation.json';
import en from './resources/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },
    lng: 'pt', 
    fallbackLng: 'pt', 
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;