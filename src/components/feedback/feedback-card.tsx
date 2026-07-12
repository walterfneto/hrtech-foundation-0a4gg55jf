import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Heart,
  Lock,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { updateFeedbackFollowUp } from '@/services/feedbacks'
import type { FeedbackRecord, ImprovementStatus } from '@/lib/types'

interface FeedbackCardProps {
  feedback: FeedbackRecord
  view: 'mural' | 'received' | 'sent'
  currentEmployeeId: string
}

const STATUS_CONFIG: Record<
  ImprovementStatus,
  { label: string; icon: typeof Clock; class: string }
> = {
  pending: { label: 'Aguardando', icon: Clock, class: 'bg-slate-100 text-slate-600' },
  in_progress: {
    label: 'Em Progresso',
    icon: Loader2,
    class: 'bg-blue-50 text-blue-700',
  },
  improved: {
    label: 'Melhorou',
    icon: CheckCircle2,
    class: 'bg-green-50 text-green-700',
  },
  no_change: {
    label: 'Sem Mudança',
    icon: AlertCircle,
    class: 'bg-orange-50 text-orange-700',
  },
}

function getName(emp?: any) {
  return emp?.expand?.user?.name ?? 'Desconhecido'
}

function getInitial(emp?: any) {
  return emp?.expand?.user?.name?.charAt(0) ?? 'U'
}

function StructuredField({ label, content }: { label: string; content: string }) {
  if (!content?.trim()) return null
  return (
    <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
    </div>
  )
}

export function FeedbackCard({ feedback, view, currentEmployeeId }: FeedbackCardProps) {
  const [followUpOpen, setFollowUpOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [followUpNotes, setFollowUpNotes] = useState(feedback.follow_up_notes ?? '')
  const [improvementStatus, setImprovementStatus] = useState<ImprovementStatus>(
    feedback.improvement_status ?? 'pending',
  )

  const dateStr = new Date(feedback.created).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const otherPerson =
    view === 'received'
      ? feedback.expand?.sender
      : view === 'sent'
        ? feedback.expand?.receiver
        : feedback.expand?.sender

  const header =
    view === 'mural' ? (
      <>
        <span className="font-semibold text-slate-900">{getName(feedback.expand?.sender)}</span>
        <span className="text-muted-foreground text-sm">enviou para</span>
        <span className="font-semibold text-primary">{getName(feedback.expand?.receiver)}</span>
      </>
    ) : view === 'received' ? (
      <>
        <span className="text-muted-foreground text-sm">Recebido de</span>
        <span className="font-semibold text-slate-900">{getName(feedback.expand?.sender)}</span>
      </>
    ) : (
      <>
        <span className="text-muted-foreground text-sm">Enviado para</span>
        <span className="font-semibold text-primary">{getName(feedback.expand?.receiver)}</span>
      </>
    )

  const statusCfg = STATUS_CONFIG[feedback.improvement_status ?? 'pending']
  const StatusIcon = statusCfg.icon
  const canFollowUp =
    feedback.sender === currentEmployeeId || feedback.receiver === currentEmployeeId
  const showFollowUp =
    (feedback.follow_up_notes?.trim() || feedback.improvement_status !== 'pending') &&
    view !== 'mural'

  const handleSaveFollowUp = async () => {
    setSaving(true)
    setFieldErrors({})
    try {
      await updateFeedbackFollowUp(feedback.id, {
        follow_up_notes: followUpNotes.trim(),
        improvement_status: improvementStatus,
      })
      toast.success('Retorno atualizado com sucesso!')
      setFollowUpOpen(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao atualizar retorno.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-5 flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback>{getInitial(otherPerson)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">{header}</div>

            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`font-normal capitalize ${
                  feedback.type === 'public_praise'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {feedback.type === 'public_praise' ? (
                  <Heart className="h-3 w-3 mr-1" />
                ) : (
                  <Lock className="h-3 w-3 mr-1" />
                )}
                {feedback.type.replace(/_/g, ' ')}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {dateStr}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <StructuredField label="Situação / Contexto" content={feedback.context} />
              <StructuredField label="Impacto Observado" content={feedback.impact} />
              <StructuredField
                label="Plano de Ação / Sugestão de Melhoria"
                content={feedback.action_plan}
              />
            </div>

            {showFollowUp && (
              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Retorno / Acompanhamento
                  </span>
                  <Badge variant="secondary" className={`font-normal text-xs ${statusCfg.class}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusCfg.label}
                  </Badge>
                </div>
                {feedback.follow_up_notes?.trim() && (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {feedback.follow_up_notes}
                  </p>
                )}
              </div>
            )}

            {canFollowUp && view !== 'mural' && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs h-7"
                onClick={() => {
                  setFollowUpNotes(feedback.follow_up_notes ?? '')
                  setImprovementStatus(feedback.improvement_status ?? 'pending')
                  setFollowUpOpen(true)
                }}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {showFollowUp ? 'Atualizar Retorno' : 'Adicionar Retorno'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={followUpOpen} onOpenChange={setFollowUpOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Retorno / Acompanhamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Status de Melhoria</Label>
              <Select
                value={improvementStatus}
                onValueChange={(v) => setImprovementStatus(v as ImprovementStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Aguardando</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="improved">Melhorou</SelectItem>
                  <SelectItem value="no_change">Sem Mudança</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold">Notas de Retorno</Label>
              <Textarea
                className="min-h-[100px] bg-slate-50"
                placeholder="Documente se o comportamento ou desempenho melhorou com o tempo. Ex: 'Após a conversa, os relatórios passaram a ser revisados 24h antes, sem mais atrasos.'"
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
              />
              {fieldErrors.follow_up_notes && (
                <p className="text-sm text-red-500">{fieldErrors.follow_up_notes}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFollowUp} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                'Salvar Retorno'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
