import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Clock, Target, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { ONE_ON_ONE_STATUS } from '@/lib/status'
import type { OneOnOneRecord } from '@/services/one-on-ones'

interface Props {
  oneOnOne: OneOnOneRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OneOnOneDetailDialog({ oneOnOne, open, onOpenChange }: Props) {
  if (!oneOnOne) return null

  const manager = oneOnOne.expand?.manager
  const managerName = manager?.expand?.user?.name ?? manager?.job_title ?? 'Gestor'
  const statusCfg = ONE_ON_ONE_STATUS[oneOnOne.status] ?? ONE_ON_ONE_STATUS.planned
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
      color: 'text-muted-foreground',
    },
    { icon: FileText, label: 'Motivo', value: oneOnOne.reason, color: 'text-muted-foreground' },
    {
      icon: TrendingUp,
      label: 'O que está bom',
      value: oneOnOne.positive_points,
      color: 'text-primary',
    },
    {
      icon: TrendingDown,
      label: 'O que precisa melhorar',
      value: oneOnOne.improvement_points,
      color: 'text-warning',
    },
    {
      icon: FileText,
      label: 'Relatório da Reunião',
      value: oneOnOne.report,
      color: 'text-muted-foreground',
    },
  ].filter((f) => f.value)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto shadow-elevation">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Reunião 1:1</DialogTitle>
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
          <Badge variant="outline" className={`${statusCfg.bg} ${statusCfg.text}`}>
            {statusCfg.label}
          </Badge>
          {deadlineStr && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">Prazo para ser feito:</span> {deadlineStr}
            </div>
          )}
          {fields.map((f) => (
            <div key={f.label} className="bg-muted/50 rounded-lg p-4 border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <f.icon className={`h-4 w-4 ${f.color}`} /> {f.label}
              </h4>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
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
