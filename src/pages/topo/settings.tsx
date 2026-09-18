
import { useEffect, useState } from 'react';
import {
  Bell,
  Globe,
  Lock,
  Monitor,
  Moon,
  Palette,
  Save,
  Settings as SettingsIcon,
  Sun,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t, i18n } = useTranslation();

  const [idioma, setIdioma] = useState(
    i18n.language?.startsWith('en') ? 'en' : 'pt'
  );

  const [tema, setTema] = useState(
    localStorage.getItem('vertice_theme') || 'system'
  );

  const [notificacoes, setNotificacoes] = useState(
    localStorage.getItem('vertice_notifications') !== 'false'
  );

  // ==============================
  // TEMA
  // ==============================
  useEffect(() => {
    const root = document.documentElement;

    if (tema === 'dark') {
      root.classList.add('dark');
    } else if (tema === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.toggle(
        'dark',
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }

    localStorage.setItem('vertice_theme', tema);
  }, [tema]);

  // ==============================
  // IDIOMA
  // ==============================
  const alterarIdioma = async (novoIdioma: string) => {
    setIdioma(novoIdioma);
    await i18n.changeLanguage(novoIdioma);
  };

  // ==============================
  // GUARDAR
  // ==============================
  const guardarConfiguracoes = () => {
    localStorage.setItem(
      'vertice_notifications',
      String(notificacoes)
    );

    localStorage.setItem('vertice_theme', tema);
  };

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      <div>
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-indigo-600" />

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t('settings.title')}
          </h1>
        </div>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t('settings.description')}
        </p>
      </div>

      {/* CONFIGURAÇÕES */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* IDIOMA */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-indigo-600" />

            <div className="flex-1">
              <h2 className="font-semibold text-slate-800 dark:text-white">
                {t('settings.language.title')}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('settings.language.description')}
              </p>
            </div>
          </div>

          <select
            value={idioma}
            onChange={(e) => alterarIdioma(e.target.value)}
            className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="pt">
              {t('settings.language.portuguese')}
            </option>

            <option value="en">
              {t('settings.language.english')}
            </option>
          </select>
        </section>

        {/* APARÊNCIA */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-indigo-600" />

            <div>
              <h2 className="font-semibold text-slate-800 dark:text-white">
                {t('settings.appearance.title')}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('settings.appearance.description')}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">

            <button
              type="button"
              onClick={() => setTema('light')}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition ${
                tema === 'light'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Sun className="h-5 w-5" />
              {t('settings.appearance.light')}
            </button>

            <button
              type="button"
              onClick={() => setTema('dark')}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition ${
                tema === 'dark'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Moon className="h-5 w-5" />
              {t('settings.appearance.dark')}
            </button>

            <button
              type="button"
              onClick={() => setTema('system')}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition ${
                tema === 'system'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Monitor className="h-5 w-5" />
              {t('settings.appearance.system')}
            </button>

          </div>
        </section>

        {/* NOTIFICAÇÕES */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-indigo-600" />

            <div className="flex-1">
              <h2 className="font-semibold text-slate-800 dark:text-white">
                {t('settings.notifications.title')}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('settings.notifications.description')}
              </p>
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-600">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('settings.notifications.enable')}
            </span>

            <input
              type="checkbox"
              checked={notificacoes}
              onChange={(e) => setNotificacoes(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600"
            />
          </label>
        </section>

        {/* SEGURANÇA */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-indigo-600" />

            <div className="flex-1">
              <h2 className="font-semibold text-slate-800 dark:text-white">
                {t('settings.security.title')}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t('settings.security.description')}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {t('settings.security.changePassword')}
          </button>
        </section>
      </div>

      {/* BOTÃO GUARDAR */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={guardarConfiguracoes}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Save className="h-4 w-4" />
          {t('common.save')}
        </button>
      </div>
    </div>
  );
}
