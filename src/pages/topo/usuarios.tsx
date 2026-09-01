import { UserCog } from 'lucide-react';
import { PaginaPlaceholder } from '../placeholder/PaginaPlaceholder';
import { useTranslation } from 'react-i18next';

export default function Usuarios() {
  const {t}=useTranslation();
  return (
    <PaginaPlaceholder
      titulo="Usuários"
      Icon={UserCog}
      descricao="Gestão de contas de login e permissões de acesso ao sistema. Em breve."
    />
  );
}