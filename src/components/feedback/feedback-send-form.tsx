import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2, Heart, Lock, Send, Info } from 'lucide-react'
import { EmployeeCombobox } from '@/components/feedback/employee-combobox'
import { toast } from 'sonner'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { createFeedback } from '@/services/feedbacks'
import type { EmployeeRecord } from '@/lib/types'

const FEEDBACK_TYPES = [
  {
    value: 'public_praise',
    label: 'Público (Elogio)',
    icon: Heart,
    activeClass: 'bg-primary text-primary-foreground border-primary',
    idleClass: 'hover:bg-muted',
  },
  {
    value: 'confidential_improvement',
    label: 'Privado (Construtivo)',
    icon: Lock,
    activeClass: 'bg-warning text-primary-foreground border-warning',
    idleClass: 'hover:bg-muted',
  },
] as const

interface FeedbackSendFormProps {
  employees: EmployeeRecord[]
  currentEmployeeId: string
  onSubmitted: () => void
}

export function FeedbackSendForm({
  employees,
  currentEmployeeId,
  onSubmitted,
}: FeedbackSendFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    receiver: '',
    type: 'public_praise',
    content: '',
    context: '',
    impact: '',
    action_plan: '',
  })

  const isValid =
    form.receiver &&
    form.content.trim() &&
    form.context.trim() &&
    form.impact.trim() &&
    form.action_plan.trim()

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }
    setSubmitting(true)
    setFieldErrors({})
    try {
      await createFeedback({
        sender: currentEmployeeId,
        receiver: form.receiver,
        type: form.type,
        content: form.content.trim(),
        context: form.context.trim(),
        impact: form.impact.trim(),
        action_plan: form.action_plan.trim(),
      })
      toast.success('Feedback enviado com sucesso!')
      setForm({
        receiver: '',
        type: 'public_praise',
        content: '',
        context: '',
        impact: '',
        action_plan: '',
      })
      onSubmitted()
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao enviar feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="rounded-lg border bg-card shadow-subtle">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-2 rounded-lg bg-accent border p-3">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            O feedback deve ser <strong>objetivo e baseado em fatos</strong>, focando em
            comportamentos e resultados profissionais — não em opiniões pessoais ou sentimentos.
          </p>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium">Para quem? *</Label>
          <EmployeeCombobox
            employees={employees.filter((e) => e.status === 'active' && e.id !== currentEmployeeId)}
            value={form.receiver}
            onChange={(id) => setForm({ ...form, receiver: id })}
            placeholder="Selecione um colaborador"
          />
          {fieldErrors.receiver && (
            <p className="text-sm text-destructive">{fieldErrors.receiver}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium">Tipo de Feedback *</Label>
          <div className="flex gap-2 flex-wrap">
            {FEEDBACK_TYPES.map((ft) => {
              const Icon = ft.icon
              const isActive = form.type === ft.value
              return (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: ft.value })}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-95 ${isActive ? ft.activeClass : `border-border bg-card text-muted-foreground ${ft.idleClass}`}`}
                >
                  <Icon className="h-4 w-4" />
                  {ft.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium">Mensagem Principal *</Label>
          <Textarea
            className="min-h-[100px] bg-muted/50"
            placeholder="Escreva a mensagem principal do feedback..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          {fieldErrors.content && <p className="text-sm text-destructive">{fieldErrors.content}</p>}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium">Situação / Contexto *</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Descreva a situação específica e observável. Ex: "Na reunião de segunda-feira, os
                prazos do sprint não foram cumpridos..."
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            className="min-h-[80px] bg-muted/50"
            placeholder="Ex: Na apresentação de quinta-feira, o relatório mensal foi entregue sem os dados de receita..."
            value={form.context}
            onChange={(e) => setForm({ ...form, context: e.target.value })}
          />
          {fieldErrors.context && <p className="text-sm text-destructive">{fieldErrors.context}</p>}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium">Impacto Observado *</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Descreva o impacto profissional da situação. Ex: "Isso atrasou a tomada de decisão
                da diretoria em dois dias..."
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            className="min-h-[80px] bg-muted/50"
            placeholder="Ex: Sem os dados de receita, a diretoria não conseguiu aprovar o orçamento do próximo trimestre, atrasando o planejamento..."
            value={form.impact}
            onChange={(e) => setForm({ ...form, impact: e.target.value })}
          />
          {fieldErrors.impact && <p className="text-sm text-destructive">{fieldErrors.impact}</p>}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium">Plano de Ação / Sugestão de Melhoria *</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Proponha ações concretas. Ex: "Sugiro revisar o relatório com o time financeiro 24h
                antes da apresentação..."
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            className="min-h-[80px] bg-muted/50"
            placeholder="Ex: Sugiro criar um checklist de revisão antes da entrega e incluir o time financeiro na conferência dos dados..."
            value={form.action_plan}
            onChange={(e) => setForm({ ...form, action_plan: e.target.value })}
          />
          {fieldErrors.action_plan && (
            <p className="text-sm text-destructive">{fieldErrors.action_plan}</p>
          )}
        </div>

        <div className="pt-6 border-t">
          <Button
            className="w-full sm:w-auto bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={submitting || !isValid}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Enviar Feedback
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
