import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, Save } from 'lucide-react'
import { getCycle, getTemplate, getMember } from '@/lib/eval-data'
import type { AvaliacaoResposta } from '@/lib/types'
import { toast } from 'sonner'

interface Props {
  avaliacao: AvaliacaoResposta
  onClose: () => void
}

export function EvaluationFormDialog({ avaliacao, onClose }: Props) {
  const [answers, setAnswers] = useState<Record<string, string | number>>(avaliacao.respostas)
  const cycle = getCycle(avaliacao.ciclo_id)
  const template = cycle ? getTemplate(cycle.modelo_id) : null
  const avaliado = getMember(avaliacao.avaliado_id)

  const setAnswer = (qid: string, val: string | number) =>
    setAnswers((prev) => ({ ...prev, [qid]: val }))

  const handleSubmit = () => {
    toast.success('Avaliação enviada com sucesso!', {
      description: `Respostas registradas para ${avaliado?.name}.`,
    })
    onClose()
  }

  const handleDraft = () => {
    toast.info('Rascunho salvo!', { description: 'Você pode continuar mais tarde.' })
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avaliado?.avatar} />
              <AvatarFallback>{avaliado?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Avaliação: {avaliado?.name}</DialogTitle>
              <DialogDescription>
                {cycle?.nome} •{' '}
                {avaliacao.tipo === 'auto' ? 'Autoavaliação' : 'Avaliação de Gestor'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {template?.questoes.map((q, i) => (
            <div key={q.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-sm">
                  {i + 1}. {q.texto}
                </Label>
                {q.tipo === 'escala' && answers[q.id] !== undefined && (
                  <span className="text-sm font-bold text-primary">
                    {answers[q.id]}/{q.escala_max}
                  </span>
                )}
              </div>

              {q.tipo === 'escala' && (
                <>
                  <Slider
                    value={[Number(answers[q.id] || 0)]}
                    onValueChange={([v]) => setAnswer(q.id, v)}
                    max={q.escala_max || 5}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 - Abaixo do esperado</span>
                    <span>{q.escala_max || 5} - Supera expectativas</span>
                  </div>
                </>
              )}

              {q.tipo === 'multipla_escolha' && (
                <RadioGroup
                  value={String(answers[q.id] || '')}
                  onValueChange={(v) => setAnswer(q.id, v)}
                >
                  {q.opcoes?.map((op) => (
                    <div
                      key={op}
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      <RadioGroupItem value={op} id={`${q.id}-${op}`} />
                      <Label
                        htmlFor={`${q.id}-${op}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {op}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.tipo === 'texto' && (
                <Textarea
                  value={String(answers[q.id] || '')}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder="Digite sua resposta..."
                  className="min-h-[80px] resize-none"
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleDraft}>
            <Save className="h-4 w-4 mr-2" /> Salvar Rascunho
          </Button>
          <Button onClick={handleSubmit}>
            <CheckCircle2 className="h-4 w-4 mr-2" /> Enviar Avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
