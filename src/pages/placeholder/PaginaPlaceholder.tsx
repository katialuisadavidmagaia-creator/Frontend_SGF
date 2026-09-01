import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaginaPlaceholderProps {
  titulo: string;
  descricao: string;
  Icon: LucideIcon;
}

export function PaginaPlaceholder({ titulo, descricao, Icon }: PaginaPlaceholderProps) {
  const {t}=useTranslation();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold font-sora text-[#0E1A2B] flex items-center gap-2 mb-6">
        <Icon className="h-6 w-6 text-[#4F6EF7]" />
        {titulo}
      </h1>

      <div className="border border-dashed border-border rounded-2xl bg-white p-12 flex flex-col items-center text-center gap-3">
        <div className="h-14 w-14 rounded-2xl bg-[#4F6EF7]/10 flex items-center justify-center">
          <Icon className="h-7 w-7 text-[#4F6EF7]" />
        </div>
        <p className="font-semibold font-sora text-[#0E1A2B]">Em construção</p>
        <p className="text-sm text-muted-foreground max-w-sm">{descricao}</p>
      </div>
    </div>
  );
}