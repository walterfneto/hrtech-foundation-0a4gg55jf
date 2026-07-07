import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, CheckSquare, ListChecks, FileText } from 'lucide-react'
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

  const notes = oneOnOne.notes
    ? typeof oneOnOne.notes === 'string'
      ? JSON.parse(oneOnOne.notes as string)
      : oneOnOne.notes
    : {}

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

          {notes.summary && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Resumo
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{notes.summary}</p>
            </div>
          )}

          {notes.agenda && Array.isArray(notes.agenda) && notes.agenda.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" /> Pauta
              </h4>
              <ul className="space-y-1.5">
                {notes.agenda.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notes.action_items &&
            Array.isArray(notes.action_items) &&
            notes.action_items.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-emerald-600" /> Itens de Ação
                </h4>
                <ul className="space-y-1.5">
                  {notes.action_items.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="w-4 h-4 rounded border border-emerald-300 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {!notes.summary && !notes.agenda && !notes.action_items && (
            <p className="text-sm text-muted-foreground italic">
              {oneOnOne.status === 'planned'
                ? 'Esta reunião ainda não possui notas. As notas aparecerão aqui após a conclusão.'
                : 'Sem notas registradas para esta reunião.'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
