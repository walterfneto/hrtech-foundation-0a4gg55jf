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
  const [form, setForm] = useState({ employee: '', scheduled_at: '', agenda: '' })

  useEffect(() => {
    if (!open) return
    setFieldErrors({})
    fetchEmployees()
      .then(setEmployees)
      .catch(() => {})
  }, [open])

  const handleSubmit = async () => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      const notes: Record<string, any> = { agenda: [], privateNotes: '' }
      if (form.agenda.trim()) {
        notes.agenda = [{ id: Date.now().toString(), text: form.agenda.trim(), done: false }]
      }
      await createOneOnOne({
        employee: form.employee,
        manager: managerId,
        scheduled_at: form.scheduled_at,
        notes,
        status: 'planned',
      })
      toast.success('1:1 agendado com sucesso!')
      setForm({ employee: '', scheduled_at: '', agenda: '' })
      onCreated()
      onOpenChange(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao agendar 1:1.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" /> Agendar 1:1
          </DialogTitle>
          <DialogDescription>
            Programe uma nova reunião 1:1 com pauta colaborativa.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="1on1-employee">Colaborador *</Label>
            <Select
              value={form.employee || 'none'}
              onValueChange={(v) => setForm({ ...form, employee: v === 'none' ? '' : v })}
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
              onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
            />
            {fieldErrors.scheduled_at && (
              <p className="text-sm text-red-500">{fieldErrors.scheduled_at}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="1on1-agenda">Pauta Inicial</Label>
            <Textarea
              id="1on1-agenda"
              value={form.agenda}
              onChange={(e) => setForm({ ...form, agenda: e.target.value })}
              placeholder="Primeiro item da pauta colaborativa..."
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !form.employee || !form.scheduled_at}
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
