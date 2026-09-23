import React, { useState } from 'react';
import {
  FileText,
  FolderKanban,
  Users,
  CheckSquare,
  Calendar,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Folder,
} from 'lucide-react';

type StatusProjeto = 'EM_ANDAMENTO' | 'CONCLUIDO' | 'PENDENTE';

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  status: StatusProjeto;
}

export default function MeusProjetosLayout() {
  const [sidebarEncolhida, setSidebarEncolhida] = useState(false);
  const [menuAtivo, setMenuAtivo] = useState('os-meus-projetos');
  const [pesquisa, setPesquisa] = useState('');

  // Exemplo de dados de projetos
  const [projetos] = useState<Projeto[]>([
    {
      id: '1',
      nome: 'Sistema de Gestão de Funcionários',
      status: 'EM_ANDAMENTO',
    },
    {
      id: '2',
      nome: 'Redesign do Portal Moodle',
      status: 'PENDENTE',
    },
  ]);

  // Filtro
  const projetosFiltrados = projetos.filter((item) =>
    item.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // Totais
  const totalProjetos = projetos.length;
  const emAndamento = projetos.filter((p) => p.status === 'EM_ANDAMENTO').length;
  const concluidos = projetos.filter((p) => p.status === 'CONCLUIDO').length;
  const pendentes = projetos.filter((p) => p.status === 'PENDENTE').length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* 1. SIDEBAR */}
      <aside
        className={`relative flex flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-300 ${
          sidebarEncolhida ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          {!sidebarEncolhida && (
            <span className="text-xl font-black tracking-wider text-white">
              VERTICE
            </span>
          )}
          <button
            onClick={() => setSidebarEncolhida(!sidebarEncolhida)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {sidebarEncolhida ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          <div>
            {!sidebarEncolhida && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Visão Geral
              </p>
            )}
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setMenuAtivo('os-meus-relatorios')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  menuAtivo === 'os-meus-relatorios'
                    ? 'border-r-2 border-blue-500 bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <FileText className="h-5 w-5 shrink-0" />
                {!sidebarEncolhida && <span>Os meus relatórios</span>}
              </button>

              <button
                onClick={() => setMenuAtivo('os-meus-projetos')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  menuAtivo === 'os-meus-projetos'
                    ? 'border-r-2 border-blue-500 bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <FolderKanban className="h-5 w-5 shrink-0" />
                {!sidebarEncolhida && <span>Os meus projetos</span>}
              </button>
            </div>
          </div>

          <div>
            {!sidebarEncolhida && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Gestão
              </p>
            )}
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setMenuAtivo('membros')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  menuAtivo === 'membros'
                    ? 'border-r-2 border-blue-500 bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Users className="h-5 w-5 shrink-0" />
                {!sidebarEncolhida && <span>Membros</span>}
              </button>
            </div>
          </div>

          <div>
            {!sidebarEncolhida && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Projetos e Tarefas
              </p>
            )}
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setMenuAtivo('tasks')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  menuAtivo === 'tasks'
                    ? 'border-r-2 border-blue-500 bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <CheckSquare className="h-5 w-5 shrink-0" />
                {!sidebarEncolhida && <span>Tasks</span>}
              </button>

              <button
                onClick={() => setMenuAtivo('calendario')}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  menuAtivo === 'calendario'
                    ? 'border-r-2 border-blue-500 bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Calendar className="h-5 w-5 shrink-0" />
                {!sidebarEncolhida && <span>Calendário</span>}
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#f8fafc]">
        {/* Barra Superior / Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-8 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-slate-700">
            Painel de Gestão
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <button className="relative rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-sm">
                L
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold text-slate-800">Lian</p>
                <p className="text-[11px] font-medium text-blue-600">
                  Colaborador
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Conteúdo idêntico à imagem de referência */}
        <main className="mx-auto w-full max-w-5xl space-y-6 p-8">
          {/* Cabeçalho de Título + Card de Total */}
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Badge da Categoria */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50/80 px-3 py-1.5 text-xs font-bold tracking-wider text-indigo-500">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                  <Folder className="h-3.5 w-3.5" />
                </div>
                GESTÃO DE PROJETOS
              </div>

              {/* Título e Subtítulo */}
              <h1 className="mt-3 text-3xl font-black text-slate-900 tracking-tight">
                Os Meus Projetos
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500 max-w-lg">
                Acompanhe os projetos em que está atribuído como responsável ou colaborador.
              </p>
            </div>

            {/* Card Superior Direito: Total de Projetos */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 pr-10 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <Folder className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total de projetos
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {totalProjetos}
                </p>
              </div>
            </div>
          </div>

          {/* Cards de Métricas por Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Em andamento */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm min-h-[120px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Em andamento
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {emAndamento}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-blue-600">
                  Projetos ativos
                </span>
              </div>
            </div>

            {/* Concluídos */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm min-h-[120px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Concluídos
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {concluidos}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600">
                  Projetos finalizados
                </span>
              </div>
            </div>

            {/* Pendentes */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm min-h-[120px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Pendentes
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-900">
                    {pendentes}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-amber-600">
                  Aguardam início
                </span>
              </div>
            </div>
          </div>

          {/* Campo de Pesquisa em Bloco */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome do projeto..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="w-full rounded-xl border border-slate-200/60 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* Lista de Projetos (se houver resultados) */}
          {projetosFiltrados.length > 0 && (
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
              {projetosFiltrados.map((projeto) => (
                <div
                  key={projeto.id}
                  className="flex items-center justify-between p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {projeto.nome}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Status: {projeto.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}