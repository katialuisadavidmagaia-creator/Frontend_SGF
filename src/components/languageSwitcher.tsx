
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-1 text-xs">
      <button
        onClick={() => i18n.changeLanguage('pt')}
        className={`px-2 py-1 rounded ${i18n.language === 'pt' ? 'bg-white/20 text-white' : 'text-white/50'}`}
      >
        PT
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-white/20 text-white' : 'text-white/50'}`}
      >
        EN
      </button>
    </div>
  );
}