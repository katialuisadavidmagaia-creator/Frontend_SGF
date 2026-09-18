
import {
  Building2,
  CalendarDays,
  FileText,
  User,
  Users,
  X,
} from 'lucide-react';

import type { Departamento } from '../../types/departamento.types';

interface ModalVerDepartamentoProps {
  aberto: boolean;
  departamento: Departamento | null;
  onFechar: () => void;
}

function formatarData(data?: string) {
  if (!data) return '—';

  const dataObj = new Date(data);

  if (Number.isNaN(dataObj.getTime())) {
    return '—';
  }

  return dataObj.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function ModalVerDepartamento({
  aberto,
  departamento,
  onFechar,
}: ModalVerDepartamentoProps) {
  if (!aberto || !departamento) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onFechar();
        }
      }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {departamento.nome}
              </h2>

              <p className="text-sm text-gray-500">
                Detalhes do departamento
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-5 px-6 py-6">
          {/* DESCRIÇÃO */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />

              <h3 className="text-sm font-semibold text-gray-900">
                Descrição
              </h3>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              {departamento.descricao ||
                'Nenhuma descrição disponível.'}
            </p>
          </div>

          {/* INFORMAÇÕES */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />

                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Responsável
                </span>
              </div>

              <p className="font-medium text-gray-900">
                {departamento.responsavelNome ||
                  'Não definido'}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />

                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Funcionários
                </span>
              </div>

              <p className="font-medium text-gray-900">
                {departamento.totalFuncionarios ?? 0}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Funcionários associados
              </p>
            </div>
          </div>

          {/* DATAS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                <CalendarDays className="h-4 w-4 text-gray-500" />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Criado em
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatarData(departamento.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                <CalendarDays className="h-4 w-4 text-gray-500" />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Atualizado em
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatarData(departamento.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
