import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2, Heart, Lock, MessageSquare, Send, Info } from 'lucide-react'
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
  },
  {
    value: 'confidential_improvement',
    label: 'Privado (Construtivo)',
    icon: Lock,
    activeClass: 'bg-warning text-primary-foreground border-warning',
  },
  {
    value: '1_on_1',
    label: '1:1',
    icon: MessageSquare,
    activeClass: 'bg-accent text-accent-foreground border-accent',
  },
] as const

const TEXT_FIELDS = [
  {
    key: 'content',
    label: 'Mensagem Principal *',
    placeholder: 'Escreva a mensagem principal do feedback...',
    minHeight: 'min-h-[100px]',
    tooltip: undefined as string | undefined,
  },
  {
    key: 'context',
    label: 'Situação / Contexto *',
    placeholder:
      'Ex: Na apresentação de quinta-feira, o relatório mensal foi entregue sem os dados de receita...',
    minHeight: 'min-h-[80px]',
    tooltip:
      'Descreva a situação específica e observável. Ex: "Na reunião de segunda-feira, os prazos do sprint não foram cumpridos..."',
  },
  {
    key: 'impact',
    label: 'Impacto Observado *',
    placeholder:
      'Ex: Sem os dados de receita, a diretoria não conseguiu aprovar o orçamento do próximo trimestre...',
    minHeight: 'min-h-[80px]',
    tooltip:
      'Descreva o impacto profissional da situação. Ex: "Isso atrasou a tomada de decisão da diretoria em dois dias..."',
  },
  {
    key: 'action_plan',
    label: 'Plano de Ação / Sugestão de Melhoria *',
    placeholder:
      'Ex: Sugiro criar um checklist de revisão antes da entrega e incluir o time financeiro na conferência dos dados...',
    minHeight: 'min-h-[80px]',
    tooltip:
      'Proponha ações concretas. Ex: "Sugiro revisar o relatório com o time financeiro 24h antes da apresentação..."',
  },
] as const

const EMPTY_FORM = {
  receiver: '',
  type: 'public_praise',
  content: '',
  context: '',
  impact: '',
  action_plan: '',
}

interface FeedbackSendFormProps {
  employees: EmployeeRecord[]
  currentEmployeeId: string
  onSubmitted: () => void
  embedded?: boolean
}

export function FeedbackSendForm({
  employees,
  currentEmployeeId,
  onSubmitted,
  embedded = false,
}: FeedbackSendFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({ ...EMPTY_FORM })

  const isValid = !!(
    form.receiver &&
    form.content.trim() &&
    form.context.trim() &&
    form.impact.trim() &&
    form.action_plan.trim()
  )
  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

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
      setForm({ ...EMPTY_FORM })
      onSubmitted()
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao enviar feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  const content = (
    <div className="space-y-6">
      <div className="flex items-start gap-2 rounded-lg bg-accent border p-3">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          O feedback deve ser <span className="font-semibold">objetivo e baseado em fatos</span>,
          focando em comportamentos e resultados profissionais.
        </p>
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium">Para quem? *</Label>
        <EmployeeCombobox
          employees={employees.filter((e) => e.status === 'active' && e.id !== currentEmployeeId)}
          value={form.receiver}
          onChange={(id) => set('receiver', id)}
          placeholder="Selecione um colaborador"
        />
        {fieldErrors.receiver && <p className="text-sm text-destructive">{fieldErrors.receiver}</p>}
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
                onClick={() => set('type', ft.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors active:scale-95 ${isActive ? ft.activeClass : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}
              >
                <Icon className="h-4 w-4" />
                {ft.label}
              </button>
            )
          })}
        </div>
      </div>
      {TEXT_FIELDS.map((f) => (
        <div className="grid gap-2" key={f.key}>
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium">{f.label}</Label>
            {f.tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">{f.tooltip}</TooltipContent>
              </Tooltip>
            )}
          </div>
          <Textarea
            className={`${f.minHeight} bg-muted/50`}
            placeholder={f.placeholder}
            value={form[f.key as keyof typeof form]}
            onChange={(e) => set(f.key, e.target.value)}
          />
          {fieldErrors[f.key] && <p className="text-sm text-destructive">{fieldErrors[f.key]}</p>}
        </div>
      ))}
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
    </div>
  )

  if (embedded) return content
  return (
    <Card className="rounded-lg border bg-card shadow-subtle">
      <CardContent className="p-6">{content}</CardContent>
    </Card>
  )
}
