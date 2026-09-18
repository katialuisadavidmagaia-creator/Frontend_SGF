
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { useToast } from '../../hooks/useToast';
import type { Departamento } from '../../types/departamento.types';
import * as departamentoService from '../../services/departamento.service';

interface Props {
  departamento: Departamento;
  onFechar: () => void;
  onEditado: () => void;
}

export function ModalEditarDepartamento({
  departamento,
  onFechar,
  onEditado,
}: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setNome(departamento.nome || '');
    setDescricao(departamento.descricao || '');
  }, [departamento]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const nomeLimpo = nome.trim();
    const descricaoLimpa = descricao.trim();

    if (!nomeLimpo) {
      toast.erro('Digite o nome do departamento');
      return;
    }

    if (nomeLimpo.length < 2) {
      toast.erro(
        'O nome do departamento deve ter pelo menos 2 caracteres'
      );
      return;
    }

    setSalvando(true);

    try {
      await (departamentoService as any).editarDepartamento(
        departamento.id,
        {
          nome: nomeLimpo,
          descricao: descricaoLimpa,
        }
      );

      toast.sucesso(
        'Departamento atualizado com sucesso'
      );

      onEditado();
    } catch (err: any) {
      console.error(
        'Erro ao atualizar departamento:',
        err
      );

      toast.erro(
        err?.response?.data?.mensagem ||
          err?.response?.data?.message ||
          'Não foi possível atualizar o departamento'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !salvando) {
          onFechar();
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Editar Departamento
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Atualize os dados do departamento
            </p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label
              htmlFor="editarNomeDepartamento"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Nome *
            </label>

            <input
              id="editarNomeDepartamento"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              minLength={2}
              disabled={salvando}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#4F6EF7]/20 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="editarDescricaoDepartamento"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Descrição
            </label>

            <textarea
              id="editarDescricaoDepartamento"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do departamento"
              rows={4}
              disabled={salvando}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#4F6EF7] focus:ring-2 focus:ring-[#4F6EF7]/20 disabled:bg-gray-100"
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-[#4F6EF7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#405bd4] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {salvando ? 'A guardar...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
