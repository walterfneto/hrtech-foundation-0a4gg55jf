import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EVALUATION_STATUS } from '@/lib/status'
import type { MyEvaluationRecord } from '@/services/my-evaluations'

interface Props {
  evaluation: MyEvaluationRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
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
  const statusCfg = EVALUATION_STATUS[evaluation.status] ?? EVALUATION_STATUS.pending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] shadow-elevation">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Detalhes da Avaliação
          </DialogTitle>
          <DialogDescription>
            {cycle?.title ?? 'Ciclo'} • Avaliador:{' '}
            {evaluator?.expand?.user?.name ?? evaluator?.job_title ?? 'N/A'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`${statusCfg.bg} ${statusCfg.text}`}>
              {statusCfg.label}
            </Badge>
            {evaluation.status === 'completed' && (
              <span className="text-sm font-medium text-muted-foreground">
                Pontuação:{' '}
                <span className="text-primary">{evaluation.score?.toFixed(1) ?? 'N/A'}</span>
              </span>
            )}
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Respostas</h4>
            {Object.keys(responses).length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {Object.entries(responses).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 rounded-lg p-3 border">
                      <p className="text-xs font-medium text-muted-foreground mb-1">{key}</p>
                      <p className="text-sm text-foreground">{String(value)}</p>
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
