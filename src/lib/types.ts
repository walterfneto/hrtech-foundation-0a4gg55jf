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

export interface EmployeeRecord {
  id: string
  user: string
  company: string
  team: string
  job_title: string
  department: string
  status: 'active' | 'inactive'
  role: string
  manager: string | null
  created: string
  updated: string
  expand?: {
    user: { id: string; name: string; email: string; avatar: string }
    team: { id: string; name: string }
    company: { id: string; name: string; slug: string }
    manager?: EmployeeRecord
  }
}

export interface EvaluationTemplateRecord {
  id: string
  name: string
  description: string
  questions: EvaluationQuestion[]
  company: string
  created: string
  updated: string
}

export interface EvaluationCycleRecord {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  status: 'draft' | 'active' | 'finished'
  company: string
  template: string
  created: string
  updated: string
  expand?: {
    template: EvaluationTemplateRecord
    company: { id: string; name: string }
  }
}

export interface EvaluationRecord {
  id: string
  cycle: string
  employee: string
  evaluator: string
  responses: Record<string, string | number>
  score: number
  potential: number
  status: 'pending' | 'in_progress' | 'completed'
  company: string
  created: string
  updated: string
  expand?: {
    cycle: EvaluationCycleRecord
    employee: EmployeeRecord
    evaluator: EmployeeRecord
  }
}

export interface TaskRecord {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'completed'
  assignee: string
  priority: 'low' | 'medium' | 'high'
  due_date: string
  company: string
  created: string
  updated: string
  expand?: { assignee: EmployeeRecord }
}

export interface FeedbackRecord {
  id: string
  sender: string
  receiver: string
  type: 'public_praise' | 'confidential_improvement' | '1_on_1'
  content: string
  tags: any
  company: string
  created: string
  updated: string
  expand?: { sender: EmployeeRecord; receiver: EmployeeRecord }
}

export interface PdiGoalRecord {
  id: string
  title: string
  description: string
  employee: string
  due_date: string
  status: 'todo' | 'in_progress' | 'completed'
  progress: number
  company: string
  created: string
  updated: string
}

export interface HRRequestRecord {
  id: string
  requester: string
  type: 'vacation' | 'refund' | 'bonus' | 'training'
  status: 'pending' | 'approved' | 'rejected'
  details: any
  company: string
  created: string
  updated: string
  expand?: { requester: EmployeeRecord }
}

export interface CandidateRecord {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  skills: string[]
  company: string
  created: string
  updated: string
}

export interface PulseSurveyRecord {
  id: string
  title: string
  questions: any[]
  active: boolean
  company: string
  created: string
  updated: string
}
