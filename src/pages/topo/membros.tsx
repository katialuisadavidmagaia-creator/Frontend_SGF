import { useEffect, useState } from 'react';
import { Mail, Search, UserRound, UsersRound, Plus, Edit2, Trash2, Shield, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

interface Membro {
  id: number;
  name?: string;
  nome?: string;
  email?: string;
  role?: string;
  cargo?: string;
}

export default function Membros() {
  const { t } = useTranslation();

  const [membros, setMembros] = useState<Membro[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [senha, setSenha] = useState('12345678'); // Senha padrão caso o backend exija
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarMembros();
  }, []);

  const carregarMembros = async () => {
    try {
      const resposta = await api.get('/funcionarios');
      const dados = resposta.data;

      if (Array.isArray(dados)) {
        setMembros(dados);
      } else if (Array.isArray(dados?.data)) {
        setMembros(dados.data);
      } else if (Array.isArray(dados?.dados)) {
        setMembros(dados.dados);
      }
    } catch (erro) {
      console.error('Erro ao carregar membros:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarMembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome || !novoEmail) return;

    setSalvando(true);
    try {
      // Envia os dados completos que o esquema do backend costuma validar (Prisma / Express)
      await api.post('/funcionarios', {
        name: novoNome,
        nome: novoNome,
        email: novoEmail,
        password: senha,
        senha: senha,
        role: 'COLABORADOR',
        cargo: 'Colaborador',
      });

      await carregarMembros();
      setNovoNome('');
      setNovoEmail('');
      setModalAberto(false);
    } catch (erro: any) {
      console.error('Erro detalhado do backend:', erro.response?.data || erro);
      const mensagem =
        erro.response?.data?.message ||
        erro.response?.data?.error ||
        (Array.isArray(erro.response?.data?.errors) ? erro.response.data.errors.join(', ') : null) ||
        'Erro ao adicionar membro (400 Bad Request). Verifique os campos.';
      alert(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const filtrados = membros.filter((membro) => {
    const termo = pesquisa.toLowerCase();
    const nome = (membro.name || membro.nome || '').toLowerCase();
    const email = (membro.email || '').toLowerCase();
    return nome.includes(termo) || email.includes(termo);
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <UsersRound className="h-7 w-7 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-800">
              {t('members.title', 'Membros')}
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {t('members.description', 'Visualize os membros e colaboradores da organização.')}
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Membro</span>
        </button>
      </div>

      {/* Tabela de Membros */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            {t('members.team', 'Equipa')}
          </h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {membros.length} {t('members.members', 'membros')}
          </span>
        </div>

        <div className="relative mb-5 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder={t('members.search', 'Pesquisar membro...')}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        {carregando ? (
          <div className="py-12 text-center text-sm text-slate-500">
            {t('common.loading', 'A carregar...')}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            {t('members.empty', 'Nenhum membro encontrado.')}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Membro</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Função / Cargo</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtrados.map((membro) => (
                  <tr key={membro.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                          <UserRound className="h-4 w-4" />
                        </div>
                        {membro.name || membro.nome}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {membro.email ? (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{membro.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <Shield className="h-3 w-3 text-blue-500" />
                        Colaborador
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Editar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          title="Remover"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Adicionar Novo Membro</h3>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdicionarMembro} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="Ex: joao@gmail.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Senha Temporária
                </label>
                <input
                  type="text"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {salvando ? 'A guardar...' : 'Guardar Membro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}