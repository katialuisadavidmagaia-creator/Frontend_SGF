import { api } from './api';
import {LoginPayload,RecuperarPasswordPayload,RedefinirPasswordPayload,Utilizador,} from '../types/auth.types';


export interface LoginResponse {
  sucesso: boolean;
  token: string;
  funcionario: Utilizador;
  utilizador?: Utilizador; 
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    
    const { data } = await api.post<LoginResponse>('/login', payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('utilizador', JSON.stringify(data.funcionario));
    return { ...data, utilizador: data.funcionario };
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');
    window.location.href = '/login';
  },

  async recuperarPassword(payload: RecuperarPasswordPayload): Promise<{ mensagem: string }> {
    const { data } = await api.post('/recuperar-password', payload);
    return data;
  },

  async redefinirPassword(payload: RedefinirPasswordPayload): Promise<{ mensagem: string }> {
    const { data } = await api.post('/redefinir-password', payload);
    return data;
  },

  async validarTokenRecuperacao(token: string): Promise<{ valido: boolean }> {
    const { data } = await api.get(`/validar-token/${token}`);
    return data;
  },

  getUtilizadorAtual(): Utilizador | null {
    const raw = localStorage.getItem('utilizador');
    if (!raw || raw === 'undefined' || raw === 'null') return null;

    try {
      return JSON.parse(raw) as Utilizador;
    } catch {
      localStorage.removeItem('utilizador');
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  },
};