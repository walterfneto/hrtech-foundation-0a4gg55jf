import type { Usuario, EvaluationTemplate, EvaluationCycle } from '@/lib/types'
import { MOCK_ORG_USERS, MOCK_TEAMS } from '@/lib/org-data'
import { MOCK_TEMPLATES, MOCK_CYCLES, MOCK_RESPONSES } from '@/lib/evaluation-data'

const DEFAULT_EMPRESA = 'emp-1'

export async function fetchUsers(empresaId: string = DEFAULT_EMPRESA): Promise<Usuario[]> {
  return MOCK_ORG_USERS.filter((u) => u.empresa_id === empresaId && !u.deleted_at)
}

export async function fetchTeams(empresaId: string = DEFAULT_EMPRESA) {
  return MOCK_TEAMS.filter((t) => t.empresa_id === empresaId && !t.deleted_at)
}

export async function fetchTemplates(empresaId: string = DEFAULT_EMPRESA) {
  return MOCK_TEMPLATES.filter((t) => t.empresa_id === empresaId && !t.deleted_at)
}

export async function fetchCycles(empresaId: string = DEFAULT_EMPRESA) {
  return MOCK_CYCLES.filter((c) => c.empresa_id === empresaId && !c.deleted_at)
}

export async function fetchResponses(cycleId: string) {
  return MOCK_RESPONSES.filter((r) => r.cycle_id === cycleId)
}

export async function createTemplate(
  data: Omit<EvaluationTemplate, 'id' | 'created_at' | 'deleted_at' | 'empresa_id'>,
  empresaId: string = DEFAULT_EMPRESA,
): Promise<EvaluationTemplate> {
  const tpl: EvaluationTemplate = {
    ...data,
    id: `tpl-${Date.now()}`,
    empresa_id: empresaId,
    created_at: new Date().toISOString(),
    deleted_at: null,
  }
  MOCK_TEMPLATES.push(tpl)
  return tpl
}

export async function createCycle(
  data: Omit<EvaluationCycle, 'id' | 'created_at' | 'deleted_at' | 'empresa_id' | 'status'>,
  empresaId: string = DEFAULT_EMPRESA,
): Promise<EvaluationCycle> {
  const cycle: EvaluationCycle = {
    ...data,
    id: `cyc-${Date.now()}`,
    empresa_id: empresaId,
    status: 'ativo',
    created_at: new Date().toISOString(),
    deleted_at: null,
  }
  MOCK_CYCLES.push(cycle)
  return cycle
}

export async function importUsers(
  users: Array<{
    nome: string
    email: string
    cargo: string
    departamento: string
    manager_nome?: string
  }>,
  empresaId: string = DEFAULT_EMPRESA,
): Promise<number> {
  users.forEach((u, i) => {
    const manager = MOCK_ORG_USERS.find((m) => m.nome === u.manager_nome)
    MOCK_ORG_USERS.push({
      id: `usr-${Date.now()}-${i}`,
      nome: u.nome,
      email: u.email,
      papel_sistema: 'Colaborador',
      cargo: u.cargo,
      departamento: u.departamento,
      manager_id: manager?.id ?? null,
      team_id: null,
      empresa_id: empresaId,
      avatar_url: null,
      status: 'Ativo',
      deleted_at: null,
    })
  })
  return users.length
}
