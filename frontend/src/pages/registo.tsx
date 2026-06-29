import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const API = 'http://localhost:4003/api';

export default function Registo() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [birth, setBirth]=useState('');
  const [phone, setPhone] = useState(''); 
  const [msg, setMsg] = useState<{ texto: string; tipo: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegisto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    if (password !== confirmPassword) {
      setMsg({ texto: 'As senhas não coincidem.', tipo: 'error' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/registo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name,birth, email, password, phone,confirmPassword }) 
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ texto: data.erro || 'Erro ao criar conta.', tipo: 'error' });
      } else {
        setMsg({ texto: 'Conta criada com sucesso!', tipo: 'success' });
        setTimeout(() => navigate('/'), 1500);
      }
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

        <h2>Criar Conta</h2>
        <p className={styles.subtitle}>Preencha os dados para se registar.</p>

        <form onSubmit={handleRegisto} className={styles.form}>

          <div className={styles.field}>
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" type="text" placeholder="O seu nome"
              value={name} onChange={e => setName(e.target.value)} required />
          </div>


          <div className={styles.field}>
            <label htmlFor="birth">Data de nascimento</label>
            <input id="birth" type="text" placeholder="DD/MM/AAAA"
              value={birth} onChange={e => setBirth(e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Endereço de email</label>
            <input id="email" type="email" placeholder="exemplo@gmail.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" type="tel" placeholder="+258 000 000 000"
              value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" placeholder="000000"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="confirmarPassword">Confirmar senha</label>
            <input id="confirmarPassword" type="password" placeholder="000000"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          

          {msg && (
            <div className={`${styles.msg} ${styles[msg.tipo]}`}>
              {msg.texto}
            </div>
          )}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'A criar...' : 'Criar conta'}
          </button>

        </form>

        <div className={styles.footer}>
          <p>Já tem conta? <Link to="/">Iniciar sessão</Link></p>
        </div>

      </div>
    </div>
  );
}