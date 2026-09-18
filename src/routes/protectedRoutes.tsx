import { Navigate, Outlet, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  console.log('[ProtectedRoute]', {
    pathname: location.pathname,
    estaAutenticado,
    role,
    permitido,
    modulo,
    accao,
    podeResultado: modulo ? pode(modulo, accao) : 'N/A',
  });

  // 1. Tem de estar autenticado
  if (!estaAutenticado) {
    console.log('[ProtectedRoute] → redirect /login (não autenticado)');
    return <Navigate to="/login" replace />;
  }

  // 2. Verificação por role específica (usada em App.tsx: permitido={['ADMIN','RH']})
  if (permitido && (!role || !permitido.includes(role as Role))) {
    console.log('[ProtectedRoute] → redirect /acesso-negado (role não permitido)');
    return <Navigate to="/acesso-negado" replace />;
  }

  // 3. Verificação por permissão de módulo/ação (RBAC granular)
  if (modulo && !pode(modulo, accao)) {
    console.log('[ProtectedRoute] → redirect /acesso-negado (sem permissão de módulo)');
    return <Navigate to="/acesso-negado" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}