import { Badge } from '@/components/ui/badge'

export function DossierPreview({ event }: { event: any }) {
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
            {event.status}
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

      {event.type === 'evaluation' && (
        <div className="mt-8 bg-slate-50 border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">Resumo de Competências</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Trabalho em Equipe</span>
              <span className="font-medium text-emerald-600">4.5 / 5.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Comunicação</span>
              <span className="font-medium text-slate-700">4.0 / 5.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gestão de Tempo</span>
              <span className="font-medium text-amber-600">3.0 / 5.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
