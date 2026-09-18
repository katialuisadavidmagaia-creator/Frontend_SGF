export interface Funcionario {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  departamento?: string;
  ativo?: boolean;
  criadoEm?: string;
}

export interface CreateFuncionarioPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birth?: string;
}

export interface UpdateFuncionarioPayload {
  name?: string;
  email?: string;
  phone?: string;
  birth?: string;
  role?: string;
  password?: string;
}