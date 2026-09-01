import { Settings as SettingsIcon } from 'lucide-react';
import { PaginaPlaceholder } from '../placeholder/PaginaPlaceholder';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const {t}=useTranslation();
  return (
    <PaginaPlaceholder
      titulo="Settings"
      Icon={SettingsIcon}
      descricao="Preferências da conta e configurações da aplicação. Em breve."
    />
  );
}