import { api } from './api';
import {CriarDepartamentoPayload,Departamento,EditarDepartamentoPayload,} from '../types/departamento.types';

export const departamentoService = {
  async listarDepartamentos(): Promise<Departamento[]> {
  const response = await api.get('/departamentos');
  
  console.log('--- DIAGNÓSTICO DA API ---');
  console.log('Status HTTP:', response.status);
  console.log('Dados recebidos:', response.data);
  console.log('É Array?:', Array.isArray(response.data));
  
  return Array.isArray(response.data) ? response.data : response.data?.data || [];
},
  // async listarDepartamentos(): Promise<Departamento[]> {
  //   const response = await api.get('/departamentos');
  //   const resData = response.data;

  //   if (Array.isArray(resData)) {
  //     return resData;
  //   }

  //   if (resData && Array.isArray(resData.data)) {
  //     return resData.data;
  //   }

  //   if (resData && Array.isArray(resData.departamentos)) {
  //     return resData.departamentos;
  //   }

  //   // Retorna array vazio caso venha nulo ou formato inesperado
  //   return [];
  // },


  async criarDepartamento(payload: CriarDepartamentoPayload): Promise<Departamento> {
    const { data } = await api.post<Departamento>('/departamentos', payload);
    return data;
  },

  async editarDepartamento(
    id: string,
    payload: EditarDepartamentoPayload
  ): Promise<Departamento> {
    const { data } = await api.put<Departamento>(`/departamentos/${id}`, payload);
    return data;
  },

  async eliminarDepartamento(id: string): Promise<void> {
    await api.delete(`/departamentos/${id}`);
  },
};

export const listarDepartamentos = departamentoService.listarDepartamentos;
export const eliminarDepartamento = departamentoService.eliminarDepartamento;

export default departamentoService;