import { Link } from 'react-router-dom';
import { ArrowRight, Users, FolderKanban, Building2, FileText, ShieldCheck, FileDown, Gauge } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const NOS = [
  { id: 'pessoas', label: 'Pessoas', icon: Users, angle: -135 },
  { id: 'projetos', label: 'Projetos', icon: FolderKanban, angle: -45 },
  { id: 'departamentos', label: 'Departamentos', icon: Building2, angle: 135 },
  { id: 'relatorios', label: 'Relatórios', icon: FileText, angle: 45 },
];

function Vertice() {
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAtivo((v) => (v + 1) % NOS.length), 1800);
    return () => clearInterval(id);
  }, []);

  const raio = 150;

  return (
    <div className="relative w-[340px] h-[340px] mx-auto">
      <svg viewBox="0 0 340 340" className="absolute inset-0 w-full h-full">
        {NOS.map((no, i) => {
          const rad = (no.angle * Math.PI) / 180;
          const x = 170 + raio * Math.cos(rad);
          const y = 170 + raio * Math.sin(rad);
          const emFoco = ativo === i;
          return (
            <line
              key={no.id}
              x1={170}
              y1={170}
              x2={x}
              y2={y}
              stroke={emFoco ? '#8FA4FF' : 'rgba(255,255,255,0.12)'}
              strokeWidth={emFoco ? 2 : 1}
              className="transition-all duration-700"
            />
          );
        })}
        <circle cx={170} cy={170} r={5} fill="#4F6EF7" />
        <circle cx={170} cy={170} r={12} fill="none" stroke="#4F6EF7" strokeWidth={1} opacity={0.4}>
          <animate attributeName="r" values="12;28;12" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>

      {NOS.map((no, i) => {
        const rad = (no.angle * Math.PI) / 180;
        const x = 170 + raio * Math.cos(rad);
        const y = 170 + raio * Math.sin(rad);
        const Icon = no.icon;
        const emFoco = ativo === i;
        return (
          <div
            key={no.id}
            className={`absolute flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
              emFoco ? 'scale-110' : 'scale-100 opacity-60'
            }`}
            style={{ left: x, top: y }}
          >
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-colors duration-700 ${
                emFoco ? 'bg-[#4F6EF7] border-[#4F6EF7]' : 'bg-white/5 border-white/10'
              }`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-white/70 font-mono tracking-wide">{no.label}</span>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-14">
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#8FA4FF]">VERTICE</span>
      </div>
    </div>
  );
}

const FUNCIONALIDADES = [
  {
    icon: ShieldCheck,
    titulo: 'Acesso por perfil',
    descricao: 'ADMIN, RH e Funcionário veem só o que lhes compete. Sem exceções, sem configuração manual.',
  },
  {
    icon: FileDown,
    titulo: 'Relatórios em PDF',
    descricao: 'Cada projeto concluído gera um relatório exportável, pronto para arquivar ou partilhar.',
  },
  {
    icon: Gauge,
    titulo: 'Estado em tempo real',
    descricao: 'Projetos em andamento, aprovações pendentes e estatísticas da equipa, sempre atualizados.',
  },
];

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      <div className="absolute -inset-6 bg-[#4F6EF7]/10 blur-3xl rounded-3xl" />

      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F1B33] animate-[fadeIn_0.6s_ease-out]">
        <div className="flex h-[280px]">
          {/* Sidebar em miniatura */}
          <div className="w-16 bg-[#0A1224] border-r border-white/10 flex flex-col items-center py-4 gap-4">
            <div className="w-6 h-6 rounded-md bg-[#4F6EF7]" />
            <div className="w-full h-px bg-white/10 my-1" />
            <div className="w-8 h-8 rounded-lg bg-[#4F6EF7]/30 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-sm bg-[#8FA4FF]" />
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/20" />
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/20" />
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/20" />
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="h-2.5 w-24 rounded-full bg-white/20" />
              <div className="w-6 h-6 rounded-full bg-[#4F6EF7]" />
            </div>

            {/* Cards de estatística */}
            <div className="grid grid-cols-3 gap-2 p-3">
              {[
                { valor: '128', cor: 'bg-[#4F6EF7]' },
                { valor: '34', cor: 'bg-[#6D5DF6]' },
                { valor: '9', cor: 'bg-[#8FA4FF]' },
              ].map((c, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${c.cor} mb-2`} />
                  <p className="text-white text-sm font-bold font-sora leading-none mb-1">{c.valor}</p>
                  <div className="h-1.5 w-10 rounded-full bg-white/15" />
                </div>
              ))}
            </div>

            {/* Novo Gráfico (Substituiu a mini tabela aqui) */}
            <div className="flex-1 mx-3 mb-3 bg-white/5 rounded-lg p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-16 rounded-full bg-white/20" />
                <div className="h-1.5 w-8 rounded-full bg-[#4F6EF7]" />
              </div>
              
              <div className="relative h-16 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F6EF7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4F6EF7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 30 Q 25 10, 50 22 T 100 5 L 100 40 L 0 40 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 0 30 Q 25 10, 50 22 T 100 5"
                    fill="none"
                    stroke="#4F6EF7"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 justify-center">
        <span className="text-[10px] font-mono tracking-[0.2em] text-[#8FA4FF]">PAINEL DE GESTÃO</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A1224] text-white overflow-x-hidden">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4F6EF7] flex items-center justify-center font-bold text-xs font-sora">
            V
          </div>
          <span className="font-bold tracking-wide text-sm font-sora">VERTICE</span>
        </div>
        <Link
          to="/login"
          className="text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Entrar
        </Link>
      </nav>

      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-12 md:pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-mono tracking-wider text-[#8FA4FF] border border-[#8FA4FF]/30 rounded-full px-3 py-1 mb-6">
            Gestão Inteligente de Equipas 
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold font-sora leading-[1.05] mb-6">
            Cada equipa,<br />um só lugar.
          </h1>
          <p className="text-white/60 text-base md:text-lg mb-8 max-w-md">
            Pessoas, projetos, departamentos e relatórios, todos a convergir num único sistema. Sem folhas de cálculo espalhadas, sem processos duplicados.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="flex items-center gap-2 bg-[#4F6EF7] hover:bg-[#3d5ce0] text-white font-semibold rounded-lg px-5 py-3 text-sm transition-colors"
            >
              Aceder ao sistema
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/registo"
              className="flex items-center gap-2 border border-white/20 hover:bg-white/5 text-white font-semibold rounded-lg px-5 py-3 text-sm transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>

        <DashboardPreview />
      </section>

      <section className="border-t border-white/10 bg-[#0F1B33]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-3 gap-8">
          {FUNCIONALIDADES.map(({ icon: Icon, titulo, descricao }) => (
            <div key={titulo}>
              <div className="h-10 w-10 rounded-lg bg-[#4F6EF7]/15 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-[#8FA4FF]" />
              </div>
              <h3 className="font-sora font-bold text-lg mb-2">{titulo}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 text-center">
        <h2 className="text-2xl md:text-4xl font-sora font-extrabold mb-4">
          Pronto para organizar a tua equipa?
        </h2>
        <p className="text-white/55 mb-8 max-w-md mx-auto">
          Cria a tua conta e começa a gerir funcionários, projetos e relatórios num só sítio.
        </p>
        <Link
          to="/registo"
          className="inline-flex items-center gap-2 bg-[#4F6EF7] hover:bg-[#3d5ce0] text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors"
        >
          Começar agora
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © 2026 — VERTICE. Gestão inteligente, resultados reais.
      </footer>
    </div>
  );
}