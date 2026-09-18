import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';
interface ItemNav {
  label: string;
  path: string;
  icon: ReactNode;
}

const icon = {
  // dashboard: (
  //   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //     <rect x="3" y="3" width="7" height="9" rx="1" />
  //     <rect x="14" y="3" width="7" height="5" rx="1" />
  //     <rect x="14" y="12" width="7" height="9" rx="1" />
  //     <rect x="3" y="16" width="7" height="5" rx="1" />
  //   </svg>
  // ),
  funcionarios: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <circle cx="18" cy="7" r="3" />
      <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.4" />
    </svg>
  ),
  departamentos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="7" height="14" rx="1" />
      <rect x="14" y="3" width="7" height="18" rx="1" />
      <path d="M6 11h1M6 15h1M17 7h1M17 11h1M17 15h1" />
    </svg>
  ),
  projetos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 3h6l1 3h4v4l-3 1v6l3 1v4h-4l-1 3H9l-1-3H4v-4l3-1v-6l-3-1V6h4l1-3Z" opacity="0" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5" />
    </svg>
  ),
  relatorios: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  ),
  definicoes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
};

const ITENS_NAV: ItemNav[] = [
  // { label: 'Dashboard', path: '/dashboard', icon: icon.dashboard },
  { label: 'Funcionários', path: '/dashboard/funcionarios', icon: icon.funcionarios },
  { label: 'Departamentos', path: '/dashboard/departamentos', icon: icon.departamentos },
  { label: 'Projetos', path: '/dashboard/projetos', icon: icon.projetos },
  { label: 'Relatórios', path: '/dashboard/relatorios', icon: icon.relatorios },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 shrink-0 flex-col bg-[#0E1A2B] text-white/80 h-screen sticky top-0">
      {/* Logótipo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-sm text-white">
          VERTICE
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">
          Gestão inteligente,Resultados reais
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {ITENS_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé — definições/conta */}
      <div className="px-3 py-4 border-t border-white/5">
        <NavLink
          to="/dashboard/perfil"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {icon.definicoes}
          Definições
        </NavLink>
      </div>
    </aside>
  );
}