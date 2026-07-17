import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const API = 'http://localhost:4003/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]   = useState(false);
  const [msg, setMsg]           = useState<{ texto: string; tipo: 'error' | 'success' } | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ texto: data.erro || 'Erro ao iniciar sessão.', tipo: 'error' });
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        navigate('/dashboard');
      }
    } catch {
      setMsg({ texto: 'o utilizador nao tem uma conta ', tipo: 'error' });
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

        <h2>Iniciar Sessão</h2>
        <p className={styles.subtitle}>
          Introduza as suas credenciais para aceder ao sistema.
        </p>

        <form onSubmit={handleLogin} className={styles.form}>

          <div className={styles.field}>
            <label htmlFor="email">Endereço de email</label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputIcon}>
              <input
                id="password"
                type={show ? 'text' : 'password'} placeholder='000000'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.togglePass}
  onClick={() => setShow(!show)}>
  {show ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
        a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8
        a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )}
</button>
            </div>
          </div>

          <p className={styles.linkAlt} style={{ textAlign: 'right' }}>
            <Link to="/recuperar">Esqueceu a senha?</Link>
          </p>

          {msg && (
            <div className={`${styles.msg} ${styles[msg.tipo]}`}>
              {msg.texto}
            </div>
          )}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>

        </form>

        <div className={styles.footer}>
          <p>Não tem conta? <Link to="/registo">Criar conta</Link></p>
        </div>

      </div>
    </div>
  );
}