
export type EstadoProjeto =
  | 'PLANEADO'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'CANCELADO';

export type StatusFuncionarioProjeto =
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'CANCELADO';

export interface ProjetoFuncionario {
  id: number;
  funcionarioId: number;
  projetoId: string;
  status: StatusFuncionarioProjeto;
  dataAtribuicao?: string;
  dataSubmissao?: string | null;

  funcionario: {
    id: number;
    name: string;
  };
}

export interface Projeto {
  id: string;
  nome: string;
  descricao?: string;

  departamentoId: string;
  departamentoNome?: string;

  estado: EstadoProjeto;

  dataInicio: string;
  dataFim?: string;

  responsavelId?: string;
  responsavelNome?: string;

  createdAt: string;
  updatedAt: string;

  funcionarios: ProjetoFuncionario[];
}

export interface CriarProjetoPayload {
  nome: string;
  descricao?: string;
  departamentoId: string;
  estado?: EstadoProjeto;
  dataInicio: string;
  dataFim?: string;
  responsavelId?: string;
}

export interface EditarProjetoPayload
  extends Partial<CriarProjetoPayload> {}