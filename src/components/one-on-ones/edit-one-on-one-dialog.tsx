import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { updateOneOnOne, type OneOnOneRecord } from '@/services/one-on-ones'

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Agendada' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' },
] as const

const TEXT_FIELDS = [
  { key: 'objective', label: 'Objetivo / Finalidade *' },
  { key: 'reason', label: 'Motivo' },
  { key: 'positive_points', label: 'O que está bom' },
  { key: 'improvement_points', label: 'O que precisa melhorar' },
  { key: 'report', label: 'Relatório da Reunião' },
] as const

interface Props {
  oneOnOne: OneOnOneRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditOneOnOneDialog({ oneOnOne, open, onOpenChange, onUpdated }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    status: 'planned',
    scheduled_at: '',
    objective: '',
    reason: '',
    positive_points: '',
    improvement_points: '',
    report: '',
    action_deadline: '',
  })

  useEffect(() => {
    if (oneOnOne && open) {
      const d = new Date(oneOnOne.scheduled_at)
      const offset = d.getTimezoneOffset()
      setForm({
        status: oneOnOne.status || 'planned',
        scheduled_at: new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16),
        objective: oneOnOne.objective || '',
        reason: oneOnOne.reason || '',
        positive_points: oneOnOne.positive_points || '',
        improvement_points: oneOnOne.improvement_points || '',
        report: oneOnOne.report || '',
        action_deadline: oneOnOne.action_deadline ? oneOnOne.action_deadline.slice(0, 10) : '',
      })
    }
  }, [oneOnOne, open])

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const handleSubmit = async () => {
    if (!oneOnOne) return
    setSubmitting(true)
    try {
      await updateOneOnOne(oneOnOne.id, {
        status: form.status,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        objective: form.objective,
        reason: form.reason,
        positive_points: form.positive_points,
        improvement_points: form.improvement_points,
        report: form.report,
        action_deadline: form.action_deadline || undefined,
      })
      toast.success('Reunião 1:1 atualizada com sucesso!')
      onUpdated()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao atualizar reunião.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" /> Editar Reunião 1:1
          </DialogTitle>
          <DialogDescription>Atualize status, conteúdo estruturado e prazos.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-1on1-date">Data e Hora *</Label>
            <Input
              id="edit-1on1-date"
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => set('scheduled_at', e.target.value)}
            />
          </div>
          {TEXT_FIELDS.map((f) => (
            <div className="grid gap-2" key={f.key}>
              <Label htmlFor={`edit-${f.key}`}>{f.label}</Label>
              <Textarea
                id={`edit-${f.key}`}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className="resize-none"
              />
            </div>
          ))}
          <div className="grid gap-2">
            <Label htmlFor="edit-1on1-deadline">Prazo para ser feito</Label>
            <Input
              id="edit-1on1-deadline"
              type="date"
              value={form.action_deadline}
              onChange={(e) => set('action_deadline', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !form.scheduled_at || !form.objective}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
