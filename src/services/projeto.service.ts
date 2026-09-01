import { api } from './api';
import { CriarProjetoPayload, EditarProjetoPayload, Projeto } from '../types/projeto.types';
import { useTranslation } from 'react-i18next';

export const projetosService = {
  async listar(): Promise<Projeto[]> {
    const{t}=useTranslation();
    const { data } = await api.get<Projeto[]>('/projetos');
    return data;
  },

  async listarPorDepartamento(departamentoId: string): Promise<Projeto[]> {
    const { data } = await api.get<Projeto[]>('/projetos', {
      params: { departamentoId },
    });
    return data;
  },

  async obterPorId(id: string): Promise<Projeto> {
    const { data } = await api.get<Projeto>(`/projetos/${id}`);
    return data;
  },

  async criar(payload: CriarProjetoPayload): Promise<Projeto> {
    const { data } = await api.post<Projeto>('/projetos', payload);
    return data;
  },

  async editar(id: string, payload: EditarProjetoPayload): Promise<Projeto> {
    const { data } = await api.put<Projeto>(`/projetos/${id}`, payload);
    return data;
  },

  async eliminar(id: string): Promise<void> {
    await api.delete(`/projetos/${id}`);
  },
  
  async atribuirFuncionario(projetoId: number, funcionarioId: number) {
  
  }
};
