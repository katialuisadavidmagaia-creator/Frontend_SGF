
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '../../hooks/useToast';
import { usePermissoes } from '../../hooks/usePermissoes';

import { projetosService } from '../../services/projeto.service';
import { api } from '../../services/api';

interface FuncionarioOpcao {
  id: number;
  name?: string;
  nome?: string;
  nomeCompleto?: string;
  email?: string;
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const { pode } = usePermissoes();

  const [funcionarios, setFuncionarios] =
    useState<FuncionarioOpcao[]>([]);

  const [funcionarioId, setFuncionarioId] =
    useState<number | null>(null);

  const [erro, setErro] =
    useState<string | null>(null);

  const [aEnviar, setAEnviar] =
    useState(false);

  const [aCarregar, setACarregar] =
    useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarFuncionarios() {
      try {
        setACarregar(true);
        setErro(null);

        const resposta =
          await api.get<FuncionarioOpcao[]>(
            '/funcionarios'
          );

        if (!ativo) return;

        const disponiveis =
          resposta.data.filter(
            (funcionario) =>
              !funcionariosJaAtribuidos.includes(
                funcionario.id
              )
          );

        setFuncionarios(disponiveis);
      } catch (err: any) {
        if (!ativo) return;

        setErro(
          err?.response?.data?.mensagem ??
            t(
              'projetos.erroCarregarFuncionarios',
              'Não foi possível carregar os funcionários.'
            )
        );
      } finally {
        if (ativo) {
          setACarregar(false);
        }
      }
    }

    carregarFuncionarios();

    return () => {
      ativo = false;
    };
  }, [funcionariosJaAtribuidos, t]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!pode('projetos', 'editar')) {
      setErro(
        'Não tem permissão para atribuir funcionários.'
      );
      return;
    }

    if (funcionarioId === null) {
      setErro(
        t(
          'projetos.selecioneFuncionario',
          'Selecione um funcionário.'
        )
      );
      return;
    }

    setAEnviar(true);
    setErro(null);

    try {
      await projetosService.atribuirFuncionario(
        projetoId,
        funcionarioId
      );

      toast.sucesso(
        t(
          'projetos.funcionarioAdicionado',
          'Funcionário atribuído ao projeto com sucesso.'
        )
      );

      onAtribuido();
    } catch (err: any) {
      setErro(
        err?.response?.data?.mensagem ??
          err?.response?.data?.message ??
          t(
            'projetos.erroAtribuirFuncionario',
            'Não foi possível atribuir o funcionário.'
          )
      );
    } finally {
      setAEnviar(false);
    }
  }

  function nomeFuncionario(
    funcionario: FuncionarioOpcao
  ) {
    return (
      funcionario.name ??
      funcionario.nome ??
      funcionario.nomeCompleto ??
      funcionario.email ??
      `Funcionário #${funcionario.id}`
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {t(
              'projetos.adicionarFuncionario',
              'Adicionar funcionário'
            )}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Selecione o funcionário que pretende
            atribuir a este projeto.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="px-6 py-5">

            <label
              htmlFor="funcionario"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Funcionário
            </label>

            <select
              id="funcionario"
              value={funcionarioId ?? ''}
              onChange={(e) => {
                const value = e.target.value;

                setFuncionarioId(
                  value === ''
                    ? null
                    : Number(value)
                );

                setErro(null);
              }}
              disabled={aCarregar || aEnviar}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            >
              <option value="">
                {aCarregar
                  ? 'A carregar funcionários...'
                  : 'Selecione um funcionário'}
              </option>

              {funcionarios.map(
                (funcionario) => (
                  <option
                    key={funcionario.id}
                    value={funcionario.id}
                  >
                    {nomeFuncionario(funcionario)}
                  </option>
                )
              )}
            </select>

            {!aCarregar &&
              funcionarios.length === 0 &&
              !erro && (
                <p className="mt-2 text-sm text-gray-500">
                  Todos os funcionários já estão
                  atribuídos a este projeto.
                </p>
              )}

            {erro && (
              <p className="mt-3 text-sm text-red-600">
                {erro}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">

            <button
              type="button"
              onClick={onFechar}
              disabled={aEnviar}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                aEnviar ||
                aCarregar ||
                funcionarioId === null ||
                funcionarios.length === 0
              }
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {aEnviar
                ? 'A atribuir...'
                : 'Atribuir'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
