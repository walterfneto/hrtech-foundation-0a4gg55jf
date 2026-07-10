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
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateCandidate } from '@/services/candidates'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { CandidateRecord } from '@/lib/types'

const STAGES = [
  { value: 'screening', label: 'Triagem' },
  { value: 'interview', label: 'Entrevista' },
  { value: 'offer', label: 'Proposta' },
  { value: 'hired', label: 'Contratado' },
  { value: 'rejected', label: 'Rejeitado' },
] as const

function parseSkills(skills: any): string[] {
  if (!skills) return []
  if (Array.isArray(skills)) return skills
  try {
    return JSON.parse(skills)
  } catch {
    return []
  }
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
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'screening',
    skills: [] as string[],
  })

  useEffect(() => {
    if (candidate && open) {
      setForm({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        role: candidate.role || '',
        status: candidate.status || 'screening',
        skills: parseSkills(candidate.skills),
      })
      setFieldErrors({})
    }
  }, [candidate, open])

  const addSkill = () => {
    const t = skillInput.trim()
    if (t && !form.skills.includes(t)) {
      setForm({ ...form, skills: [...form.skills, t] })
      setSkillInput('')
    }
  }

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
        skills: form.skills,
      })
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" /> Editar Candidato
          </DialogTitle>
          <DialogDescription>Atualize as informações do candidato.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
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
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill()
                  }
                }}
                placeholder="Digite e Enter..."
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                Add
              </Button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.skills.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button
                      onClick={() =>
                        setForm({ ...form, skills: form.skills.filter((x) => x !== s) })
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
