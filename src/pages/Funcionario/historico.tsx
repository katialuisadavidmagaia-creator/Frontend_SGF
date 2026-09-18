import { useEffect, useState } from 'react';
import styles from './components.module.css';

const API = 'http://localhost:4003/api';

interface Registo {
  id: number;
  email: string;
  acao: string;
  descricao: string;
  ip: string;
  sucesso: boolean;
  criado_em: string;
}

export default function Historico() {
  
  const [registos, setRegistos] = useState<Registo[]>([]);
  const [loading, setLoading]   = useState(true);
  const [erro, setErro]         = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/historico`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setRegistos(data); setLoading(false); })
      .catch(() => { setErro('Erro ao carregar histórico.'); setLoading(false); });
  }, []);

  if (loading) return <p className={styles.info}>A carregar...</p>;
  if (erro)    return <p className={styles.erro}>{erro}</p>;

  return (
    <div className={styles.container}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Ação</th>
            <th>Descrição</th>
            <th>IP</th>
            <th>Sucesso</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {registos.map(r => (
            <tr key={r.id}>
              <td>{r.email}</td>
              <td><span className={styles.badge}>{r.acao}</span></td>
              <td>{r.descricao}</td>
              <td>{r.ip || '-'}</td>
              <td>
                <span className={r.sucesso ? styles.sucessoBadge : styles.erroBadge}>
                  {r.sucesso ? 'Sim' : 'Não'}
                </span>
              </td>
              <td>{new Date(r.criado_em).toLocaleString('pt-PT')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {registos.length === 0 && (
        <p className={styles.info}>Nenhum registo encontrado.</p>
      )}
    </div>
  );
}