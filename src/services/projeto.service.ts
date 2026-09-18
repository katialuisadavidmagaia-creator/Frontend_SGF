import { api } from './api';

import type {
  Projeto,
  CriarProjetoPayload,
} from '../types/projeto.types';

interface RespostaApi<T> {
  sucesso?: boolean;
  dados?: T;
  mensagem?: string;
}

function extrairDados<T>(resposta: T | RespostaApi<T>): T {
  if (
    resposta &&
    typeof resposta === 'object' &&
    'dados' in resposta
  ) {
    const respostaApi = resposta as RespostaApi<T>;

    if (respostaApi.dados !== undefined) {
      return respostaApi.dados;
    }
  }

  return resposta as T;
}

export const projetosService = {
  async listar(): Promise<Projeto[]> {
    const { data } =
      await api.get<Projeto[] | RespostaApi<Projeto[]>>(
        '/projetos'
      );

    return extrairDados(data);
  },

  async obterPorId(
    id: number | string
  ): Promise<Projeto> {
    const { data } =
      await api.get<Projeto | RespostaApi<Projeto>>(
        `/projetos/${id}`
      );

    return extrairDados(data);
  },

  async criar(
    payload: CriarProjetoPayload
  ): Promise<Projeto> {
    const { data } =
      await api.post<Projeto | RespostaApi<Projeto>>(
        '/projetos',
        payload
      );

    return extrairDados(data);
  },

  async editar(
    id: number | string,
    payload: CriarProjetoPayload
  ): Promise<Projeto> {
    const { data } =
      await api.put<Projeto | RespostaApi<Projeto>>(
        `/projetos/${id}`,
        payload
      );

    return extrairDados(data);
  },

  async eliminar(
    id: number | string
  ): Promise<void> {
    await api.delete(`/projetos/${id}`);
  },

  async atribuirFuncionario(
    projetoId: number | string,
    funcionarioId: number
  ) {
    const { data } =
      await api.post(
        `/projetos/${projetoId}/funcionarios`,
        {
          funcionarioId,
        }
      );

    return extrairDados(data);
  },

  async atualizarStatusFuncionario(
    projetoId: number | string,
    funcionarioId: number,
    status: string
  ) {
    const { data } =
      await api.patch(
        `/projetos/${projetoId}/funcionarios/${funcionarioId}`,
        {
          status,
        }
      );

    return extrairDados(data);
  },
};