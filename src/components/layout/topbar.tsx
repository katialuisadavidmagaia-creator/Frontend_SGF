import { useState } from 'react';

interface TopbarProps {
  titulo?: string;
  nomeUtilizador?: string;
}

export function Topbar({ titulo = 'Dashboard', nomeUtilizador = 'Utilizador' }: TopbarProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const iniciais = nomeUtilizador
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-black/5 sticky top-0 z-20">
      <h1 className="text-base font-semibold text-slate-800">{titulo}</h1>

      <div className="flex items-center gap-4">
        {/* Pesquisa */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-56">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
          />
        </div>

        {/* Notificações */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>

        {/* Perfil */}
        <div className="relative">
          <button
            onClick={() => setMenuAberto((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
              {iniciais}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {nomeUtilizador}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-black/5 rounded-lg shadow-lg py-1 z-30">
              <a href="/dashboard/perfil" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                O meu perfil
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
                className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-slate-50"
              >
                Terminar sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}