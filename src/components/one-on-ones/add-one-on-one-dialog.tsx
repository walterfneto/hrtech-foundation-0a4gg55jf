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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CalendarPlus } from 'lucide-react'
import { toast } from 'sonner'
import { createOneOnOne } from '@/services/one-on-ones'
import { fetchEmployees } from '@/services/employees'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Agendada' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' },
] as const

const TEXT_FIELDS = [
  {
    key: 'objective',
    label: 'Objetivo / Finalidade *',
    placeholder: 'Qual é a finalidade da reunião?',
  },
  { key: 'reason', label: 'Motivo', placeholder: 'Motivo da reunião...' },
  {
    key: 'positive_points',
    label: 'O que está bom',
    placeholder: 'Pontos positivos observados...',
  },
  {
    key: 'improvement_points',
    label: 'O que precisa melhorar',
    placeholder: 'Pontos que precisam de melhoria...',
  },
  {
    key: 'report',
    label: 'Relatório da Reunião',
    placeholder: 'Relatório detalhado da reunião...',
  },
] as const

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
  managerId: string
}

export function AddOneOnOneDialog({ open, onOpenChange, onCreated, managerId }: Props) {
  const [employees, setEmployees] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    employee: '',
    scheduled_at: '',
    objective: '',
    reason: '',
    positive_points: '',
    improvement_points: '',
    report: '',
    action_deadline: '',
    status: 'planned',
  })

  useEffect(() => {
    if (!open) return
    setFieldErrors({})
    fetchEmployees()
      .then(setEmployees)
      .catch(() => {})
  }, [open])

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const handleSubmit = async () => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      await createOneOnOne({
        employee: form.employee,
        manager: managerId,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        status: form.status,
        objective: form.objective,
        reason: form.reason,
        positive_points: form.positive_points,
        improvement_points: form.improvement_points,
        report: form.report,
        action_deadline: form.action_deadline || undefined,
      })
      toast.success('1:1 agendado com sucesso!')
      setForm({
        employee: '',
        scheduled_at: '',
        objective: '',
        reason: '',
        positive_points: '',
        improvement_points: '',
        report: '',
        action_deadline: '',
        status: 'planned',
      })
      onCreated()
      onOpenChange(false)
    } catch (err) {
      setFieldErrors(extractFieldErrors(err))
      toast.error('Erro ao agendar 1:1. Verifique os campos obrigatórios.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" /> Agendar 1:1
          </DialogTitle>
          <DialogDescription>Programe uma nova reunião 1:1 estruturada.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="1on1-employee">Colaborador *</Label>
            <Select
              value={form.employee || 'none'}
              onValueChange={(v) => set('employee', v === 'none' ? '' : v)}
            >
              <SelectTrigger id="1on1-employee">
                <SelectValue placeholder="Selecionar colaborador" />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter((e) => e.id !== managerId)
                  .map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.expand?.user?.name ?? 'Desconhecido'}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {fieldErrors.employee && <p className="text-sm text-red-500">{fieldErrors.employee}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="1on1-date">Data e Hora *</Label>
            <Input
              id="1on1-date"
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => set('scheduled_at', e.target.value)}
            />
            {fieldErrors.scheduled_at && (
              <p className="text-sm text-red-500">{fieldErrors.scheduled_at}</p>
            )}
          </div>
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
          {TEXT_FIELDS.map((f) => (
            <div className="grid gap-2" key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              <Textarea
                id={f.key}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="resize-none"
              />
              {fieldErrors[f.key] && <p className="text-sm text-red-500">{fieldErrors[f.key]}</p>}
            </div>
          ))}
          <div className="grid gap-2">
            <Label htmlFor="1on1-deadline">Prazo para ser feito</Label>
            <Input
              id="1on1-deadline"
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
            disabled={submitting || !form.employee || !form.scheduled_at || !form.objective}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Agendando...
              </>
            ) : (
              'Agendar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
