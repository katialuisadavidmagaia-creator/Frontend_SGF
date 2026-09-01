import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { usePermissoes } from '../hooks/usePermissoes';
import { ReactNode } from 'react';

type Role = 'ADMIN' | 'RH' | 'FUNCIONARIO';

interface ProtectedRouteProps {
  modulo?: string;
  accao?: 'ver' | 'criar' | 'editar' | 'eliminar';
  children?: ReactNode;
  permitido?: Role[];
}

export function ProtectedRoute({ modulo, accao = 'ver', children, permitido }: ProtectedRouteProps) {
  const { estaAutenticado } = useAuth();
  const { pode, role } = usePermissoes();

  // 1. Tem de estar autenticado
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // 2. Verificação por role específica (usada em App.tsx: permitido={['ADMIN','RH']})
  if (permitido && (!role || !permitido.includes(role as Role))) {
    return <Navigate to="/acesso-negado" replace />;
  }

  // 3. Verificação por permissão de módulo/ação (RBAC granular)
  if (modulo && !pode(modulo, accao)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}