import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './login.module.css'; // Reaproveita os estilos do login

export default function RedefinirPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ texto: string; tipo: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRedefinir = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('http://localhost:4003/api/auth/redefinir-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaPassword: password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMsg({ texto: 'Senha atualizada com sucesso! Redirecionando...', tipo: 'success' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMsg({ texto: data.mensagem || data.erro || 'Erro ao redefinir a senha.', tipo: 'error' });
      }
    } catch {
      setMsg({ texto: 'Não foi possível conectar ao servidor.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>SGF</h1>
          <p>Sistema de Gestão de Funcionários</p>
        </div>

        <h2>Nova Senha</h2>
        <p className={styles.subtitle}>Introduza a sua nova palavra-passe de acesso.</p>

        <form onSubmit={handleRedefinir} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="password">Nova Senha</label>
            <input 
              id="password" 
              type="password" 
              placeholder="Digite a nova senha" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          {msg && (
            <div className={`${styles.msg} ${styles[msg.tipo]}`}>
              {msg.texto}
            </div>
          )}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}