import { useEffect, useState, FormEvent } from 'react';
import DataTable from '../../components/dataTable';
import { relatoriosService } from '../../services/relatorio.service';
import * as departamentoService from '../../services/departamento.service';
import { Relatorio, GerarRelatorioPayload, TipoRelatorio } from '../../types/relatorio.types';
import { Departamento } from '../../types/departamento.types';
import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';
import { FileText, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TIPOS: TipoRelatorio[] = ['FUNCIONARIOS', 'DEPARTAMENTOS', 'PROJETOS', 'DESEMPENHO'];

const TIPO_LABEL: Record<TipoRelatorio, string> = {
  FUNCIONARIOS: 'Funcionários',
  DEPARTAMENTOS: 'Departamentos',
  PROJETOS: 'Projetos',
  DESEMPENHO: 'Desempenho',
};

interface AxiosErrorLike {
  response?: {
    data?: {
      mensagem?: string;
    };
  };
}

export default function Relatorios() {
  const {t}=useTranslation();
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
  const { pode } = usePermissoes();

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
      toast.erro(error?.response?.data?.mensagem || 'Erro ao carregar relatórios');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModalGerar() {
    setForm({ titulo: '', tipo: 'FUNCIONARIOS', departamentoId: '', dataInicio: '', dataFim: '' });
    setModalAberto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGerando(true);
    try {
      await relatoriosService.gerar(form);
      toast.sucesso('Relatório gerado com sucesso');
      setModalAberto(false);
      carregarDados();
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(error?.response?.data?.mensagem || 'Erro ao gerar relatório');
    } finally {
      setGerando(false);
    }
  }

  async function handleExportarPdf(relatorio: Relatorio) {
    setExportandoId(relatorio.id);
    try {
      await relatoriosService.exportarPdf(relatorio.id, `${relatorio.titulo}.pdf`);
      toast.sucesso('PDF descarregado com sucesso');
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(error?.response?.data?.mensagem || 'Erro ao exportar PDF');
    } finally {
      setExportandoId(null);
    }
  }

  async function handleEliminar(relatorio: Relatorio) {
    if (!confirm(`Eliminar o relatório "${relatorio.titulo}"?`)) return;
    try {
      await relatoriosService.eliminar(relatorio.id);
      toast.sucesso('Relatório eliminado com sucesso');
      carregarDados();
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(error?.response?.data?.mensagem || 'Erro ao eliminar relatório');
    }
  }

  return (
    <div className="p-6">
      <DataTable<Relatorio>
        title="Relatórios"
        subtitle="Geração e exportação de relatórios em PDF"
        data={relatorios}
        loading={carregando}
        searchKeys={['titulo', 'geradoPorNome']}
        filters={[
          {
            key: 'tipo',
            label: 'Tipo',
            title: 'Tipo de Relatório',
            placeholder: 'Selecione o tipo',
            value: 'tipo',
            options: TIPOS.map((t) => ({ value: t, label: TIPO_LABEL[t] })),
          },
        ]}
        columns={[
          { key: 'titulo', label: 'Título' },
          { key: 'tipo', label: 'Tipo', render: (r: Relatorio) => TIPO_LABEL[r.tipo] },
          { key: 'geradoPorNome', label: 'Gerado Por' },
          { key: 'createdAt', label: 'Data' },  
        ]}
        actions={[
          ...(pode('exportacoes', 'ver')
            ? [
                {
                  label: 'Exportar PDF',
                  icon: <FileText className="h-4 w-4" />,
                  onClick: handleExportarPdf,
                  loading: (r: Relatorio) => exportandoId === r.id,
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
        onNew={pode('relatorios', 'criar') ? abrirModalGerar : undefined}
        newLabel="Gerar Relatório"
      />

      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Gerar Relatório</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoRelatorio })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {TIPO_LABEL[t]}
                    </option>
                  ))}
                </select>
              </div>

              {form.tipo === 'DEPARTAMENTOS' || form.tipo === 'PROJETOS' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Departamento</label>
                  <select
                    value={form.departamentoId}
                    onChange={(e) => setForm({ ...form, departamentoId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Todos</option>
                    {departamentos.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Data Início</label>
                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={form.dataFim}
                    onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={gerando}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {gerando ? 'A gerar...' : 'Gerar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}