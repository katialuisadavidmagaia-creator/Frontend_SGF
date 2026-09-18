import { useEffect, useMemo, useState } from 'react';
import {CheckCircle2,Circle,Clock3,ListTodo,Pencil,Plus,Search,Trash2,UserRound,X,} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

type EstadoTask =
  | 'PENDENTE'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDA'
  | 'CANCELADA';

type PrioridadeTask = 'BAIXA' | 'MEDIA' | 'ALTA';

interface Projeto {
  id: number;
  nome: string;
}

interface Funcionario {
  id: number;
  name: string;
  email?: string;
}

interface Task {
  id: number;
  titulo: string;
  descricao?: string;
  estado: EstadoTask;
  prioridade: PrioridadeTask;
  dataInicio?: string;
  prazo?: string;
  projetoId?: number;
  projeto?: Projeto;
  responsavelId?: number;
  responsavel?: Funcionario;
}

interface FormTask {
  titulo: string;
  descricao: string;
  estado: EstadoTask;
  prioridade: PrioridadeTask;
  dataInicio: string;
  prazo: string;
  projetoId: string;
  responsavelId: string;
}

const ESTADOS: EstadoTask[] = [
  'PENDENTE',
  'EM_ANDAMENTO',
  'CONCLUIDA',
  'CANCELADA',
];

const PRIORIDADES: PrioridadeTask[] = [
  'BAIXA',
  'MEDIA',
  'ALTA',
];

const formInicial: FormTask = {
  titulo: '',
  descricao: '',
  estado: 'PENDENTE',
  prioridade: 'MEDIA',
  dataInicio: '',
  prazo: '',
  projetoId: '',
  responsavelId: '',
};

