import type { Usuario, Time, OrgNode } from '@/lib/types'

const AV = (g: string, s: number) =>
  `https://img.usecurling.com/ppl/thumbnail?gender=${g}&seed=${s}`

export const MOCK_TEAMS: Time[] = [
  {
    id: 't-1',
    nome: 'Recursos Humanos',
    descricao: 'Departamento de RH',
    time_pai_id: null,
    manager_id: 'u-1',
    empresa_id: 'emp-1',
    deleted_at: null,
  },
  {
    id: 't-2',
    nome: 'Engenharia',
    descricao: 'Time de engenharia de software',
    time_pai_id: null,
    manager_id: 'u-2',
    empresa_id: 'emp-1',
    deleted_at: null,
  },
  {
    id: 't-3',
    nome: 'Design',
    descricao: 'Time de design de produto',
    time_pai_id: null,
    manager_id: 'u-3',
    empresa_id: 'emp-1',
    deleted_at: null,
  },
  {
    id: 't-4',
    nome: 'Marketing',
    descricao: 'Time de marketing',
    time_pai_id: null,
    manager_id: 'u-7',
    empresa_id: 'emp-1',
    deleted_at: null,
  },
]

export const MOCK_ORG_USERS: Usuario[] = [
  {
    id: 'u-1',
    nome: 'Ana Moura',
    email: 'ana@caminho.com.br',
    papel_sistema: 'Admin RH',
    cargo: 'Diretora de RH',
    departamento: 'RH',
    manager_id: null,
    team_id: 't-1',
    empresa_id: 'emp-1',
    avatar_url: AV('female', 1),
    status: 'Ativo',
    deleted_at: null,
  },
  {
    id: 'u-2',
    nome: 'Roberto Lima',
    email: 'roberto@caminho.com.br',
    papel_sistema: 'Gestor',
    cargo: 'Tech Lead',
    departamento: 'Engenharia',
    manager_id: 'u-1',
    team_id: 't-2',
    empresa_id: 'emp-1',
    avatar_url: AV('male', 4),
    status: 'Ativo',
    deleted_at: null,
  },
  {
    id: 'u-3',
    nome: 'Mariana Costa',
    email: 'mariana@caminho.com.br',
    papel_sistema: 'Gestor',
    cargo: 'Head de Design',
    departamento: 'Design',
    manager_id: 'u-1',
    team_id: 't-3',
    empresa_id: 'emp-1',
    avatar_url: AV('female', 3),
    status: 'Ativo',
    deleted_at: null,
  },
  {
    id: 'u-4',
    nome: 'Carlos Santos',
    email: 'carlos@caminho.com.br',
    papel_sistema: 'Colaborador',
    cargo: 'Engenheiro de Software',
    departamento: 'Engenharia',
    manager_id: 'u-2',
    team_id: 't-2',
    empresa_id: 'emp-1',
    avatar_url: AV('male', 2),
    status: 'Ativo',
    deleted_at: null,
  },
  {
    id: 'u-5',
    nome: 'Juliana Silva',
    email: 'juliana@caminho.com.br',
    papel_sistema: 'Colaborador',
    cargo: 'Analista de Dados',
    departamento: 'Engenharia',
    manager_id: 'u-2',
    team_id: 't-2',
    empresa_id: 'emp-1',
    avatar_url: AV('female', 5),
    status: 'Férias',
    deleted_at: null,
  },
  {
    id: 'u-6',
    nome: 'Carlos Mendes',
    email: 'cmendes@caminho.com.br',
    papel_sistema: 'Colaborador',
    cargo: 'Designer Jr',
    departamento: 'Design',
    manager_id: 'u-3',
    team_id: 't-3',
    empresa_id: 'emp-1',
    avatar_url: AV('male', 6),
    status: 'Ativo',
    deleted_at: null,
  },
  {
    id: 'u-7',
    nome: 'Beatriz Lima',
    email: 'beatriz@caminho.com.br',
    papel_sistema: 'Gestor',
    cargo: 'Head de Marketing',
    departamento: 'Marketing',
    manager_id: 'u-1',
    team_id: 't-4',
    empresa_id: 'emp-1',
    avatar_url: AV('female', 7),
    status: 'Ativo',
    deleted_at: null,
  },
]

export function buildOrgTree(users: Usuario[]): OrgNode | null {
  const roots = users.filter((u) => !u.manager_id)
  if (roots.length === 0) return null

  function buildNode(user: Usuario): OrgNode {
    const children = users.filter((u) => u.manager_id === user.id).map(buildNode)
    return { ...user, children }
  }

  return buildNode(roots[0])
}
