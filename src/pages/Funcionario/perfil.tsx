import { useEffect, useState } from 'react';
import { usePermissoes } from '../../hooks/usePermissoes';
import { Building2, Mail, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://localhost:4003/api';

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
  departamento?: {
    id: number;
    nome: string;
  };
}

function RoleBadge({ role }: { role: string }) {
  const cores: Record<string, string> = {
    ADMIN: 'bg-red-50 text-red-700 border-red-200',
    RH: 'bg-blue-50 text-blue-700 border-blue-200',
    FUNCIONARIO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
        cores[role] ?? 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {role}
    </span>
  );
}

export default function Perfil() {
  const {t}=useTranslation();
  const { role } = usePermissoes();

  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro('');

        const res = await fetch(`${API_URL}/funcionarios/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Falha ao carregar dados do perfil.');

        const dados = await res.json();
        setFuncionario(dados);
      } catch (e) {
        console.error('Erro ao carregar perfil:', e);
        setErro('Não foi possível carregar os dados do perfil.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [token]);

  if (carregando) {
    return <p className="p-6 text-sm text-muted-foreground">A carregar perfil...</p>;
  }

  const iniciais = funcionario?.nome
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') ?? '?';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold font-[Sora] text-[#0E1A2B] mb-6">
        O meu perfil
      </h1>

      {erro && (
        <p className="text-red-600 text-sm mb-4">{erro}</p>
      )}

      {funcionario && (
        <div className="border border-border rounded-2xl bg-white shadow-sm overflow-hidden">
          {/* Faixa superior com destaque de marca */}
          <div className="h-16 bg-gradient-to-r from-[#0E1A2B] to-[#243B5C]" />

          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-8">
              <div className="h-16 w-16 rounded-2xl bg-[#4F6EF7] text-white flex items-center justify-center text-xl font-bold font-[Sora] border-4 border-white shadow-sm shrink-0">
                {iniciais}
              </div>

              <div className="pb-1">
                {role && <RoleBadge role={role} />}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h2 className="text-xl font-semibold font-[Sora] text-[#0E1A2B]">
                {funcionario.nome}
              </h2>

              {funcionario.cargo && (
                <p className="text-sm text-muted-foreground -mt-2">
                  {funcionario.cargo}
                </p>
              )}

              <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 text-[#4F6EF7] shrink-0" />
                  <span className="text-foreground">{funcionario.email}</span>
                </div>

                <div className="flex items-center gap-2.5 text-sm">
                  <Building2 className="h-4 w-4 text-[#4F6EF7] shrink-0" />
                  <span className="text-foreground">
                    {funcionario.departamento?.nome ?? 'Departamento não definido'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-sm">
                  <UserIcon className="h-4 w-4 text-[#4F6EF7] shrink-0" />
                  <span className="text-foreground">ID: {funcionario.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}