export default function Tasks() {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [taskEditando, setTaskEditando] = useState<Task | null>(null);

  const [pesquisa, setPesquisa] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPrioridade, setFiltroPrioridade] = useState('');

  const [form, setForm] = useState<FormTask>(formInicial);

  useEffect(() => {
    carregarDados();
  }, []);

  const extrairArray = <T,>(resposta: any): T[] => {
    if (Array.isArray(resposta)) return resposta;

    if (Array.isArray(resposta?.data)) {
      return resposta.data;
    }

    if (Array.isArray(resposta?.dados)) {
      return resposta.dados;
    }

    return [];
  };

  const carregarDados = async () => {
    try {
      setCarregando(true);

      const [tasksRes, projetosRes, funcionariosRes] = await Promise.allSettled([
        api.get('/tasks'),
        api.get('/projetos'),
        api.get('/funcionarios'),
      ]);

      if (tasksRes.status === 'fulfilled') {
        setTasks(extrairArray<Task>(tasksRes.value.data));
      } else {
        console.error('Erro em /tasks:', tasksRes.reason);
      }

      if (projetosRes.status === 'fulfilled') {
        setProjetos(extrairArray<Projeto>(projetosRes.value.data));
      } else {
        console.error('Erro em /projetos:', projetosRes.reason);
      }

      if (funcionariosRes.status === 'fulfilled') {
        setFuncionarios(extrairArray<Funcionario>(funcionariosRes.value.data));
      } else {
        console.error('Erro em /funcionarios:', funcionariosRes.reason);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const abrirCriacao = () => {
    setTaskEditando(null);
    setForm(formInicial);
    setModalAberto(true);
  };

  const abrirEdicao = (task: Task) => {
    setTaskEditando(task);

    setForm({
      titulo: task.titulo || '',
      descricao: task.descricao || '',
      estado: task.estado || 'PENDENTE',
      prioridade: task.prioridade || 'MEDIA',
      dataInicio: task.dataInicio
        ? task.dataInicio.substring(0, 10)
        : '',
      prazo: task.prazo
        ? task.prazo.substring(0, 10)
        : '',
      projetoId: task.projetoId
        ? String(task.projetoId)
        : '',
      responsavelId: task.responsavelId
        ? String(task.responsavelId)
        : '',
    });

    setModalAberto(true);
  };

  const atualizarCampo = (
    campo: keyof FormTask,
    valor: string
  ) => {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  const guardarTask = async () => {
    if (!form.titulo.trim()) {
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        estado: form.estado,
        prioridade: form.prioridade,
        dataInicio: form.dataInicio || undefined,
        prazo: form.prazo || undefined,
        projetoId: form.projetoId
          ? Number(form.projetoId)
          : undefined,
        responsavelId: form.responsavelId
          ? Number(form.responsavelId)
          : undefined,
      };

      if (taskEditando) {
        await api.put(`/tasks/${taskEditando.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }

      await carregarDados();

      setModalAberto(false);
      setTaskEditando(null);
      setForm(formInicial);
    } catch (erro) {
      console.error('Erro ao guardar task:', erro);
    } finally {
      setSalvando(false);
    }
  };

  const eliminarTask = async (id: number) => {
    const confirmar = window.confirm(
      t('tasks.confirmDelete')
    );

    if (!confirmar) return;

    try {
      await api.delete(`/tasks/${id}`);

      setTasks((atuais) =>
        atuais.filter((task) => task.id !== id)
      );
    } catch (erro) {
      console.error('Erro ao eliminar task:', erro);
    }
  };

  const alterarEstado = async (
    task: Task,
    estado: EstadoTask
  ) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        estado,
      });

      setTasks((atuais) =>
        atuais.map((item) =>
          item.id === task.id
            ? { ...item, estado }
            : item
        )
      );
    } catch (erro) {
      console.error('Erro ao alterar estado:', erro);
    }
  };

  const tarefasFiltradas = useMemo(() => {
    const termo = pesquisa.toLowerCase().trim();

    return tasks.filter((task) => {
      const correspondePesquisa =
        !termo ||
        task.titulo.toLowerCase().includes(termo) ||
        task.descricao?.toLowerCase().includes(termo) ||
        task.projeto?.nome.toLowerCase().includes(termo) ||
        task.responsavel?.name.toLowerCase().includes(termo);

      const correspondeEstado =
        !filtroEstado ||
        task.estado === filtroEstado;

      const correspondePrioridade =
        !filtroPrioridade ||
        task.prioridade === filtroPrioridade;

      return (
        correspondePesquisa &&
        correspondeEstado &&
        correspondePrioridade
      );
    });
  }, [tasks, pesquisa, filtroEstado, filtroPrioridade]);

  const estaAtrasada = (task: Task) => {
    if (!task.prazo || task.estado === 'CONCLUIDA') {
      return false;
    }

    return new Date(task.prazo) < new Date();
  };

  const estatisticas = {
    total: tasks.length,
    pendentes: tasks.filter(
      (task) => task.estado === 'PENDENTE'
    ).length,
    andamento: tasks.filter(
      (task) => task.estado === 'EM_ANDAMENTO'
    ).length,
    concluidas: tasks.filter(
      (task) => task.estado === 'CONCLUIDA'
    ).length,
    atrasadas: tasks.filter(estaAtrasada).length,
  };

  const estadoLabel = (estado: EstadoTask) =>
    t(`tasks.status.${estado}`);

  const prioridadeLabel = (prioridade: PrioridadeTask) =>
    t(`tasks.priority.${prioridade}`);

  const estadoClasses: Record<EstadoTask, string> = {
    PENDENTE: 'bg-slate-100 text-slate-700',
    EM_ANDAMENTO: 'bg-blue-100 text-blue-700',
    CONCLUIDA: 'bg-green-100 text-green-700',
    CANCELADA: 'bg-red-100 text-red-700',
  };

  const prioridadeClasses: Record<PrioridadeTask, string> = {
    BAIXA: 'bg-slate-100 text-slate-600',
    MEDIA: 'bg-yellow-100 text-yellow-700',
    ALTA: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <ListTodo className="h-7 w-7 text-indigo-600" />

            <h1 className="text-2xl font-bold text-slate-800">
              {t('tasks.title')}
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {t('tasks.description')}
          </p>
        </div>

        <button
          onClick={abrirCriacao}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          {t('tasks.newTask')}
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {t('tasks.statistics.total')}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-800">
            {estatisticas.total}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {t('tasks.statistics.pending')}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-700">
            {estatisticas.pendentes}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {t('tasks.statistics.inProgress')}
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {estatisticas.andamento}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {t('tasks.statistics.completed')}
          </p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {estatisticas.concluidas}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {t('tasks.statistics.overdue')}
          </p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {estatisticas.atrasadas}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder={t('tasks.search')}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          >
            <option value="">
              {t('tasks.filters.allStatuses')}
            </option>

            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estadoLabel(estado)}
              </option>
            ))}
          </select>

          <select
            value={filtroPrioridade}
            onChange={(e) =>
              setFiltroPrioridade(e.target.value)
            }
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
          >
            <option value="">
              {t('tasks.filters.allPriorities')}
            </option>

            {PRIORIDADES.map((prioridade) => (
              <option
                key={prioridade}
                value={prioridade}
              >
                {prioridadeLabel(prioridade)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {carregando ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-500">
            {t('common.loading')}
          </div>
        ) : tarefasFiltradas.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <ListTodo className="mb-3 h-10 w-10 text-slate-300" />

            <p className="text-sm text-slate-500">
              {t('tasks.empty')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tarefasFiltradas.map((task) => (
              <div
                key={task.id}
                className="p-5 transition hover:bg-slate-50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <button
                      onClick={() =>
                        alterarEstado(
                          task,
                          task.estado === 'CONCLUIDA'
                            ? 'PENDENTE'
                            : 'CONCLUIDA'
                        )
                      }
                      className="mt-1 shrink-0"
                    >
                      {task.estado === 'CONCLUIDA' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-semibold ${
                            task.estado === 'CONCLUIDA'
                              ? 'text-slate-400 line-through'
                              : 'text-slate-800'
                          }`}
                        >
                          {task.titulo}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${estadoClasses[task.estado]}`}
                        >
                          {estadoLabel(task.estado)}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${prioridadeClasses[task.prioridade]}`}
                        >
                          {prioridadeLabel(task.prioridade)}
                        </span>

                        {estaAtrasada(task) && (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                            {t('tasks.overdue')}
                          </span>
                        )}
                      </div>

                      {task.descricao && (
                        <p className="mt-1 text-sm text-slate-500">
                          {task.descricao}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        {task.projeto?.nome && (
                          <span>
                            {t('tasks.project')}:{' '}
                            <strong className="text-slate-700">
                              {task.projeto.nome}
                            </strong>
                          </span>
                        )}

                        {task.responsavel?.name && (
                          <span className="flex items-center gap-1">
                            <UserRound className="h-3.5 w-3.5" />

                            {task.responsavel.name}
                          </span>
                        )}

                        {task.prazo && (
                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />

                            {new Date(
                              task.prazo
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => abrirEdicao(task)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      title={t('common.edit')}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => eliminarTask(task.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      title={t('common.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {taskEditando
                    ? t('tasks.editTask')
                    : t('tasks.newTask')}
                </h2>
              </div>

              <button
                onClick={() => setModalAberto(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t('tasks.fields.title')}
                </label>

                <input
                  value={form.titulo}
                  onChange={(e) =>
                    atualizarCampo(
                      'titulo',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t('tasks.fields.description')}
                </label>

                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    atualizarCampo(
                      'descricao',
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('tasks.fields.status')}
                  </label>

                  <select
                    value={form.estado}
                    onChange={(e) =>
                      atualizarCampo(
                        'estado',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estadoLabel(estado)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('tasks.fields.priority')}
                  </label>

                  <select
                    value={form.prioridade}
                    onChange={(e) =>
                      atualizarCampo(
                        'prioridade',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  >
                    {PRIORIDADES.map((prioridade) => (
                      <option
                        key={prioridade}
                        value={prioridade}
                      >
                        {prioridadeLabel(prioridade)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('tasks.fields.project')}
                  </label>

                  <select
                    value={form.projetoId}
                    onChange={(e) =>
                      atualizarCampo(
                        'projetoId',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  >
                    <option value="">
                      {t('tasks.fields.selectProject')}
                    </option>

                    {projetos.map((projeto) => (
                      <option
                        key={projeto.id}
                        value={projeto.id}
                      >
                        {projeto.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('tasks.fields.responsible')}
                  </label>

                  <select
                    value={form.responsavelId}
                    onChange={(e) =>
                      atualizarCampo(
                        'responsavelId',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  >
                    <option value="">
                      {t('tasks.fields.selectResponsible')}
                    </option>

                    {funcionarios.map((funcionario) => (
                      <option
                        key={funcionario.id}
                        value={funcionario.id}
                      >
                        {funcionario.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('tasks.fields.startDate')}
                  </label>

                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={(e) =>
                      atualizarCampo(
                        'dataInicio',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {t('tasks.fields.deadline')}
                  </label>

                  <input
                    type="date"
                    value={form.prazo}
                    onChange={(e) =>
                      atualizarCampo(
                        'prazo',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
              <button
                onClick={() => setModalAberto(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              >
                {t('common.cancel')}
              </button>

              <button
                onClick={guardarTask}
                disabled={salvando}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {salvando
                  ? t('common.loading')
                  : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}