import { UsersRound } from 'lucide-react';
import { PaginaPlaceholder } from '../placeholder/PaginaPlaceholder';
import { useTranslation } from 'react-i18next';

export default function Membros() {
  const {t}=useTranslation();
  return (
    <PaginaPlaceholder
      titulo="Membros"
      Icon={UsersRound}
      descricao="Organização de equipas e grupos de trabalho. Em breve."
    />
  );
}