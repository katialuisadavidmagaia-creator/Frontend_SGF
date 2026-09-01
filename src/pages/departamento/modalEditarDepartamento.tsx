import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import type { Departamento } from '../../types/departamento.types';
import * as departamentoService from '../../services/departamento.service';
import { useTranslation } from 'react-i18next';

interface Props {
  departamento: Departamento;
  onFechar: () => void;
  onEditado: () => void;
}

export function ModalEditarDepartamento({ departamento, onFechar, onEditado }: Props) {
  const {t}=useTranslation();
  const [nome, setNome] = useState(departamento.nome);
  const [erro, setErro] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAEnviar(true);

    try {
      await (departamentoService as any).actualizarDepartamento(departamento.id, { nome });
      toast.sucesso('Departamento actualizado');
      onEditado();
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? 'Erro ao actualizar departamento');
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Departamento</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} required minLength={2} />
          </label>

          {erro && <p className="text-red-500">{erro}</p>}

          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onFechar}>Cancelar</button>
            <button type="submit" disabled={aEnviar} className="btn-primary">
              {aEnviar ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}