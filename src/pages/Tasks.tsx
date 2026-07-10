import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, ListTodo } from 'lucide-react'
import { fetchTasks } from '@/services/tasks'
import { useRealtime } from '@/hooks/use-realtime'
import { AddTaskDialog } from '@/components/tasks/add-task-dialog'
import type { TaskRecord } from '@/lib/types'

const COLUMNS = [
  { key: 'todo', label: 'A Fazer', color: 'border-t-slate-400' },
  { key: 'in_progress', label: 'Em Progresso', color: 'border-t-blue-500' },
  { key: 'completed', label: 'Concluído', color: 'border-t-emerald-500' },
] as const

const PRIORITY_LABELS: Record<string, { label: string; className: string }> = {
  low: { label: 'Baixa', className: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Média', className: 'bg-amber-50 text-amber-700' },
  high: { label: 'Alta', className: 'bg-red-50 text-red-700' },
}

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setTasks(await fetchTasks())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('tasks', () => {
    load()
  })

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tarefas</h1>
          <p className="text-muted-foreground mt-1">Gerencie tarefas da equipe em quadro Kanban.</p>
        </div>
        <Button className="shadow-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Nenhuma tarefa cadastrada. Crie a primeira!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => (t.status || 'todo') === col.key)
            return (
              <div key={col.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-700">{col.label}</h3>
                  <Badge variant="outline" className="text-xs">
                    {colTasks.length}
                  </Badge>
                </div>
                <div
                  className={`rounded-lg border-t-4 ${col.color} bg-white border shadow-sm min-h-[200px] p-3 space-y-3`}
                >
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">Nenhuma tarefa</p>
                  ) : (
                    colTasks.map((t) => {
                      const pr = PRIORITY_LABELS[t.priority] ?? PRIORITY_LABELS.medium
                      return (
                        <Card key={t.id} className="shadow-none">
                          <CardContent className="p-3">
                            <p className="font-medium text-sm text-slate-800">{t.title}</p>
                            {t.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {t.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className={`text-[10px] ${pr.className}`}>
                                {pr.label}
                              </Badge>
                              {t.due_date && (
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(t.due_date).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={load} />
    </div>
  )
}
