import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = 'http://localhost:4003/api';

interface FuncionarioDetalhes {
  id: number;
  nome: string;
  email: string;
  criado_em: string;
}

export default function DetalhesFuncionario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [funcionario, setFuncionario] = useState<FuncionarioDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem('token');
    
    fetch(`${API}/funcionario/${id}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível carregar os detalhes do funcionário.');
        return res.json();
      })
      .then((json) => {
        if (json && json.data) {
          setFuncionario(json.data);
        } else {
          throw new Error('Formato de dados inválido recebido do servidor.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: '20px', textAlign: 'center' }}>A carregar detalhes...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!funcionario) return null;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: '#333' }}>Detalhes do Funcionário</h2>
          <span style={badgeStyle}>ID #{funcionario.id}</span>
        </div>

        <div style={infoContainerStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Nome Completo</label>
            <p style={valueStyle}>{funcionario.nome}</p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Endereço de Email</label>
            <p style={valueStyle}>{funcionario.email}</p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Data de Cadastro</label>
            <p style={valueStyle}>
              {new Date(funcionario.criado_em).toLocaleString('pt-PT', {
                dateStyle: 'short',
                timeStyle: 'short'
              })}
            </p>
          </div>
        </div>

        <div style={actionsStyle}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={btnVoltarStyle}
          >
            Voltar para a Lista
          </button>
          
          <button 
            onClick={() => navigate(`/dashboard/editar-funcionario/${funcionario.id}`)} 
            style={btnEditarStyle}
          >
            Editar Dados
          </button>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '70vh',
  padding: '20px',
  fontFamily: 'sans-serif'
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: '550px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  padding: '32px',
  border: '1px solid #eaeaea'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '2px solid #f4f4f5',
  paddingBottom: '16px',
  marginBottom: '24px'
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9',
  color: '#64748b',
  padding: '4px 10px',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '14px'
};

const infoContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const fieldGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontWeight: 600
};

const valueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  color: '#1e293b',
  fontWeight: 500,
  backgroundColor: '#f8fafc',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #f1f5f9'
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '32px',
  borderTop: '1px solid #f4f4f5',
  paddingTop: '20px'
};

const btnVoltarStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#fff',
  color: '#334155',
  cursor: 'pointer',
  fontWeight: 500
};

const btnEditarStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 500
};