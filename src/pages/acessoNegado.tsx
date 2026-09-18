import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { usePermissoes } from '../hooks/usePermissoes';

export default function AcessoNegado() {
  const navigate = useNavigate();
  const { role } = usePermissoes();

  // Manda cada role de volta para a sua área principal
  const destinoPadrao = role === 'FUNCIONARIO' ? '/dashboard/perfil' : '/dashboard/estatisticas';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-sm text-center flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-xl font-bold font-sora text-[#0E1A2B]">Acesso negado</h1>

        <p className="text-sm text-muted-foreground">
          O teu perfil ({role ?? 'desconhecido'}) não tem permissão para aceder a esta página.
        </p>

        <button
          onClick={() => navigate(destinoPadrao)}
          className="mt-2 bg-[#4F6EF7] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Voltar à minha área
        </button>
      </div>
    </div>
  );
}