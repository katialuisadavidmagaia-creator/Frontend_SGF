import { useTranslation } from "react-i18next";

const {t}=useTranslation(); 

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  mensagem: string;
  duracao?: number;
}