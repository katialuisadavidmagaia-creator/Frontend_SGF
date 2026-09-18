import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { api } from '../../services/api';
import DataTable, { Column, Action, IconEye, IconEdit, IconTrash } from '../../components/dataTable';

interface DepartamentoObj {
  id: number;
  nome: string;
}

interface Funcionario {
  id: number;
  name?: string;
  nome?: string;
  email: string;
  createdAt?: string;
  criadoEm?: string;
  departamento?: DepartamentoObj | string;
  departamentoId?: number;
}

export default function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/funcionarios');
      const dados = resposta.data?.data || resposta.data?.dados || resposta.data;

      if (Array.isArray(dados)) {
        setFuncionarios(dados);
      }
    } catch (erro) {
      console.error('Erro ao carregar funcionários:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const handleDeletarFuncionario = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja remover este funcionário?')) return;

    try {
      await api.delete(`/funcionarios/${id}`);
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (erro) {
      console.error('Erro ao apagar funcionário:', erro);
      alert('Não foi possível remover o funcionário.');
    }
  };

  const columns: Column<Funcionario>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (f) => <span className="font-mono text-xs">{f.id}</span>,
    },
    {
      key: 'nome',
      label: 'Nome',
      render: (f) => <span className="font-medium text-slate-800">{f.name || f.nome || '—'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (f) => <span className="text-slate-500">{f.email}</span>,
    },
    {
      key: 'departamento',
      label: 'Departamento',
      render: (f) => {
        let nomeDep = 'Sem Departamento';
        if (typeof f.departamento === 'object' && f.departamento?.nome) {
          nomeDep = f.departamento.nome;
        } else if (typeof f.departamento === 'string' && f.departamento.trim()) {
          nomeDep = f.departamento;
        }

        const isSemDep = nomeDep === 'Sem Departamento';
        return (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isSemDep ? 'bg-slate-100 text-slate-600' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            {nomeDep}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Criado Em',
      render: (f) => {
        const dataStr = f.createdAt || f.criadoEm;
        if (!dataStr) return '—';
        try {
          return new Date(dataStr).toLocaleDateString('pt-PT');
        } catch {
          return dataStr;
        }
      },
    },
  ];

  const actions: Action<Funcionario>[] = [
    {
      icon: <IconEye />,
      label: 'Ver Detalhes',
      onClick: (f) => navigate(`/dashboard/funcionarios/${f.id}`),
    },
    {
      icon: <IconEdit />,
      label: 'Editar',
      onClick: (f) => navigate(`/dashboard/funcionarios/${f.id}/editar`),
    },
    {
      icon: <IconTrash />,
      label: 'Remover',
      variant: 'danger',
      onClick: (f) => handleDeletarFuncionario(f.id),
    },
  ];

  return (
    <DataTable<Funcionario>
      title="Funcionários"
      subtitle="Gerencie os funcionários e permissões do sistema"
      icon={<Users className="h-6 w-6 text-indigo-600" />}
      data={funcionarios}
      loading={carregando}
      columns={columns}
      actions={actions}
      searchKeys={['name', 'nome', 'email']}
      newLabel="Novo Funcionário"
      placeholder="Pesquisar por nome ou email..."
      onNew={() => navigate('/dashboard/funcionarios/novo')}
    />
  );
}