import { cn } from '@/lib/utils'
import { FileText, MessageSquare, Target, CalendarDays, TrendingUp, Paperclip } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  evaluation: FileText,
  feedback: MessageSquare,
  goal: Target,
  meeting: CalendarDays,
  pdi: TrendingUp,
  document: Paperclip,
}

const COLOR_MAP: Record<string, string> = {
  evaluation: 'text-indigo-500',
  feedback: 'text-blue-500',
  goal: 'text-emerald-500',
  meeting: 'text-amber-500',
  pdi: 'text-purple-500',
  document: 'text-slate-500',
}

interface DossierTimelineProps {
  events: any[]
  selectedId: string
  onSelect: (id: string) => void
}

export function DossierTimeline({ events, selectedId, onSelect }: DossierTimelineProps) {
  return (
    <div className="flex flex-col">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h3 className="font-semibold text-sm">Linha do Tempo</h3>
        <p className="text-xs text-muted-foreground mt-1">{events.length} registros indexados</p>
      </div>
      {events.map((event) => {
        const Icon = ICON_MAP[event.type] || FileText
        const isSelected = selectedId === event.id
        const colorClass = COLOR_MAP[event.type] || 'text-slate-500'

        return (
          <button
            key={event.id}
            onClick={() => onSelect(event.id)}
            className={cn(
              'flex items-start gap-4 p-4 text-left border-b hover:bg-slate-100/50 transition-colors w-full',
              isSelected
                ? 'bg-slate-100/80 border-l-4 border-l-primary'
                : 'border-l-4 border-l-transparent',
            )}
          >
            <div className="mt-1 bg-white p-2 rounded-full shadow-sm border border-slate-200 shrink-0">
              <Icon className={cn('h-4 w-4', colorClass)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-medium truncate text-slate-900">{event.title}</h4>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">{event.module}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{event.date}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
