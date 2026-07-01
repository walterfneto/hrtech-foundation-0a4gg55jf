import { useState, useMemo } from 'react'
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
import { Search, MoreHorizontal, Mail, Building2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MOCK_TEAM } from '@/lib/mock-data'
import { getMemberName } from '@/lib/mock-data'

export function TeamListTab() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return MOCK_TEAM.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    )
  }, [search])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Colaboradores</h2>
          <p className="text-muted-foreground mt-1">
            {MOCK_TEAM.length} colaboradores ativos na organização.
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-slate-50/50 rounded-t-lg">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, cargo ou email..."
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Colaborador</TableHead>
                <TableHead className="hidden md:table-cell">Cargo</TableHead>
                <TableHead className="hidden lg:table-cell">Departamento</TableHead>
                <TableHead className="hidden md:table-cell">Gestor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span>{member.name}</span>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 md:hidden">
                          <Mail className="h-3 w-3" /> {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">
                    {member.role}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-slate-600 text-sm">
                      <Building2 className="h-3 w-3" /> {member.departamento}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">
                    {member.manager_id ? getMemberName(member.manager_id) : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        member.status === 'Ativo'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }
                    >
                      {member.status}
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
                        <DropdownMenuItem>Ver Dossiê</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Desativar (Soft Delete)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
