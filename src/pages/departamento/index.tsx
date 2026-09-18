
import { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../components/dataTable';
import { ModalEliminar } from '../../components/modais/modalEliminar';
import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';
import type { Departamento } from '../../types/departamento.types';
import { departamentoService } from '../../services/departamento.service';
import ModalCriarDepartamento from './modalCriarDepartamento';
import { ModalEditarDepartamento } from './modalEditarDepartamento';
import ModalVerDepartamento from './modalVerDepartamento';

export function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  const [departamentoParaEditar, setDepartamentoParaEditar] =
    useState<Departamento | null>(null);

  const [departamentoParaVer, setDepartamentoParaVer] =
    useState<Departamento | null>(null);

  const [departamentoParaEliminar, setDepartamentoParaEliminar] =
    useState<Departamento | null>(null);

  const { toast } = useToast();
  const { pode } = usePermissoes();

  async function carregarDepartamentos() {
    setCarregando(true);

    try {
      const dados = await (departamentoService as any).listarDepartamentos();
      setDepartamentos(dados);
    } catch (err: any) {
      console.error('Erro ao carregar departamentos:', err);

      toast.erro(
        err?.response?.data?.mensagem ||
          err?.response?.data?.message ||
          'Não foi possível carregar os departamentos'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDepartamentos();
  }, []);

  function abrirCriar() {
    setModalCriarAberto(true);
  }

  function fecharCriar() {
    setModalCriarAberto(false);
  }

  function abrirVer(departamento: Departamento) {
    setDepartamentoParaVer(departamento);
  }

  function fecharVer() {
    setDepartamentoParaVer(null);
  }

  function abrirEditar(departamento: Departamento) {
    setDepartamentoParaEditar(departamento);
  }

  function fecharEditar() {
    setDepartamentoParaEditar(null);
  }

  function abrirEliminar(departamento: Departamento) {
    setDepartamentoParaEliminar(departamento);
  }

  function fecharEliminar() {
    setDepartamentoParaEliminar(null);
  }

  async function handleEliminar() {
    if (!departamentoParaEliminar) return;

    try {
      await (departamentoService as any).eliminarDepartamento(
        departamentoParaEliminar.id
      );

      toast.sucesso('Departamento eliminado com sucesso');

      setDepartamentoParaEliminar(null);

      await carregarDepartamentos();
    } catch (err: any) {
      console.error('Erro ao eliminar departamento:', err);

      toast.erro(
        err?.response?.data?.mensagem ||
          err?.response?.data?.message ||
          'Não foi possível eliminar o departamento'
      );
    }
  }

  const acoes = [
    {
      label: 'Ver',
      icon: <Eye size={16} />,
      onClick: abrirVer,
    },

    ...(pode('departamentos', 'editar')
      ? [
          {
            label: 'Editar',
            icon: <Pencil size={16} />,
            onClick: abrirEditar,
          },
        ]
      : []),

    ...(pode('departamentos', 'eliminar')
      ? [
          {
            label: 'Eliminar',
            icon: <Trash2 size={16} />,
            onClick: abrirEliminar,
            variant: 'danger' as const,
          },
        ]
      : []),
  ];

  return (
    <div className="w-full">
      <DataTable<Departamento>
        title="Departamentos"
        subtitle="Gestão dos departamentos da empresa"
        data={departamentos}
        loading={carregando}
        searchKeys={['nome']}
        columns={[
          {
            key: 'nome',
            label: 'Nome',
          },
          {
            key: 'descricao',
            label: 'Descrição',
            render: (departamento) =>
              departamento.descricao || 'Sem descrição',
          },
          {
            key: 'totalFuncionarios',
            label: 'Funcionários',
            render: (departamento) =>
              departamento.totalFuncionarios ?? 0,
          },
          {
            key: 'createdAt',
            label: 'Criado em',
            render: (departamento) => {
              if (!departamento.createdAt) return '—';

              const data = new Date(departamento.createdAt);

              if (Number.isNaN(data.getTime())) return '—';

              return data.toLocaleDateString('pt-PT');
            },
          },
        ]}
        actions={acoes}
        onNew={
          pode('departamentos', 'criar')
            ? abrirCriar
            : undefined
        }
        newLabel="Novo Departamento"
      />

      {modalCriarAberto && (
        <ModalCriarDepartamento
          onFechar={fecharCriar}
          onCriado={async () => {
            fecharCriar();
            await carregarDepartamentos();
          }}
        />
      )}

      {departamentoParaVer && (
        <ModalVerDepartamento
          aberto={true}
          departamento={departamentoParaVer}
          onFechar={fecharVer}
        />
      )}

      {departamentoParaEditar && (
        <ModalEditarDepartamento
          departamento={departamentoParaEditar}
          onFechar={fecharEditar}
          onEditado={async () => {
            fecharEditar();
            await carregarDepartamentos();
          }}
        />
      )}

      {departamentoParaEliminar && (
        <ModalEliminar
          titulo="Eliminar Departamento"
          mensagem={`Tens a certeza que queres eliminar "${departamentoParaEliminar.nome}"?`}
          onCancelar={fecharEliminar}
          onConfirmar={handleEliminar}
        />
      )}
    </div>
  );
}

export default Departamentos;
