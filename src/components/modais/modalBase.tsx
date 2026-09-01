import { ReactNode, useEffect } from "react";

interface ModalBaseProps {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  children: ReactNode;
  largura?: string;
}

export default function ModalBase({ aberto, onFechar, titulo, children, largura = "480px" }: ModalBaseProps) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    if (aberto) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      onClick={onFechar}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          width: "100%",
          maxWidth: largura,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          animation: "modal-fade-in 0.2s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>{titulo}</h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "1.25rem" }}>{children}</div>

        <style>{`
          @keyframes modal-fade-in {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}