import { ListTodo } from 'lucide-react';
import { PaginaPlaceholder } from '../placeholder/PaginaPlaceholder';
import { useTranslation } from 'react-i18next';

export default function Tasks() {
  const {t}=useTranslation();
  return (
    <PaginaPlaceholder
      titulo="Tasks"
      Icon={ListTodo}
      descricao="Gestão de tarefas individuais e de equipa. Em breve."
    />
  );
}