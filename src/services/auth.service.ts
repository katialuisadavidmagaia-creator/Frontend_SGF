import { api } from './api';
import {
  LoginPayload,
  RecuperarPasswordPayload,
  RedefinirPasswordPayload,
  Utilizador,
} from '../types/auth.types';

export interface LoginResponse {
  token: string;
  utilizador: Utilizador;
}

// Extrai { token, utilizador } aceitando 'funcionario' ou 'utilizador' e navegando por wrappers se existirem
function extrairResultadoLogin(payload: unknown): LoginResponse | null {
  if (!payload || typeof payload !== 'object') return null;

  const obj = payload as Record<string, unknown>;

  // Extrai o objeto do utilizador vindo como 'funcionario' ou 'utilizador'
  const util = (obj.funcionario || obj.utilizador) as Utilizador | undefined;

  if (typeof obj.token === 'string' && util) {
    return { token: obj.token, utilizador: util };
  }

  // Se a resposta vier envolvida em 'dados' ou 'data'
  if (obj.dados) {
    return extrairResultadoLogin(obj.dados);
  }
  if (obj.data) {
    return extrairResultadoLogin(obj.data);
  }

  return null;
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post('/login', payload);

    // eslint-disable-next-line no-console
    console.log('[authService.login] resposta bruta do backend:', data);

    const resultado = extrairResultadoLogin(data);

    if (!resultado) {
      console.error(
        '[authService.login] Não foi possível encontrar token/utilizador na resposta. Formato recebido:',
        JSON.stringify(data)
      );
      throw new Error(
        'Resposta de login inválida: token ou utilizador em falta.'
      );
    }

    localStorage.setItem('token', resultado.token);
    localStorage.setItem('utilizador', JSON.stringify(resultado.utilizador));

    return resultado;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');
    window.location.href = '/login';
  },

  async recuperarPassword(
    payload: RecuperarPasswordPayload
  ): Promise<{ mensagem: string }> {
    const { data } = await api.post('/recuperar-password', payload);
    return data;
  },

  async redefinirPassword(
    payload: RedefinirPasswordPayload
  ): Promise<{ mensagem: string }> {
    const { data } = await api.post('/redefinir-password', payload);
    return data;
  },

  async validarTokenRecuperacao(
    token: string
  ): Promise<{ valido: boolean }> {
    const { data } = await api.get(`/validar-token/${token}`);
    return data;
  },

  getUtilizadorAtual(): Utilizador | null {
    const raw = localStorage.getItem('utilizador');

    if (!raw || raw === 'undefined' || raw === 'null') {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as Utilizador;
      // Proteção extra: nunca devolver um objeto sem role válido.
      if (!parsed || !parsed.role) {
        localStorage.removeItem('utilizador');
        return null;
      }
      return parsed;
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