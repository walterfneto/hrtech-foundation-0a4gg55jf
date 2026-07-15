import { cn } from '@/lib/utils'
import { FileText, MessageSquare, CalendarDays, Paperclip, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import type { DossierEvent } from '@/services/dossier'

const ICON_MAP: Record<string, any> = {
  evaluation: FileText,
  feedback: MessageSquare,
  meeting: CalendarDays,
  pdi: TrendingUp,
  document: Paperclip,
}

const COLOR_MAP: Record<string, string> = {
  evaluation: 'text-indigo-500',
  feedback: 'text-blue-500',
  meeting: 'text-amber-500',
  pdi: 'text-purple-500',
  document: 'text-slate-500',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
  planned: 'Planejado',
  cancelled: 'Cancelado',
  improved: 'Melhorou',
  no_change: 'Sem Mudança',
  Arquivado: 'Arquivado',
}

interface DossierTimelineProps {
  events: DossierEvent[]
  selectedId: string
  onSelect: (id: string) => void
}

export function DossierTimeline({ events, selectedId, onSelect }: DossierTimelineProps) {
  const groups: Record<string, DossierEvent[]> = {}
  for (const event of events) {
    const key = format(new Date(event.dateValue), "MMMM 'de' yyyy", { locale: ptBR })
    if (!groups[key]) groups[key] = []
    groups[key].push(event)
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h3 className="font-semibold text-sm">Linha do Tempo</h3>
        <p className="text-xs text-muted-foreground mt-1">{events.length} registros indexados</p>
      </div>
      {Object.entries(groups).map(([monthYear, monthEvents]) => (
        <div key={monthYear}>
          <div className="px-4 py-2 bg-slate-100/70 border-b border-l-2 border-l-slate-300">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {monthYear}
            </span>
          </div>
          {monthEvents.map((event) => {
            const Icon = ICON_MAP[event.type] || FileText
            const isSelected = selectedId === event.id
            const colorClass = COLOR_MAP[event.type] || 'text-slate-500'
            return (
              <HoverCard key={event.id} openDelay={400} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <button
                    onClick={() => onSelect(event.id)}
                    className={cn(
                      'flex items-start gap-3 p-3 text-left border-b hover:bg-slate-100/50 transition-colors w-full',
                      isSelected
                        ? 'bg-slate-100/80 border-l-4 border-l-primary'
                        : 'border-l-4 border-l-transparent',
                    )}
                  >
                    <div className="mt-0.5 bg-white p-1.5 rounded-full shadow-sm border border-slate-200 shrink-0">
                      <Icon className={cn('h-3.5 w-3.5', colorClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium truncate text-slate-900">{event.title}</h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {event.module}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{event.date}</p>
                    </div>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 text-xs" side="right" align="start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className={cn('h-4 w-4', colorClass)} />
                      <span className="font-semibold text-sm">{event.title}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-4">{event.content}</p>
                    {event.fileUrl && (
                      <p className="text-blue-600 font-medium flex items-center gap-1">
                        <Paperclip className="h-3 w-3" /> Arquivo anexo disponível
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 pt-1 border-t">
                      {event.module} • {STATUS_LABELS[event.status] || event.status}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )
          })}
        </div>
      ))}
    </div>
  )
}
