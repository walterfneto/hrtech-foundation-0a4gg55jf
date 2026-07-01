export type PapelSistema = 'Admin RH' | 'Gestor' | 'Colaborador' | 'Super Admin'

export interface Usuario {
  id: string
  nome: string
  email: string
  papel_sistema: PapelSistema
  cargo: string
  departamento: string
  manager_id: string | null
  team_id: string | null
  empresa_id: string
  avatar_url: string | null
  status: 'Ativo' | 'Inativo' | 'Férias'
  deleted_at: string | null
}

export interface Time {
  id: string
  nome: string
  descricao: string
  time_pai_id: string | null
  manager_id: string | null
  empresa_id: string
  deleted_at: string | null
}

export interface OrgNode extends Usuario {
  children: OrgNode[]
}

export type QuestionType = 'rating' | 'multiple_choice' | 'text'

export interface EvaluationQuestion {
  id: string
  type: QuestionType
  label: string
  description?: string
  required: boolean
  options?: string[]
  scaleMax?: number
}

export interface EvaluationTemplate {
  id: string
  nome: string
  descricao: string
  questions: EvaluationQuestion[]
  empresa_id: string
  created_at: string
  deleted_at: string | null
}

export type CycleStatus = 'rascunho' | 'ativo' | 'encerrado'

export interface EvaluationCycle {
  id: string
  nome: string
  template_id: string
  data_inicio: string
  data_fim: string
  target: 'empresa' | 'times'
  target_teams: string[]
  status: CycleStatus
  empresa_id: string
  created_at: string
  deleted_at: string | null
}

export type ResponseStatus = 'nao_iniciado' | 'rascunho' | 'concluido'

export interface EvaluationResponse {
  id: string
  cycle_id: string
  template_id: string
  user_id: string
  user_name: string
  user_avatar: string
  status: ResponseStatus
  submitted_at: string | null
}
