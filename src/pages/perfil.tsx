import { useEffect, useState } from 'react';
import axios from 'axios';

interface Projeto {
  id: string;
  nome: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
  relatorio?: { id: string } | null;
}

interface Perfil {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  projetosConcluidos: Projeto[];
  projetosEmAndamento: Projeto[];
}

export function PerfilPage({ funcionarioId }: { funcionarioId: string }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {

    axios.get<Perfil>(`http://localhost:4003/perfil/${funcionarioId}`)
      .then(res => setPerfil(res.data))
      .finally(() => setCarregando(false));
  }, [funcionarioId]);

  async function baixarPDF(projetoId: string, nomeProjeto: string) {
   
    const res = await axios.get(`http://localhost:4003/relatorios/${projetoId}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-${nomeProjeto}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  if (carregando) return <p>A carregar perfil...</p>;
  if (!perfil) return <p>Funcionário não encontrado.</p>;

  return (
    <div className="perfil-container">
      <header>
        <h1>{perfil.nome}</h1>
        <p>{perfil.cargo} — {perfil.departamento}</p>
        <p>{perfil.email}</p>
      </header>

      <section>
        <h2>Projetos em Andamento</h2>
        {perfil.projetosEmAndamento.length === 0 && <p>Nenhum projeto em andamento.</p>}
        <ul>
          {perfil.projetosEmAndamento.map(p => (
            <li key={p.id}>
              <strong>{p.nome}</strong> — início: {new Date(p.dataInicio).toLocaleDateString('pt-PT')}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Histórico de Projetos Concluídos</h2>
        {perfil.projetosConcluidos.length === 0 && <p>Nenhum projeto concluído ainda.</p>}
        <ul>
          {perfil.projetosConcluidos.map(p => (
            <li key={p.id}>
              <strong>{p.nome}</strong> — concluído em: {p.dataFim && new Date(p.dataFim).toLocaleDateString('pt-PT')}
              {p.relatorio && (
                <button onClick={() => baixarPDF(p.id, p.nome)}>
                  Baixar Relatório (PDF)
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}