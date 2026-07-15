import { Badge } from '@/components/ui/badge'
import type { DossierEvent } from '@/services/dossier'

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

export function DossierPreview({ event }: { event: DossierEvent }) {
  const isPdf = event.fileUrl?.toLowerCase().endsWith('.pdf')
  const isImage = event.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2 border-b pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-50 uppercase tracking-wider text-[10px]">
            {event.module}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
          >
            {STATUS_LABELS[event.status] || event.status}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{event.title}</h2>
        <p className="text-sm text-muted-foreground">
          Registrado em {event.date} • {event.author}
        </p>
      </div>

      <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-sm">
        <p className="whitespace-pre-wrap">{event.content}</p>
      </div>

      {event.type === 'evaluation' && event.raw && (
        <div className="mt-8 bg-slate-50 border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">Resumo de Competências</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nota Final</span>
              <span className="font-medium text-emerald-600">
                {event.raw.score?.toFixed(1) ?? 'N/A'} / 5.0
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Potencial</span>
              <span className="font-medium text-indigo-600">
                {event.raw.potential?.toFixed(1) ?? 'N/A'} / 5.0
              </span>
            </div>
          </div>
        </div>
      )}

      {event.type === 'feedback' && event.raw && (
        <div className="mt-6 space-y-4">
          {event.raw.context && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-1 text-blue-900">Contexto</h4>
              <p className="text-sm text-blue-800">{event.raw.context}</p>
            </div>
          )}
          {event.raw.impact && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-1 text-amber-900">Impacto</h4>
              <p className="text-sm text-amber-800">{event.raw.impact}</p>
            </div>
          )}
          {event.raw.action_plan && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-1 text-emerald-900">Plano de Ação</h4>
              <p className="text-sm text-emerald-800">{event.raw.action_plan}</p>
            </div>
          )}
        </div>
      )}

      {event.type === 'meeting' && event.raw && (
        <div className="mt-6 space-y-4">
          {event.raw.positive_points && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-1 text-emerald-900">Pontos Positivos</h4>
              <p className="text-sm text-emerald-800">{event.raw.positive_points}</p>
            </div>
          )}
          {event.raw.improvement_points && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-1 text-amber-900">Pontos de Melhoria</h4>
              <p className="text-sm text-amber-800">{event.raw.improvement_points}</p>
            </div>
          )}
        </div>
      )}

      {event.type === 'document' && event.fileUrl && (
        <div className="mt-6">
          <h4 className="font-semibold text-sm mb-3">Visualização do Documento</h4>
          {isPdf ? (
            <iframe
              src={event.fileUrl}
              className="w-full h-[600px] border rounded-lg bg-slate-50"
              title={event.title}
            />
          ) : isImage ? (
            <img
              src={event.fileUrl}
              alt={event.title}
              className="max-w-full rounded-lg border shadow-sm"
            />
          ) : (
            <a
              href={event.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Baixar arquivo
            </a>
          )}
        </div>
      )}
    </div>
  )
}
