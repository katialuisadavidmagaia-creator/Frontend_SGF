import { useEffect, useState, type FormEvent } from 'react';
import DataTable from '../../components/dataTable';
import { projetosService } from '../../services/projeto.service';
import { departamentoService } from '../../services/departamento.service';
import type { Projeto, CriarProjetoPayload, EstadoProjeto } from '../../types/projeto.types';
import type { Departamento } from '../../types/departamento.types';
import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';
import { Building2, CalendarDays, Pencil, Trash2, User, FolderKanban, Eye } from 'lucide-react';
import { ModalVerProjeto } from './modalVerProjeto';
import FuncionarioService from '../../services/funcionario.service';

interface Funcionario {
  id: number;
  nome?: string;
  name?: string;
  nomeCompleto?: string;
  email?: string;
  utilizador?: {
    nome?: string;
    email?: string;
  };
}

const ESTADOS: EstadoProjeto[] = ['PLANEADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO'];

const ESTADO_LABEL: Record<EstadoProjeto, string> = {
  PLANEADO: 'Planeado',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

const ESTADO_CLASSES: Record<EstadoProjeto, string> = {
  PLANEADO: 'bg-slate-100 text-slate-700 border border-slate-200',
  EM_ANDAMENTO: 'bg-blue-50 text-blue-700 border border-blue-200',
  CONCLUIDO: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CANCELADO: 'bg-red-50 text-red-700 border border-red-200',
};

function formatarData(data?: string) {
  if (!data) return '—';

  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return '—';
  }

  return dataObj.toLocaleDateString('pt-PT');
}

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState<Projeto | null>(null);
  const [projetoDetalhes, setProjetoDetalhes] = useState<Projeto | null>(null);

  // CORREÇÃO: o valor inicial já não referencia "form" dentro de si mesmo
  // e usa "estado" (o campo que o CriarProjetoPayload/form realmente usa
  // localmente); a conversão para "status" acontece só no handleSubmit,
  // na hora de montar o payload enviado ao backend.
  const [form, setForm] = useState<CriarProjetoPayload>({
    nome: '',
    descricao: '',
    departamentoId: '',
    estado: 'PLANEADO',
    dataInicio: '',
    dataFim: '',
    responsavelId: '',
  });

  const { toast } = useToast();
  const { isAdmin, isRH, isUtilizador, pode } = usePermissoes();

  async function carregarDados() {
    setCarregando(true);

    try {
      const [dadosProjetos, dadosDepartamentos, respostaFuncionarios] = await Promise.all([
        projetosService.listar(),
        departamentoService.listarDepartamentos(),
        FuncionarioService.listarTodos(),
      ]);

      setProjetos(Array.isArray(dadosProjetos) ? dadosProjetos : []);

      setDepartamentos(Array.isArray(dadosDepartamentos) ? dadosDepartamentos : []);

      // CORREÇÃO: lida tanto com a API a devolver um array direto
      // como com a API a devolver { data: [...] }
      const listaFuncionarios = Array.isArray(respostaFuncionarios)
        ? respostaFuncionarios
        : Array.isArray((respostaFuncionarios as any)?.data)
        ? (respostaFuncionarios as any).data
        : [];

      setFuncionarios(listaFuncionarios);
    } catch (err: any) {
      toast.erro(
        err?.response?.data?.mensagem ??
          err?.response?.data?.message ??
          'Erro ao carregar os dados dos projetos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirModalCriar() {
    if (!pode('projetos', 'criar')) {
      toast.erro('Não tem permissão para criar projetos.');
      return;
    }

    setProjetoEditando(null);

    setForm({
      nome: '',
      descricao: '',
      departamentoId: departamentos[0]?.id ?? '',
      estado: 'PLANEADO',
      dataInicio: '',
      dataFim: '',
      responsavelId: '',
    });

    setModalAberto(true);
  }

  function abrirModalEditar(projeto: Projeto) {
    if (!pode('projetos', 'editar')) {
      toast.erro('Não tem permissão para editar projetos.');
      return;
    }

    setProjetoEditando(projeto);

    setForm({
      nome: projeto.nome,
      descricao: projeto.descricao ?? '',
      departamentoId: projeto.departamentoId,
      estado: projeto.estado,
      dataInicio: projeto.dataInicio?.slice(0, 10) ?? '',
      dataFim: projeto.dataFim?.slice(0, 10) ?? '',
      responsavelId: projeto.responsavelId ? String(projeto.responsavelId) : '',
    });

    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setProjetoEditando(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nome = form.nome.trim();

    if (!nome) {
      toast.erro('Informe o nome do projeto.');
      return;
    }

    if (!form.departamentoId) {
      toast.erro('Selecione um departamento.');
      return;
    }

    if (!form.dataInicio) {
      toast.erro('Informe a data de início.');
      return;
    }

    if (form.dataFim && form.dataFim < form.dataInicio) {
      toast.erro('A data de fim não pode ser anterior à data de início.');
      return;
    }

    if (projetoEditando && !pode('projetos', 'editar')) {
      return;
    }

    if (!projetoEditando && !pode('projetos', 'criar')) {
      return;
    }

    // NOTA: o backend espera a chave "status", não "estado".
    // Se o TypeScript continuar a acusar erro aqui, o tipo
    // CriarProjetoPayload em projeto.types.ts ainda tem o campo
    // chamado "estado" e precisa de ser renomeado para "status".
    const payload = {
      nome,
      descricao: form.descricao?.trim() || undefined,
      departamentoId: form.departamentoId,
      status: form.estado ?? 'PLANEADO',
      dataInicio: form.dataInicio,
      dataFim: form.dataFim || undefined,
      responsavelId: form.responsavelId || undefined,
    } as unknown as CriarProjetoPayload;

    setSalvando(true);

    try {
      if (projetoEditando) {
        await projetosService.editar(projetoEditando.id, payload);
        toast.sucesso('Projeto atualizado com sucesso.');
      } else {
        await projetosService.criar(payload);
        toast.sucesso('Projeto criado com sucesso.');
      }

      setModalAberto(false);
      setProjetoEditando(null);

      await carregarDados();
    } catch (err: any) {
      toast.erro(
        err?.response?.data?.mensagem ?? err?.response?.data?.message ?? 'Erro ao guardar o projeto.'
      );
    } finally {
      setSalvando(false);
    }
  }

  async function handleEliminar(projeto: Projeto) {
    if (!pode('projetos', 'eliminar')) {
      toast.erro('Não tem permissão para eliminar projetos.');
      return;
    }

    const confirmou = window.confirm(`Tem certeza que deseja eliminar o projeto "${projeto.nome}"?`);

    if (!confirmou) return;

    try {
      await projetosService.eliminar(projeto.id);
      toast.sucesso('Projeto eliminado com sucesso.');
      await carregarDados();
    } catch (err: any) {
      toast.erro(
        err?.response?.data?.mensagem ?? err?.response?.data?.message ?? 'Erro ao eliminar projeto.'
      );
    }
  }

  function fecharDetalhes() {
    setProjetoDetalhes(null);
  }

  async function atualizarDepoisDoModal() {
    await carregarDados();

    if (!projetoDetalhes) return;

    try {
      const atualizado = await projetosService.obterPorId(projetoDetalhes.id);
      setProjetoDetalhes(atualizado);
    } catch {
      setProjetoDetalhes(null);
    }
  }

  const quantidadeProjetos = projetos.length;

  const projetosEmAndamento = projetos.filter((p) => p.estado === 'EM_ANDAMENTO').length;

  const projetosConcluidos = projetos.filter((p) => p.estado === 'CONCLUIDO').length;

  const projetosPlaneados = projetos.filter((p) => p.estado === 'PLANEADO').length;

  return (
    <div className="space-y-6 p-6">
      {/* CABEÇALHO */}

      <div>
        <div className="flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-blue-600" />

          <h1 className="text-2xl font-bold text-slate-900">Projetos</h1>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? 'Gestão completa dos projetos da organização.'
            : isRH
            ? 'Gestão e acompanhamento dos projetos e respetivas equipas.'
            : 'Consulta dos projetos e respetivas informações.'}
        </p>
      </div>

      {/* RESUMO */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total de projetos</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">{quantidadeProjetos}</p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Em andamento</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">{projetosEmAndamento}</p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Concluídos</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">{projetosConcluidos}</p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Planeados</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">{projetosPlaneados}</p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* FUNCIONÁRIO */}

      {isUtilizador && (
        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <Eye className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-900">Modo de consulta</p>

            <p className="mt-1 text-sm text-blue-700">
              Como funcionário, pode consultar os projetos, estados, responsáveis, departamentos e
              equipas.
            </p>
          </div>
        </div>
      )}

      {/* TABELA */}

      <DataTable<Projeto>
        title="Lista de projetos"
        subtitle={
          isAdmin
            ? 'Administre todos os projetos da organização.'
            : isRH
            ? 'Acompanhe os projetos e respetivas equipas.'
            : 'Consulte os projetos disponíveis.'
        }
        data={projetos}
        loading={carregando}
        searchKeys={['nome', 'departamentoNome', 'responsavelNome']}
        filters={[
          {
            key: 'estado',
            label: 'Estado',
            title: 'Estado',
            placeholder: 'Selecione o estado',
            value: '',
            options: ESTADOS.map((estado) => ({
              value: estado,
              label: ESTADO_LABEL[estado],
            })),
          },

          {
            key: 'departamentoId',
            label: 'Departamento',
            title: 'Departamento',
            placeholder: 'Selecione o departamento',
            value: '',
            options: departamentos.map((departamento) => ({
              value: departamento.id,
              label: departamento.nome,
            })),
          },
        ]}
        onNew={pode('projetos', 'criar') ? abrirModalCriar : undefined}
        newLabel="Novo projeto"
        columns={[
          {
            key: 'nome',
            label: 'Projeto',
            render: (projeto: Projeto) => (
              <div className="min-w-[180px]">
                <p className="font-semibold text-slate-800">{projeto.nome}</p>

                {projeto.descricao && (
                  <p className="mt-1 max-w-xs truncate text-xs text-slate-400">{projeto.descricao}</p>
                )}
              </div>
            ),
          },

          {
            key: 'departamentoNome',
            label: 'Departamento',
            render: (projeto: Projeto) => (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />

                <span>{projeto.departamentoNome || '—'}</span>
              </div>
            ),
          },

          {
            key: 'responsavelNome',
            label: 'Responsável',
            render: (projeto: Projeto) => (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />

                <span>{projeto.responsavelNome || 'Não definido'}</span>
              </div>
            ),
          },

          {
            key: 'estado',
            label: 'Estado',
            render: (projeto: Projeto) => (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  ESTADO_CLASSES[projeto.estado]
                }`}
              >
                {ESTADO_LABEL[projeto.estado]}
              </span>
            ),
          },

          {
            key: 'dataInicio',
            label: 'Início',
            render: (projeto: Projeto) => formatarData(projeto.dataInicio),
          },

          {
            key: 'dataFim',
            label: 'Fim',
            render: (projeto: Projeto) => formatarData(projeto.dataFim),
          },
        ]}
        actions={[
          {
            label: 'Ver detalhes',
            icon: <Eye className="h-4 w-4" />,
            onClick: (projeto: Projeto) => {
              setProjetoDetalhes(projeto);
            },
          },

          ...(pode('projetos', 'editar')
            ? [
                {
                  label: 'Editar',
                  icon: <Pencil className="h-4 w-4" />,
                  onClick: (projeto: Projeto) => {
                    abrirModalEditar(projeto);
                  },
                },
              ]
            : []),

          ...(pode('projetos', 'eliminar')
            ? [
                {
                  label: 'Eliminar',
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: (projeto: Projeto) => {
                    handleEliminar(projeto);
                  },
                  variant: 'danger' as const,
                },
              ]
            : []),
        ]}
      />

      {/* MODAL CRIAR / EDITAR */}

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b px-6 py-5">
              <h2 className="text-xl font-bold text-slate-900">
                {projetoEditando ? 'Editar projeto' : 'Novo projeto'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {projetoEditando
                  ? 'Atualize as informações do projeto.'
                  : 'Preencha as informações para criar um novo projeto.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nome do projeto</label>

                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ex.: Sistema de Gestão"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Descrição</label>

                <textarea
                  value={form.descricao ?? ''}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Descreva o projeto..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Departamento</label>

                  <select
                    value={form.departamentoId}
                    onChange={(e) => setForm({ ...form, departamentoId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Selecione...</option>

                    {departamentos.map((departamento) => (
                      <option key={departamento.id} value={departamento.id}>
                        {departamento.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Estado</label>

                  <select
                    value={form.estado ?? 'PLANEADO'}
                    onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoProjeto })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {ESTADO_LABEL[estado]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Data de início</label>

                  <input
                    type="date"
                    value={form.dataInicio}
                    onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Data de fim</label>

                  <input
                    type="date"
                    value={form.dataFim ?? ''}
                    min={form.dataInicio || undefined}
                    onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Responsável pelo projeto
                </label>

                <select
  value={form.responsavelId ?? ''}
  onChange={(e) => setForm({ ...form, responsavelId: e.target.value })}
  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
>
  <option value="">Sem responsável</option>

  {funcionarios.map((funcionario) => {
    // Procura a chave correta onde o nome está guardado
    const nomeExibicao =
      funcionario.nome ||
      funcionario.nomeCompleto ||
      funcionario.name ||
      funcionario.utilizador?.nome ||
      funcionario.email ||
      `Funcionário #${funcionario.id}`;

    return (
      <option key={funcionario.id} value={funcionario.id}>
        {nomeExibicao}
      </option>
    );
  })}
</select>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvando ? 'A guardar...' : projetoEditando ? 'Guardar alterações' : 'Criar projeto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETALHES */}

      {projetoDetalhes && (
        <ModalVerProjeto
          projeto={projetoDetalhes}
          onFechar={fecharDetalhes}
          onAtualizado={atualizarDepoisDoModal}
        />
      )}
    </div>
  );
}