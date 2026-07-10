import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Target, Users, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { fetchCompanyGoals, deletePdiGoal } from '@/services/pdi-goals'
import { useRealtime } from '@/hooks/use-realtime'
import { AddGoalDialog } from '@/components/goals/add-goal-dialog'
import { EditGoalDialog } from '@/components/goals/edit-goal-dialog'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type { PdiGoalRecord } from '@/lib/types'

const STATUS_STYLES: Record<string, { label: string; className: string; bar: string }> = {
  todo: { label: 'A Fazer', className: 'bg-slate-100 text-slate-600', bar: '[&>div]:bg-slate-400' },
  in_progress: {
    label: 'Em Progresso',
    className: 'bg-blue-50 text-blue-700',
    bar: '[&>div]:bg-blue-500',
  },
  completed: {
    label: 'Concluído',
    className: 'bg-emerald-50 text-emerald-700',
    bar: '[&>div]:bg-emerald-500',
  },
}

export default function Goals() {
  const [goals, setGoals] = useState<PdiGoalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<PdiGoalRecord | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteGoal, setDeleteGoal] = useState<PdiGoalRecord | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setGoals(await fetchCompanyGoals())
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('pdi_goals', () => {
    load()
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Metas e OKRs</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhamento de objetivos estratégicos e individuais.
          </p>
        </div>
        <Button className="shadow-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Objetivo
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">
            Nenhum objetivo cadastrado ainda. Crie o primeiro!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((g) => {
            const st = STATUS_STYLES[g.status] ?? STATUS_STYLES.todo
            return (
              <Card key={g.id} className="border-t-4 border-t-primary shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="mb-2 bg-slate-50 text-slate-600 flex w-fit items-center gap-1"
                      >
                        <Users className="h-3 w-3" /> Objetivo
                      </Badge>
                      <CardTitle className="text-lg leading-tight">{g.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={st.className}>
                        {st.label}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
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
                  </div>
                </CardHeader>
                <CardContent>
                  {g.description && (
                    <p className="text-sm text-muted-foreground mb-3">{g.description}</p>
                  )}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground font-medium">Progresso</span>
                      <span className="font-bold text-slate-700">{g.progress ?? 0}%</span>
                    </div>
                    <Progress value={g.progress ?? 0} className={`h-2 ${st.bar}`} />
                  </div>
                  {g.due_date && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Prazo: {new Date(g.due_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AddGoalDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={load} />
      <EditGoalDialog goal={editGoal} open={editOpen} onOpenChange={setEditOpen} onUpdated={load} />
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir Objetivo"
        description="Tem certeza que deseja excluir este objetivo? Esta ação não pode ser desfeita."
        onConfirm={async () => {
          if (deleteGoal) await deletePdiGoal(deleteGoal.id)
        }}
      />
    </div>
  )
}
