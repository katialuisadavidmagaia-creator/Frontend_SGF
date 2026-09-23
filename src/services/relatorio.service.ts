import { api } from './api'; 
import type { Relatorio, GerarRelatorioPayload } from '../types/relatorio.types';

export const relatoriosService = {
  async listar(): Promise<Relatorio[]> {
    const response = await api.get<Relatorio[]>('/relatorios');
    return response.data;
  },

  async obterPorId(id: string | number): Promise<Relatorio> {
    const response = await api.get<Relatorio>(`/relatorios/${id}`);
    return response.data;
  },

  async gerar(payload: GerarRelatorioPayload): Promise<Relatorio> {
    const response = await api.post<Relatorio>('/relatorios/gerar', payload);
    return response.data;
  },

  async criar(formData: FormData): Promise<Relatorio> {
    const response = await api.post<Relatorio>('/relatorios', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async eliminar(id: string | number): Promise<void> {
    await api.delete(`/relatorios/${id}`);
  },

  async exportarPdf(id: string | number, nomeFicheiro?: string): Promise<void> {
    const response = await api.get(`/relatorios/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeFicheiro || `relatorio-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async exportarWord(id: string | number, nomeFicheiro?: string): Promise<void> {
    const response = await api.get(`/relatorios/${id}/word`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeFicheiro || `relatorio-${id}.docx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async listarMeus(): Promise<Relatorio[]> {
    const response = await api.get<Relatorio[]>('/relatorios/meus');
    return response.data;
  },

  async listarPendentes(): Promise<Relatorio[]> {
    const response = await api.get<Relatorio[]>('/relatorios/pendentes');
    return response.data;
  },

  async aprovar(id: number): Promise<Relatorio> {
    const response = await api.patch<Relatorio>(`/relatorios/${id}/aprovar`);
    return response.data;
  },

  async rejeitar(id: number): Promise<Relatorio> {
    const response = await api.patch<Relatorio>(`/relatorios/${id}/rejeitar`);
    return response.data;
  },

  obterUrlPreviewPdf(id: number): string {
    return `${api.defaults.baseURL}/relatorios/${id}/pdf/preview`;
  },
};