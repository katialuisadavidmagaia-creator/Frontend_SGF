import React from 'react';

interface ModalEliminarProps {
  titulo: string;
  mensagem: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export const ModalEliminar: React.FC<ModalEliminarProps> = ({
  titulo,
  mensagem,
  onCancelar,
  onConfirmar,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white">{titulo}</h3>
        <p className="mt-2 text-sm text-gray-300">{mensagem}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminar;