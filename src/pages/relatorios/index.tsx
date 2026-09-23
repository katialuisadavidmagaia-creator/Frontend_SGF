import {
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react';

import DataTable from '../../components/dataTable';
import { relatoriosService } from '../../services/relatorio.service';
import { departamentoService } from '../../services/departamento.service';
import MeusRelatorios from '../dashboard/meusRelatorios';
import {
  Relatorio,
  GerarRelatorioPayload,
  TipoRelatorio,
  StatusRelatorio,
} from '../../types/relatorio.types';

import { Departamento } from '../../types/departamento.types';

import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';

import {
  FileText,
  Trash2,
  X,
  BarChart3,
  Download,
  Plus,
  CalendarDays,
  Building2,
  FileBarChart,
  Loader2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

const TIPOS: TipoRelatorio[] = [
  'FUNCIONARIOS',
  'DEPARTAMENTOS',
  'PROJETOS',
  'DESEMPENHO',
];

const TIPO_LABEL: Record<TipoRelatorio, string> = {
  FUNCIONARIOS: 'Funcionários',
  DEPARTAMENTOS: 'Departamentos',
  PROJETOS: 'Projetos',
  DESEMPENHO: 'Desempenho',
};

const TIPO_CLASSES: Record<TipoRelatorio, string> = {
  FUNCIONARIOS: 'bg-blue-50 text-blue-700 border border-blue-200',
  DEPARTAMENTOS: 'bg-violet-50 text-violet-700 border border-violet-200',
  PROJETOS: 'bg-amber-50 text-amber-700 border border-amber-200',
  DESEMPENHO: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const STATUS_LABEL: Record<StatusRelatorio, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

const STATUS_CLASSES: Record<StatusRelatorio, string> = {
  PENDENTE: 'bg-amber-50 text-amber-700 border border-amber-200/60',
  APROVADO: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
  REJEITADO: 'bg-rose-50 text-rose-700 border border-rose-200/60',
};

interface AxiosErrorLike {
  response?: {
    data?: {
      mensagem?: string;
      message?: string;
    };
  };
}

function formatarData(data?: string) {
  if (!data) return '—';
  const dataObj = new Date(data);
  if (Number.isNaN(dataObj.getTime())) return '—';

  return dataObj.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface ModalGerarRelatorioProps {
  aberto: boolean;
  form: GerarRelatorioPayload;
  departamentos: Departamento[];
  gerando: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setForm: Dispatch<SetStateAction<GerarRelatorioPayload>>;
}

function ModalGerarRelatorio({
  aberto,
  form,
  departamentos,
  gerando,
  onClose,
  onSubmit,
  setForm,
}: ModalGerarRelatorioProps) {
  if (!aberto) return null;

  function atualizarCampo(campo: keyof GerarRelatorioPayload, valor: string) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  const precisaDepartamento =
    form.tipo === 'DEPARTAMENTOS' || form.tipo === 'PROJETOS';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!gerando) onClose();
      }}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileBarChart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Gerar relatório
              </h2>
              <p className="text-sm text-slate-500">
                Configure os parâmetros para emissão do documento.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={gerando}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Título do relatório
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => atualizarCampo('titulo', e.target.value)}
              placeholder="Ex.: Relatório mensal de desempenho"
              required
              disabled={gerando}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tipo de relatório
            </label>
            <div className="relative">
              <BarChart3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={form.tipo}
                onChange={(e) => atualizarCampo('tipo', e.target.value)}
                disabled={gerando}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
              >
                {TIPOS.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {TIPO_LABEL[tipo]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {precisaDepartamento && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Departamento
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={form.departamentoId ?? ''}
                  onChange={(e) =>
                    atualizarCampo('departamentoId', e.target.value)
                  }
                  disabled={gerando}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                >
                  <option value="">Todos os departamentos</option>
                  {departamentos.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <label className="text-sm font-semibold text-slate-700">
                Período
              </label>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Data de início
                </label>
                <input
                  type="date"
                  value={form.dataInicio ?? ''}
                  onChange={(e) => atualizarCampo('dataInicio', e.target.value)}
                  disabled={gerando}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Data de fim
                </label>
                <input
                  type="date"
                  value={form.dataFim ?? ''}
                  min={form.dataInicio || undefined}
                  onChange={(e) => atualizarCampo('dataFim', e.target.value)}
                  disabled={gerando}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={gerando}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={gerando}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {gerando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A gerar...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Gerar relatório
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Relatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [exportandoId, setExportandoId] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [form, setForm] = useState<GerarRelatorioPayload>({
    titulo: '',
    tipo: 'FUNCIONARIOS',
    departamentoId: '',
    dataInicio: '',
    dataFim: '',
  });

  const { toast } = useToast();
  const { pode, isAdmin, isRH, isUtilizador } = usePermissoes();

  async function carregarDados() {
    setCarregando(true);
    try {
      const [dadosRelatorios, dadosDepartamentos] = await Promise.all([
        relatoriosService.listar(),
        departamentoService.listarDepartamentos(),
      ]);
      setRelatorios(dadosRelatorios);
      setDepartamentos(dadosDepartamentos);
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(
        error?.response?.data?.mensagem ||
          error?.response?.data?.message ||
          'Erro ao carregar relatórios.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModalGerar() {
    setForm({
      titulo: '',
      tipo: 'FUNCIONARIOS',
      departamentoId: '',
      dataInicio: '',
      dataFim: '',
    });
    setModalAberto(true);
  }

  function fecharModal() {
    if (gerando) return;
    setModalAberto(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const titulo = form.titulo.trim();

    if (!titulo) {
      toast.erro('Informe o título do relatório.');
      return;
    }

    if (form.dataInicio && form.dataFim && form.dataFim < form.dataInicio) {
      toast.erro('A data de fim não pode ser anterior à data de início.');
      return;
    }

    const payload: GerarRelatorioPayload = {
      ...form,
      titulo,
      departamentoId: form.departamentoId || undefined,
      dataInicio: form.dataInicio || undefined,
      dataFim: form.dataFim || undefined,
    };

    setGerando(true);
    try {
      await relatoriosService.gerar(payload);
      toast.sucesso('Relatório gerado com sucesso.');
      setModalAberto(false);
      await carregarDados();
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(
        error?.response?.data?.mensagem ||
          error?.response?.data?.message ||
          'Erro ao gerar relatório.'
      );
    } finally {
      setGerando(false);
    }
  }

  function handleVisualizar(relatorio: Relatorio) {
    // Ação ao clicar no botão "Ver / Detalhes"
    toast.sucesso(`A abrir detalhes do relatório: ${relatorio.titulo}`);
  }

  async function handleExportarPdf(relatorio: Relatorio) {
    const relatorioId = String(relatorio.id);
    setExportandoId(relatorioId);
    try {
      await relatoriosService.exportarPdf(
        relatorioId,
        `${relatorio.titulo}.pdf`
      );
      toast.sucesso('PDF exportado com sucesso.');
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(
        error?.response?.data?.mensagem ||
          error?.response?.data?.message ||
          'Erro ao exportar PDF.'
      );
    } finally {
      setExportandoId(null);
    }
  }

  async function handleEliminar(relatorio: Relatorio) {
    if (!isAdmin) return;
    const confirmou = window.confirm(
      `Tem certeza que deseja eliminar o relatório "${relatorio.titulo}"?`
    );
    if (!confirmou) return;

    try {
      await relatoriosService.eliminar(String(relatorio.id));
      toast.sucesso('Relatório eliminado com sucesso.');
      await carregarDados();
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(
        error?.response?.data?.mensagem ||
          error?.response?.data?.message ||
          'Erro ao eliminar relatório.'
      );
    }
  }

  // Estatísticas do Topo
  const totalRelatorios = relatorios.length;
  const totalAprovados = relatorios.filter((r) => r.status === 'APROVADO').length;
  const totalPendentes = relatorios.filter((r) => r.status === 'PENDENTE').length;
  const totalRejeitados = relatorios.filter((r) => r.status === 'REJEITADO').length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Relatórios
            </h1>
            <p className="text-sm text-slate-500">
              {isAdmin
                ? 'Geração, gestão e acompanhamento de relatórios organizacionais.'
                : isRH
                ? 'Geração e acompanhamento dos relatórios de Recursos Humanos.'
                : 'Consulta e descarregamento de relatórios autorizados.'}
            </p>
          </div>
        </div>

        {pode('relatorios', 'criar') && (
          <button
            type="button"
            onClick={abrirModalGerar}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Gerar Relatório
          </button>
        )}
      </div>

      {isUtilizador && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-blue-900">
          <Eye className="h-5 w-5 shrink-0 text-blue-600" />
          <p className="text-sm font-medium">
            Está no modo de consulta. Pode visualizar e exportar os relatórios
            aos quais possui permissão de acesso.
          </p>
        </div>
      )}

      {/* Cards Estatísticos no Topo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total de Relatórios
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalRelatorios}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Aprovados
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {totalAprovados}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pendentes
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {totalPendentes}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Rejeitados
            </p>
            <p className="mt-1 text-2xl font-bold text-rose-600">
              {totalRejeitados}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <XCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Lista e Tabela Unificada sem Aninhamento */}
      <DataTable<Relatorio>
        title="Lista de Relatórios"
        subtitle="Consulte, filtre e descarregue os relatórios gerados pelo sistema."
        data={relatorios}
        loading={carregando}
        searchKeys={['titulo', 'geradoPorNome']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            title: 'Filtrar por Status',
            placeholder: 'Todos os Status',
            value: '',
            options: [
              { value: 'PENDENTE', label: 'Pendente' },
              { value: 'APROVADO', label: 'Aprovado' },
              { value: 'REJEITADO', label: 'Rejeitado' },
            ],
          },
          {
            key: 'tipo',
            label: 'Tipo',
            title: 'Tipo de relatório',
            placeholder: 'Todos os Tipos',
            value: '',
            options: TIPOS.map((tipo) => ({
              value: tipo,
              label: TIPO_LABEL[tipo],
            })),
          },
        ]}
        columns={[
          {
            key: 'titulo',
            label: 'Relatório',
            render: (relatorio: Relatorio) => (
              <div className="min-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {relatorio.titulo}
                    </p>
                    <p className="text-xs text-slate-400">Documento PDF</p>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'tipo',
            label: 'Tipo',
            render: (relatorio: Relatorio) => (
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  TIPO_CLASSES[relatorio.tipo]
                }`}
              >
                {TIPO_LABEL[relatorio.tipo]}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (relatorio: Relatorio) => {
              const status = relatorio.status || 'APROVADO';
              return (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    STATUS_CLASSES[status]
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {STATUS_LABEL[status]}
                </span>
              );
            },
          },
          {
            key: 'geradoPorNome',
            label: 'Gerado por',
            render: (relatorio: Relatorio) => (
              <span className="text-sm text-slate-600">
                {relatorio.geradoPorNome || 'Sistema'}
              </span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Data',
            render: (relatorio: Relatorio) => (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                {formatarData(relatorio.createdAt)}
              </div>
            ),
          },
        ]}
        actions={[
          {
            label: 'Ver Detalhes',
            icon: <Eye className="h-4 w-4" />,
            onClick: handleVisualizar,
          },
          ...(pode('exportacoes', 'ver')
            ? [
                {
                  label: 'Exportar PDF',
                  icon: <Download className="h-4 w-4" />,
                  onClick: handleExportarPdf,
                  loading: (r: Relatorio) =>
                    exportandoId === String(r.id),
                },
              ]
            : []),
          ...(pode('relatorios', 'eliminar')
            ? [
                {
                  label: 'Eliminar',
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: handleEliminar,
                  variant: 'danger' as const,
                },
              ]
            : []),
        ]}
      />

      {/* Modal de Criação */}
      <ModalGerarRelatorio
        aberto={modalAberto}
        form={form}
        departamentos={departamentos}
        gerando={gerando}
        onClose={fecharModal}
        onSubmit={handleSubmit}
        setForm={setForm}
      />
    </div>
  );
}