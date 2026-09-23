
import { useEffect, useMemo, useState } from 'react';
import {
  FolderKanban,
  Search,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Loader2,
  Clock3,
  ArrowUpRight,
  Users,
} from 'lucide-react';
import { api } from '../../services/api';

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  estado: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'PENDENTE';
  dataInicio: string;
  dataFim?: string;
  progresso?: number;
}

export function MeusProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    async function carregarProjetos() {
      try {
        setLoading(true);

        const res = await api.get('/projetos/meus');

        // Proteção caso a API devolva os dados dentro de uma propriedade
        const dados = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.dados)
            ? res.data.dados
            : Array.isArray(res.data?.projetos)
              ? res.data.projetos
              : [];

        setProjetos(dados);
      } catch (error) {
        console.error('Erro ao carregar os meus projetos:', error);
        setProjetos([]);
      } finally {
        setLoading(false);
      }
    }

    carregarProjetos();
  }, []);

  const projetosFiltrados = useMemo(() => {
    const termo = filtro.trim().toLowerCase();

    if (!termo) return projetos;

    return projetos.filter((projeto) =>
      projeto.nome.toLowerCase().includes(termo)
    );
  }, [projetos, filtro]);

  const projetosAtivos = projetos.filter(
    (projeto) => projeto.estado === 'EM_ANDAMENTO'
  ).length;

  const projetosConcluidos = projetos.filter(
    (projeto) => projeto.estado === 'CONCLUIDO'
  ).length;

  const projetosPendentes = projetos.filter(
    (projeto) => projeto.estado === 'PENDENTE'
  ).length;

  const formatarData = (data?: string) => {
    if (!data) return 'Não definida';

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
      return data;
    }

    return dataObj.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getEstado = (estado: Projeto['estado']) => {
    switch (estado) {
      case 'CONCLUIDO':
        return {
          label: 'Concluído',
          className:
            'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };

      case 'EM_ANDAMENTO':
        return {
          label: 'Em andamento',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: <Clock3 className="w-3.5 h-3.5" />,
        };

      default:
        return {
          label: 'Pendente',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const getProgresso = (projeto: Projeto) => {
    if (projeto.progresso !== undefined) {
      return Math.min(100, Math.max(0, projeto.progresso));
    }

    if (projeto.estado === 'CONCLUIDO') return 100;
    if (projeto.estado === 'EM_ANDAMENTO') return 50;

    return 0;
  };

  return (
    <div className="min-h-full bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#4F6EF7]/10 text-[#4F6EF7]">
                  <FolderKanban className="w-5 h-5" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-[#4F6EF7]">
                  Gestão de projetos
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Os Meus Projetos
              </h1>

              <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl">
                Acompanhe os projetos em que está atribuído como responsável
                ou colaborador.
              </p>
            </div>

            {/* TOTAL */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#4F6EF7]/10 text-[#4F6EF7]">
                <FolderKanban className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total de projetos
                </p>

                <p className="text-2xl font-bold text-slate-900">
                  {projetos.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {/* ATIVOS */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Em andamento
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {projetosAtivos}
                </p>
              </div>

              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                <Clock3 className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Projetos ativos
            </div>
          </div>

          {/* CONCLUÍDOS */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Concluídos
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {projetosConcluidos}
                </p>
              </div>

              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Projetos finalizados
            </div>
          </div>

          {/* PENDENTES */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pendentes
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {projetosPendentes}
                </p>
              </div>

              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Aguardam início
            </div>
          </div>
        </div>

        {/* PESQUISA */}
        {projetos.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Pesquisar por nome do projeto..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="
                  w-full
                  h-11
                  pl-10
                  pr-4
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  text-sm
                  text-slate-800
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-[#4F6EF7]
                  focus:ring-4
                  focus:ring-[#4F6EF7]/10
                "
              />
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl min-h-[400px] flex flex-col items-center justify-center shadow-sm">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4F6EF7]/10 mb-4">
              <Loader2 className="w-7 h-7 text-[#4F6EF7] animate-spin" />
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              A carregar os seus projetos
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Aguarde enquanto buscamos os seus dados...
            </p>
          </div>
        ) : projetosFiltrados.length > 0 ? (

          /* PROJETOS */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {projetosFiltrados.map((projeto) => {
              const estado = getEstado(projeto.estado);
              const progresso = getProgresso(projeto);

              return (
                <div
                  key={projeto.id}
                  className="
                    group
                    bg-white
                    border border-slate-200
                    rounded-2xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    transition-all
                    duration-200
                  "
                >
                  {/* LINHA SUPERIOR */}
                  <div className="h-1 bg-[#4F6EF7]" />

                  <div className="p-5">

                    {/* ESTADO + ÍCONE */}
                    <div className="flex items-center justify-between mb-5">

                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          px-2.5
                          py-1.5
                          rounded-full
                          border
                          text-xs
                          font-semibold
                          ${estado.className}
                        `}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${estado.dot}`} />
                        {estado.icon}
                        {estado.label}
                      </span>

                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4F6EF7]/10 group-hover:text-[#4F6EF7] transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* NOME */}
                    <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 min-h-[3.5rem]">
                      {projeto.nome}
                    </h3>

                    {/* DESCRIÇÃO */}
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[2.75rem]">
                      {projeto.descricao ||
                        'Sem descrição definida para este projeto.'}
                    </p>

                    {/* PROGRESSO */}
                    <div className="mt-6">

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500">
                            Progresso
                          </span>
                        </div>

                        <span className="text-xs font-bold text-slate-800">
                          {progresso}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4F6EF7] rounded-full transition-all duration-500"
                          style={{ width: `${progresso}%` }}
                        />
                      </div>
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                          <CalendarDays className="w-4 h-4" />

                          <span className="text-xs">
                            Início
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-slate-700">
                          {formatarData(projeto.dataInicio)}
                        </span>
                      </div>

                      {projeto.dataFim && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-500">
                            <CalendarDays className="w-4 h-4" />

                            <span className="text-xs">
                              Término
                            </span>
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {formatarData(projeto.dataFim)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-slate-400 pt-1">
                        <Users className="w-4 h-4" />

                        <span className="text-xs">
                          Projeto atribuído a si
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* EMPTY STATE */
          <div className="bg-white border border-slate-200 rounded-2xl min-h-[420px] flex flex-col items-center justify-center text-center px-6 shadow-sm">

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#4F6EF7]/10 rounded-full blur-xl" />

              <div className="relative flex items-center justify-center w-20 h-20 bg-slate-50 border border-slate-200 text-slate-400 rounded-3xl">
                <FolderKanban className="w-9 h-9" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {filtro
                ? 'Nenhum projeto encontrado'
                : 'Nenhum projeto atribuído'}
            </h3>

            <p className="text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
              {filtro
                ? `Não encontramos projetos que correspondam à pesquisa "${filtro}".`
                : 'Neste momento você não tem nenhum projeto atribuído ao seu utilizador. Quando um administrador ou gestor lhe atribuir um projeto, ele aparecerá nesta área.'}
            </p>

            {filtro ? (
              <button
                type="button"
                onClick={() => setFiltro('')}
                className="
                  mt-6
                  px-4
                  py-2.5
                  rounded-xl
                  bg-[#4F6EF7]
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-[#405bd4]
                  transition-colors
                "
              >
                Limpar pesquisa
              </button>
            ) : (
              <div className="mt-6 inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span>
                  Precisa de acesso? Contacte o seu gestor de equipa.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MeusProjetos;
