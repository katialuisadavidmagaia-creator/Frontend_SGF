import { useMemo } from 'react';
import { useAuth } from '../context/authcontext';
import { Role } from '../types/auth.types';

type Accao = 'ver' | 'criar' | 'editar' | 'eliminar';

const MATRIZ_PERMISSOES: Record<Role, Record<string, Accao[]>> = {
  ADMIN: {
    funcionarios: ['ver', 'criar', 'editar', 'eliminar'],
    departamentos: ['ver', 'criar', 'editar', 'eliminar'],
    projetos: ['ver', 'criar', 'editar', 'eliminar'],
    relatorios: ['ver', 'criar', 'editar', 'eliminar'],
    exportacoes: ['ver', 'criar', 'editar', 'eliminar'],
    utilizadores: ['ver', 'criar', 'editar', 'eliminar'],
  },

  RH: {
    funcionarios: ['ver', 'criar', 'editar'],
    departamentos: ['ver'],
    projetos: ['ver', 'criar', 'editar'],
    relatorios: ['ver', 'criar'],
    exportacoes: ['ver', 'criar'],
    utilizadores: ['ver'],
  },

  FUNCIONARIO: {
    funcionarios: ['ver'],
    departamentos: ['ver'],
    projetos: ['ver'],
    relatorios: ['ver'],
    exportacoes: [],
    utilizadores: [],
  },
};

export function usePermissoes() {
  const { utilizador } = useAuth();

  const pode = useMemo(() => {
    return (modulo: string, accao: Accao): boolean => {
      if (!utilizador) return false;

      const acoesPermitidas =
        MATRIZ_PERMISSOES[utilizador.role]?.[modulo] ?? [];

      return acoesPermitidas.includes(accao);
    };
  }, [utilizador]);

  return {
    role: utilizador?.role ?? null,
    pode,
    isAdmin: utilizador?.role === 'ADMIN',
    isRH: utilizador?.role === 'RH',
    isUtilizador: utilizador?.role === 'FUNCIONARIO',
    id: utilizador?.id ?? null,
    email: utilizador?.email ?? null,
  };
}