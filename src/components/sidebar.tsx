import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {Users,LayoutDashboard,FolderKanban,Building2,LogOut,ChevronLeft,ChevronRight,FileText,CheckSquare,BarChart3,UserCog,CalendarDays,UsersRound,ListTodo,Settings,} from 'lucide-react';

import { Button } from '../components/ui/button';
import { usePermissoes } from '../hooks/usePermissoes';
import { Role } from 'src/types/auth.types';
import type { LucideIcon } from 'lucide-react';

interface ItemNav {
  label: string;
  path: string;
  icon: LucideIcon; // ✅ Mantido como LucideIcon
  apenas?: readonly Role[] | Role[];
}

interface SeccaoNav {
  titulo: string;
  itens: ItemNav[];
}

function temAcesso(
  apenas: readonly Role[] | Role[] | undefined,
  role: Role | null | undefined
): boolean {
  if (!apenas) return true;
  if (!role) return false;

  return (apenas as readonly Role[]).includes(role);
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role: roleRaw } = usePermissoes();

  const role: Role | null =
    roleRaw === 'ADMIN' ||
    roleRaw === 'RH' ||
    roleRaw === 'FUNCIONARIO'
      ? roleRaw
      : null;

  const [aberta, setAberta] = useState(true);

  const email = localStorage.getItem('email') || 'Utilizador';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('utilizador');

    navigate('/login');
  };

  // =========================================================
  // GRUPOS E SEÇÕES DE NAVEGAÇÃO
  // =========================================================

  const seccoesMenu: SeccaoNav[] = [
    {
      titulo: 'VISÃO GERAL',
      itens: [
        {
          label: 'Visão Geral',
          path: '/dashboard',
          icon: LayoutDashboard,
          apenas: ['ADMIN', 'RH'] as const,
        },
        {
          label: 'Os meus relatórios',
          path: '/dashboard/meus-relatorios',
          icon: FileText,
          apenas: ['FUNCIONARIO'] as const,
        },
        {
          label: 'Os meus projetos',
          path: '/meus-projetos',
          icon: FolderKanban, // ✅ Corrigido: passada a referência do ícone FolderKanban
          apenas: ['FUNCIONARIO'] as const, // Opcional: restringe apenas a funcionários se necessário
        },
        {
          label: 'Estatísticas',
          path: '/dashboard/estatisticas',
          icon: BarChart3,
          apenas: ['ADMIN', 'RH'] as const,
        },
        {
          label: 'Relatórios',
          path: '/dashboard/relatorios',
          icon: FileText,
          apenas: ['ADMIN', 'RH'] as const,
        },
      ],
    },
    {
      titulo: 'GESTÃO',
      itens: [
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
          label: 'Usuários',
          path: '/usuarios',
          icon: UserCog,
          apenas: ['ADMIN'] as const,
        },
        {
          label: 'Membros',
          path: '/membros',
          icon: UsersRound,
        },
      ],
    },
    {
      titulo: 'PROJETOS E TAREFAS',
      itens: [
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
          label: 'Tasks',
          path: '/tasks',
          icon: ListTodo,
        },
        {
          label: 'Calendário',
          path: '/calendario',
          icon: CalendarDays,
        },
      ],
    },
    {
      titulo: 'SISTEMA',
      itens: [
        {
          label: 'Definições',
          path: '/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        bg-[#0B132B]
        min-h-screen
        h-screen
        sticky
        top-0
        shrink-0
        transition-all
        duration-300
        flex
        flex-col
        border-r
        border-white/5
        ${aberta ? 'w-64' : 'w-20'}
      `}
    >
      {/* =====================================================
          CONTEÚDO PRINCIPAL DA SIDEBAR
      ====================================================== */}

      <div className="flex-1 overflow-y-auto">

        {/* ===================================================
            CABEÇALHO
        ==================================================== */}

        <div
          className={`
            h-[86px]
            flex
            items-center
            border-b
            border-white/10
            px-5
            ${aberta ? 'justify-between' : 'justify-center'}
          `}
        >
          {aberta && (
            <h1 className="text-xl font-bold tracking-tight text-white">
              VERTICE
            </h1>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAberta(!aberta)}
            className="
              h-8
              w-8
              text-white/60
              hover:text-white
              hover:bg-white/10
              shrink-0
            "
          >
            {aberta ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* ===================================================
            NAVEGAÇÃO POR SECÇÕES
        ==================================================== */}

        <nav className="px-3 py-4 space-y-6">
          {seccoesMenu.map((seccao) => {
            // Filtra os itens com base na permissão do utilizador
            const itensFiltrados = seccao.itens.filter((item) =>
              temAcesso(item.apenas, role)
            );

            if (itensFiltrados.length === 0) return null;

            return (
              <div key={seccao.titulo} className="space-y-1">
                {/* Título da Secção */}
                {aberta ? (
                  <h2 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    {seccao.titulo}
                  </h2>
                ) : (
                  <div className="h-px bg-white/10 my-3" />
                )}

                {/* Itens da Secção */}
                {itensFiltrados.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/dashboard'}
                    >
                      {({ isActive }) => (
                        <div
                          className={`
                            flex
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            transition-colors
                            ${!aberta ? 'justify-center px-2' : ''}
                            ${
                              isActive
                                ? 'bg-[#202A43] text-white font-semibold'
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5 shrink-0" />

                          {aberta && <span>{item.label}</span>}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* =====================================================
          PERFIL + LOGOUT
      ====================================================== */}

      <div className="border-t border-white/10 p-4">
        {aberta && (
          <span
            className="block text-xs text-white/50 truncate px-2 mb-2"
            title={email}
          >
            {email}
          </span>
        )}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`
            w-full
            text-red-300
            hover:text-red-200
            hover:bg-red-500/10
            ${
              aberta
                ? 'justify-start gap-3'
                : 'justify-center px-2'
            }
          `}
        >
          <LogOut className="h-5 w-5 shrink-0" />

          {aberta && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;