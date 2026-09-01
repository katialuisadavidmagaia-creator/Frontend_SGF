import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://localhost:4003/api';

const CORES_STATUS: Record<string, string> = {
  EM_ANDAMENTO: '#4F6EF7',
  CONCLUIDO: '#22C55E',
};

const NOME_STATUS: Record<string, string> = {
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
};

interface StatusDistribuicao {
  status: 'EM_ANDAMENTO' | 'CONCLUIDO';
  total: number;
}

interface ProgressoEquipa {
  funcionarioId: number;
  nome: string;
  emAndamento: number;
  concluidos: number;
}

interface ResumoProjetos {
  statusDistribuicao?: StatusDistribuicao[];
  progressoEquipa?: ProgressoEquipa[];
}

export default function ProjetosPanorama() {
  const { t } = useTranslation();
  const [resumo, setResumo] = useState<ResumoProjetos | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        setErro('');

        const res = await fetch(`${API_URL}/projetos/resumo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Falha ao carregar panorama de projetos.');

        const dados = await res.json();
        setResumo(dados);
      } catch (e) {
        setErro('Não foi possível carregar o panorama dos projetos.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [token]);

  if (carregando) {
    return (
      <section className="border border-border rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">A carregar panorama de projetos...</p>
      </section>
    );
  }

  if (erro || !resumo) {
    return (
      <section className="border border-border rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm text-red-600">{erro || 'Sem dados disponíveis.'}</p>
      </section>
    );
  }

  // Tratamento defensivo contra propriedades undefined
  const statusDistribuicao = resumo.statusDistribuicao ?? [];
  const progressoEquipa = resumo.progressoEquipa ?? [];

  const totalProjetos = statusDistribuicao.reduce((acc, s) => acc + s.total, 0);
  const totalConcluidos = statusDistribuicao.find((s) => s.status === 'CONCLUIDO')?.total ?? 0;
  const percentConcluido = totalProjetos > 0 ? Math.round((totalConcluidos / totalProjetos) * 100) : 0;

  return (
    <section className="border border-border rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="h-5 w-5 text-[#4F6EF7]" />
        <h2 className="text-lg font-semibold font-sora text-[#0E1A2B]">
          Panorama dos projetos
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* -------- Estado dos projetos (pizza) -------- */}
        <div className="border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Estado dos projetos
          </p>

          {totalProjetos === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Sem projetos registados.
            </p>
          ) : (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribuicao}
                      dataKey="total"
                      nameKey="status"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {statusDistribuicao.map((entrada) => (
                        <Cell
                          key={entrada.status}
                          fill={CORES_STATUS[entrada.status] ?? '#94A3B8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(valor, nome) => [
                        valor,
                        NOME_STATUS[nome as keyof typeof NOME_STATUS] ?? nome,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                {statusDistribuicao.map((s) => (
                  <div key={s.status} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CORES_STATUS[s.status] ?? '#94A3B8' }}
                    />
                    <span className="text-muted-foreground">
                      {NOME_STATUS[s.status] ?? s.status}
                    </span>
                    <span className="ml-auto font-semibold text-[#0E1A2B]">{s.total}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* -------- Progresso geral (barra) -------- */}
        <div className="border border-border rounded-xl p-4 flex flex-col">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Progresso geral
          </p>

          <div className="flex-1 flex flex-col justify-center gap-3">
            <p className="text-3xl font-bold font-sora text-[#0E1A2B]">
              {percentConcluido}%
            </p>

            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4F6EF7] to-[#22C55E] transition-all"
                style={{ width: `${percentConcluido}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {totalConcluidos} de {totalProjetos} projetos concluídos
            </p>
          </div>
        </div>

        {/* -------- Progresso por equipa (barras) -------- */}
        <div className="border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Progresso da equipa
          </p>

          {progressoEquipa.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Sem atribuições registadas.
            </p>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressoEquipa}>
                  <XAxis
                    dataKey="nome"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend
                    formatter={(valor) =>
                      valor === 'concluidos' ? 'Concluídos' : 'Em andamento'
                    }
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Bar dataKey="concluidos" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="emAndamento"
                    stackId="a"
                    fill="#4F6EF7"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}