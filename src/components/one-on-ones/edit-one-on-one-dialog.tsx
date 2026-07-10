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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Pencil, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateOneOnOne, type OneOnOneRecord } from '@/services/one-on-ones'

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Agendada' },
  { value: 'completed', label: 'Concluída' },
  { value: 'cancelled', label: 'Cancelada' },
] as const

interface Props {
  oneOnOne: OneOnOneRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditOneOnOneDialog({ oneOnOne, open, onOpenChange, onUpdated }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('planned')
  const [summary, setSummary] = useState('')
  const [privateNotes, setPrivateNotes] = useState('')
  const [agenda, setAgenda] = useState<Array<{ id: string; text: string; done: boolean }>>([])
  const [agendaInput, setAgendaInput] = useState('')

  useEffect(() => {
    if (oneOnOne && open) {
      const notes = oneOnOne.notes
        ? typeof oneOnOne.notes === 'string'
          ? JSON.parse(oneOnOne.notes)
          : oneOnOne.notes
        : {}
      setStatus(oneOnOne.status || 'planned')
      setSummary(notes.summary || '')
      setPrivateNotes(notes.privateNotes || '')
      setAgenda(Array.isArray(notes.agenda) ? notes.agenda : [])
      setAgendaInput('')
    }
  }, [oneOnOne, open])

  const addAgendaItem = () => {
    const t = agendaInput.trim()
    if (t) {
      setAgenda([...agenda, { id: Date.now().toString(), text: t, done: false }])
      setAgendaInput('')
    }
  }

  const handleSubmit = async () => {
    if (!oneOnOne) return
    setSubmitting(true)
    try {
      await updateOneOnOne(oneOnOne.id, { status, notes: { summary, privateNotes, agenda } })
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" /> Editar Reunião 1:1
          </DialogTitle>
          <DialogDescription>Atualize status, pauta e notas da reunião.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
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
            <Label>Pauta</Label>
            <div className="flex gap-2">
              <Textarea
                value={agendaInput}
                onChange={(e) => setAgendaInput(e.target.value)}
                placeholder="Novo item da pauta..."
                className="resize-none"
              />
              <Button type="button" variant="outline" onClick={addAgendaItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {agenda.length > 0 && (
              <div className="space-y-1 mt-2">
                {agenda.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded border text-sm"
                  >
                    <span>{item.text}</span>
                    <button
                      onClick={() => setAgenda(agenda.filter((a) => a.id !== item.id))}
                      className="ml-auto"
                    >
                      <X className="h-3 w-3 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Resumo / Notas</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Resumo da reunião..."
              className="resize-none min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label>Notas Privadas</Label>
            <Textarea
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Notas visíveis apenas para você..."
              className="resize-none min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
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
