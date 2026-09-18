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
  dataInicio?: string;
  dataFim?: string;
}

interface Relatorio {
  id: number;
  titulo?: string;
  estado?: string;
  createdAt?: string;
  dataCriacao?: string;
}

interface Task {
  id: number;
  titulo?: string;
  estado?: string;
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
];

const CORES_PROJETO: Record<string, string> = {
  PLANEADO: '#6366F1',
  EM_ANDAMENTO: '#F59E0B',
  CONCLUIDO: '#10B981',
  CANCELADO: '#EF4444',
};

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
    carregarDashboard();
  }, []);

const extrairLista = <T,>(resposta: any): T[] => {
  const dados = resposta?.data;

  if (Array.isArray(dados)) {
    return dados;
  }

  if (Array.isArray(dados?.data)) {
    return dados.data;
  }

  if (Array.isArray(dados?.dados)) {
    return dados.dados;
  }

  if (Array.isArray(dados?.dados?.funcionarios)) {
    return dados.dados.funcionarios;
  }

  if (Array.isArray(dados?.dados?.departamentos)) {
    return dados.dados.departamentos;
  }

  if (Array.isArray(dados?.dados?.projetos)) {
    return dados.dados.projetos;
  }

  if (Array.isArray(dados?.dados?.relatorios)) {
    return dados.dados.relatorios;
  }

  if (Array.isArray(dados?.dados?.tasks)) {
    return dados.dados.tasks;
  }

  if (Array.isArray(dados?.funcionarios)) {
    return dados.funcionarios;
  }

  if (Array.isArray(dados?.departamentos)) {
    return dados.departamentos;
  }

  if (Array.isArray(dados?.projetos)) {
    return dados.projetos;
  }

  if (Array.isArray(dados?.relatorios)) {
    return dados.relatorios;
  }

  if (Array.isArray(dados?.tasks)) {
    return dados.tasks;
  }

  return [];
};

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

      const funcionarios =
        resultados[0].status === 'fulfilled'
          ? extrairLista<Funcionario>(resultados[0].value)
          : [];

      const departamentos =
        resultados[1].status === 'fulfilled'
          ? extrairLista<Departamento>(resultados[1].value)
          : [];

      const projetos =
        resultados[2].status === 'fulfilled'
          ? extrairLista<Projeto>(resultados[2].value)
          : [];

      const relatorios =
        resultados[3].status === 'fulfilled'
          ? extrairLista<Relatorio>(resultados[3].value)
          : [];

      const tasks =
        resultados[4].status === 'fulfilled'
          ? extrairLista<Task>(resultados[4].value)
          : [];

      setDados({
        funcionarios,
        departamentos,
        projetos,
        relatorios,
        tasks,
      });
    } catch (erro) {
      console.error('Erro ao carregar dashboard:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const projetosPorEstado = useMemo(() => {
    return ESTADOS_PROJETO.map((estado) => ({
      nome: t(`dashboard.projectStatus.${estado}`),
      quantidade: dados.projetos.filter(
        (projeto) => projeto.estado === estado
      ).length,
      estado,
    }));
  }, [dados.projetos, t]);

  const totalProjetos = dados.projetos.length;

  const projetosConcluidos = dados.projetos.filter(
    (projeto) => projeto.estado === 'CONCLUIDO'
  ).length;

  const projetosEmAndamento = dados.projetos.filter(
    (projeto) => projeto.estado === 'EM_ANDAMENTO'
  ).length;

  const projetosCancelados = dados.projetos.filter(
    (projeto) => projeto.estado === 'CANCELADO'
  ).length;

  const progressoProjetos =
    totalProjetos > 0
      ? Math.round((projetosConcluidos / totalProjetos) * 100)
      : 0;

  const relatoriosPendentes = dados.relatorios.filter(
    (relatorio) => relatorio.estado === 'PENDENTE'
  ).length;

  const relatoriosAprovados = dados.relatorios.filter(
    (relatorio) => relatorio.estado === 'APROVADO'
  ).length;

  const relatoriosRejeitados = dados.relatorios.filter(
    (relatorio) => relatorio.estado === 'REJEITADO'
  ).length;

  const relatoriosConcluidos = dados.relatorios.filter(
    (relatorio) => relatorio.estado === 'CONCLUIDO'
  ).length;

  const tarefasConcluidas = dados.tasks.filter(
    (task) => task.estado === 'CONCLUIDA'
  ).length;

  const tarefasPendentes = dados.tasks.filter(
    (task) => task.estado === 'PENDENTE'
  ).length;

  const tarefasAndamento = dados.tasks.filter(
    (task) => task.estado === 'EM_ANDAMENTO'
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
                {carregando ? '—' : dados.funcionarios.length}
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
                {carregando ? '—' : dados.departamentos.length}
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
                {carregando ? '—' : dados.relatorios.length}
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
        {/* Gráfico de pizza */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-800">
              {t('dashboard.projectOverview.title')}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t('dashboard.projectOverview.description')}
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
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
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
                  >
                    {projetosPorEstado.map((item, index) => (
                      <Cell
                     key={`${item.estado}-${index}`}
                     fill={CORES_PROJETO[item.estado] || '#94A3B8'}
                         />
                      ))}
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
              {t('dashboard.projectProgress.description')}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock3 className="h-4 w-4 text-indigo-500" />
                  {t('dashboard.projectStatus.EM_ANDAMENTO')}
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

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {t('dashboard.projectStatus.CONCLUIDO')}
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

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  {t('dashboard.projectStatus.CANCELADO')}
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
          </div>

          {/* Percentagem geral */}
          <div className="mt-7 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {t('dashboard.projectProgress.completedPercentage')}
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
                    {t('dashboard.tasks.pendingDescription')}
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-800">
                {tarefasPendentes}
              </span>
            </div>

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
                    {t('dashboard.tasks.inProgressDescription')}
                  </p>
                </div>
              </div>

              <span className="text-xl font-bold text-slate-800">
                {tarefasAndamento}
              </span>
            </div>

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
                    {t('dashboard.tasks.completedDescription')}
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