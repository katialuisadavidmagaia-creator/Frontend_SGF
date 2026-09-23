import { useTranslation } from "react-i18next";

const {t}=useTranslation();

export type Role = 'ADMIN' | 'RH' | 'FUNCIONARIO';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface Utilizador {
  id: number;
  nome: string;
  email: string;
  role: string ;
  [key: string]: any;
}
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  utilizador: Utilizador;
}

export interface RecuperarPasswordPayload {
  email: string;
}

export interface RedefinirPasswordPayload {
  token: string;
  novaPassword: string;
}