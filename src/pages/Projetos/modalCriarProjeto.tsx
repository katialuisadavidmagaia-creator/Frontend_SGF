import { useEffect, useState, FormEvent } from 'react';
import DataTable from '../../components/dataTable';
import { projetosService } from '../../services/projeto.service';
import * as departamentoService from '../../services/departamento.service';
import { Projeto, CriarProjetoPayload, EstadoProjeto } from '../../types/projeto.types';
import { Departamento } from '../../types/departamento.types';
import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';


interface ModalCriarProjetoProps {
  onClose: () => void;
  onCriado: () => void;
}

export function ModalCriarProjeto({ onClose, onCriado }: ModalCriarProjetoProps) {
  const {t}=useTranslation();
  return (
    <div>
      {/* ... */}
      <button onClick={onClose}>carregando....</button>
    </div>
  );
}
const ESTADOS: EstadoProjeto[] = ['PLANEADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'];

const ESTADO_LABEL: Record<EstadoProjeto, string> = {
  PLANEADO: 'Planeado',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState<Projeto | null>(null);
  const [form, setForm] = useState<CriarProjetoPayload>({
    nome: '',
    descricao: '',
    departamentoId: '',
    estado: 'PLANEADO',
    dataInicio: '',
    dataFim: '',
  });

  const { toast } = useToast();
  const { pode } = usePermissoes();

  async function carregarDados() {
    setCarregando(true);
    try {
      const [dadosProjetos, dadosDepartamentos] = await Promise.all([
        projetosService.listar(),
        departamentoService.departamentoService.listarDepartamentos(),
      ]);
      setProjetos(dadosProjetos);
      setDepartamentos(dadosDepartamentos);
    } catch (err: any) {
      toast.erro(err?.response?.data?.mensagem || 'Erro ao carregar projetos');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModalCriar() {
    setProjetoEditando(null);
    setForm({
      nome: '',
      descricao: '',
      departamentoId: departamentos[0]?.id ?? '',
      estado: 'PLANEADO',
      dataInicio: '',
      dataFim: '',
    });
    setModalAberto(true);
  }

  function abrirModalEditar(projeto: Projeto) {
    setProjetoEditando(projeto);
    setForm({
      nome: projeto.nome,
      descricao: projeto.descricao ?? '',
      departamentoId: projeto.departamentoId,
      estado: projeto.estado,
      dataInicio: projeto.dataInicio?.slice(0, 10) ?? '',
      dataFim: projeto.dataFim?.slice(0, 10) ?? '',
    });
    setModalAberto(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (projetoEditando) {
        await projetosService.editar(projetoEditando.id, form);
        toast.sucesso('Projeto atualizado com sucesso');
      } else {
        await projetosService.criar(form);
        toast.sucesso('Projeto criado com sucesso');
      }
      setModalAberto(false);
      carregarDados();
    } catch (err: any) {
      toast.erro(err?.response?.data?.mensagem || 'Erro ao guardar projeto');
    }
  }

  async function handleEliminar(projeto: Projeto) {
    if (!confirm(`Eliminar o projeto "${projeto.nome}"?`)) return;
    try {
      await projetosService.eliminar(projeto.id);
      toast.sucesso('Projeto eliminado com sucesso');
      carregarDados();
    } catch (err: any) {
      toast.erro(err?.response?.data?.mensagem || 'Erro ao eliminar projeto');
    }
  }

  return (
    <div className="p-6">
      <DataTable<Projeto>
        title="Projetos"
        subtitle="Gestão de projetos por departamento"
        data={projetos}
        loading={carregando}
        searchKeys={['nome', 'departamentoNome']}
        filters={[
        {
          key: 'estado',
          label: 'Estado',
          title: 'Estado',
          placeholder: 'Selecione o estado',
          options: ESTADOS.map((e) => ({ value: e, label: ESTADO_LABEL[e] })),
        },
        {
          key: 'departamentoId',
          label: 'Departamento',
          title: 'Departamento',
          placeholder: 'Selecione o departamento',
          options: departamentos.map((d) => ({ value: d.id, label: d.nome })),
        },
      ]}
        columns={[
          { key: 'nome', label: 'Nome' },
          { key: 'departamentoNome', label: 'Departamento' },
          {
            key: 'estado',
            label: 'Estado',
            render: (p: Projeto) => ESTADO_LABEL[p.estado],
          },
          { key: 'dataInicio', label: 'Início' },
          { key: 'dataFim', label: 'Fim' },
        ]}
        actions={[
          ...(pode('projetos', 'editar')
            ? [{ label: 'Editar', icon: <Pencil className="w-4 h-4" />, onClick: abrirModalEditar }]
            : []),
          ...(pode('projetos', 'eliminar')
            ? [{ label: 'Eliminar', icon: <Trash2 className="w-4 h-4" />, onClick: handleEliminar, variant: 'danger' as const }]
            : []),
        ]}
        onNew={pode('projetos', 'criar') ? abrirModalCriar : undefined}
        newLabel="Novo Projeto"
      />

      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {projetoEditando ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Departamento</label>
                <select
                  value={form.departamentoId}
                  onChange={(e) => setForm({ ...form, departamentoId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="" disabled>
                    Selecione um departamento
                  </option>
                  {departamentos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) =>
                    setForm({ ...form, estado: e.target.value as EstadoProjeto })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>
                      {ESTADO_LABEL[e]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Data Início</label>
                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                    required
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
                  Carregando...
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}