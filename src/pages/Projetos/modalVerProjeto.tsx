import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';


import type {
  Projeto,
  StatusFuncionarioProjeto,
} from '../../types/projeto.types';

import * as projetoService from '../../services/projeto.service';

import { ModalAtribuirFuncionario } from './modalAtribuirFuncionario';

interface Props {
  projeto: Projeto;
  onFechar: () => void;
  onAtualizado: () => void;
}

const STATUS_OPCOES: StatusFuncionarioProjeto[] = [
  'EM_ANDAMENTO',
  'CONCLUIDO',
  'CANCELADO',
];

export function ModalVerProjeto({
  projeto,
  onFechar,
  onAtualizado,
}: Props) {
  const {t}=useTranslation();
  const [
    modalAtribuirAberto,
    setModalAtribuirAberto,
  ] = useState(false);

  const { toast } = useToast();
  const { pode } = usePermissoes();

  async function handleMudarStatus(
    funcionarioId: number,
    status: StatusFuncionarioProjeto
  ) {
    try {
      await (projetoService as any) .atualizarStatusFuncionario(
        projeto.id,
        funcionarioId,
        status
      );

      toast.sucesso(
        'Estado actualizado'
      );

      onAtualizado();
    } catch {
      toast.erro(
        'Não foi possível actualizar o estado'
      );
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{projeto.nome}</h2>

        {projeto.descricao && (
          <p>{projeto.descricao}</p>
        )}

        <div className="flex justify-between items-center mt-4 mb-2">
          <h3 className="font-semibold">
            Equipa
          </h3>

          {pode('projetos', 'editar') && (
            <button
              type="button"
              onClick={() =>
                setModalAtribuirAberto(true)
              }
            >
              + Adicionar Funcionário
            </button>
          )}
        </div>

        {projeto.funcionarios.length === 0 ? (
          <p className="text-gray-500">
            Nenhum funcionário atribuído.
          </p>
        ) : (
          <ul>
            {projeto.funcionarios.map(
              (pf) => (
                <li
                  key={pf.id}
                  className="flex justify-between items-center py-2"
                >
                  <span>
                    {pf.funcionario.name}
                  </span>

                  <select
                    value={pf.status}
                    onChange={(e) =>
                      handleMudarStatus(
                        pf.funcionarioId,
                        e.target.value as StatusFuncionarioProjeto
                      )
                    }
                    disabled={
                      !pode(
                        'projetos',
                        'editar'
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    {STATUS_OPCOES.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </li>
              )
            )}
          </ul>
        )}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onFechar}
          >
            Fechar
          </button>
        </div>

        {modalAtribuirAberto && (
          <ModalAtribuirFuncionario
            projetoId={Number(projeto.id)}
            funcionariosJaAtribuidos={projeto.funcionarios.map(
              (funcionario) =>
                funcionario.funcionarioId
            )}
            onFechar={() =>
              setModalAtribuirAberto(false)
            }
            onAtribuido={() => {
              setModalAtribuirAberto(false);
              onAtualizado();
            }}
          />
        )}
      </div>
    </div>
  );
}