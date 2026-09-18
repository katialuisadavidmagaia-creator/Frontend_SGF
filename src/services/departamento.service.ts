import { api } from './api';
import {
  Departamento,
  CriarDepartamentoPayload,
  EditarDepartamentoPayload,
} from '../types/departamento.types';

export const departamentoService = {
  async listarDepartamentos(): Promise<Departamento[]> {
    const { data } = await api.get('/departamentos');

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.dados)) {
      return data.dados;
    }

    return [];
  },

  async obterDepartamentoPorId(
    id: string | number
  ): Promise<Departamento> {
    const { data } = await api.get<Departamento>(
      `/departamentos/${id}`
    );

    return data;
  },

  async criarDepartamento(
    payload: CriarDepartamentoPayload
  ): Promise<Departamento> {
    const { data } = await api.post<Departamento>(
      '/departamentos',
      payload
    );

    return data;
  },

  async editarDepartamento(
    id: string | number,
    payload: EditarDepartamentoPayload
  ): Promise<Departamento> {
    const { data } = await api.put<Departamento>(
      `/departamentos/${id}`,
      payload
    );

    return data;
  },

  async desativarDepartamento(id: string | number): Promise<void> {
    await api.patch(`/departamentos/${id}/desativar`);
  },

  // Alias para compatibilidade com chamadas existentes (ex: Departamentos.tsx).
  // O backend não elimina de facto — faz soft delete (ativo: false).
  async eliminarDepartamento(id: string | number): Promise<void> {
    await this.desativarDepartamento(id);
  },
};