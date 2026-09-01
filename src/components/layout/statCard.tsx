interface StatCardProps {
  label: string;
  valor: string | number;
  variacao?: { texto: string; positiva: boolean };
  rodape?: string;
}

export function StatCard({ label, valor, variacao, rodape }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-5">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-2 mt-2">
        <p className="text-2xl font-bold text-slate-800">{valor}</p>
        {variacao && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold mb-1 ${
              variacao.positiva ? 'text-emerald-600' : 'text-destructive'
            }`}
          >
            {variacao.positiva ? '▲' : '▼'} {variacao.texto}
          </span>
        )}
      </div>
      {rodape && <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-black/5">{rodape}</p>}
    </div>
  );
}