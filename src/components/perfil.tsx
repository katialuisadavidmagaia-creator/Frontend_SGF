
import { useEffect, useState } from 'react';
import { usePermissoes } from '../hooks/usePermissoes'; 

const API_URL = 'http://localhost:4003/api'; 

type StatusProjeto = 'EM_ANDAMENTO' | 'CONCLUIDO';

interface Relatorio {
  id: number;
  titulo: string;
  descricao?: string;
  nomeArquivo: string;
  criadoEm: string;
}

interface Atribuicao {
  id: number;
  status: StatusProjeto;
  atribuidoEm: string;
  projeto: {
    id: number;
    nome: string;
    descricao?: string;
    dataInicio: string;
    dataFim?: string;
  };
}

function RoleBadge({ role }: { role: string }) {
  const cores: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700 border-red-300',
    RH: 'bg-blue-100 text-blue-700 border-blue-300',
    FUNCIONARIO: 'bg-green-100 text-green-700 border-green-300',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${
        cores[role] ?? 'bg-gray-100 text-gray-700 border-gray-300'
      }`}
    >
      {role}
    </span>
  );
}

export default function Perfil() {
  const { role } = usePermissoes();

  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [emAndamento, setEmAndamento] = useState<Atribuicao[]>([]);
  const [concluidos, setConcluidos] = useState<Atribuicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Formulário de upload
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const token = localStorage.getItem('token');

  async function carregarDados() {
    try {
      setCarregando(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [resRelatorios, resProjetos] = await Promise.all([
        fetch(`${API_URL}/relatorios/meus`, { headers }),
        fetch(`${API_URL}/projetos/meus`, { headers }),
      ]);

      if (!resRelatorios.ok || !resProjetos.ok) {
        throw new Error('Falha ao carregar dados do perfil.');
      }

      const dadosRelatorios = await resRelatorios.json();
      const dadosProjetos = await resProjetos.json();

      setRelatorios(dadosRelatorios.relatorios ?? []);
      setEmAndamento(dadosProjetos.emAndamento ?? []);
      setConcluidos(dadosProjetos.concluidos ?? []);
    } catch (e) {
      setErro('Não foi possível carregar os dados do perfil.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo || !titulo) {
      setErro('Título e ficheiro são obrigatórios.');
      return;
    }

    try {
      setEnviando(true);
      setErro('');

      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('descricao', descricao);
      formData.append('arquivo', arquivo);

      const res = await fetch(`${API_URL}/relatorios`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // não definir Content-Type manualmente com FormData
        body: formData,
      });

      if (!res.ok) {
        const dados = await res.json();
        throw new Error(dados.mensagem ?? 'Erro ao anexar relatório.');
      }

      setTitulo('');
      setDescricao('');
      setArquivo(null);
      await carregarDados();
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao anexar relatório.');
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <p className="p-4">A carregar perfil...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Cabeçalho com role */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold">O meu perfil</h1>
        {role && <RoleBadge role={role} />}
      </div>

      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      {/* Upload de relatórios */}
      <section>
        <h2 className="text-lg font-medium mb-3">Anexar relatório</h2>
        <form onSubmit={handleUpload} className="space-y-3 border rounded-lg p-4">
          <input
            type="text"
            placeholder="Título do relatório"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
            className="w-full"
          />
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {enviando ? 'A enviar...' : 'Anexar'}
          </button>
        </form>

        <ul className="mt-4 space-y-2">
          {relatorios.map((r) => (
            <li key={r.id} className="flex justify-between items-center border rounded px-3 py-2">
              <div>
                <p className="font-medium">{r.titulo}</p>
                <p className="text-sm text-gray-500">
                  {new Date(r.criadoEm).toLocaleDateString('pt-PT')} — {r.nomeArquivo}
                </p>
              </div>
              <a
                href={`${API_URL}/relatorios/${r.id}/download`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm underline"
              >
                Descarregar
              </a>
            </li>
          ))}
          {relatorios.length === 0 && (
            <p className="text-sm text-gray-500">Ainda não anexaste nenhum relatório.</p>
          )}
        </ul>
      </section>

      {/* Projetos em andamento */}
      <section>
        <h2 className="text-lg font-medium mb-3">Projetos em andamento</h2>
        <ul className="space-y-2">
          {emAndamento.map((a) => (
            <li key={a.id} className="border rounded px-3 py-2">
              <p className="font-medium">{a.projeto.nome}</p>
              {a.projeto.descricao && <p className="text-sm text-gray-500">{a.projeto.descricao}</p>}
            </li>
          ))}
          {emAndamento.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum projeto em andamento.</p>
          )}
        </ul>
      </section>

      {/* Projetos concluídos */}
      <section>
        <h2 className="text-lg font-medium mb-3">Projetos concluídos</h2>
        <ul className="space-y-2">
          {concluidos.map((a) => (
            <li key={a.id} className="border rounded px-3 py-2 opacity-75">
              <p className="font-medium">{a.projeto.nome}</p>
              {a.projeto.descricao && <p className="text-sm text-gray-500">{a.projeto.descricao}</p>}
            </li>
          ))}
          {concluidos.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum projeto concluído ainda.</p>
          )}
        </ul>
      </section>
    </div>
  );
}


const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fb',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
  },
  divider: {
    border: '0',
    borderTop: '1px solid #eee',
    marginBottom: '20px',
  },
  infoGroup: {
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
    fontSize: '14px',
    display: 'block',
    marginBottom: '5px',
  },
  value: {
    margin: 0,
    fontSize: '16px',
    color: '#111',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#0070f3',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  }
};