
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  FileText,
  CheckCircle2,
  Clock3,
  ArrowRight,
  User,
  Building2,
  CalendarDays,
  Activity,
  AlertCircle,
} from 'lucide-react';

import { api } from '../../services/api';
import { useAuth } from '../../context/authcontext';

interface Projeto {
  id: number;
  nome?: string;
  estado?: string;
  progresso?: number;
  createdAt?: string;
}

interface Relatorio {
  id: number;
  titulo?: string;
  nome?: string;
  estado?: string;
  createdAt?: string;
}

interface Perfil {
  name?: string;
  email?: string;
  cargo?: string;
  departamentos?: {
    nome?: string;
  };
  gestorDireto?: string;
  localizacao?: string;
}

function formatarEstado(estado?: string) {
  if (!estado) return 'Sem estado';

  return estado
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

function formatarData(data?: string) {
  if (!data) return '';

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
  });
}

export default function DashboardFuncionario() {
  const navigate = useNavigate();
  const { utilizador } = useAuth();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setCarregando(true);
        setErro('');

        const [perfilResponse, projetosResponse, relatoriosResponse] =
          await Promise.all([
            api.get('/perfil'),
            api.get('/projetos'),
            api.get('/relatorios'),
          ]);

        const perfilData =
          perfilResponse.data?.data ??
          perfilResponse.data ??
          null;

        const projetosData =
          projetosResponse.data?.data ??
          projetosResponse.data ??
          [];

        const relatoriosData =
          relatoriosResponse.data?.data ??
          relatoriosResponse.data ??
          [];

        setPerfil(perfilData);

        setProjetos(
          Array.isArray(projetosData)
            ? projetosData
            : []
        );

        setRelatorios(
          Array.isArray(relatoriosData)
            ? relatoriosData
            : []
        );
      } catch (error) {
        console.error(error);

        setErro(
          'Não foi possível carregar a sua dashboard.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  const projetosAtivos = projetos.filter(
    (projeto) =>
      projeto.estado?.toUpperCase() !== 'CONCLUIDO'
  );

  const projetosConcluidos = projetos.filter(
    (projeto) =>
      projeto.estado?.toUpperCase() === 'CONCLUIDO'
  );

  const relatoriosPendentes = relatorios.filter(
    (relatorio) =>
      relatorio.estado?.toUpperCase() === 'PENDENTE'
  );

  const nome =
    perfil?.name ||
    utilizador?.nome ||
    'Utilizador';

  const iniciais = nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');

  if (carregando) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="h-12 w-12 rounded-full border-4 border-indigo-100" />

            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-indigo-600" />
          </div>

          <p className="text-sm font-medium text-gray-600">
            A preparar a sua dashboard...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            A carregar as suas informações
          </p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={24} />
          </div>

          <h2 className="font-semibold text-red-900">
            Ocorreu um problema
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {erro}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* HERO */}
      <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-lg md:p-8">

        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <div className="absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300" />

              <span className="text-sm font-medium text-indigo-100">
                PORTAL DO COLABORADOR
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Olá, {nome.split(' ')[0]}!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100 md:text-base">
              Acompanhe os seus projetos, relatórios e
              informações profissionais num só lugar.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur-md">
              {iniciais || '?'}
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <CalendarDays size={17} />

                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString(
                    'pt-PT',
                    {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    }
                  )}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INFORMAÇÕES PRINCIPAIS */}
      <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Meus projetos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projetos.length}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Projetos atribuídos
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FolderKanban size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Projetos ativos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projetosAtivos.length}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Em andamento
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Activity size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Concluídos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projetosConcluidos.length}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Projetos finalizados
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Relatórios pendentes
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {relatoriosPendentes.length}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Aguardam atenção
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileText size={21} />
            </div>
          </div>
        </div>

      </section>

      {/* PERFIL + PROJETOS */}
      <section className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* MEU PERFIL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <User size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Minhas informações
              </h2>

              <p className="text-xs text-slate-500">
                Informação profissional
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-xs text-slate-400">
                Nome
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {nome}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Cargo
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {perfil?.cargo || 'Não informado'}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Departamento
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Building2
                  size={15}
                  className="text-indigo-500"
                />

                <p className="text-sm font-semibold text-slate-800">
                  {perfil?.departamentos?.nome ||
                    'Não atribuído'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Gestor direto
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {perfil?.gestorDireto ||
                  'Não informado'}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard/perfil')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Ver meu perfil
            <ArrowRight size={15} />
          </button>

        </div>

        {/* MEUS PROJETOS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FolderKanban size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Meus projetos
                </h2>

                <p className="text-xs text-slate-500">
                  Projetos em que está envolvido
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/projetos')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Ver todos
              <ArrowRight size={14} />
            </button>

          </div>

          {projetosAtivos.length > 0 ? (

            <div className="space-y-5">

              {projetosAtivos
                .slice(0, 4)
                .map((projeto) => {

                  const progresso =
                    typeof projeto.progresso === 'number'
                      ? Math.min(
                          Math.max(projeto.progresso, 0),
                          100
                        )
                      : 0;

                  return (
                    <div key={projeto.id}>

                      <div className="mb-2 flex items-center justify-between">

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {projeto.nome ||
                              'Projeto sem nome'}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatarEstado(
                              projeto.estado
                            )}
                          </p>
                        </div>

                        <span className="ml-3 text-xs font-bold text-indigo-600">
                          {progresso}%
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all"
                          style={{
                            width: `${progresso}%`,
                          }}
                        />
                      </div>

                    </div>
                  );
                })}

            </div>

          ) : (

            <div className="flex h-40 flex-col items-center justify-center">
              <FolderKanban
                size={34}
                className="mb-3 text-slate-200"
              />

              <p className="text-sm text-slate-500">
                Não existem projetos ativos.
              </p>
            </div>

          )}

        </div>

      </section>

      {/* RELATÓRIOS + ATENÇÃO */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* RELATÓRIOS */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Meus relatórios
                </h2>

                <p className="text-xs text-slate-500">
                  Estado dos seus relatórios
                </p>
              </div>

            </div>

          </div>

          <div className="divide-y divide-slate-100">

            {relatorios.length > 0 ? (

              relatorios
                .slice(0, 5)
                .map((relatorio) => (

                  <div
                    key={relatorio.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <FileText size={17} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {relatorio.titulo ||
                          relatorio.nome ||
                          'Relatório'}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {formatarData(
                          relatorio.createdAt
                        )}
                      </p>

                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                      {formatarEstado(
                        relatorio.estado
                      )}
                    </span>

                  </div>

                ))

            ) : (

              <div className="flex flex-col items-center justify-center py-12">

                <FileText
                  size={34}
                  className="mb-3 text-slate-200"
                />

                <p className="text-sm text-slate-400">
                  Ainda não existem relatórios.
                </p>

              </div>

            )}

          </div>

          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={() => navigate('/relatorios')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              Ver meus relatórios
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

        {/* ATENÇÃO */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Atenção necessária
              </h2>

              <p className="text-xs text-slate-500">
                Informações importantes
              </p>
            </div>

          </div>

          {relatoriosPendentes.length > 0 ? (

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">

              <div className="flex items-start gap-3">

                <Clock3
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>

                  <p className="text-sm font-semibold text-amber-900">
                    Tens {relatoriosPendentes.length}{' '}
                    relatório
                    {relatoriosPendentes.length !== 1
                      ? 's'
                      : ''}{' '}
                    pendente
                    {relatoriosPendentes.length !== 1
                      ? 's'
                      : ''}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Existem relatórios que precisam
                    da tua atenção.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate('/relatorios')}
                className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-amber-700 shadow-sm hover:bg-amber-100"
              >
                Ver relatórios
                <ArrowRight size={14} />
              </button>

            </div>

          ) : (

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <CheckCircle2 size={19} />
              </div>

              <div>

                <p className="text-sm font-semibold text-emerald-900">
                  Tudo em dia
                </p>

                <p className="mt-1 text-xs text-emerald-700">
                  Não existem relatórios pendentes.
                </p>

              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

