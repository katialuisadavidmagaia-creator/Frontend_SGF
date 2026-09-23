
import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  FileText,
  Users,
  Building2,
  Clock3,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '../../services/api';

interface Funcionario {
  id: number;
  nome?: string;
  name?: string;
  email?: string;
}

interface Departamento {
  id: number;
  nome?: string;
}

interface Projeto {
  id: number;
  nome?: string;
  estado?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
}

interface Relatorio {
  id: number;
  titulo?: string;
  estado?: string;
  status?: string;
  createdAt?: string;
  dataCriacao?: string;
}

interface Task {
  id: number;
  titulo?: string;
  estado?: string;
  status?: string;
  prazo?: string;
}

interface DashboardData {
  funcionarios: Funcionario[];
  departamentos: Departamento[];
  projetos: Projeto[];
  relatorios: Relatorio[];
  tasks: Task[];
}

const ESTADOS_PROJETO = [
  'PLANEADO',
  'EM_ANDAMENTO',
  'CONCLUIDO',
  'CANCELADO',
] as const;

const CORES_PROJETO: Record<string, string> = {
  PLANEADO: '#6366F1',
  EM_ANDAMENTO: '#F59E0B',
  CONCLUIDO: '#10B981',
  CANCELADO: '#EF4444',
};

function extrairArray<T>(resposta: any, chave?: string): T[] {
  const data = resposta?.data;

  // Caso a API devolva diretamente:
  // { data: [...] }
  if (Array.isArray(data)) {
    return data;
  }

  // Caso devolva:
  // { data: { data: [...] } }
  if (Array.isArray(data?.data)) {
    return data.data;
  }

  // Caso devolva:
  // { data: { dados: [...] } }
  if (Array.isArray(data?.dados)) {
    return data.dados;
  }

  // Caso devolva:
  // { data: { dados: { funcionarios: [...] } } }
  if (chave && Array.isArray(data?.dados?.[chave])) {
    return data.dados[chave];
  }

  // Caso devolva:
  // { data: { funcionarios: [...] } }
  if (chave && Array.isArray(data?.[chave])) {
    return data[chave];
  }

  return [];
}

