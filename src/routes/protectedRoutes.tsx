import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authcontext'; // Ajuste o caminho se necessário

interface ProtectedRouteProps {
  permitido?: string[];
}

export function ProtectedRoute({ permitido }: ProtectedRouteProps) {
  const { utilizador } = useAuth();

  // 1. Verifica token diretamente do localStorage para não depender apenas do estado do React
  const token = localStorage.getItem('token');
  const userStorage = localStorage.getItem('user');
  const userLocal = userStorage ? JSON.parse(userStorage) : null;

  const user = utilizador || userLocal;
  const estaAutenticado = Boolean(token);

  console.log('[ProtectedRoute] Check:', {
    pathname: window.location.pathname,
    estaAutenticado,
    user
  });

  if (!estaAutenticado) {
    console.log('[ProtectedRoute] -> redirect /login (não autenticado)');
    return <Navigate to="/login" replace />;
  }

  if (permitido && permitido.length > 0) {
    const userRole = user?.role || user?.tipo || user?.perfil;

    if (!userRole || !permitido.includes(userRole)) {
      console.log('[ProtectedRoute] -> redirect /acesso-negado');
      return <Navigate to="/acesso-negado" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;