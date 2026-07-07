import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreHorizontal, Trash2, Mail, Building2, TrendingUp } from 'lucide-react'
import { fetchEmployees } from '@/services/employees'
import { useRealtime } from '@/hooks/use-realtime'
import { getAvatarUrl } from '@/services/helpers'
import { AddEmployeeDialog } from '@/components/team/add-employee-dialog'
import { DeleteEmployeeDialog } from '@/components/team/delete-employee-dialog'
import { EmployeeEvolutionDialog } from '@/components/performance/employee-evolution-dialog'
import type { EmployeeRecord } from '@/lib/types'

const ROLE_LABELS: Record<string, string> = {
  'Admin RH': 'Admin RH',
  Gestor: 'Gestor',
  Colaborador: 'Colaborador',
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Ativo',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
}

export default function Team() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [evolutionOpen, setEvolutionOpen] = useState(false)
  const [evolutionTarget, setEvolutionTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [error, setError] = useState('')

  const loadEmployees = useCallback(async () => {
    try {
      const data = await fetchEmployees()
      setEmployees(data)
    } catch {
      setError('Erro ao carregar colaboradores.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  useRealtime('employees', () => {
    loadEmployees()
  })

  const filtered = employees.filter((e) => {
    const name = e.expand?.user?.name ?? ''
    const dept = e.department ?? ''
    const q = search.toLowerCase()
    return name.toLowerCase().includes(q) || dept.toLowerCase().includes(q)
  })

  const getEmployeeName = (e: EmployeeRecord) => e.expand?.user?.name ?? 'Desconhecido'
  const getEmployeeEmail = (e: EmployeeRecord) => e.expand?.user?.email ?? ''
  const getEmployeeAvatar = (e: EmployeeRecord) =>
    e.expand?.user ? getAvatarUrl(e.expand.user) : null

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Equipe e Estrutura</h1>
          <p className="text-muted-foreground mt-1">Gerencie colaboradores da sua organização.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-slate-50/50 rounded-t-lg">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou departamento..."
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {search ? 'Nenhum colaborador encontrado.' : 'Nenhum colaborador cadastrado ainda.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Colaborador</TableHead>
                  <TableHead className="hidden md:table-cell">Cargo</TableHead>
                  <TableHead className="hidden lg:table-cell">Departamento</TableHead>
                  <TableHead className="hidden lg:table-cell">Time</TableHead>
                  <TableHead className="hidden md:table-cell">Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((emp) => {
                  const status = STATUS_LABELS[emp.status] ?? STATUS_LABELS.inactive
                  return (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={getEmployeeAvatar(emp) ?? undefined} />
                            <AvatarFallback>{getEmployeeName(emp).charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span>{getEmployeeName(emp)}</span>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {getEmployeeEmail(emp)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-slate-600">
                        {emp.job_title || '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-slate-600 text-sm">
                          <Building2 className="h-3 w-3" />
                          {emp.department || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-slate-600">
                        {emp.expand?.team?.name ?? '—'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {ROLE_LABELS[emp.role] ?? emp.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEvolutionTarget({
                                  id: emp.id,
                                  name: getEmployeeName(emp),
                                })
                                setEvolutionOpen(true)
                              }}
                            >
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Ver Evolução
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setDeleteTarget({
                                  id: emp.id,
                                  name: getEmployeeName(emp),
                                })
                                setDeleteOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {employees.filter((e) => e.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Ativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {employees.filter((e) => e.status === 'inactive').length}
              </p>
              <p className="text-sm text-muted-foreground">Inativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(employees.map((e) => e.department).filter(Boolean)).size}
              </p>
              <p className="text-sm text-muted-foreground">Departamentos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddEmployeeDialog open={addOpen} onOpenChange={setAddOpen} onCreated={loadEmployees} />
      <DeleteEmployeeDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        employeeId={deleteTarget?.id ?? null}
        employeeName={deleteTarget?.name ?? ''}
        onDeleted={loadEmployees}
      />
      <EmployeeEvolutionDialog
        open={evolutionOpen}
        onOpenChange={setEvolutionOpen}
        employeeId={evolutionTarget?.id ?? null}
        employeeName={evolutionTarget?.name ?? ''}
      />
    </div>
  )
}
