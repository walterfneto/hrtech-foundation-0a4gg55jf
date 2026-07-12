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
import { Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { updateCandidate } from '@/services/candidates'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { CompetencyManager } from '@/components/recruitment/competency-manager'
import type { CandidateRecord, CandidateCompetency } from '@/lib/types'

const STAGES = [
  { value: 'screening', label: 'Triagem' },
  { value: 'interview', label: 'Entrevista' },
  { value: 'offer', label: 'Proposta' },
  { value: 'hired', label: 'Contratado' },
  { value: 'rejected', label: 'Rejeitado' },
] as const

function parseCompetencies(raw: any): CandidateCompetency[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((s: any) => (typeof s === 'string' ? { name: s, level: '', notes: '' } : s))
  }
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map((s: any) => (typeof s === 'string' ? { name: s, level: '', notes: '' } : s))
    }
  } catch {
    /* intentionally ignored */
  }
  return []
}

interface Props {
  candidate: CandidateRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditCandidateDialog({ candidate, open, onOpenChange, onUpdated }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'screening',
    observations: '',
    interview_info: '',
  })
  const [competencies, setCompetencies] = useState<CandidateCompetency[]>([])

  useEffect(() => {
    if (candidate && open) {
      setForm({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        role: candidate.role || '',
        status: candidate.status || 'screening',
        observations: candidate.observations || '',
        interview_info: candidate.interview_info || '',
      })
      setCompetencies(parseCompetencies((candidate as any).skills))
      setFieldErrors({})
    }
  }, [candidate, open])

  const handleSubmit = async () => {
    if (!candidate) return
    setSubmitting(true)
    setFieldErrors({})
    try {
      await updateCandidate(candidate.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: form.status,
        competencies,
        observations: form.observations,
        interview_info: form.interview_info,
      } as any)
      toast.success('Candidato atualizado com sucesso!')
      onUpdated()
      onOpenChange(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao atualizar candidato.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" /> Editar Candidato
          </DialogTitle>
          <DialogDescription>Atualize as informações do candidato.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label>Nome *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Telefone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Cargo</Label>
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Competências</Label>
            <CompetencyManager competencies={competencies} onChange={setCompetencies} />
          </div>
          <div className="grid gap-2">
            <Label>Observações Gerais</Label>
            <Textarea
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
              placeholder="Observações gerais sobre o candidato..."
              className="min-h-[80px]"
            />
          </div>
          <div className="grid gap-2">
            <Label>Informações da Entrevista</Label>
            <Textarea
              value={form.interview_info}
              onChange={(e) => setForm({ ...form, interview_info: e.target.value })}
              placeholder="Feedback e detalhes da entrevista..."
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !form.name}>
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
