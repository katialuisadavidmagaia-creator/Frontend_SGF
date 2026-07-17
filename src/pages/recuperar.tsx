import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const API = 'http://localhost:4003/api';

export default function Recuperar() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<{ texto: string; tipo: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);
  
const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API}/auth/recuperar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      setMsg({ texto: data.mensagem || data.erro || 'Instruções enviadas!', tipo: res.ok ? 'success' : 'error' });
    } catch {
      setMsg({ texto: 'Não foi possível ligar ao servidor.', tipo: 'error' });
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

        <h2>Recuperar Senha</h2>
        <p className={styles.subtitle}>
          Introduza o seu email e telefone para receber instruções.
        </p>

        <form onSubmit={handleRecuperar} className={styles.form}>

          <div className={styles.field}>
            <label htmlFor="email">Endereço de email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="exemplo@empresa.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

        
          
          {msg && (
            <div className={`${styles.msg} ${styles[msg.tipo]}`}>
              {msg.texto}
            </div>
          )}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : 'Enviar instruções'}
          </button>

        </form>

        <div className={styles.footer}>
          <p><Link to="/">Voltar ao login</Link></p>
        </div>

      </div>
    </div>
  );
}