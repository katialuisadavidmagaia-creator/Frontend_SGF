import { CalendarDays } from 'lucide-react';
import { PaginaPlaceholder } from '../placeholder/PaginaPlaceholder';
import { useTranslation } from 'react-i18next';

export default function Calendario() {
  const {t}=useTranslation();
  return (
    <PaginaPlaceholder
      titulo="Calendário"
      Icon={CalendarDays}
      descricao="Vista de calendário com prazos de projetos e eventos da equipa. Em breve."
    />
  );
}