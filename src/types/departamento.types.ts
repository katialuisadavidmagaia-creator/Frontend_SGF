export interface Departamento {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  responsavelId?: number;
  responsavelNome?: string | null;
  totalFuncionarios?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CriarDepartamentoPayload {
  nome: string;
  codigo: string;
  descricao?: string;
  responsavelId?: number;
  ativo?: boolean;
}

export interface EditarDepartamentoPayload
  extends Partial<CriarDepartamentoPayload> {}