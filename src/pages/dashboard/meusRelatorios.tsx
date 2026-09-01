import { useEffect, useState } from 'react';
import { relatoriosService } from '../../services/relatorio.service';
import { Relatorio } from '../../types/relatorio.types';
import { useToast } from '../../hooks/useToast';
import ModalCriarRelatorio from '../relatorios/modalCriarRelatorio';
import { UploadCloud, Download } from 'lucide-react';

interface AxiosErrorLike {
  response?: { data?: { mensagem?: string } };
}

const CORES_ESTADO: Record<string, string> = {
  PENDENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  APROVADO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJEITADO: 'bg-red-50 text-red-700 border-red-200',
};

const LABEL_ESTADO: Record<string, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REJEITADO: 'Rejeitado',
};

export default function MeusRelatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const { toast } = useToast();

  async function carregar() {
    setCarregando(true);
    try {
      const dados = await relatoriosService.listarMeus();
      setRelatorios(dados);
    } catch (err: unknown) {
      const error = err as AxiosErrorLike;
      toast.erro(error?.response?.data?.mensagem || 'Erro ao carregar os teus relatórios');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSucesso() {
    setModalAberto(false);
    toast.sucesso('Relatório enviado com sucesso');
    carregar();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#4F6EF7] uppercase mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl font-bold font-sora text-[#0E1A2B]">
            Os meus relatórios
          </h1>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 bg-[#4F6EF7] text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <UploadCloud className="h-4 w-4" />
          Enviar relatório
        </button>
      </div>

      <section className="border border-border rounded-2xl bg-white p-6 shadow-sm">
        {carregando && (
          <p className="text-sm text-muted-foreground">A carregar...</p>
        )}

        <ul className="space-y-2">
          {relatorios.map((r) => (
            <li
              key={r.id}
              className="flex justify-between items-center border border-border rounded-lg px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{r.titulo}</p>
                  {r.status && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        CORES_ESTADO[r.status] ?? ''
                      }`}
                    >
                      {LABEL_ESTADO[r.status] ?? r.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {r.criadoEm ? new Date(r.criadoEm).toLocaleDateString('pt-PT') : 'N/A'}
                </p>
              </div>

              {r.caminhoArquivo && (
                <a
                  href={relatoriosService.obterUrlPreviewPdf(r.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#4F6EF7] text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  Ver
                </a>
              )}
            </li>
          ))}

          {!carregando && relatorios.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ainda não enviaste nenhum relatório.
            </p>
          )}
        </ul>
      </section>

      {modalAberto && (
        <ModalCriarRelatorio
          onClose={() => setModalAberto(false)}
          onSuccess={handleSucesso}
        />
      )}
    </div>
  );
}