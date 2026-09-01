import { useTranslation } from "react-i18next";

const {t}=useTranslation();
export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
  responsavelId?: string;
  responsavelNome?: string;
  totalFuncionarios?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CriarDepartamentoPayload {
  nome: string;
  descricao?: string;
  responsavelId?: string;
}

export interface EditarDepartamentoPayload extends Partial<CriarDepartamentoPayload> {}