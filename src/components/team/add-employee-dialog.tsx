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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { createEmployeeWithUser } from '@/services/employees'
import { fetchEmployees } from '@/services/teams-employees-combined'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import { TeamCombobox } from '@/components/team/team-combobox'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

const ROLES = ['Admin RH', 'Gestor', 'Colaborador'] as const
const STATUSES = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
] as const

export function AddEmployeeDialog({ open, onOpenChange, onCreated }: Props) {
  const [managers, setManagers] = useState<{ id: string; name: string; job_title: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    job_title: '',
    department: '',
    role: 'Colaborador',
    status: 'active',
    team: '',
    manager: '',
  })

  useEffect(() => {
    if (!open) return
    setFieldErrors({})
    fetchEmployees()
      .then((empData) => {
        setManagers(
          empData.map((e: any) => ({
            id: e.id,
            name: e.expand?.user?.name ?? 'Desconhecido',
            job_title: e.job_title ?? '',
          })),
        )
      })
      .catch(() => {})
  }, [open])

  const handleSubmit = async () => {
    setSubmitting(true)
    setFieldErrors({})
    try {
      await createEmployeeWithUser({
        name: form.name,
        email: form.email,
        password: form.password || 'Skip@Pass',
        job_title: form.job_title,
        department: form.department,
        role: form.role,
        status: form.status,
        team: form.team || undefined,
        manager: form.manager || undefined,
      })
      toast.success('Colaborador adicionado com sucesso!')
      setForm({
        name: '',
        email: '',
        password: '',
        job_title: '',
        department: '',
        role: 'Colaborador',
        status: 'active',
        team: '',
        manager: '',
      })
      onCreated()
      onOpenChange(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) {
        toast.error('Erro ao adicionar colaborador.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = (v: boolean) => {
    if (!v) {
      setFieldErrors({})
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Novo Colaborador
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para adicionar um novo colaborador à empresa.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid gap-2">
            <Label htmlFor="emp-name">Nome *</Label>
            <Input
              id="emp-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome completo"
            />
            {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="emp-email">Email *</Label>
              <Input
                id="emp-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@empresa.com"
              />
              {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emp-password">Senha</Label>
              <Input
                id="emp-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Padrão: Skip@Pass"
              />
              {fieldErrors.password && (
                <p className="text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="emp-title">Cargo *</Label>
              <Input
                id="emp-title"
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                placeholder="Ex: Desenvolvedor Senior"
              />
              {fieldErrors.job_title && (
                <p className="text-sm text-red-500">{fieldErrors.job_title}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emp-dept">Departamento *</Label>
              <Input
                id="emp-dept"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="Ex: Tecnologia"
              />
              {fieldErrors.department && (
                <p className="text-sm text-red-500">{fieldErrors.department}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="emp-role">Papel *</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger id="emp-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emp-status">Status *</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger id="emp-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emp-team">Time (opcional)</Label>
            <TeamCombobox
              value={form.team}
              onChange={(v) => setForm({ ...form, team: v })}
              placeholder="Selecionar ou criar time"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emp-manager">Gestor (opcional)</Label>
            <Select
              value={form.manager || 'none'}
              onValueChange={(v) => setForm({ ...form, manager: v === 'none' ? '' : v })}
            >
              <SelectTrigger id="emp-manager">
                <SelectValue placeholder="Selecionar gestor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem gestor</SelectItem>
                {managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} {m.job_title ? `— ${m.job_title}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Adicionar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
