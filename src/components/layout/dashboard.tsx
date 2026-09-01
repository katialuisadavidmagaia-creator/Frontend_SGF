import { useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '../layout/statCard';

const API = 'http://localhost:4003/api';

interface DashboardLayoutProps {
  children: ReactNode;
  titulo?: string;
}

interface ResumoDashboard {
  totalFuncionarios: number;
  totalDepartamentos: number;
  projetosAtivos: number;
  relatoriosGerados: number;
}

// Layout Interno do Dashboard
export function DashboardLayout({ children, titulo }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {titulo && (
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{titulo}</h1>
        </header>
      )}
      <main>{children}</main>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [resumo, setResumo] = useState<ResumoDashboard>({
    totalFuncionarios: 0,
    totalDepartamentos: 6,
    projetosAtivos: 12,
    relatoriosGerados: 27,
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Procura a contagem real de funcionários a partir do teu backend
    fetch(`${API}/funcionarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar dados.');
        return res.json();
      })
      .then((json) => {
        const dataArray = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        
        setResumo((prev) => ({
          ...prev,
          totalFuncionarios: dataArray.length,
        }));
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro no Dashboard:', err);
        setCarregando(false);
      });
  }, []);

  return (
    <DashboardLayout titulo="Dashboard">
      {/* Cartões de Estatística */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Funcionários"
          valor={carregando ? '—' : resumo.totalFuncionarios}
          variacao={{ texto: 'Total registado', positiva: true }}
          rodape="Ativos na plataforma"
        />
        <StatCard
          label="Departamentos"
          valor={carregando ? '—' : resumo.totalDepartamentos}
          rodape="Estrutura organizacional"
        />
        <StatCard
          label="Projetos Ativos"
          valor={carregando ? '—' : resumo.projetosAtivos}
          variacao={{ texto: '2 novos', positiva: true }}
          rodape="Em andamento neste momento"
        />
        <StatCard
          label="Relatórios"
          valor={carregando ? '—' : resumo.relatoriosGerados}
          rodape="Gerados este ano"
        />
      </div>

      {/* Secções Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">
              Funcionários por Departamento
            </h2>
          </div>
          <div className="h-64 flex items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg">
            Gráfico de distribuição por departamento
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Atividade Recente</h2>
          </div>
          <div className="space-y-4">
            {[
              { texto: 'Novo funcionário admitido', tempo: 'há 2 horas' },
              { texto: 'Relatório de desempenho gerado', tempo: 'há 5 horas' },
              { texto: 'Projeto "Migração ERP" concluído', tempo: 'ontem' },
              { texto: 'Departamento de TI atualizado', tempo: 'há 2 dias' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">{item.texto}</p>
                  <p className="text-xs text-slate-400">{item.tempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}