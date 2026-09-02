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
            <span className="text-xs font-medium text-white/70 font-jakarta tracking-wide">{no.label}</span>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-14">
        <span className="text-[10px] font-jakarta tracking-[0.2em] text-[#8FA4FF]">VERTICE</span>
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

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A1224] text-white overflow-x-hidden">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4F6EF7] flex items-center justify-center font-bold text-xs font-jakarta">
            V
          </div>
          <span className="font-bold tracking-wide text-sm font-jakarta">VERTICE</span>
        </div>
        <Link
          to="/login"
          className="text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Entrar
        </Link>
      </nav>
      <section className="relative w-full min-h-[600px] flex items-center overflow-hidden py-16 md:py-24">
  {/* 1. Imagem de Fundo (Preenche toda a secção) */}
  <img
    src="https://duledigital.com.br/uploads/blog/landing-page-o-que-e-como-funciona-e-por-que-sua-empresa-precisa-de-uma_20260815.png"
    alt="Painel de gestão do sistema"
    className="absolute inset-0 w-full h-full object-cover object-center z-0"
  />

  {/* 2. Overlay Escuro / Gradiente (Garante que o texto fique legível sobre a imagem) */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10" />

  {/* 3. Conteúdo sobreposto */}
  <div className="relative z-20 max-w-6xl mx-auto px-6 md:px-10 w-full">
    <div className="max-w-xl">
      <span className="inline-block font-jakarta font-medium text-sm text-white/80 mb-5">
        Gestão inteligente de equipas
      </span>
      
      <h1 className="text-4xl md:text-6xl font-extrabold font-jakarta text-white leading-[1.05] mb-6">
        Cada equipa,<br />um só lugar.
      </h1>

      <p className="font-jakarta text-white/80 text-base md:text-lg mb-8">
        Pessoas, projetos, departamentos e relatórios, todos a convergir num único sistema. Sem folhas de cálculo espalhadas, sem processos duplicados.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/login"
          className="flex items-center gap-2 bg-[#4F6EF7] hover:bg-[#3d5ce0] text-white font-jakarta font-semibold rounded-lg px-5 py-3 text-sm transition-colors shadow-lg"
        >
          Aceder ao sistema
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/registo"
          className="flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-jakarta font-semibold rounded-lg px-5 py-3 text-sm transition-colors backdrop-blur-sm"
        >
          Criar conta
        </Link>
      </div>
    </div>
  </div>
</section>
      <section className="border-t border-white/10 bg-[#0F1B33]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-3 gap-8">
          {FUNCIONALIDADES.map(({ icon: Icon, titulo, descricao }) => (
            <div key={titulo}>
              <div className="h-10 w-10 rounded-lg bg-[#4F6EF7]/15 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-[#8FA4FF]" />
              </div>
              <h3 className="font-jakarta font-bold text-lg mb-2">{titulo}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 text-center">
        <h2 className="text-2xl md:text-4xl font-jakarta font-extrabold mb-4">
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