export default function Dashboard() {
  const { t } = useTranslation();

  const [dados, setDados] = useState<DashboardData>({
    funcionarios: [],
    departamentos: [],
    projetos: [],
    relatorios: [],
    tasks: [],
  });

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    const carregarDashboard = async () => {
      try {
        setCarregando(true);

        const resultados = await Promise.allSettled([
          api.get('/funcionarios'),
          api.get('/departamentos'),
          api.get('/projetos'),
          api.get('/relatorios'),
          api.get('/tasks'),
        ]);

        if (!ativo) return;

        const funcionarios =
          resultados[0].status === 'fulfilled'
            ? extrairArray<Funcionario>(
                resultados[0].value,
                'funcionarios'
              )
            : [];

        const departamentos =
          resultados[1].status === 'fulfilled'
            ? extrairArray<Departamento>(
                resultados[1].value,
                'departamentos'
              )
            : [];

        const projetos =
          resultados[2].status === 'fulfilled'
            ? extrairArray<Projeto>(
                resultados[2].value,
                'projetos'
              )
            : [];

        const relatorios =
          resultados[3].status === 'fulfilled'
            ? extrairArray<Relatorio>(
                resultados[3].value,
                'relatorios'
              )
            : [];

        const tasks =
          resultados[4].status === 'fulfilled'
            ? extrairArray<Task>(
                resultados[4].value,
                'tasks'
              )
            : [];

        console.log('[Dashboard] Funcionários:', funcionarios);
        console.log('[Dashboard] Departamentos:', departamentos);
        console.log('[Dashboard] Projetos:', projetos);
        console.log('[Dashboard] Relatórios:', relatorios);
        console.log('[Dashboard] Tasks:', tasks);

        setDados({
          funcionarios: Array.isArray(funcionarios)
            ? funcionarios
            : [],
          departamentos: Array.isArray(departamentos)
            ? departamentos
            : [],
          projetos: Array.isArray(projetos)
            ? projetos
            : [],
          relatorios: Array.isArray(relatorios)
            ? relatorios
            : [],
          tasks: Array.isArray(tasks)
            ? tasks
            : [],
        });
      } catch (erro) {
        console.error(
          '[Dashboard] Erro ao carregar dados:',
          erro
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, []);

  const obterEstadoProjeto = (projeto: Projeto) => {
    return projeto.estado || projeto.status || '';
  };

  const obterEstadoRelatorio = (relatorio: Relatorio) => {
    return relatorio.estado || relatorio.status || '';
  };

  const obterEstadoTask = (task: Task) => {
    return task.estado || task.status || '';
  };

  const projetosPorEstado = useMemo(() => {
    return ESTADOS_PROJETO.map((estado) => ({
      nome: t(`dashboard.projectStatus.${estado}`),
      quantidade: dados.projetos.filter(
        (projeto) => obterEstadoProjeto(projeto) === estado
      ).length,
      estado,
    }));
  }, [dados.projetos, t]);

  const totalProjetos = dados.projetos.length;

  const projetosConcluidos = dados.projetos.filter(
    (projeto) =>
      obterEstadoProjeto(projeto) === 'CONCLUIDO'
  ).length;

  const projetosEmAndamento = dados.projetos.filter(
    (projeto) =>
      obterEstadoProjeto(projeto) === 'EM_ANDAMENTO'
  ).length;

  const projetosCancelados = dados.projetos.filter(
    (projeto) =>
      obterEstadoProjeto(projeto) === 'CANCELADO'
  ).length;

  const projetosPlaneados = dados.projetos.filter(
    (projeto) =>
      obterEstadoProjeto(projeto) === 'PLANEADO'
  ).length;

  const progressoProjetos =
    totalProjetos > 0
      ? Math.round(
          (projetosConcluidos / totalProjetos) * 100
        )
      : 0;

  const relatoriosPendentes = dados.relatorios.filter(
    (relatorio) =>
      obterEstadoRelatorio(relatorio) === 'PENDENTE'
  ).length;

  const relatoriosAprovados = dados.relatorios.filter(
    (relatorio) =>
      obterEstadoRelatorio(relatorio) === 'APROVADO'
  ).length;

  const relatoriosRejeitados = dados.relatorios.filter(
    (relatorio) =>
      obterEstadoRelatorio(relatorio) === 'REJEITADO'
  ).length;

  const relatoriosConcluidos = dados.relatorios.filter(
    (relatorio) =>
      obterEstadoRelatorio(relatorio) === 'CONCLUIDO'
  ).length;

  const tarefasConcluidas = dados.tasks.filter(
    (task) =>
      obterEstadoTask(task) === 'CONCLUIDA'
  ).length;

  const tarefasPendentes = dados.tasks.filter(
    (task) =>
      obterEstadoTask(task) === 'PENDENTE'
  ).length;

  const tarefasAndamento = dados.tasks.filter(
    (task) =>
      obterEstadoTask(task) === 'EM_ANDAMENTO'
  ).length;

  const obterPercentagem = (
    valor: number,
    total: number
  ) => {
    if (!total) return 0;

    return Math.round((valor / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {t('dashboard.title')}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {t('dashboard.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {t('dashboard.statistics.employees')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {carregando
                  ? '—'
                  : dados.funcionarios.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {t('dashboard.statistics.departments')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {carregando
                  ? '—'
                  : dados.departamentos.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
              <Building2 className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {t('dashboard.statistics.projects')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {carregando ? '—' : totalProjetos}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <FolderKanban className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {t('dashboard.statistics.reports')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {carregando
                  ? '—'
                  : dados.relatorios.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {t('dashboard.statistics.tasks')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {carregando ? '—' : dados.tasks.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <ClipboardList className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Gráfico */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-800">
              {t('dashboard.projectOverview.title')}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t(
                'dashboard.projectOverview.description'
              )}
            </p>
          </div>

          {totalProjetos === 0 ? (
            <div className="flex h-[320px] flex-col items-center justify-center text-center">
              <FolderKanban className="h-10 w-10 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                {t('dashboard.projectOverview.empty')}
              </p>
            </div>
          ) : (
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={projetosPorEstado}
                    dataKey="quantidade"
                    nameKey="nome"
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    labelLine={false}
                  >
                    {projetosPorEstado.map(
                      (item, index) => (
                        <Cell
                          key={`${item.estado}-${index}`}
                          fill={
                            CORES_PROJETO[item.estado] ||
                            '#94A3B8'
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Resumo dos projetos */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-800">
              {t('dashboard.projectProgress.title')}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t(
                'dashboard.projectProgress.description'
              )}
            </p>
          </div>

          <div className="space-y-5">
            {/* Em andamento */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock3 className="h-4 w-4 text-indigo-500" />

                  {t(
                    'dashboard.projectStatus.EM_ANDAMENTO'
                  )}
                </span>

                <span className="font-semibold text-slate-800">
                  {projetosEmAndamento}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${obterPercentagem(
                      projetosEmAndamento,
                      totalProjetos
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Concluídos */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                  {t(
                    'dashboard.projectStatus.CONCLUIDO'
                  )}
                </span>

                <span className="font-semibold text-slate-800">
                  {projetosConcluidos}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${obterPercentagem(
                      projetosConcluidos,
                      totalProjetos
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Cancelados */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <AlertCircle className="h-4 w-4 text-red-500" />

                  {t(
                    'dashboard.projectStatus.CANCELADO'
                  )}
                </span>

                <span className="font-semibold text-slate-800">
                  {projetosCancelados}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{
                    width: `${obterPercentagem(
                      projetosCancelados,
                      totalProjetos
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Planeados */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <FolderKanban className="h-4 w-4 text-indigo-500" />

                  {t(
                    'dashboard.projectStatus.PLANEADO'
                  )}
                </span>

                <span className="font-semibold text-slate-800">
                  {projetosPlaneados}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${obterPercentagem(
                      projetosPlaneados,
                      totalProjetos
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Percentagem geral */}
          <div className="mt-7 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {t(
                    'dashboard.projectProgress.completedPercentage'
                  )}
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {progressoProjetos}%
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relatórios e tarefas */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Relatórios */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-800">
              {t('dashboard.reports.title')}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t('dashboard.reports.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs font-medium text-amber-700">
                {t('dashboard.reports.pending')}
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-800">
                {relatoriosPendentes}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-medium text-emerald-700">
                {t('dashboard.reports.approved')}
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-800">
                {relatoriosAprovados}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs font-medium text-red-700">
                {t('dashboard.reports.rejected')}
              </p>

              <p className="mt-2 text-2xl font-bold text-red-800">
                {relatoriosRejeitados}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">
                {t('dashboard.reports.completed')}
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-800">
                {relatoriosConcluidos}
              </p>
            </div>
          </div>
        </div>

        {/* Tarefas */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-800">
              {t('dashboard.tasks.title')}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t('dashboard.tasks.description')}
            </p>
          </div>

          <div className="space-y-4">
            {/* Pendentes */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <Clock3 className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {t('dashboard.tasks.pending')}
                  </p>

                  <p className="text-xs text-slate-400">
                    {t(
                      'dashboard.tasks.pendingDescription'
                    )}
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-800">
                {tarefasPendentes}
              </span>
            </div>

            {/* Em andamento */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                  <ClipboardList className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {t('dashboard.tasks.inProgress')}
                  </p>

                  <p className="text-xs text-slate-400">
                    {t(
                      'dashboard.tasks.inProgressDescription'
                    )}
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-800">
                {tarefasAndamento}
              </span>
            </div>

            {/* Concluídas */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {t('dashboard.tasks.completed')}
                  </p>

                  <p className="text-xs text-slate-400">
                    {t(
                      'dashboard.tasks.completedDescription'
                    )}
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-800">
                {tarefasConcluidas}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
