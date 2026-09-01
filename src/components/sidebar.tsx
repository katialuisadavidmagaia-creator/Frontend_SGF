import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {Users,FolderKanban,Building2,User,LogOut,ChevronLeft,ChevronRight,ChevronDown,FileText,CheckSquare,BarChart3,LayoutDashboard,UserCog,
  CalendarDays,
  UsersRound,
  ListTodo,
  Settings,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePermissoes } from '../hooks/usePermissoes';
import { Role } from 'src/types/auth.types';
import { useTranslation } from 'react-i18next';


interface ItemNav {
  label: string;
  path: string;
  icon: typeof User;
  apenas?: readonly Role[] | Role[];
}

function temAcesso(apenas: readonly Role[] | Role[] | undefined, role: Role | null | undefined): boolean {
  if (!apenas) return true;
  if (!role) return false;
  return (apenas as readonly Role[]).includes(role);
}

export function Sidebar() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = usePermissoes();

  const [aberta, setAberta] = useState(true);
  const [dashboardExpandida, setDashboardExpandida] = useState(
    location.pathname.startsWith('/dashboard')
  );

  const email = localStorage.getItem('email') || 'Utilizador';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  // ---- Sub-itens do grupo "Dashboard" ----
  const itensDashboard: ItemNav[] = [
    { label: 'Perfil', path: '/dashboard/perfil', icon: User },
    {
      label: 'Os meus relatórios',
      path: '/dashboard/meus-relatorios',
      icon: FileText,
      apenas: ['FUNCIONARIO'] as const,
    },
    {
      label: 'Relatórios',
      path: '/dashboard/relatorios',
      icon: FileText,
      apenas: ['ADMIN', 'RH'] as const,
    },
    {
      label: 'Funcionários',
      path: '/dashboard/funcionarios',
      icon: Users,
      apenas: ['ADMIN', 'RH'] as const,
    },
    {
      label: 'Departamentos',
      path: '/dashboard/departamentos',
      icon: Building2,
      apenas: ['ADMIN', 'RH'] as const,
    },
    {
      label: 'Projetos',
      path: '/dashboard/projetos',
      icon: FolderKanban,
      apenas: ['ADMIN', 'RH'] as const,
    },
    {
      label: 'Aprovações',
      path: '/dashboard/aprovacoes',
      icon: CheckSquare,
      apenas: ['ADMIN', 'RH'] as const,
    },
    {
      label: 'Estatísticas',
      path: '/dashboard/estatisticas',
      icon: BarChart3,
      apenas: ['ADMIN', 'RH'] as const,
    },
  ].filter((item) => temAcesso(item.apenas, role));

  // ---- Itens de topo (fora da Dashboard) ----
  const itensTopo: ItemNav[] = [
    { label: 'Usuários', path: '/usuarios', icon: UserCog, apenas: ['ADMIN'] as const },
    { label: 'Calendário', path: '/calendario', icon: CalendarDays },
    { label: 'Membros', path: '/membros', icon: UsersRound },
    { label: 'Tasks', path: '/tasks', icon: ListTodo },
    { label: 'Settings', path: '/settings', icon: Settings },
  ].filter((item) => temAcesso(item.apenas, role));

  const dashboardAtiva = location.pathname.startsWith('/dashboard');

  return (
    <aside
      className={`bg-[#0E1A2B] min-h-screen transition-all duration-300 flex flex-col justify-between p-4 ${
        aberta ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex-1 overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6 px-1">
          {aberta && (
            <h1 className="text-xl font-bold tracking-tight text-white font-sora">
              VERTICE
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAberta(!aberta)}
            className="h-8 w-8 ml-auto text-white/70 hover:text-white hover:bg-white/10"
          >
            {aberta ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex flex-col gap-1">
          {/* ---------- Grupo Dashboard ---------- */}
          <button
            onClick={() => {
              if (!aberta) setAberta(true);
              setDashboardExpandida((v) => !v);
            }}
            className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              !aberta ? 'justify-center px-2' : ''
            } ${
              dashboardAtiva
                ? 'bg-[#4F6EF7] text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            {aberta && (
              <>
                <span className="flex-1 text-left">Dashboard</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    dashboardExpandida ? 'rotate-180' : ''
                  }`}
                />
              </>
            )}
          </button>

          {aberta && dashboardExpandida && (
            <div className="ml-3 pl-3 border-l border-white/10 flex flex-col gap-0.5 my-1">
              {itensDashboard.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.path} to={item.path}>
                    {({ isActive }) => (
                      <div
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-[#4F6EF7]/20 text-[#8FA4FF] font-semibold'
                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          <div className="h-px bg-white/10 my-3" />

          {/* ---------- Itens de topo ---------- */}
          {itensTopo.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      !aberta ? 'justify-center px-2' : ''
                    } ${
                      isActive
                        ? 'bg-[#4F6EF7] text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {aberta && <span>{item.label}</span>}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Perfil e Logout */}
      <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
        {aberta && (
          <span className="text-xs text-white/50 truncate px-2" title={email}>
            {email}
          </span>
        )}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full text-red-300 hover:text-red-200 hover:bg-red-500/10 ${
            aberta ? 'justify-start gap-3' : 'justify-center px-2'
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {aberta && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
