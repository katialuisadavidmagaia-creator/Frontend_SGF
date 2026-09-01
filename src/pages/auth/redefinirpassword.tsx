import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from 'react-i18next';

export default function RedefinirPassword() {
  const{t}=useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [novaPassword, setNovaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      return;
    }
    authService
      .validarTokenRecuperacao(token)
      .then((res) => setTokenValido(res.valido))
      .catch(() => setTokenValido(false));
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (novaPassword !== confirmarPassword) {
      toast.erro('As passwords não coincidem');
      return;
    }
    if (novaPassword.length < 8) {
      toast.erro('A password deve ter pelo menos 8 caracteres');
      return;
    }

    setCarregando(true);
    try {
      await authService.redefinirPassword({ token, novaPassword });
      toast.sucesso('Password redefinida com sucesso');
      navigate('/login');
    } catch (err: any) {
      toast.erro(err?.response?.data?.mensagem || 'Erro ao redefinir password');
    } finally {
      setCarregando(false);
    }
  }

  if (tokenValido === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">A validar link...</p>
      </div>
    );
  }

  if (tokenValido === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-red-600">Link inválido ou expirado</h1>
          <p className="text-sm text-gray-600">
            Solicite um novo link de recuperação de password.
          </p>
          <Link to="/recuperar-password" className="text-blue-600 hover:underline text-sm">
            Pedir novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Redefinir Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nova Password</label>
            <input
              type="password"
              value={novaPassword}
              onChange={(e) => setNovaPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Password</label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repita a password"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {carregando ? 'A guardar...' : 'Redefinir Password'}
          </button>
        </form>
      </div>
    </div>
  );
}