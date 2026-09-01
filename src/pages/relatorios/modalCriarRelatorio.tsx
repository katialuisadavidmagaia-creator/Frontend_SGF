import { useState, FormEvent } from 'react';
import { relatoriosService } from '../../services/relatorio.service';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from 'react-i18next';

interface ModalCriarRelatorioProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCriarRelatorio({ onClose, onSuccess }: ModalCriarRelatorioProps) {
  const {t}=useTranslation();
  const [titulo, setTitulo] = useState('');
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ficheiro) {
      toast.erro('Por favor, selecione um ficheiro');
      return;
    }

    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('file', ficheiro);

      await relatoriosService.criar(formData);
      toast.sucesso('Relatório enviado com sucesso');
      onSuccess();
    } catch {
      toast.erro('Erro ao enviar o relatório');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Enviar Novo Relatório</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ficheiro</label>
            <input
              type="file"
              onChange={(e) => setFicheiro(e.target.files?.[0] || null)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {carregando ? 'A enviar...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}