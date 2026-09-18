
import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from 'react';

import { X, FileText, Upload, Loader2 } from 'lucide-react';

import { relatoriosService } from '../../services/relatorio.service';
import { useToast } from '../../hooks/useToast';

interface ModalCriarRelatorioProps {
  onClose: () => void;
  onSuccess: () => void;
}

const TIPOS_PERMITIDOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const EXTENSOES_PERMITIDAS = [
  '.pdf',
  '.doc',
  '.docx',
];

const TAMANHO_MAXIMO = 10 * 1024 * 1024;

export default function ModalCriarRelatorio({
  onClose,
  onSuccess,
}: ModalCriarRelatorioProps) {
  const [titulo, setTitulo] = useState('');
  const [ficheiro, setFicheiro] =
    useState<File | null>(null);
  const [carregando, setCarregando] =
    useState(false);

  const { toast } = useToast();

  function handleFicheiro(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const ficheiroSelecionado =
      e.target.files?.[0];

    if (!ficheiroSelecionado) {
      setFicheiro(null);
      return;
    }

    const nome =
      ficheiroSelecionado.name.toLowerCase();

    const extensaoValida =
      EXTENSOES_PERMITIDAS.some((extensao) =>
        nome.endsWith(extensao)
      );

    const tipoValido =
      TIPOS_PERMITIDOS.includes(
        ficheiroSelecionado.type
      );

    if (!extensaoValida && !tipoValido) {
      toast.erro(
        'Formato inválido. Envie apenas PDF, DOC ou DOCX.'
      );

      e.target.value = '';
      setFicheiro(null);
      return;
    }

    if (
      ficheiroSelecionado.size >
      TAMANHO_MAXIMO
    ) {
      toast.erro(
        'O ficheiro não pode ultrapassar 10 MB.'
      );

      e.target.value = '';
      setFicheiro(null);
      return;
    }

    setFicheiro(ficheiroSelecionado);
  }

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    const tituloLimpo = titulo.trim();

    if (!tituloLimpo) {
      toast.erro(
        'Informe o título do relatório.'
      );
      return;
    }

    if (!ficheiro) {
      toast.erro(
        'Selecione o ficheiro do relatório.'
      );
      return;
    }

    setCarregando(true);

    try {
      const formData = new FormData();

      formData.append(
        'titulo',
        tituloLimpo
      );

      /*
       * IMPORTANTE:
       * O backend usa multer:
       * upload.single('arquivo')
       *
       * Portanto o campo deve ser "arquivo"
       * e não "file".
       */
      formData.append(
        'arquivo',
        ficheiro
      );

      await relatoriosService.criar(
        formData
      );

      toast.sucesso(
        'Relatório enviado com sucesso.'
      );

      setTitulo('');
      setFicheiro(null);

      onSuccess();
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            mensagem?: string;
            message?: string;
          };
        };
      };

      toast.erro(
        error?.response?.data?.mensagem ||
          error?.response?.data?.message ||
          'Erro ao enviar o relatório.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!carregando) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Enviar relatório
              </h2>

              <p className="text-sm text-slate-500">
                Envie o relatório para análise.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={carregando}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-6"
        >
          {/* Título */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Título do relatório
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(e) =>
                setTitulo(e.target.value)
              }
              placeholder="Ex.: Relatório do projeto"
              required
              disabled={carregando}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
            />
          </div>

          {/* Ficheiro */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Ficheiro
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50/30">
              <Upload className="mb-3 h-8 w-8 text-slate-400" />

              <span className="text-sm font-semibold text-slate-700">
                {ficheiro
                  ? ficheiro.name
                  : 'Selecionar ficheiro'}
              </span>

              <span className="mt-1 text-xs text-slate-400">
                PDF, DOC ou DOCX — máximo 10 MB
              </span>

              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFicheiro}
                disabled={carregando}
                className="hidden"
              />
            </label>

            {ficheiro && (
              <p className="mt-2 text-xs text-emerald-600">
                Ficheiro selecionado:
                {' '}
                {ficheiro.name}
              </p>
            )}
          </div>

          {/* Rodapé */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={carregando}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A enviar...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Enviar relatório
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
