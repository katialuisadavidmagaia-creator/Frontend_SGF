import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import DataTable, { IconEdit, IconEye, IconTrash, type Action, type Column, type FilterConfig } from '../../components/dataTable';

const API = 'http://localhost:4003/api';

interface Funcionario {
  id: number;
  name: string;
  email: string;
  phone: string;
  departamento: string; 
  criadoEm: string;
}

const columns: Column<Funcionario>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },                 
  { key: 'email', label: 'Email' },
  { key: 'departamento', label: 'Departamento' },  
  {
    key: 'criado_em',
    label: 'Criado em',
    render: (row: Funcionario) => row.criadoEm ? new Date(row.criadoEm).toLocaleDateString('pt-PT') : '-',
  },
];

const filterConfig: FilterConfig<Funcionario>[] = [
  {
    key: 'departamento',
    title: 'Departamento',
    label: 'Departamento', 
    value: '',
    placeholder: 'Filtrar por Departamento',
    options: [
      { label: 'direcao geral', value: 'direcao geral' },
      { label: 'Tecnologia e sistemas', value: 'Tecnologia e sistemas' },
      { label: 'Financas e contabilidade', value: 'Financas e contabilidade' },
      { label: 'Marketing e comunicacao', value: 'Marketing e comunicacao' },
      { label: 'Projetos e inovacao', value: 'Projetos e inovacao' }, 
      { label: 'Operacoes', value: 'Operacoes' },
    ],
  },
];

const FuncionariosIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default function ListarFuncionario() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/funcionarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar funcionários.');
        return res.json();
      })
      .then((json) => {
        console.log("Dados recebidos da API :", json);
        const dataArray = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        setFuncionarios(dataArray);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao procurar funcionários:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const openDeleteDialog = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedFuncionario(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedFuncionario) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
     
      const response = await fetch(`${API}/funcionarios/${selectedFuncionario.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erro ao eliminar no servidor.');

      setFuncionarios((prev) => prev.filter((f) => f.id !== selectedFuncionario.id));
      closeDeleteDialog();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

 const actions: Action<Funcionario>[] = [
  {
    icon: <IconEye />,
    label: 'Visualizar',
    onClick: (row) => {
      navigate(`/dashboard/funcionarios/${row.id}`);
    },
  },
  {
    icon: <IconEdit />,
    label: 'Editar',
    onClick: (row) => {
      navigate(`/dashboard/funcionarios/${row.id}/editar`);
    },
  },
  {
    icon: <IconTrash />,
    label: 'Eliminar',
    className: 'danger',
    onClick: (row) => openDeleteDialog(row),
  },
];

  if (isLoading) return <p style={{ padding: '24px', fontFamily: 'sans-serif', color: '#666' }}>A carregar...</p>;
  if (error) return <p style={{ color: '#cc3333', padding: '24px', fontFamily: 'sans-serif' }}>{error}</p>;

  return (
    <>
      <DataTable
        title="Funcionários"
        subtitle="Gerencie os funcionários e permissões do sistema"
        icon={<FuncionariosIcon />}
        data={funcionarios}
        columns={columns}
        filters={filterConfig} 
        actions={actions}
        searchKeys={['name', 'email', 'departamento']}
onNew={() => navigate('/dashboard/registar-funcionario')} 
      />

      {/* Modal de Confirmação */}
      {isModalOpen && selectedFuncionario && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0, color: '#1a1a1a' }}>Confirmar Eliminação</h3>
            <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.5' }}>
              Tens a certeza de que desejas eliminar o funcionário <strong>{selectedFuncionario.name}</strong>? Esta acção não poderá ser desfeita.
            </p>
            <div style={modalActionsStyle}>
              <button type="button" onClick={closeDeleteDialog} disabled={isDeleting} style={cancelButtonStyle}>Cancelar</button>
              <button type="button" onClick={confirmDelete} disabled={isDeleting} style={deleteButtonStyle}>
                {isDeleting ? 'A eliminar...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const modalContentStyle: React.CSSProperties = { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' };
const modalActionsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' };
const cancelButtonStyle: React.CSSProperties = { padding: '9px 16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#555' };
const deleteButtonStyle: React.CSSProperties = { padding: '9px 16px', border: 'none', borderRadius: '8px', backgroundColor: '#cc3333', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600 };