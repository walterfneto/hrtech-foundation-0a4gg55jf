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
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { createPdiGoal } from '@/services/pdi-goals'
import { fetchEmployees } from '@/services/employees'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { EmployeeRecord } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
  defaultEmployeeId?: string
}

export function AddPdiDialog({ open, onOpenChange, onCreated, defaultEmployeeId }: Props) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    employee: defaultEmployeeId ?? '',
  })

  useEffect(() => {
    if (!open) return
    setFieldErrors({})
    setForm({
      title: '',
      description: '',
      due_date: '',
      employee: defaultEmployeeId ?? '',
    })
    fetchEmployees()
      .then(setEmployees)
      .catch(() => {})
  }, [open, defaultEmployeeId])

  const handleSubmit = async () => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      await createPdiGoal({
        title: form.title,
        description: form.description,
        employee: form.employee,
        due_date: form.due_date,
        status: 'todo',
        progress: 0,
      })
      toast.success('Área de desenvolvimento criada!')
      setForm({ title: '', description: '', due_date: '', employee: defaultEmployeeId ?? '' })
      onCreated()
      onOpenChange(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao criar área.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nova Área de Desenvolvimento
          </DialogTitle>
          <DialogDescription>Defina uma nova meta de desenvolvimento pessoal.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="pdi-employee">Colaborador *</Label>
            <Select
              value={form.employee || 'none'}
              onValueChange={(v) => setForm({ ...form, employee: v === 'none' ? '' : v })}
            >
              <SelectTrigger id="pdi-employee">
                <SelectValue placeholder="Selecionar colaborador" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.expand?.user?.name ?? 'Desconhecido'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.employee && <p className="text-sm text-red-500">{fieldErrors.employee}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pdi-title">Título *</Label>
            <Input
              id="pdi-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Melhorar comunicação em apresentações"
            />
            {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pdi-desc">Descrição</Label>
            <Textarea
              id="pdi-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva a área de desenvolvimento..."
              className="resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pdi-date">Prazo</Label>
            <Input
              id="pdi-date"
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !form.title || !form.employee}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              'Criar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
