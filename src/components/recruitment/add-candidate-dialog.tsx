import { useState } from 'react'
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
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { createCandidate } from '@/services/candidates'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { CompetencyManager } from '@/components/recruitment/competency-manager'
import type { CandidateCompetency } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function AddCandidateDialog({ open, onOpenChange, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  })
  const [competencies, setCompetencies] = useState<CandidateCompetency[]>([])

  const handleSubmit = async () => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      await createCandidate({
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        competencies,
        status: 'screening',
      })
      toast.success('Candidato cadastrado com sucesso!')
      setForm({ name: '', email: '', phone: '', role: '' })
      setCompetencies([])
      onCreated()
      onOpenChange(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) toast.error('Erro ao cadastrar candidato.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Novo Candidato
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo candidato no pipeline de recrutamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="cand-name">Nome *</Label>
            <Input
              id="cand-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome completo"
            />
            {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cand-email">Email *</Label>
              <Input
                id="cand-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
              {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cand-phone">Telefone</Label>
              <Input
                id="cand-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cand-role">Cargo Desejado</Label>
            <Input
              id="cand-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Ex: Desenvolvedor Senior"
            />
          </div>
          <div className="grid gap-2">
            <Label>Competências</Label>
            <CompetencyManager competencies={competencies} onChange={setCompetencies} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !form.name || !form.email}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              'Cadastrar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
