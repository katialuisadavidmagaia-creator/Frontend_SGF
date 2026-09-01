import ModalBase from "./modalBase";

export interface CampoVisualizacao {
  label: string;
  valor: string | number | null | undefined;
}

interface ModalVerProps {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  campos: CampoVisualizacao[];
}

export default function ModalVer({ aberto, onFechar, titulo, campos }: ModalVerProps) {
  return (
    <ModalBase aberto={aberto} onFechar={onFechar} titulo={titulo}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        {campos.map((campo, i) => (
          <div key={i}>
            <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600, textTransform: "uppercase" }}>
              {campo.label}
            </span>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.95rem", color: "#111827" }}>
              {campo.valor ?? "—"}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onFechar}
          style={{
            padding: "0.5rem 1.2rem",
            backgroundColor: "#f3f4f6",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Fechar
        </button>
      </div>
    </ModalBase>
  );
}