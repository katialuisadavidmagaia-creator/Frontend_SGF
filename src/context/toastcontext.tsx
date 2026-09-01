import { createContext, useCallback, useState, useRef, ReactNode } from "react";
import type { Toast, ToastType } from "../types/toast";
import { useTranslation } from "react-i18next";

export interface ToastContextData {
  toasts: Toast[];
  toast: {
    sucesso: (mensagem: string, duracao?: number) => void;
    erro: (mensagem: string, duracao?: number) => void;
    aviso: (mensagem: string, duracao?: number) => void;
    info: (mensagem: string, duracao?: number) => void;
  };
  removerToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextData | undefined>(undefined);

const DURACAO_PADRAO = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const {t}=useTranslation();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removerToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const mostrarToast = useCallback(
    (mensagem: string, type: ToastType = "info", duracao: number = DURACAO_PADRAO) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const novoToast: Toast = { id, type, mensagem, duracao };

      setToasts((prev) => [...prev, novoToast]);

      if (duracao > 0) {
        const timer = setTimeout(() => removerToast(id), duracao);
        timersRef.current.set(id, timer);
      }
    },
    [removerToast]
  );

  const toast = {
    sucesso: useCallback((m: string, d?: number) => mostrarToast(m, "success", d), [mostrarToast]),
    erro: useCallback((m: string, d?: number) => mostrarToast(m, "error", d), [mostrarToast]),
    aviso: useCallback((m: string, d?: number) => mostrarToast(m, "warning", d), [mostrarToast]),
    info: useCallback((m: string, d?: number) => mostrarToast(m, "info", d), [mostrarToast]),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removerToast }}>
      {children}
      <ToastContainer toasts={toasts} onFechar={removerToast} />
    </ToastContext.Provider>
  );
}

// ⚠️ Recebe props explicitamente — é isto que faltava
interface ToastContainerProps {
  toasts: Toast[];
  onFechar: (id: string) => void;
}

function ToastContainer({ toasts, onFechar }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        maxWidth: "360px",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onFechar(toast.id)} />
      ))}
    </div>
  );
}

const CORES: Record<ToastType, { bg: string; borda: string; texto: string }> = {
  success: { bg: "#ecfdf5", borda: "#10b981", texto: "#065f46" },
  error: { bg: "#fef2f2", borda: "#ef4444", texto: "#991b1b" },
  warning: { bg: "#fffbeb", borda: "#f59e0b", texto: "#92400e" },
  info: { bg: "#eff6ff", borda: "#3b82f6", texto: "#1e40af" },
};

const ICONES: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const cor = CORES[toast.type];

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        backgroundColor: cor.bg,
        borderLeft: `4px solid ${cor.borda}`,
        color: cor.texto,
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        animation: "toast-slide-in 0.25s ease-out",
        fontSize: "0.9rem",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1 }}>{ICONES[toast.type]}</span>
      <span style={{ flex: 1 }}>{toast.mensagem}</span>
      <button
        onClick={onClose}
        aria-label="Fechar"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: cor.texto,
          fontSize: "1rem",
          lineHeight: 1,
          opacity: 0.6,
        }}
      >
        ✕
      </button>

      <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}