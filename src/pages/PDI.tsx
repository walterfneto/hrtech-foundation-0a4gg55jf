import { useState, useEffect, useCallback } from 'react'
import { fetchCompanyGoals, deletePdiGoal } from '@/services/pdi-goals'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, MoreVertical, Pencil, Trash2, FileDown } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { AddPdiDialog } from '@/components/pdi/add-pdi-dialog'
import { EditPdiDialog } from '@/components/pdi/edit-pdi-dialog'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import { exportToPdf } from '@/lib/pdf-utils'
import type { PdiGoalRecord } from '@/lib/types'

export default function PDI() {
  const { employee } = useAuth()
  const [goals, setGoals] = useState<PdiGoalRecord[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<PdiGoalRecord | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteGoal, setDeleteGoal] = useState<PdiGoalRecord | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setGoals(await fetchCompanyGoals())
    } catch {
      /* */
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useRealtime('pdi_goals', () => {
    load()
  })

  const handlePdf = () => {
    exportToPdf({
      title: 'Planos de Desenvolvimento (PDI)',
      subtitle: employee?.expand?.user?.name ?? 'Colaborador',
      sections: goals.map((g) => ({
        heading: g.title,
        items: [
          { label: 'Colaborador', value: g.expand?.employee?.expand?.user?.name ?? 'N/A' },
          { label: 'Status', value: g.status.replace('_', ' ') },
          { label: 'Progresso', value: `${g.progress}%` },
          ...(g.due_date
            ? [{ label: 'Prazo', value: new Date(g.due_date).toLocaleDateString('pt-BR') }]
            : []),
        ],
        content: g.description || undefined,
      })),
    })
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Planos de Desenvolvimento (PDI)
          </h1>
          <p className="text-muted-foreground mt-1">
            Transforme lacunas em ações concretas de crescimento.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePdf} disabled={goals.length === 0}>
            <FileDown className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button
            className="shadow-sm active:scale-95 transition-all"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Área
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {goals.map((g) => (
          <Card key={g.id} className="border-t-4 border-t-blue-500 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6 border">
                      <AvatarFallback className="text-xs">
                        {g.expand?.employee?.expand?.user?.name?.charAt(0) ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-slate-600">
                      {g.expand?.employee?.expand?.user?.name ?? 'Desconhecido'}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-2"
                  >
                    {g.status.replace('_', ' ')}
                  </Badge>
                  <CardTitle className="text-xl">{g.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{g.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditGoal(g)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        setDeleteGoal(g)
                        setDeleteOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Progresso</span>
                  <span className="font-bold text-blue-600">{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="h-2 [&>div]:bg-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
        {goals.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum PDI cadastrado.</p>
        )}
      </div>

      <AddPdiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={load}
        defaultEmployeeId={employee?.id}
      />

      <EditPdiDialog goal={editGoal} open={editOpen} onOpenChange={setEditOpen} onUpdated={load} />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir PDI"
        description="Tem certeza que deseja excluir esta área de desenvolvimento? Esta ação não pode ser desfeita."
        onConfirm={async () => {
          if (deleteGoal) await deletePdiGoal(deleteGoal.id)
        }}
      />
    </div>
  )
}
