import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { EvaluationTemplate } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: EvaluationTemplate
  cycleName: string
  targetUserName: string
}

export function EvaluationFormDialog({
  open,
  onOpenChange,
  template,
  cycleName,
  targetUserName,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({})

  const setAns = (qid: string, val: string | number) => setAnswers((a) => ({ ...a, [qid]: val }))

  const handleSubmit = () => {
    const unanswered = template.questions.filter((q) => q.required && !(q.id in answers))
    if (unanswered.length > 0) {
      toast.error(`${unanswered.length} perguntas obrigatórias pendentes`)
      return
    }
    toast.success('Avaliação enviada com sucesso!')
    setAnswers({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.nome}</DialogTitle>
          <DialogDescription>
            {cycleName} • Avaliando:{' '}
            <span className="font-medium text-slate-700">{targetUserName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {template.questions.map((q, i) => (
            <div key={q.id} className="space-y-3 border-b pb-4 last:border-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Label className="text-sm font-semibold">
                    {i + 1}. {q.label}
                    {q.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {q.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{q.description}</p>
                  )}
                </div>
              </div>

              {q.type === 'rating' && (
                <div className="px-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">1</span>
                    <span className="text-sm font-bold text-primary">{answers[q.id] ?? '-'}</span>
                    <span className="text-xs text-muted-foreground">{q.scaleMax ?? 5}</span>
                  </div>
                  <Slider
                    min={1}
                    max={q.scaleMax ?? 5}
                    step={1}
                    value={[Number(answers[q.id] ?? 1)]}
                    onValueChange={([v]) => setAns(q.id, v)}
                    className="w-full"
                  />
                </div>
              )}

              {q.type === 'multiple_choice' && (
                <RadioGroup
                  value={String(answers[q.id] ?? '')}
                  onValueChange={(v) => setAns(q.id, v)}
                >
                  {q.options?.map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                      <Label
                        htmlFor={`${q.id}-${opt}`}
                        className="text-sm cursor-pointer font-normal"
                      >
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === 'text' && (
                <Textarea
                  value={String(answers[q.id] ?? '')}
                  onChange={(e) => setAns(q.id, e.target.value)}
                  placeholder="Digite sua resposta..."
                  className="min-h-[80px]"
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Salvar Rascunho
          </Button>
          <Button onClick={handleSubmit}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar Avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
