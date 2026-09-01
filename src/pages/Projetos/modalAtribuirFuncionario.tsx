import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { projetosService} from '../../services/projeto.service'; 
import { api } from '../../services/api'; 
import { useTranslation } from 'react-i18next';


interface FuncionarioOpcao {
  id: number;
  name: string;
}

interface Props {
  projetoId: number;
  funcionariosJaAtribuidos: number[];
  onFechar: () => void;
  onAtribuido: () => void;
}

export function ModalAtribuirFuncionario({
  projetoId,
  funcionariosJaAtribuidos,
  onFechar,
  onAtribuido,
}: Props) {
  const {t}=useTranslation();
  const [funcionarios, setFuncionarios] = useState<FuncionarioOpcao[]>([]);
  const [funcionarioId, setFuncionarioId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.get('/funcionarios').then(({ data }) => {
      const disponiveis = data.filter((f: FuncionarioOpcao) => !funcionariosJaAtribuidos.includes(f.id));
      setFuncionarios(disponiveis);
    });
  }, [funcionariosJaAtribuidos]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!funcionarioId) {
      setErro('Selecione um funcionário');
      return;
    }

    setAEnviar(true);
    try {
      await projetosService.atribuirFuncionario(projetoId, funcionarioId);
      toast.sucesso('Funcionário adicionado ao projeto');
      onAtribuido();
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? 'Erro ao atribuir funcionário');
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Funcionário</h2>

        <form onSubmit={handleSubmit}>
          <select value={funcionarioId ?? ''} onChange={(e) => setFuncionarioId(Number(e.target.value))}>
            <option value="" disabled>Selecione...</option>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          {erro && <p className="text-red-500">{erro}</p>}

          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onFechar}>Cancelar</button>
            <button type="submit" disabled={aEnviar} className="btn-primary">
              {aEnviar ? 'A atribuir...' : 'Atribuir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}