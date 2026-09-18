
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

const STATUS_LABEL: Record<
  StatusFuncionarioProjeto,
  string
> = {
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export function ModalVerProjeto({
  projeto,
  onFechar,
  onAtualizado,
}: Props) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { pode } = usePermissoes();

  const [
    modalAtribuirAberto,
    setModalAtribuirAberto,
  ] = useState(false);

  const [
    aAtualizar,
    setAAtualizar,
  ] = useState<number | null>(null);

  async function handleMudarStatus(
    funcionarioId: number,
    status: StatusFuncionarioProjeto
  ) {
    if (!pode('projetos', 'editar')) {
      toast.erro(
        'Não tem permissão para alterar o estado.'
      );
      return;
    }

    try {
      setAAtualizar(funcionarioId);

      await (projetoService as any).atualizarStatusFuncionario(
        Number(projeto.id),
        funcionarioId,
        status
      );

      toast.sucesso(
        t(
          'projetos.estadoActualizado',
          'Estado atualizado com sucesso.'
        )
      );

      await onAtualizado();
    } catch (err: any) {
      toast.erro(
        err?.response?.data?.mensagem ??
          err?.response?.data?.message ??
          t(
            'projetos.erroActualizarEstado',
            'Não foi possível atualizar o estado.'
          )
      );
    } finally {
      setAAtualizar(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onFechar}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* CABEÇALHO */}
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {projeto.nome}
            </h2>

            {projeto.descricao && (
              <p className="mt-1 text-sm text-gray-500">
                {projeto.descricao}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="max-h-[calc(90vh-150px)] overflow-y-auto px-6 py-5">

          {/* INFORMAÇÕES */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Departamento
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {projeto.departamentoNome ?? '—'}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Estado
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {projeto.estado}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Data de início
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {projeto.dataInicio
                  ? new Date(
                      projeto.dataInicio
                    ).toLocaleDateString('pt-PT')
                  : '—'}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Data de fim
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {projeto.dataFim
                  ? new Date(
                      projeto.dataFim
                    ).toLocaleDateString('pt-PT')
                  : '—'}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
              <p className="text-xs font-medium uppercase text-gray-500">
                Responsável
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {projeto.responsavelNome ??
                  'Não definido'}
              </p>
            </div>
          </div>

          {/* EQUIPA */}
          <div className="mt-7">

            <div className="mb-3 flex items-center justify-between">

              <div>
                <h3 className="font-semibold text-gray-900">
                  Equipa do projeto
                </h3>

                <p className="text-sm text-gray-500">
                  {projeto.funcionarios.length}{' '}
                  {projeto.funcionarios.length === 1
                    ? 'funcionário'
                    : 'funcionários'}
                </p>
              </div>

              {pode('projetos', 'editar') && (
                <button
                  type="button"
                  onClick={() =>
                    setModalAtribuirAberto(true)
                  }
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  + Adicionar funcionário
                </button>
              )}
            </div>

            {projeto.funcionarios.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 px-5 py-8 text-center">
                <p className="text-sm text-gray-500">
                  Nenhum funcionário atribuído
                  a este projeto.
                </p>
              </div>
            ) : (
              <div className="divide-y overflow-hidden rounded-xl border">

                {projeto.funcionarios.map(
                  (pf) => (
                    <div
                      key={pf.id}
                      className="flex items-center justify-between gap-4 px-4 py-4"
                    >

                      <div>
                        <p className="font-medium text-gray-900">
                          {pf.funcionario.name}
                        </p>

                        {pf.dataAtribuicao && (
                          <p className="text-xs text-gray-500">
                            Atribuído em{' '}
                            {new Date(
                              pf.dataAtribuicao
                            ).toLocaleDateString(
                              'pt-PT'
                            )}
                          </p>
                        )}
                      </div>

                      <select
                        value={pf.status}
                        onChange={(e) =>
                          handleMudarStatus(
                            pf.funcionarioId,
                            e.target
                              .value as StatusFuncionarioProjeto
                          )
                        }
                        disabled={
                          !pode(
                            'projetos',
                            'editar'
                          ) ||
                          aAtualizar ===
                            pf.funcionarioId
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                      >
                        {STATUS_OPCOES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {STATUS_LABEL[status]}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )
                )}

              </div>
            )}
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="flex justify-end border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Fechar
          </button>
        </div>

        {/* ATRIBUIÇÃO */}
        {modalAtribuirAberto && (
          <ModalAtribuirFuncionario
            projetoId={Number(projeto.id)}
            funcionariosJaAtribuidos={
              projeto.funcionarios.map(
                (pf) => pf.funcionarioId
              )
            }
            onFechar={() =>
              setModalAtribuirAberto(false)
            }
            onAtribuido={async () => {
              setModalAtribuirAberto(false);
              await onAtualizado();
            }}
          />
        )}
      </div>
    </div>
  );
}
