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
import { Slider } from '@/components/ui/slider'
import { Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { updatePdiGoal } from '@/services/pdi-goals'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { PdiGoalRecord } from '@/lib/types'

const STATUS_OPTIONS = [
  { value: 'todo', label: 'A Fazer' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'completed', label: 'Concluído' },
] as const

interface Props {
  goal: PdiGoalRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditGoalDialog({ goal, open, onOpenChange, onUpdated }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    progress: 0,
    due_date: '',
  })

  useEffect(() => {
    if (goal && open) {
      setForm({
        title: goal.title || '',
        description: goal.description || '',
        status: goal.status || 'todo',
        progress: goal.progress ?? 0,
        due_date: goal.due_date || '',
      })
      setFieldErrors({})
    }
  }, [goal, open])

  const handleSubmit = async () => {
    if (!goal) return
    setSubmitting(true)
    setFieldErrors({})
    try {
      await updatePdiGoal(goal.id, {
        title: form.title,
        description: form.description,
        status: form.status,
        progress: form.progress,
        due_date: form.due_date,
      })
      toast.success('Objetivo atualizado com sucesso!')
      onUpdated()
      onOpenChange(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao atualizar objetivo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" /> Editar Objetivo
          </DialogTitle>
          <DialogDescription>Atualize as informações do objetivo ou OKR.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="edit-goal-title">Título *</Label>
            <Input
              id="edit-goal-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {fieldErrors.title && <p className="text-sm text-red-500">{fieldErrors.title}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-goal-desc">Descrição</Label>
            <Textarea
              id="edit-goal-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
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
              <Label htmlFor="edit-goal-date">Prazo</Label>
              <Input
                id="edit-goal-date"
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Progresso: {form.progress}%</Label>
            <Slider
              value={[form.progress]}
              max={100}
              step={5}
              onValueChange={([v]) => setForm({ ...form, progress: v })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !form.title}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
