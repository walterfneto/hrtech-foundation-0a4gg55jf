import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { MyEvaluationRecord } from '@/services/my-evaluations'

interface Props {
  evaluation: MyEvaluationRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusLabels: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  in_progress: { label: 'Em Andamento', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Concluída', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

export function EvaluationDetailDialog({ evaluation, open, onOpenChange }: Props) {
  if (!evaluation) return null

  const responses = evaluation.responses
    ? typeof evaluation.responses === 'string'
      ? JSON.parse(evaluation.responses as string)
      : evaluation.responses
    : {}

  const cycle = evaluation.expand?.cycle
  const evaluator = evaluation.expand?.evaluator
  const status = statusLabels[evaluation.status] ?? statusLabels.pending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes da Avaliação</DialogTitle>
          <DialogDescription>
            {cycle?.title ?? 'Ciclo'} • Avaliador:{' '}
            {evaluator?.expand?.user?.name ?? evaluator?.job_title ?? 'N/A'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={status.class}>
              {status.label}
            </Badge>
            {evaluation.status === 'completed' && (
              <span className="text-sm font-semibold text-slate-700">
                Pontuação:{' '}
                <span className="text-primary">{evaluation.score?.toFixed(1) ?? 'N/A'}</span>
              </span>
            )}
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Respostas</h4>
            {Object.keys(responses).length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {Object.entries(responses).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-xs font-medium text-slate-500 mb-1">{key}</p>
                      <p className="text-sm text-slate-800">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhuma resposta registrada ainda.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
