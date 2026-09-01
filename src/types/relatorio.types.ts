import { useTranslation } from "react-i18next";

const {t}=useTranslation();

export type TipoRelatorio = 'FUNCIONARIOS' | 'DEPARTAMENTOS' | 'PROJETOS' | 'DESEMPENHO';
export type FormatoExportacao = 'PDF' | 'WORD';

export type StatusRelatorio = 'PENDENTE' | 'APROVADO' | 'REJEITADO'; 
export interface Relatorio {
  id: number;
  titulo: string;
  tipo: TipoRelatorio;
  caminhoArquivo?: string;
  criadoEm?: string | Date;
  geradoPorId: number;
  geradoPorNome?: string;
  parametros?: Record<string, unknown>;
  createdAt: string;
  status?: StatusRelatorio;
  funcionario?: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface GerarRelatorioPayload {
  titulo: string;
  tipo: TipoRelatorio;
  departamentoId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface ExportarRelatorioPayload {
  relatorioId: string;
  formato: FormatoExportacao;
}

