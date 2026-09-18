import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/authcontext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aCarregar, setACarregar] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setACarregar(true);

    try {
      await login({
  email,
  senha: password,
});
      navigate('/dashboard');
    } catch (err: any) {
      const mensagem =
        err?.response?.data?.mensagem ||
        err?.response?.data?.message ||
        'Credenciais inválidas. Tenta novamente.';
      setErro(mensagem);
    } finally {
      setACarregar(false);
    }
  }

  

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="relative flex-1 bg-[#0A1224] text-white flex flex-col justify-between px-10 py-10 overflow-hidden min-h-[280px] md:min-h-screen">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-[#4F6EF7]/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 bg-[#6D5DF6]/10 rounded-full blur-3xl" />

        <Link to="/" className="flex items-center gap-3 relative z-10 w-fit">
          <div className="w-9 h-9 rounded-lg bg-[#4F6EF7] flex items-center justify-center font-bold text-sm font-sora">
            V
          </div>
          <span className="font-bold tracking-wide text-sm font-sora">VERTICE</span>
        </Link>

        <div className="relative z-10 max-w-md hidden md:block">
          <h1 className="text-4xl md:text-5xl font-extrabold font-sora leading-tight mb-4">
            Cada equipa,<br />um só lugar.
          </h1>
          <p className="text-white/60 text-sm">
            Conectando pessoas, projetos e resultados.
          </p>
        </div>

        <div className="relative z-10 hidden md:grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
          <div className="bg-white/5 rounded-xl px-4 py-3">
            <p className="text-[#8FA4FF] font-bold text-lg font-sora">100%</p>
            <p className="text-white/50 text-xs font-mono">CENTRALIZADO</p>
          </div>
          <div className="bg-white/5 rounded-xl px-4 py-3">
            <p className="text-[#8FA4FF] font-bold text-lg font-sora">RBAC</p>
            <p className="text-white/50 text-xs font-mono">CONTROLO DE ACESSO</p>
          </div>
          <div className="bg-white/5 rounded-xl px-4 py-3">
            <p className="text-[#8FA4FF] font-bold text-lg font-sora">PDF</p>
            <p className="text-white/50 text-xs font-mono">EXPORTAÇÃO</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#E9ECF2] flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold font-sora text-[#0A1224]">
              Acesso ao Sistema
            </h2>
            <div className="w-10 h-1 bg-[#4F6EF7] rounded-full mx-auto mt-2 mb-3" />
            <p className="text-sm text-gray-500">
              Insira as suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold text-gray-500 tracking-wide font-mono">
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teu@email.com"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6EF7] bg-[#F5F7FB]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-xs font-semibold text-gray-500 tracking-wide font-mono">
                PALAVRA-PASSE
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F6EF7] bg-[#F5F7FB]"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end -mt-1">
              <Link to="/recuperar-password" className="text-xs font-medium text-[#4F6EF7] hover:underline">
                Esqueceu a palavra-passe?
              </Link>
            </div>

            {erro && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={aCarregar}
              className="flex items-center justify-center gap-2 bg-[#4F6EF7] text-white font-semibold rounded-lg py-2.5 text-sm mt-1 disabled:opacity-60 hover:bg-[#3d5ce0] transition-colors"
            >
              {aCarregar ? 'A entrar...' : 'Entrar no Sistema'}
              {!aCarregar && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-mono">OU</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Link
              to="/registo"
              className="flex items-center justify-center gap-2 border border-gray-300 text-[#0A1224] font-semibold rounded-lg py-2.5 text-sm hover:bg-gray-50 transition-colors"
            >
              Criar conta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </form>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          © 2026 — VERTICE. Gestão inteligente, resultados reais.
        </p>
      </div>
    </div>
  );
}