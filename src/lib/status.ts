export type StatusCategory = 'positive' | 'neutral' | 'warning' | 'critical' | 'info'

export interface StatusConfig {
  label: string
  category: StatusCategory
}

export const STATUS_STYLES: Record<StatusCategory, { text: string; bg: string }> = {
  positive: { text: 'text-primary', bg: 'bg-primary/8' },
  neutral: { text: 'text-muted-foreground', bg: 'bg-muted' },
  warning: { text: 'text-warning', bg: 'bg-warning/8' },
  critical: { text: 'text-destructive', bg: 'bg-destructive/8' },
  info: { text: 'text-foreground', bg: 'bg-accent' },
}

export const EVALUATION_STATUS: Record<string, StatusConfig> = {
  pending: { label: 'Pendente', category: 'warning' },
  in_progress: { label: 'Em Andamento', category: 'neutral' },
  completed: { label: 'Concluída', category: 'positive' },
}

export const CYCLE_STATUS: Record<string, StatusConfig> = {
  draft: { label: 'Rascunho', category: 'neutral' },
  active: { label: 'Ativo', category: 'positive' },
  finished: { label: 'Encerrado', category: 'info' },
}

export const ONE_ON_ONE_STATUS: Record<string, StatusConfig> = {
  planned: { label: 'Agendada', category: 'info' },
  completed: { label: 'Concluída', category: 'positive' },
  cancelled: { label: 'Cancelada', category: 'critical' },
}

export const TASK_STATUS: Record<string, StatusConfig> = {
  todo: { label: 'A Fazer', category: 'neutral' },
  in_progress: { label: 'Em Progresso', category: 'warning' },
  completed: { label: 'Concluído', category: 'positive' },
}

export const IMPROVEMENT_STATUS: Record<string, StatusConfig> = {
  pending: { label: 'Aguardando', category: 'warning' },
  in_progress: { label: 'Em Progresso', category: 'neutral' },
  improved: { label: 'Melhorou', category: 'positive' },
  no_change: { label: 'Sem Mudança', category: 'critical' },
}

export const CANDIDATE_STATUS: Record<string, StatusConfig> = {
  screening: { label: 'Triagem', category: 'neutral' },
  interview: { label: 'Entrevista', category: 'info' },
  offer: { label: 'Proposta', category: 'warning' },
  hired: { label: 'Contratado', category: 'positive' },
  rejected: { label: 'Rejeitado', category: 'critical' },
}

export const HR_REQUEST_STATUS: Record<string, StatusConfig> = {
  pending: { label: 'Pendente', category: 'warning' },
  approved: { label: 'Aprovado', category: 'positive' },
  rejected: { label: 'Rejeitado', category: 'critical' },
}

export const EMPLOYEE_STATUS: Record<string, StatusConfig> = {
  active: { label: 'Ativo', category: 'positive' },
  inactive: { label: 'Inativo', category: 'neutral' },
}

export function getStatusStyle(category: StatusCategory) {
  return STATUS_STYLES[category]
}

export function getStatusBadgeClass(category: StatusCategory): string {
  const style = STATUS_STYLES[category]
  return `${style.bg} ${style.text}`
}
