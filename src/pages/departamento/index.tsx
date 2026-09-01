import { useEffect, useState } from 'react';
import DataTable, { IconEdit, IconTrash } from '../../components/dataTable';
import { ModalEliminar } from '../../components/modais/modalEliminar';
import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';
import type { Departamento } from '../../types/departamento.types';
import * as departamentoService from '../../services/departamento.service';
import ModalCriarDepartamento from './modalCriarDepartamento'; // <-- Direct import for default export
import { ModalEditarDepartamento } from './modalEditarDepartamento';
import { useTranslation } from 'react-i18next';

export function Departamentos() {
  const {t}=useTranslation();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [departamentoParaEditar, setDepartamentoParaEditar] = useState<Departamento | null>(null);
  const [departamentoParaEliminar, setDepartamentoParaEliminar] = useState<Departamento | null>(null);

  const { toast } = useToast();
  const { pode } = usePermissoes();

  async function carregar() {
    try {
      const dados = await departamentoService.listarDepartamentos();
      setDepartamentos(dados);
    } catch {
      toast.erro('Não foi possível carregar os departamentos');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleEliminar() {
    if (!departamentoParaEliminar) return;
    try {
      await departamentoService.eliminarDepartamento(departamentoParaEliminar.id);
      toast.sucesso('Departamento eliminado');
      setDepartamentoParaEliminar(null);
      carregar();
    } catch {
      toast.erro('Não foi possível eliminar o departamento');
    }
  }

  const acoes = [
    ...(pode('departamentos', 'editar')
      ? [{ icon: <IconEdit />, label: 'Editar', onClick: (d: Departamento) => setDepartamentoParaEditar(d) }]
      : []),
    ...(pode('departamentos' , 'eliminar')
      ? [{
          icon: <IconTrash />,
          label: 'Eliminar',
          onClick: (d: Departamento) => setDepartamentoParaEliminar(d),
          className: 'danger',
        }]
      : []),
  ];

  return (
    <>
      <DataTable<Departamento>
        title="Departamentos"
        subtitle="Gestão dos departamentos da empresa"
        data={departamentos}
        searchKeys={['nome']}
        columns={[
          { key: 'nome', label: 'Nome' },
          {
            key: 'createdAt',
            label: 'Criado em',
            render: (d) => new Date(d.createdAt).toLocaleDateString('pt-PT'),
          },
        ]}
        actions={acoes}
        onNew={pode('departamentos', 'criar') ? () => setModalCriarAberto(true) : undefined}
        newLabel="Novo Departamento"
      />

      {/* {modalCriarAberto && (
        <ModalCriarDepartamento
          // onFechar={() => setModalCriarAberto(false)}
          onCriado={() => {
            setModalCriarAberto(false);
            carregar();
          }}
        />
      )} */}

      {departamentoParaEditar && (
        <ModalEditarDepartamento
          departamento={departamentoParaEditar}
          onFechar={() => setDepartamentoParaEditar(null)}
          onEditado={() => {
            setDepartamentoParaEditar(null);
            carregar();
          }}
        />
      )}

      {departamentoParaEliminar && (
        <ModalEliminar
          titulo="Eliminar Departamento"
          mensagem={`Tens a certeza que queres eliminar "${departamentoParaEliminar.nome}"?`}
          onCancelar={() => setDepartamentoParaEliminar(null)}
          onConfirmar={handleEliminar}
        />
      )}
    </>
  );
}