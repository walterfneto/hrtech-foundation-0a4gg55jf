import pb from '@/lib/pocketbase/client'
import type {
  Usuario,
  Time,
  EvaluationTemplate,
  EvaluationCycle,
  EvaluationResponse,
  EvaluationQuestion,
} from '@/lib/types'
import { getCurrentCompanyId, getAvatarUrl } from '@/services/helpers'

function mapEmployeeToUsuario(emp: any): Usuario {
  const user = emp.expand?.user
  return {
    id: emp.id,
    nome: user?.name ?? '',
    email: user?.email ?? '',
    papel_sistema: emp.role ?? 'Colaborador',
    cargo: emp.job_title ?? '',
    departamento: emp.department ?? '',
    manager_id: emp.manager ?? null,
    team_id: emp.team ?? null,
    empresa_id: emp.company ?? '',
    avatar_url: user ? getAvatarUrl(user) : null,
    status: emp.status === 'active' ? 'Ativo' : 'Inativo',
    deleted_at: null,
  }
}

function mapTeamToTime(team: any): Time {
  return {
    id: team.id,
    nome: team.name,
    descricao: team.name,
    time_pai_id: team.parent_team ?? null,
    manager_id: null,
    empresa_id: team.company,
    deleted_at: null,
  }
}

function mapTemplate(tpl: any): EvaluationTemplate {
  let questions: EvaluationQuestion[] = []
  try {
    const raw = typeof tpl.questions === 'string' ? JSON.parse(tpl.questions) : tpl.questions
    questions = Array.isArray(raw) ? raw : []
  } catch {
    questions = []
  }
  return {
    id: tpl.id,
    nome: tpl.name,
    descricao: tpl.description ?? '',
    questions,
    empresa_id: tpl.company,
    created_at: tpl.created,
    deleted_at: null,
  }
}

function mapCycle(cyc: any): EvaluationCycle {
  const statusMap: Record<string, CycleStatus> = {
    draft: 'rascunho',
    active: 'ativo',
    finished: 'encerrado',
  }
  return {
    id: cyc.id,
    nome: cyc.title,
    template_id: cyc.template ?? cyc.expand?.template?.id ?? '',
    data_inicio: cyc.start_date,
    data_fim: cyc.end_date,
    target: 'empresa',
    target_teams: [],
    status: statusMap[cyc.status] ?? 'rascunho',
    empresa_id: cyc.company,
    created_at: cyc.created,
    deleted_at: null,
  }
}

type CycleStatus = 'rascunho' | 'ativo' | 'encerrado'

function mapEvaluation(ev: any): EvaluationResponse {
  const statusMap: Record<string, ResponseStatus> = {
    pending: 'nao_iniciado',
    in_progress: 'rascunho',
    completed: 'concluido',
  }
  const emp = ev.expand?.employee
  const user = emp?.expand?.user
  return {
    id: ev.id,
    cycle_id: ev.cycle,
    template_id: ev.expand?.cycle?.template ?? '',
    user_id: ev.employee,
    user_name: user?.name ?? emp?.job_title ?? 'Colaborador',
    user_avatar: user ? getAvatarUrl(user) : '',
    status: statusMap[ev.status] ?? 'nao_iniciado',
    submitted_at: ev.status === 'completed' ? ev.updated : null,
  }
}

type ResponseStatus = 'nao_iniciado' | 'rascunho' | 'concluido'

export async function fetchUsers(): Promise<Usuario[]> {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  const employees = await pb.collection('employees').getFullList({
    filter: `company="${cid}"`,
    expand: 'user,team,company,manager',
    sort: 'created',
  })
  return employees.map(mapEmployeeToUsuario)
}

export async function fetchTeams() {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  const teams = await pb.collection('teams').getFullList({
    filter: `company="${cid}"`,
    sort: 'created',
  })
  return teams.map(mapTeamToTime)
}

export async function fetchTemplates() {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  const templates = await pb.collection('evaluation_templates').getFullList({
    filter: `company="${cid}"`,
    sort: '-created',
  })
  return templates.map(mapTemplate)
}

export async function fetchCycles() {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  const cycles = await pb.collection('evaluation_cycles').getFullList({
    filter: `company="${cid}"`,
    expand: 'template',
    sort: '-created',
  })
  return cycles.map(mapCycle)
}

export async function fetchResponses(cycleId: string) {
  const evaluations = await pb.collection('evaluations').getFullList({
    filter: `cycle="${cycleId}"`,
    expand: 'employee.user,cycle',
    sort: 'created',
  })
  return evaluations.map(mapEvaluation)
}

export async function createTemplate(
  data: Omit<EvaluationTemplate, 'id' | 'created_at' | 'deleted_at' | 'empresa_id'>,
) {
  const cid = getCurrentCompanyId()
  return pb.collection('evaluation_templates').create({
    name: data.nome,
    description: data.descricao,
    questions: JSON.stringify(data.questions),
    company: cid,
  })
}

export async function createCycle(
  data: Omit<EvaluationCycle, 'id' | 'created_at' | 'deleted_at' | 'empresa_id' | 'status'>,
) {
  const cid = getCurrentCompanyId()
  const statusMap = { rascunho: 'draft', ativo: 'active', encerrado: 'finished' }
  return pb.collection('evaluation_cycles').create({
    title: data.nome,
    description: '',
    start_date: data.data_inicio,
    end_date: data.data_fim,
    status: 'draft',
    company: cid,
    template: data.template_id,
  })
}

export async function importUsers(
  users: Array<{
    nome: string
    email: string
    cargo: string
    departamento: string
    manager_nome?: string
  }>,
): Promise<number> {
  const cid = getCurrentCompanyId()
  let count = 0
  for (const u of users) {
    try {
      let authUser
      try {
        authUser = await pb.collection('users').getFirstListItem(`email="${u.email}"`)
      } catch {
        authUser = await pb.collection('users').create({
          email: u.email,
          password: 'Skip@Pass',
          passwordConfirm: 'Skip@Pass',
          name: u.nome,
          company: cid,
        })
      }
      await pb.collection('employees').create({
        user: authUser.id,
        company: cid,
        team: '',
        job_title: u.cargo,
        department: u.departamento,
        status: 'active',
        role: 'Colaborador',
      })
      count++
    } catch (err) {
      console.error('Failed to import user:', u.email, err)
    }
  }
  return count
}
