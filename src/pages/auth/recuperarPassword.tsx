import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from 'react-i18next';

export default function RecuperarPassword() {
  const {t}= useTranslation();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      await authService.recuperarPassword({ email });
      setEnviado(true);
      toast.sucesso('Email de recuperação enviado');
    } catch (err: any) {
      toast.erro(err?.response?.data?.mensagem || 'Erro ao enviar email de recuperação');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">Recuperar Password</h1>

        {enviado ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Se o email existir na nossa base de dados, receberá um link para redefinir a
              password.
            </p>
            <Link to="/login" className="text-blue-600 hover:underline text-sm">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Indique o seu email para receber um link de recuperação.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="nome@empresa.com"
                />
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {carregando ? 'A enviar...' : 'Enviar link de recuperação'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-blue-600 hover:underline">
                  Voltar ao login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}