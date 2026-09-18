import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = 'http://localhost:4003/api';

interface DepartamentoOption {
  id: number;
  nome: string;
}

export default function EditarFuncionario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isNovo = !id;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [departamentoId, setDepartamentoId] = useState('');
  const [departamentos, setDepartamentos] = useState<DepartamentoOption[]>([]);
  const [msg, setMsg] = useState<{ texto: string; tipo: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [carregandoFuncionario, setCarregandoFuncionario] = useState(!isNovo);

  const token = localStorage.getItem('token');

  // Carrega a lista de departamentos disponíveis (usado só no modo edição)
  useEffect(() => {
    if (isNovo) return;

    fetch(`${API}/departamentos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(json => {
        const lista = Array.isArray(json) ? json : (json.data ?? json.dados ?? []);
        setDepartamentos(lista);
      })
      .catch((err) => {
        console.error('Erro ao carregar departamentos:', err);
      });
  }, [isNovo, token]);

  useEffect(() => {
    if (isNovo) {
      setCarregandoFuncionario(false);
      return;
    }

    fetch(`${API}/funcionarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Não foi possível encontrar o funcionário.');
        return r.json();
      })
      .then(json => {
        const f = json.data || json;
        setNome(f.nome || f.name || '');
        setEmail(f.email || '');
        setTelefone(f.telefone || f.phone || '');
        // CORREÇÃO: garante string no estado do <select>, mesmo vindo número da API
        setDepartamentoId(
          f.departamentoId != null
            ? String(f.departamentoId)
            : f.departamento?.id != null
            ? String(f.departamento.id)
            : ''
        );
        setCarregandoFuncionario(false);
      })
      .catch((err) => {
        setMsg({ texto: err.message, tipo: 'error' });
        setCarregandoFuncionario(false);
      });
  }, [id, token, isNovo]);

  const handleSalvar = async () => {
    setLoading(true);
    setMsg(null);

    if (isNovo && !password.trim()) {
      setMsg({ texto: 'A palavra-passe é obrigatória para criar um funcionário.', tipo: 'error' });
      setLoading(false);
      return;
    }

    const url = isNovo ? `${API}/funcionarios` : `${API}/funcionarios/${id}`;
    const method = isNovo ? 'POST' : 'PUT';

    // CORREÇÃO: o payload aceita number para departamentoId
    // (Departamento.id é Int no schema do Prisma)
    const payload: Record<string, string | number> = { name: nome, email, telefone };
    if (isNovo) {
      payload.password = password;
    } else if (departamentoId) {
      payload.departamentoId = Number(departamentoId);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      console.log('Status HTTP:', res.status);
      console.log('Resposta do Servidor:', data);

      if (!res.ok) {
        setMsg({
          texto: data.mensagem || data.message || data.error || data.erro || `Erro HTTP ${res.status}`,
          tipo: 'error'
        });
      } else {
        setMsg({
          texto: isNovo ? 'Funcionário criado com sucesso!' : 'Funcionário atualizado!',
          tipo: 'success'
        });
        setTimeout(() => navigate('/dashboard/funcionarios'), 1500);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setMsg({ texto: 'Erro de conexão com o servidor.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (carregandoFuncionario) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium text-sm animate-pulse">
          A carregar dados do funcionário...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
        
        {/* Cabeçalho */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {isNovo ? 'Cadastrar Novo Funcionário' : `Editar dados do Funcionário #${id}`}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isNovo ? 'Preencha os dados do novo funcionário' : 'Atualize as informações do funcionário'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={(e) => { e.preventDefault(); handleSalvar(); }} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite o nome completo"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="exemplo@empresa.com"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Telefone
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              placeholder="+258 84 000 0000"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition duration-150"
            />
          </div>

          {isNovo && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Palavra-passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition duration-150"
              />
            </div>
          )}

          {!isNovo && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Departamento
              </label>
              <select
                value={departamentoId}
                onChange={e => setDepartamentoId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition duration-150"
              >
                <option value="">Sem departamento</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
              </select>
            </div>
          )}

          {/* Mensagens de Alerta */}
          {msg && (
            <div
              className={`p-3.5 rounded-lg text-sm font-medium border ${
                msg.tipo === 'error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}
            >
              {msg.texto}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/funcionarios')}
              className="w-1/3 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150"
            >
              Voltar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-sm"
            >
              {loading ? 'A guardar...' : isNovo ? 'Criar Funcionário' : 'Guardar alterações'}
            </button>
          </div>

          {/* Nota Informativa */}
          {isNovo && (
            <p className="text-xs text-gray-400 text-center pt-2">
              O departamento pode ser atribuído na página de edição após a criação.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}