import { useEffect, useMemo, useState } from 'react';
import { relatoriosService } from '../../services/relatorio.service';
import { Relatorio } from '../../types/relatorio.types';
import { useToast } from '../../hooks/useToast';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Search,
} from 'lucide-react';

interface AxiosErrorLike {
  response?: { data?: { mensagem?: string } };
}

type Aba = 'pendentes' | 'historico';

const CORES_ESTADO: Record<string, string> = {
  PENDENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  APROVADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJEITADO: 'bg-red-50 text-red-700 border-red-200',
};

const LABEL_ESTADO: Record<string, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

export default function Aprovacoes() {
  const [aba, setAba] = useState<Aba>('pendentes');
  const [pendentes, setPendentes] = useState<Relatorio[]>([]);
  const [historico, setHistorico] = useState<Relatorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const { toast } = useToast();

  async function carregar() {
    setCarregando(true);
    try {
      const [dadosPendentes, dadosTodos] = await Promise.all([
        relatoriosService.listarPendentes(),
        relatoriosService.listar(),
      ]);

      setPendentes(dadosPendentes);
      setHistorico(
        dadosTodos.filter((r) => r.status === 'APROVADO' || r.status === 'REJEITADO')
      );
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(error?.response?.data?.mensagem || 'Erro ao carregar relatórios');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDecisao(id: number, decisao: 'aprovar' | 'rejeitar') {
    setProcessandoId(id);
    try {
      if (decisao === 'aprovar') {
        await relatoriosService.aprovar(id);
        toast.sucesso('Relatório aprovado');
      } else {
        await relatoriosService.rejeitar(id);
        toast.sucesso('Relatório rejeitado');
      }
      await carregar();
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(error?.response?.data?.mensagem || 'Erro ao atualizar o relatório');
    } finally {
      setProcessandoId(null);
    }
  }

  const totalAprovados = useMemo(
    () => historico.filter((r) => r.status === 'APROVADO').length,
    [historico]
  );
  const totalRejeitados = useMemo(
    () => historico.filter((r) => r.status === 'REJEITADO').length,
    [historico]
  );

  const listaAtual = aba === 'pendentes' ? pendentes : historico;
  const listaFiltrada = useMemo(() => {
    if (!busca.trim()) return listaAtual;
    const termo = busca.toLowerCase();
    return listaAtual.filter(
      (r) =>
        r.titulo.toLowerCase().includes(termo) ||
        (r.funcionario?.name ?? r.geradoPorNome ?? '').toLowerCase().includes(termo)
    );
  }, [listaAtual, busca]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* ================= CABEÇALHO ================= */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-[#4F6EF7] uppercase mb-1">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold font-sora text-[#0E1A2B] flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-[#4F6EF7]" />
          Aprovações
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Relatórios enviados pelos funcionários à espera de decisão.
        </p>
      </div>

      {/* ================= CARDS RESUMO ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardResumo
          icon={<Clock className="h-5 w-5" />}
          label="Pendentes"
          valor={pendentes.length}
          destaque
        />
        <CardResumo
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Aprovados"
          valor={totalAprovados}
        />
        <CardResumo
          icon={<XCircle className="h-5 w-5" />}
          label="Rejeitados"
          valor={totalRejeitados}
        />
      </div>

      {/* ================= TABS + PESQUISA ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setAba('pendentes')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              aba === 'pendentes'
                ? 'bg-white text-[#0E1A2B] shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pendentes ({pendentes.length})
          </button>
          <button
            onClick={() => setAba('historico')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              aba === 'historico'
                ? 'bg-white text-[#0E1A2B] shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Histórico ({historico.length})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por título ou funcionário..."
            className="pl-9 pr-3 py-2 rounded-lg border border-input bg-white text-sm w-full sm:w-148 focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]"
          />
        </div>
      </div>

      {/* ================= LISTA ================= */}
      <section className="border border-border rounded-2xl bg-white p-4 shadow-sm">
        {carregando && (
          <p className="text-sm text-muted-foreground p-4">A carregar...</p>
        )}

        <ul className="space-y-2">
          {listaFiltrada.map((r) => (
            <li
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-border rounded-xl px-4 py-3.5 hover:border-[#4F6EF7]/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#4F6EF7]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-[#4F6EF7]" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-[#0E1A2B]">{r.titulo}</p>
                    {r.status && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          CORES_ESTADO[r.status] ?? ''
                        }`}
                      >
                        {LABEL_ESTADO[r.status] ?? r.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.funcionario?.name ?? r.geradoPorNome ?? 'Funcionário'}
                    {r.funcionario?.email && (
                      <span className="text-muted-foreground/70"> · {r.funcionario.email}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {new Date(r.criadoEm || Date.now()).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0">
                {r.caminhoArquivo && (
                  <a
                    href={relatoriosService.obterUrlPreviewPdf(r.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#4F6EF7] text-xs font-medium hover:underline"
                  >
                    Ver ficheiro
                  </a>
                )}

                {r.status === 'PENDENTE' && (
                  <>
                    <button
                      onClick={() => handleDecisao(r.id, 'aprovar')}
                      disabled={processandoId === r.id}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Aprovar
                    </button>

                    <button
                      onClick={() => handleDecisao(r.id, 'rejeitar')}
                      disabled={processandoId === r.id}
                      className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Rejeitar
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}

          {!carregando && listaFiltrada.length === 0 && (
            <p className="text-sm text-muted-foreground p-6 text-center">
              {aba === 'pendentes'
                ? 'Não há relatórios à espera de aprovação.'
                : 'Ainda não há relatórios decididos.'}
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}

function CardResumo({
  icon,
  label,
  valor,
  destaque = false,
}: {
  icon: React.ReactNode;
  label: string;
  valor: number;
  destaque?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 ${
        destaque
          ? 'bg-[#0E1A2B] border-[#0E1A2B] text-white'
          : 'bg-white border-border text-[#0E1A2B]'
      }`}
    >
      <div
        className={`absolute -right-3 -top-3 h-12 w-12 rotate-45 ${
          destaque ? 'bg-[#4F6EF7]/30' : 'bg-[#4F6EF7]/10'
        }`}
      />
      <div className="relative flex items-center gap-2 mb-2">
        <span className={destaque ? 'text-[#8FA4FF]' : 'text-[#4F6EF7]'}>{icon}</span>
        <span
          className={`text-xs font-medium uppercase tracking-wide ${
            destaque ? 'text-white/70' : 'text-muted-foreground'
          }`}
        >
          {label}
        </span>
      </div>
      <p className="relative text-2xl font-bold font-sora">{valor}</p>
    </div>
  );
}