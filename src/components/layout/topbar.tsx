import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { usePermissoes } from '../../hooks/usePermissoes';
import {
  Mail,
  ShieldCheck,
  UserCheck,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Search,
  Bell
} from 'lucide-react';

interface ContactoEmergencia {
  nome: string;
  parentesco: string;
  telefone: string;
}

interface PerfilCompleto {
  id: number;
  name: string;
  email: string;
  cargo?: string;
  departamentos?: { id: number; nome: string };
  gestorDireto?: string;
  localizacao?: string;
  idiomas?: string[];
  telefonePessoal?: string;
  dataNascimento?: string;
  dataAdmissao?: string;
  tipoContrato?: string;
  morada?: string;
  contactoEmergencia?: ContactoEmergencia;
  iban?: string;
  nif?: string;
}

const LABEL_ROLE: Record<string, string> = {
  ADMIN: 'Administrador',
  RH: 'Recursos Humanos',
  FUNCIONARIO: 'Funcionário',
};

interface TopbarProps {
  titulo?: string;
}

export function Topbar({ titulo = 'Dashboard' }: TopbarProps) {
  const navigate = useNavigate();
  const { role } = usePermissoes();

  const [menuAberto, setMenuAberto] = useState(false);
  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [carregando, setCarregando] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const podeVerDadosGeraisEGestao = role === 'ADMIN' || role === 'RH';

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setCarregando(true);
        const res = await api.get<{ sucesso: boolean; data: PerfilCompleto }>('/perfil');
        setPerfil(res.data.data);
      } catch (err) {
        console.error('Erro ao carregar dados do perfil na Topbar:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const iniciais = perfil?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') ?? 'UT';

  const formatarData = (dataStr?: string) =>
    dataStr
      ? new Date(dataStr).toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Não informada';

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <h1 className="text-base font-semibold text-[#0E1A2B]">{titulo}</h1>

      <div className="flex items-center gap-4">
        {/* Pesquisa */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-56 border border-slate-200/50">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400 text-slate-700"
          />
        </div>

        {/* Notificações */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Menu do Utilizador com Perfil Completo */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setMenuAberto((v) => !v)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0E1A2B] text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {iniciais}
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-semibold text-[#0E1A2B]">{perfil?.name || 'Utilizador'}</p>
              <p className="text-xs text-[#4F6EF7] font-medium">{perfil?.cargo || 'Colaborador'}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuAberto ? 'rotate-180' : ''}`} />
          </button>

          {/* DROPDOWN DETALHADO DO PERFIL */}
          {menuAberto && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              
              {/* Header do Popover */}
              <div className="p-4 bg-gradient-to-r from-[#0E1A2B] to-[#1E293B] text-white">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white text-[#0E1A2B] font-bold text-base flex items-center justify-center shadow-md shrink-0">
                      {iniciais}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm truncate">{perfil?.name || 'A carregar...'}</h4>
                      <p className="text-xs text-blue-300 truncate">{perfil?.cargo || 'Colaborador'}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white border border-white/20 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-[#4F6EF7]" />
                    {role ? LABEL_ROLE[role] ?? role : 'Utilizador'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{perfil?.email || 'Sem e-mail'}</span>
                </div>
              </div>

              {/* Corpo com Todas as Informações */}
              <div className="max-h-[380px] overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
                {carregando ? (
                  <p className="text-xs text-center py-4 text-slate-400">A carregar informações...</p>
                ) : (
                  <>
                    {/* Informação Profissional */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Informação Profissional
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Departamento</span>
                          <span className="font-semibold text-slate-700 truncate block">
                            {perfil?.departamentos?.nome ?? 'Não atribuído'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Gestor Direto</span>
                          <span className="font-semibold text-slate-700 truncate block">
                            {perfil?.gestorDireto ?? 'Não informado'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Localização</span>
                          <span className="font-semibold text-slate-700 truncate block">
                            {perfil?.localizacao ?? 'Sede'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Idiomas</span>
                          <span className="font-semibold text-slate-700 truncate block">
                            {perfil?.idiomas?.join(', ') ?? 'Português'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dados Restritos (Apenas Admin/RH) */}
                    {podeVerDadosGeraisEGestao && (
                      <div className="pt-3 space-y-2">
                        <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Dados Restritos (RH/Admin)
                        </p>
                        
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-purple-50/50">
                            <span className="text-slate-500">Telefone:</span>
                            <span className="font-semibold text-slate-800">{perfil?.telefonePessoal ?? 'Não registado'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-purple-50/50">
                            <span className="text-slate-500">Nascimento:</span>
                            <span className="font-semibold text-slate-800">{formatarData(perfil?.dataNascimento)}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-purple-50/50">
                            <span className="text-slate-500">Admissão:</span>
                            <span className="font-semibold text-slate-800">{formatarData(perfil?.dataAdmissao)}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-purple-50/50">
                            <span className="text-slate-500">Contrato:</span>
                            <span className="font-semibold text-slate-800">{perfil?.tipoContrato ?? 'Sem Termo'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-purple-50/50">
                            <span className="text-slate-500">Morada:</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[180px]">{perfil?.morada ?? 'Não registada'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 px-2 rounded-lg bg-purple-50/50">
                            <span className="text-slate-500">Fiscal / Bancário:</span>
                            <span className="font-semibold text-slate-800">NIF: {perfil?.nif ?? '---'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Rodapé com Ações */}
              <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to="/dashboard/perfil"
                  onClick={() => setMenuAberto(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-200 transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#4F6EF7]" />
                  Página do Perfil
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}