
import { useEffect, useMemo, useState } from 'react';
import {
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCog,
  UserRound,
  X,
  ShieldCheck,
  Users,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

interface Usuario {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface FormUsuario {
  name: string;
  email: string;
  password: string;
  role: string;
}

const FORM_INICIAL: FormUsuario = {
  name: '',
  email: '',
  password: '',
  role: 'FUNCIONARIO',
};

export default function Usuarios() {
  const { t } = useTranslation();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [pesquisa, setPesquisa] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const [form, setForm] = useState<FormUsuario>(FORM_INICIAL);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);

      const resposta = await api.get('/funcionarios');
      const dados = resposta.data;

      if (Array.isArray(dados)) {
        setUsuarios(dados);
      } else if (Array.isArray(dados?.data)) {
        setUsuarios(dados.data);
      } else if (Array.isArray(dados?.dados)) {
        setUsuarios(dados.dados);
      } else if (Array.isArray(dados?.funcionarios)) {
        setUsuarios(dados.funcionarios);
      } else {
        setUsuarios([]);
      }
    } catch (erro) {
      console.error('Erro ao carregar usuários:', erro);
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalCriar = () => {
    setUsuarioEditando(null);
    setForm(FORM_INICIAL);
    setModalAberto(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);

    setForm({
      name: usuario.name || '',
      email: usuario.email || '',
      password: '',
      role: usuario.role || 'FUNCIONARIO',
    });

    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando) return;

    setModalAberto(false);
    setUsuarioEditando(null);
    setForm(FORM_INICIAL);
  };

  const atualizarCampo = (
    campo: keyof FormUsuario,
    valor: string
  ) => {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const salvarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert(t('users.validation.name'));
      return;
    }

    if (!form.email.trim()) {
      alert(t('users.validation.email'));
      return;
    }

    if (!usuarioEditando && !form.password.trim()) {
      alert(t('users.validation.password'));
      return;
    }

    try {
      setSalvando(true);

      if (usuarioEditando) {
        const payload: Record<string, string> = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        };

        if (form.password.trim()) {
          payload.password = form.password;
        }

        await api.put(
          `/funcionarios/${usuarioEditando.id}`,
          payload
        );
      } else {
        await api.post('/funcionarios', {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });
      }

      await carregarUsuarios();
      fecharModal();
    } catch (erro: any) {
      console.error('Erro ao guardar usuário:', erro);

      const mensagem =
        erro?.response?.data?.mensagem ||
        erro?.response?.data?.message ||
        t('users.errors.save');

      alert(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const eliminarUsuario = async (usuario: Usuario) => {
    const confirmar = window.confirm(
      `${t('users.deleteConfirmation')} "${usuario.name}"?`
    );

    if (!confirmar) return;

    try {
      await api.delete(`/funcionarios/${usuario.id}`);

      setUsuarios((anterior) =>
        anterior.filter((item) => item.id !== usuario.id)
      );
    } catch (erro: any) {
      console.error('Erro ao eliminar usuário:', erro);

      const mensagem =
        erro?.response?.data?.mensagem ||
        erro?.response?.data?.message ||
        t('users.errors.delete');

      alert(mensagem);
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) return usuarios;

    return usuarios.filter((usuario) => {
      return (
        usuario.name?.toLowerCase().includes(termo) ||
        usuario.email?.toLowerCase().includes(termo) ||
        usuario.role?.toLowerCase().includes(termo)
      );
    });
  }, [usuarios, pesquisa]);

  const totalUsuarios = usuarios.length;

  const totalAdmins = usuarios.filter(
    (usuario) => usuario.role === 'ADMIN'
  ).length;

  const totalRH = usuarios.filter(
    (usuario) => usuario.role === 'RH'
  ).length;

  const totalFuncionarios = usuarios.filter(
    (usuario) => usuario.role === 'FUNCIONARIO'
  ).length;

  const nomeRole = (role?: string) => {
    const roles: Record<string, string> = {
      ADMIN: t('users.roles.admin'),
      RH: t('users.roles.hr'),
      FUNCIONARIO: t('users.roles.employee'),
    };

    return roles[role || ''] || role || t('users.employee');
  };

  const inicialNome = (nome: string) => {
    return nome?.trim()?.charAt(0)?.toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <UserCog className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {t('users.title')}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {t('users.description')}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={abrirModalCriar}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          {t('users.newUser')}
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {t('users.statistics.total')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {totalUsuarios}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {t('users.statistics.admins')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {totalAdmins}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {t('users.statistics.hr')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {totalRH}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <UserCog className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {t('users.statistics.employees')}
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                {totalFuncionarios}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                {t('users.listTitle')}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {usuariosFiltrados.length} {t('users.results')}
              </p>
            </div>

            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder={t('users.search')}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {carregando ? (
          <div className="flex min-h-56 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

              <p className="mt-3 text-sm text-slate-500">
                {t('common.loading')}
              </p>
            </div>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <UserRound className="h-6 w-6 text-slate-400" />
            </div>

            <p className="mt-4 font-medium text-slate-700">
              {t('users.empty')}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {pesquisa
                ? t('users.emptySearch')
                : t('users.emptyDescription')}
            </p>

            {!pesquisa && (
              <button
                type="button"
                onClick={abrirModalCriar}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                {t('users.newUser')}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t('users.user')}
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t('users.email')}
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t('users.role')}
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                            {inicialNome(usuario.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800">
                              {usuario.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID #{usuario.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4 shrink-0 text-slate-400" />

                          <span className="truncate">
                            {usuario.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            usuario.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700'
                              : usuario.role === 'RH'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {nomeRole(usuario.role)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(usuario)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                            title={t('common.edit')}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarUsuario(usuario)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            title={t('common.delete')}
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

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                      {inicialNome(usuario.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">
                        {usuario.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                          {usuario.email}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            usuario.role === 'ADMIN'
                              ? 'bg-purple-50 text-purple-700'
                              : usuario.role === 'RH'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {nomeRole(usuario.role)}
                        </span>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(usuario)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                            title={t('common.edit')}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarUsuario(usuario)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            title={t('common.delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {usuarioEditando
                    ? t('users.editUser')
                    : t('users.newUser')}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {usuarioEditando
                    ? t('users.editDescription')
                    : t('users.createDescription')}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={salvando}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={salvarUsuario}>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t('users.fields.name')}
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      atualizarCampo('name', e.target.value)
                    }
                    placeholder={t('users.fields.namePlaceholder')}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t('users.fields.email')}
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      atualizarCampo('email', e.target.value)
                    }
                    placeholder={t('users.fields.emailPlaceholder')}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t('users.fields.password')}
                  </label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      atualizarCampo('password', e.target.value)
                    }
                    placeholder={
                      usuarioEditando
                        ? t('users.fields.passwordOptional')
                        : t('users.fields.passwordPlaceholder')
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    required={!usuarioEditando}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {t('users.fields.role')}
                  </label>

                  <select
                    value={form.role}
                    onChange={(e) =>
                      atualizarCampo('role', e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="FUNCIONARIO">
                      {t('users.roles.employee')}
                    </option>

                    <option value="RH">
                      {t('users.roles.hr')}
                    </option>

                    <option value="ADMIN">
                      {t('users.roles.admin')}
                    </option>
                  </select>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {salvando && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  {salvando
                    ? t('common.loading')
                    : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


    
// ### O que esta versão resolve

// * **Novo usuário** abre um modal.
// * Permite cadastrar **nome, email, palavra-passe e função**.
// * Faz `POST /funcionarios`.
// * **Editar** abre o mesmo formulário preenchido.
// * Faz `PUT /funcionarios/:id`.
// * **Eliminar** pede confirmação e faz `DELETE /funcionarios/:id`.
// * Pesquisa por nome, email ou função.
// * Mostra estatísticas reais de usuários.
// * Tem uma tabela profissional no desktop.
// * No telemóvel transforma a tabela em **cards responsivos**.
// * Tem loading visual.
// * Tem estado vazio.
// * Usa exclusivamente **Tailwind**, sem CSS.
// * Continua usando **i18next**, portanto não quebra a internacionalização.

// **Atenção a um ponto importante:** estou a assumir que o teu backend aceita `POST /funcionarios`, `PUT /funcionarios/:id` e `DELETE /funcionarios/:id` com os campos `name`, `email`, `password` e `role`. O teu `GET /funcionarios` já está a funcionar, mas se ao clicar em **Guardar** aparecer `404`, `400` ou `422`, então o problema já não está nesta página: precisamos ajustar o controller/service do backend para o formato real da tua API.
