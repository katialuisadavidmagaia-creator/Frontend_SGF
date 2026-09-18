import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { LoginPayload, Utilizador } from '../types/auth.types';

interface AuthContextValue {
  utilizador: Utilizador | null;
  carregando: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  estaAutenticado: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  
  const [utilizador, setUtilizador] = useState<Utilizador | null>(
    authService.getUtilizadorAtual()
  );
  const [carregando, setCarregando] = useState(false);

  const login = useCallback(async (payload: LoginPayload) => {
    setCarregando(true);
    try {
      const resposta = await authService.login(payload);
      setUtilizador(resposta.utilizador ?? null);
    } finally {
      setCarregando(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUtilizador(null);
    authService.logout();
  }, []);

  return (
    <AuthContext.Provider
      value={{ utilizador, carregando, login, logout, estaAutenticado: !!utilizador }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}