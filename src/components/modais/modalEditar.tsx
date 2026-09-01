import { useState, FormEvent } from "react";
import ModalBase from "./modalBase";

export type TipoCampo = "text" | "email" | "number" | "select" | "date" | "textarea";

export interface CampoFormulario {
  name: string;
  label: string;
  tipo: TipoCampo;
  valor: string | number;
  obrigatorio?: boolean;
  opcoes?: { label: string; value: string | number }[];
}

interface ModalEditarProps {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  campos: CampoFormulario[];
  onGuardar: (dados: Record<string, string | number>) => Promise<void> | void;
  aGuardar?: boolean;
}

export default function ModalEditar({
  aberto,
  onFechar,
  titulo,
  campos,
  onGuardar,
  aGuardar = false,
}: ModalEditarProps) {
  const [dados, setDados] = useState<Record<string, string | number>>(
    Object.fromEntries(campos.map((c) => [c.name, c.valor]))
  );

  function handleChange(name: string, valor: string | number) {
    setDados((prev) => ({ ...prev, [name]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onGuardar(dados);
  }

  return (
    <ModalBase aberto={aberto} onFechar={onFechar} titulo={titulo}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {campos.map((campo) => (
          <div key={campo.name} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>
              {campo.label}
              {campo.obrigatorio && <span style={{ color: "#ef4444" }}> *</span>}
            </label>

            {campo.tipo === "select" ? (
              <select
                value={dados[campo.name]}
                onChange={(e) => handleChange(campo.name, e.target.value)}
                required={campo.obrigatorio}
                style={estiloInput}
              >
                <option value="">Seleciona...</option>
                {campo.opcoes?.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            ) : campo.tipo === "textarea" ? (
              <textarea
                value={dados[campo.name]}
                onChange={(e) => handleChange(campo.name, e.target.value)}
                required={campo.obrigatorio}
                rows={4}
                style={{ ...estiloInput, resize: "vertical" }}
              />
            ) : (
              <input
                type={campo.tipo}
                value={dados[campo.name]}
                onChange={(e) =>
                  handleChange(campo.name, campo.tipo === "number" ? Number(e.target.value) : e.target.value)
                }
                required={campo.obrigatorio}
                style={estiloInput}
              />
            )}
          </div>
        ))}

        <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
          <button
            type="button"
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
            Cancelar
          </button>
          <button
            type="submit"
            disabled={aGuardar}
            style={{
              padding: "0.5rem 1.2rem",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: aGuardar ? "not-allowed" : "pointer",
              opacity: aGuardar ? 0.7 : 1,
              fontWeight: 500,
            }}
          >
            {aGuardar ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

const estiloInput: React.CSSProperties = {
  padding: "0.55rem 0.7rem",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "0.9rem",
  outline: "none",
};