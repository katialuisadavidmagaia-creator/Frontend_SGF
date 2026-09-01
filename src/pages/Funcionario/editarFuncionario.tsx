import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import styles from '../../components/components.module.css';
import { useTranslation } from 'react-i18next';

const API = 'http://localhost:4003/api';

export default function EditarFuncionario() {
  const {t}=useTranslation();
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [nome, setNome]       = useState('');
  const [email, setEmail]     = useState(''); 
  const [telefone, setTelefone] = useState('');
  const [msg, setMsg]         = useState<{ texto: string; tipo: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [carregandoFuncionario, setCarregandoFuncionario] = useState(true);

  const token = localStorage.getItem('token');

  //  BUSCA APENAS OS DADOS DO FUNCIONÁRIO SELECIONADO AO ENTRAR NA TELA
  useEffect(() => {
    if (!id) return;

    fetch(`${API}/funcionario/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Não foi possível encontrar o funcionário.');
        return r.json();
      })
      .then(json => {
        
        const f = json.data || json;
        setNome(f.nome || f.name || '');
        setEmail(f.email || '');
        setTelefone(f.telefone || f.phone || '');
        setCarregandoFuncionario(false);
      })
      .catch((err) => {
        setMsg({ texto: err.message, tipo: 'error' });
        setCarregandoFuncionario(false);
      });
  }, [id, token]);

  const handleEditar = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`${API}/funcionario/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nome, email, telefone })
      });
      
      const data = await res.json();

      if (!res.ok) {
        setMsg({ texto: data.erro || 'Erro ao editar.', tipo: 'error' });
      } else {
        setMsg({ texto: 'Funcionário atualizado com sucesso!', tipo: 'success' });
        // APÓS 1.5 SEGUNDOS, VOLTA AUTOMATICAMENTE PARA A LISTA
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch {
      setMsg({ texto: 'Erro ao ligar ao servidor.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (carregandoFuncionario) return <p style={{ padding: '20px' }}>A carregar dados do funcionário...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.formulario} style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h3 className={styles.subtitulo}>Editar dados do Funcionário #{id}</h3>
        
        <div className={styles.field}>
          <label>Nome</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
        </div>
        
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        
        <div className={styles.field}>
          <label>Telefone</label>
          <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} />
        </div>
        
        {msg && (
          <div className={`${styles.msg} ${styles[msg.tipo]}`}>
            {msg.texto}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            type="button" 
            className={styles.btnVoltar} 
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#ccc', color: '#000', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Voltar
          </button>
          
          <button 
            className={styles.btn} 
            onClick={handleEditar} 
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'A guardar...' : 'Guardar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}