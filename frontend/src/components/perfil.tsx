import { useEffect, useState } from 'react';

const API = 'http://localhost:4003/api';

interface FuncionarioPerfil {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birth?: string;
  role: 'ADMIN' | 'RH' | 'FUNCIONARIO';
}

export default function Perfil() {
  const [profile, setPerfil] = useState<FuncionarioPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fixed: Now using the API variable so VS Code stops complaining
    fetch(`${API}/funcionarios/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setPerfil(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={styles.container}>Carregando perfil...</div>;
  }

  if (!profile) {
    return (
      <div style={styles.container}>
        Não foi possível carregar o perfil. Por favor, faça login novamente.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Meu Perfil</h2>
        <hr style={styles.divider} />
        
        <div style={styles.infoGroup}>
          <label style={styles.label}>Nome:</label>
          <p style={styles.value}>{profile.name}</p>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Email:</label>
          <p style={styles.value}>{profile.email}</p>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Telefone:</label>
          <p style={styles.value}>{profile.phone || 'Não informado'}</p>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Data de Nascimento:</label>
          <p style={styles.value}>{profile.birth || 'Não informada'}</p>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Cargo / Função:</label>
          <span style={styles.badge}>{profile.role}</span>
        </div>
      </div>
    </div>
  );
}

// Added Record<string, React.CSSProperties> to make TypeScript fully happy with inline CSS
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