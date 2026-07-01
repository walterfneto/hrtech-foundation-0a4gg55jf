import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Download, Plus, Search, MoreHorizontal, Network } from 'lucide-react'
import { OrgChart } from '@/components/team/org-chart'
import { ImportCollaboratorsDialog } from '@/components/team/import-collaborators-dialog'
import { fetchUsers } from '@/lib/api'
import { buildOrgTree } from '@/lib/org-data'
import type { Usuario, OrgNode } from '@/lib/types'

export default function Team() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [search, setSearch] = useState('')
  const [importOpen, setImportOpen] = useState(false)
  const [orgTree, setOrgTree] = useState<OrgNode | null>(null)

  const loadUsers = async () => {
    const data = await fetchUsers()
    setUsers(data)
    setOrgTree(buildOrgTree(data))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filtered = users.filter(
    (u) =>
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.cargo.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Equipe e Estrutura</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie colaboradores, hierarquias e organograma.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setImportOpen(true)}
          >
            <Download className="mr-2 h-4 w-4" /> Importar CSV
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Novo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista">Colaboradores</TabsTrigger>
          <TabsTrigger value="orgchart">
            <Network className="mr-1.5 h-4 w-4" /> Organograma
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 border-b bg-slate-50/50 rounded-t-lg">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou cargo..."
                  className="pl-9 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={m.avatar_url ?? undefined} />
                          <AvatarFallback>{m.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{m.nome}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{m.cargo}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 font-normal"
                      >
                        {m.departamento}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {m.papel_sistema}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          m.status === 'Ativo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {m.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="orgchart">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organograma Interativo</CardTitle>
            </CardHeader>
            <CardContent>
              {orgTree ? (
                <OrgChart data={orgTree} />
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhum dado disponível</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ImportCollaboratorsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={loadUsers}
      />
    </div>
  )
}
