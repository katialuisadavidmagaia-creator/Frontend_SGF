import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { usePermissoes } from '../hooks/usePermissoes';
import {
  Mail,
  Building2,
  Phone,
  Calendar,
  ShieldCheck,
  MapPin,
  Briefcase,
  Languages,
  AlertCircle,
  Home,
  CreditCard,
  UserCheck,
  UserX,
} from 'lucide-react';

interface ContactoEmergencia {
  nome: string;
  parentesco: string;
  telefone: string;
}

interface PerfilCompleto {
  id: number;
  name: string;
  email: string;
  cargo?: string;
  departamento?: { id: number; nome: string };
  gestorDireto?: string;
  localizacao?: string; // Ex: Lisboa - Edifício A (Híbrido)
  idiomas?: string[];
  
  // Apenas RH / Admin
  telefonePessoal?: string;
  dataNascimento?: string;
  dataAdmissao?: string;
  tipoContrato?: string; // Ex: Sem Termo / Tempo Inteiro
  morada?: string;
  contactoEmergencia?: ContactoEmergencia;
  iban?: string;
  nif?: string;
}

interface AxiosErrorLike {
  response?: { data?: { mensagem?: string } };
}

const LABEL_ROLE: Record<string, string> = {
  ADMIN: 'Administrador',
  RH: 'Recursos Humanos',
  FUNCIONARIO: 'Funcionário',
};

function CartaoInfo({
  icon,
  label,
  valor,
}: {
  icon: React.ReactNode;
  label: string;
  valor: string | React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="p-2.5 rounded-lg bg-white shadow-sm text-[#4F6EF7] border border-slate-100 mt-0.5 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        {typeof valor === 'string' ? (
          <p className="text-sm font-semibold text-[#0E1A2B] truncate">{valor}</p>
        ) : (
          valor
        )}
      </div>
    </div>
  );
}

export default function Perfil() {
  const { role } = usePermissoes();

  const [perfil, setPerfil] = useState<PerfilCompleto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Verifica se o utilizador atual é Admin ou RH
  const podeVerDadosGeraisEGestao = role === 'ADMIN' || role === 'RH';

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro('');

        const res = await api.get<{ sucesso: boolean; data: PerfilCompleto }>('/perfil');
        setPerfil(res.data.data);
      } catch (err: unknown) {
        const error = err as AxiosErrorLike;
        setErro(
          error?.response?.data?.mensagem || 'Não foi possível carregar os dados do perfil.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="w-5 h-5 border-2 border-[#4F6EF7] border-t-transparent rounded-full animate-spin" />
          A carregar perfil...
        </div>
      </div>
    );
  }

  const iniciais = perfil?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') ?? '?';

  const formatarData = (dataStr?: string) =>
    dataStr
      ? new Date(dataStr).toLocaleDateString('pt-PT', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Não informada';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Título da página */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#4F6EF7] uppercase mb-1">
            Portal do Colaborador
          </p>
          <h1 className="text-2xl font-bold font-sora text-[#0E1A2B]">O meu perfil</h1>
        </div>

        {/* Indicador de Nível de Acesso */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            podeVerDadosGeraisEGestao
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}
        >
          {podeVerDadosGeraisEGestao ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
          Acesso: {podeVerDadosGeraisEGestao ? 'Completo (RH/Admin)' : 'Público (Funcionário)'}
        </span>
      </div>

      {erro && (
        <div className="border border-red-200 bg-red-50/80 text-red-700 text-sm rounded-xl p-4">
          {erro}
        </div>
      )}

      {perfil && (
        <div className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-28 bg-gradient-to-r from-[#0E1A2B] via-[#1E293B] to-[#4F6EF7] relative" />

          {/* Dados do Utilizador */}
          <div className="px-6 pb-6 relative">
            {/* Avatar + Badge de Role */}
            <div className="-mt-12 mb-4 flex items-end justify-between">
              <div className="h-24 w-24 rounded-2xl bg-white p-1.5 shadow-md">
                <div className="h-full w-full rounded-xl bg-[#0E1A2B] text-white flex items-center justify-center text-2xl font-bold font-sora">
                  {iniciais}
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F6EF7]" />
                {role ? LABEL_ROLE[role] ?? role : 'Utilizador'}
              </span>
            </div>

            {/* Nome, Cargo e Email */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-sora text-[#0E1A2B]">
                {perfil.name}
              </h2>
              <p className="text-sm font-medium text-[#4F6EF7]">
                {perfil.cargo || 'Colaborador'}
              </p>
            </div>

            {/* SECÇÃO 1: VISÃO GERAL DE TRABALHO (Acessível a TODOS os Funcionários) */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Informação Profissional & Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CartaoInfo
                  icon={<Mail className="h-4 w-4" />}
                  label="Email Corporativo"
                  valor={perfil.email}
                />

                <CartaoInfo
                  icon={<Building2 className="h-4 w-4" />}
                  label="Departamento"
                  valor={perfil.departamento?.nome ?? 'Não atribuído'}
                />

                <CartaoInfo
                  icon={<Briefcase className="h-4 w-4" />}
                  label="Gestor Direto"
                  valor={perfil.gestorDireto ?? 'Não informado'}
                />

                <CartaoInfo
                  icon={<MapPin className="h-4 w-4" />}
                  label="Localização / Regime"
                  valor={perfil.localizacao ?? 'Sede - Presencial'}
                />

                <CartaoInfo
                  icon={<Languages className="h-4 w-4" />}
                  label="Idiomas"
                  valor={perfil.idiomas?.join(', ') ?? 'Português'}
                />
              </div>
            </div>

            {/* SECÇÃO 2: DADOS PRIVADOS E DE GESTÃO (Visíveis Apenas para RH e ADMIN) */}
            {podeVerDadosGeraisEGestao && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    Dados Restritos (RH & Administração)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <CartaoInfo
                    icon={<Phone className="h-4 w-4" />}
                    label="Telefone Pessoal"
                    valor={perfil.telefonePessoal ?? 'Não registado'}
                  />

                  <CartaoInfo
                    icon={<Calendar className="h-4 w-4" />}
                    label="Data de Nascimento"
                    valor={formatarData(perfil.dataNascimento)}
                  />

                  <CartaoInfo
                    icon={<Calendar className="h-4 w-4" />}
                    label="Data de Admissão"
                    valor={formatarData(perfil.dataAdmissao)}
                  />

                  <CartaoInfo
                    icon={<Briefcase className="h-4 w-4" />}
                    label="Tipo de Contrato"
                    valor={perfil.tipoContrato ?? 'Sem Termo (Efetivo)'}
                  />

                  <CartaoInfo
                    icon={<Home className="h-4 w-4" />}
                    label="Morada Residencial"
                    valor={perfil.morada ?? 'Não registada'}
                  />

                  <CartaoInfo
                    icon={<AlertCircle className="h-4 w-4" />}
                    label="Contacto de Emergência"
                    valor={
                      perfil.contactoEmergencia ? (
                        <p className="text-sm font-semibold text-[#0E1A2B]">
                          {perfil.contactoEmergencia.nome} ({perfil.contactoEmergencia.parentesco}) -{' '}
                          <span className="text-[#4F6EF7]">{perfil.contactoEmergencia.telefone}</span>
                        </p>
                      ) : (
                        'Não registado'
                      )
                    }
                  />

                  <CartaoInfo
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Dados Fiscais & Bancários"
                    valor={
                      <p className="text-sm font-semibold text-[#0E1A2B]">
                        NIF: {perfil.nif ?? '---'} | IBAN: {perfil.iban ?? '---'}
                      </p>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}