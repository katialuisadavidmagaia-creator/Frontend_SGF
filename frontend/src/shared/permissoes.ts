export type Role = 'ADMIN' | 'RH' | 'FUNCIONARIO';

export type Modulo =
  | 'funcionarios'
  | 'relatorios'
  | 'exportacoes'
  | 'utilizadores';

export type Accao = 'ver' | 'criar' | 'editar' | 'eliminar';

export const permissoes: Record<Modulo, Record<Accao, Role[]>> = {
  funcionarios: {
    ver:      ['ADMIN', 'RH', 'FUNCIONARIO'],
    criar:    ['ADMIN', 'RH'],
    editar:   ['ADMIN', 'RH'],
    eliminar: ['ADMIN'],
  },
  relatorios: {
    ver:      ['ADMIN', 'RH'],
    criar:    ['ADMIN'],
    editar:   ['ADMIN'],
    eliminar: ['ADMIN'],
  },
  exportacoes: {
    ver:      ['ADMIN', 'RH'],
    criar:    ['ADMIN', 'RH'],
    editar:   ['ADMIN'],
    eliminar: ['ADMIN'],
  },
  utilizadores: {
    ver:      ['ADMIN'],
    criar:    ['ADMIN'],
    editar:   ['ADMIN'],
    eliminar: ['ADMIN'],
  },
};

export function temPermissao(role: Role, modulo: Modulo, accao: Accao): boolean {
  return permissoes[modulo]?.[accao]?.includes(role) ?? false;
}