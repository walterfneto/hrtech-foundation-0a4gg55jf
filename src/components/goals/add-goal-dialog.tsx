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
import { Loader2, Target } from 'lucide-react'
import { toast } from 'sonner'
import { createPdiGoal } from '@/services/pdi-goals'
import { fetchEmployees } from '@/services/employees'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function AddGoalDialog({ open, onOpenChange, onCreated }: Props) {
  const [employees, setEmployees] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({ title: '', description: '', employee: '', due_date: '' })

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
      await createPdiGoal({
        title: form.title,
        description: form.description,
        employee: form.employee,
        due_date: form.due_date,
        status: 'todo',
        progress: 0,
      })
      toast.success('Objetivo criado com sucesso!')
      setForm({ title: '', description: '', employee: '', due_date: '' })
      onCreated()
      onOpenChange(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao criar objetivo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Novo Objetivo
          </DialogTitle>
          <DialogDescription>Crie um novo objetivo ou OKR para a equipe.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="goal-title">Título *</Label>
            <Input
              id="goal-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Reduzir tempo de carregamento"
            />
            {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goal-desc">Descrição</Label>
            <Textarea
              id="goal-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva o objetivo..."
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="goal-employee">Colaborador *</Label>
              <Select
                value={form.employee || 'none'}
                onValueChange={(v) => setForm({ ...form, employee: v === 'none' ? '' : v })}
              >
                <SelectTrigger id="goal-employee">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem responsável</SelectItem>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.expand?.user?.name ?? 'Desconhecido'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.employee && (
                <p className="text-sm text-red-500">{fieldErrors.employee}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-date">Prazo</Label>
              <Input
                id="goal-date"
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
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
              'Criar Objetivo'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
