import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Clock, Target, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import type { OneOnOneRecord } from '@/services/one-on-ones'

interface Props {
  oneOnOne: OneOnOneRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig: Record<string, { label: string; class: string }> = {
  planned: { label: 'Agendada', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Concluída', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelada', class: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export function OneOnOneDetailDialog({ oneOnOne, open, onOpenChange }: Props) {
  if (!oneOnOne) return null

  const manager = oneOnOne.expand?.manager
  const managerName = manager?.expand?.user?.name ?? manager?.job_title ?? 'Gestor'
  const status = statusConfig[oneOnOne.status] ?? statusConfig.planned
  const dateStr = oneOnOne.scheduled_at
    ? new Date(oneOnOne.scheduled_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'

  const deadlineStr = oneOnOne.action_deadline
    ? new Date(oneOnOne.action_deadline).toLocaleDateString('pt-BR')
    : null

  const fields = [
    {
      icon: Target,
      label: 'Objetivo / Finalidade',
      value: oneOnOne.objective,
      color: 'text-slate-600',
    },
    { icon: FileText, label: 'Motivo', value: oneOnOne.reason, color: 'text-slate-600' },
    {
      icon: TrendingUp,
      label: 'O que está bom',
      value: oneOnOne.positive_points,
      color: 'text-emerald-600',
    },
    {
      icon: TrendingDown,
      label: 'O que precisa melhorar',
      value: oneOnOne.improvement_points,
      color: 'text-amber-600',
    },
    {
      icon: FileText,
      label: 'Relatório da Reunião',
      value: oneOnOne.report,
      color: 'text-slate-600',
    },
  ].filter((f) => f.value)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Reunião 1:1</DialogTitle>
          <DialogDescription className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {dateStr}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {managerName}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Badge variant="outline" className={status.class}>
            {status.label}
          </Badge>
          {deadlineStr && (
            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Prazo para ser feito:</span> {deadlineStr}
            </div>
          )}
          {fields.map((f) => (
            <div key={f.label} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <f.icon className={`h-4 w-4 ${f.color}`} /> {f.label}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {f.value}
              </p>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              {oneOnOne.status === 'planned'
                ? 'Esta reunião ainda não possui conteúdo registrado. As informações aparecerão aqui após serem preenchidas pelo gestor.'
                : 'Sem informações registradas para esta reunião.'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
