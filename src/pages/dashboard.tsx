import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard.module.css';
import ListarFuncionario from '../components/listarFuncionario';
import Historico          from '../components/historico';
import Perfil             from '../components/perfil';

type Seccao = 'listar' | 'historico' | 'perfil';

export default function Dashboard() {
  const navigate  = useNavigate();
  const email     = localStorage.getItem('email') || 'Utilizador';
  const [seccao, setSeccao]           = useState<Seccao>('listar');
  const [sidebarAberta, setSidebarAberta] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  };

  const titulos: Record<Seccao, string> = {
    listar:    'Funcionários',
    historico: 'Histórico de Acessos',
    perfil:    'Perfil',
  };

  const renderSeccao = () => {
    switch (seccao) {
      case 'listar':    return <ListarFuncionario />;
      case 'historico': return <Historico />;
      case 'perfil':    return <Perfil />;
    }
  };

  return (
    <div className={styles.container}>

      <aside className={`${styles.sidebar} ${sidebarAberta ? styles.aberta : styles.fechada}`}>
        <div className={styles.sidebarLogo}>
          <h1>SGF</h1>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${seccao === 'listar' ? styles.ativo : ''}`}
            onClick={() => setSeccao('listar')}>
            <span className={styles.navIcon}>F</span>
            {sidebarAberta && <span>Funcionários</span>}
          </button>
       
          <button
            className={`${styles.navItem} ${seccao === 'perfil' ? styles.ativo : ''}`}
            onClick={() => setSeccao('perfil')}>
            <span className={styles.navIcon}>P</span>
            {sidebarAberta && <span>Perfil</span>}
          </button>
        </nav>

        <button className={styles.btnToggle}
          onClick={() => setSidebarAberta(!sidebarAberta)}>
          {sidebarAberta ? 'Fechar' : 'Abrir'}
        </button>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <h2>{titulos[seccao]}</h2>
          <div className={styles.headerRight}>
            <span className={styles.emailUser}>{email}</span>
            <button className={styles.btnLogout} onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        <section className={styles.conteudo}>
          {renderSeccao()}
        </section>
      </div>

    </div>
  );
}