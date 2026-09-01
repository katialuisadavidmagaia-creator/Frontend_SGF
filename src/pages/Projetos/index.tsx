import { useEffect, useState } from 'react';
import DataTable, {
  IconEye,
  IconTrash,
} from '../../components/dataTable';

import { ModalEliminar } from '../../components/modais/modalEliminar';

import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';

import type { Projeto } from '../../types/projeto.types';

import * as projetoService from '../../services/projeto.service';

import { ModalCriarProjeto } from './modalCriarProjeto';
import { ModalVerProjeto } from './modalVerProjeto';

const estadoLabel: Record<string, string> = {
  PLANEADO: 'Planeado',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  const [modalCriarAberto, setModalCriarAberto] =
    useState(false);

  const [projetoParaVer, setProjetoParaVer] =
    useState<Projeto | null>(null);

  const [projetoParaEliminar, setProjetoParaEliminar] =
    useState<Projeto | null>(null);

  const { toast } = useToast();
  const { pode } = usePermissoes();

  async function carregar() {
    try {
      const dados = await (projetoService as any).listarProjeto();

      setProjetos(dados);
    } catch {
      toast.erro(
        'Não foi possível carregar os projetos'
      );
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleEliminar() {
    if (!projetoParaEliminar) return;

    try {
      await (projetoService as any).eliminarProjeto(
        projetoParaEliminar.id
      );

      toast.sucesso('Projeto eliminado');

      setProjetoParaEliminar(null);

      await carregar();
    } catch {
      toast.erro(
        'Não foi possível eliminar o projeto'
      );
    }
  }

  const acoes = [
    {
      icon: <IconEye />,
      label: 'Ver',
      onClick: (projeto: Projeto) =>
        setProjetoParaVer(projeto),
    },

    ...(pode('projetos', 'eliminar')
      ? [
          {
            icon: <IconTrash />,
            label: 'Eliminar',
            onClick: (projeto: Projeto) =>
              setProjetoParaEliminar(projeto),
            className: 'danger',
          },
        ]
      : []),
  ];

  return (
    <>
      <DataTable<Projeto>
        title="Projetos"
        subtitle="Gestão de projetos e equipas"
        data={projetos}
        searchKeys={['nome']}
        filters={[
          {
            key: 'estado',
            label: 'Estado',
            title: 'Estado',
            placeholder: 'Selecione o estado',

            options: [
              {
                value: 'PLANEADO',
                label: 'Planeado',
              },
              {
                value: 'EM_ANDAMENTO',
                label: 'Em Andamento',
              },
              {
                value: 'CONCLUIDO',
                label: 'Concluído',
              },
              {
                value: 'CANCELADO',
                label: 'Cancelado',
              },
            ],
          },
        ]}
        columns={[
          {
            key: 'nome',
            label: 'Nome',
          },

          {
            key: 'estado',
            label: 'Estado',
            render: (projeto) =>
              estadoLabel[projeto.estado] ??
              projeto.estado,
          },

          {
            key: 'dataInicio',
            label: 'Início',
            render: (projeto) =>
              new Date(
                projeto.dataInicio
              ).toLocaleDateString('pt-PT'),
          },

          {
            key: 'funcionarios',
            label: 'Equipa',
            render: (projeto) =>
              `${projeto.funcionarios?.length ?? 0} funcionário(s)`,
          },
        ]}
        actions={acoes}
        onNew={
          pode('projetos', 'criar')
            ? () => setModalCriarAberto(true)
            : undefined
        }
        newLabel="Novo Projeto"
      />

      {modalCriarAberto && (
        <ModalCriarProjeto
          onClose={() =>
            setModalCriarAberto(false)
          }
          onCriado={() => {
            setModalCriarAberto(false);
            carregar();
          }}
        />
      )}

      {projetoParaVer && (
        <ModalVerProjeto
          projeto={projetoParaVer}
          onFechar={() =>
            setProjetoParaVer(null)
          }
          onAtualizado={carregar}
        />
      )}

      {projetoParaEliminar && (
        <ModalEliminar
          titulo="Eliminar Projeto"
          mensagem={`Tens a certeza que queres eliminar "${projetoParaEliminar.nome}"?`}
          onCancelar={() =>
            setProjetoParaEliminar(null)
          }
          onConfirmar={handleEliminar}
        />
      )}
    </>
  );
}