import { useTranslation } from "react-i18next";

const {t}=useTranslation();

export type Role = 'ADMIN' | 'RH' | 'FUNCIONARIO';

export interface Utilizador {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
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