import { useEffect, useState, FormEvent } from 'react';
import DataTable from '../../components/dataTable';
import { departamentoService } from '../../services/departamento.service';
import {
  Departamento,
  CriarDepartamentoPayload,
} from '../../types/departamento.types';
import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';
import { Pencil, Trash2, X } from 'lucide-react';

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalAberto, setModalAberto] = useState(false);
  const [departamentoEditando, setDepartamentoEditando] =
    useState<Departamento | null>(null);

  const [form, setForm] = useState<CriarDepartamentoPayload>({
    nome: '',
    descricao: '',
  });

  const [salvando, setSalvando] = useState(false);

  const { toast } = useToast();
  const { pode } = usePermissoes();

  // ==========================================
  // CARREGAR
  // ==========================================

  async function carregarDepartamentos() {
    setCarregando(true);

    try {
      const data = await departamentoService.listarDepartamentos();
      setDepartamentos(data);
    } catch (err: any) {
      console.error('ERRO AO CARREGAR:', err);

      toast.erro(
        err?.response?.data?.mensagem ||
          'Erro ao carregar departamentos'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDepartamentos();
  }, []);

  // ==========================================
  // ABRIR MODAL
  // ==========================================

  function abrirModalCriar() {
    setDepartamentoEditando(null);

    setForm({
      nome: '',
      descricao: '',
    });

    setModalAberto(true);
  }

  // ==========================================
  // EDITAR
  // ==========================================

  function abrirModalEditar(departamento: Departamento) {
    setDepartamentoEditando(departamento);

    setForm({
      nome: departamento.nome,
      descricao: departamento.descricao ?? '',
    });

    setModalAberto(true);
  }

  // ==========================================
  // FECHAR
  // ==========================================

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setDepartamentoEditando(null);

    setForm({
      nome: '',
      descricao: '',
    });
  }

  // ==========================================
  // GUARDAR
  // ==========================================

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.nome.trim()) {
      toast.erro('Digite o nome do departamento');
      return;
    }

    setSalvando(true);

    try {
      if (departamentoEditando) {
        await departamentoService.editarDepartamento(
          departamentoEditando.id,
          {
            nome: form.nome.trim(),
            descricao: form.descricao?.trim() || '',
          }
        );

        toast.sucesso('Departamento atualizado com sucesso');
      } else {
        await departamentoService.criarDepartamento({
          nome: form.nome.trim(),
          descricao: form.descricao?.trim() || '',
        });

        toast.sucesso('Departamento criado com sucesso');
      }

      fecharModal();
      await carregarDepartamentos();
    } catch (err: any) {
      console.error('ERRO AO GUARDAR:', err);

      toast.erro(
        err?.response?.data?.mensagem ||
          err?.response?.data?.message ||
          'Erro ao guardar departamento'
      );
    } finally {
      setSalvando(false);
    }
  }

  // ==========================================
  // ELIMINAR
  // ==========================================

  async function handleEliminar(departamento: Departamento) {
    if (
      !window.confirm(
        `Eliminar o departamento "${departamento.nome}"?`
      )
    ) {
      return;
    }

    try {
      await departamentoService.eliminarDepartamento(departamento.id);

      toast.sucesso('Departamento eliminado com sucesso');
      await carregarDepartamentos();
    } catch (err: any) {
      console.error('ERRO AO ELIMINAR:', err);

      toast.erro(
        err?.response?.data?.mensagem ||
          'Erro ao eliminar departamento'
      );
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <DataTable<Departamento>
        title="Departamentos"
        subtitle="Gestão de departamentos da empresa"
        data={departamentos}
        loading={carregando}
        searchKeys={['nome']}
        columns={[
          {
            key: 'nome',
            label: 'Nome',
          },
          {
            key: 'createdAt',
            label: 'Criado em',
            render: (d) =>
              new Date(d.createdAt).toLocaleDateString('pt-PT'),
          },
        ]}
        actions={[
          ...(pode('departamentos', 'editar')
            ? [
                {
                  label: 'Editar',
                  icon: <Pencil size={16} />,
                  onClick: abrirModalEditar,
                },
              ]
            : []),

          ...(pode('departamentos', 'eliminar')
            ? [
                {
                  label: 'Eliminar',
                  icon: <Trash2 size={16} />,
                  onClick: handleEliminar,
                  variant: 'danger' as const,
                },
              ]
            : []),
        ]}
        onNew={abrirModalCriar}
        newLabel="Novo Departamento"
      />

      {/* MODAL INLINE */}
      {modalAberto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              fecharModal();
            }
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '500px',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.30)',
              overflow: 'hidden',
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#111827',
                  }}
                >
                  {departamentoEditando
                    ? 'Editar Departamento'
                    : 'Novo Departamento'}
                </h2>

                <p
                  style={{
                    margin: '5px 0 0',
                    fontSize: '13px',
                    color: '#6b7280',
                  }}
                >
                  {departamentoEditando
                    ? 'Atualize os dados do departamento'
                    : 'Adicione um novo departamento'}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={salvando}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {/* NOME */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="nomeDepartamento"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Nome
                </label>

                <input
                  id="nomeDepartamento"
                  type="text"
                  value={form.nome}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      nome: e.target.value,
                    }))
                  }
                  placeholder="Ex.: Recursos Humanos"
                  autoFocus
                  required
                  disabled={salvando}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 13px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* DESCRIÇÃO */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="descricaoDepartamento"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Descrição
                </label>

                <textarea
                  id="descricaoDepartamento"
                  value={form.descricao ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Descrição do departamento"
                  rows={4}
                  disabled={salvando}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 13px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>

              {/* BOTÕES */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  style={{
                    padding: '10px 18px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#4F6EF7',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: salvando ? 'not-allowed' : 'pointer',
                    opacity: salvando ? 0.7 : 1,
                  }}
                >
                  {salvando
                    ? 'A guardar...'
                    : departamentoEditando
                    ? 'Atualizar'
                    : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}