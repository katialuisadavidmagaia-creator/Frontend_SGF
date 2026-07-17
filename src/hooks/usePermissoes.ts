import { useMemo } from 'react';
import { temPermissao } from '../shared/permissoes.ts';
import type { Role, Modulo, Accao } from '../shared/permissoes.ts';

function lerPayloadJWT(token: string): { id: number; email: string; role: Role } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function usePermissoes() {
  const payload = useMemo(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return lerPayloadJWT(token);
  }, []);

  const role: Role = payload?.role ?? 'FUNCIONARIO';

  return {
    role,
    pode: (modulo: Modulo, accao: Accao) => temPermissao(role, modulo, accao),
    isAdmin: role === 'ADMIN',
    isRH: role === 'RH',
    isUtilizador: role === 'FUNCIONARIO',
  };
}