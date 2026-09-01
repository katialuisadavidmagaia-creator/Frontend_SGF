import ProjetosPanorama from '../../pages/dashboard/projetosPanorama'; 
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Estatisticas() {
  const {t}=useTranslation();
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-widest text-[#4F6EF7] uppercase mb-1">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold font-sora text-[#0E1A2B] flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-[#4F6EF7]" />
          Estatísticas
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do estado dos projetos e da equipa.
        </p>
      </div>

      <ProjetosPanorama /> 
    </div> 
  );
}