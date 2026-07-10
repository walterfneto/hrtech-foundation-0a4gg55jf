import { useState, useEffect } from 'react'
import { fetchTasks, updateTask, createTask } from '@/services/modules'
import type { TaskRecord } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Plus } from 'lucide-react'

export default function Tasks() {
  const { employee } = useAuth()
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const loadTasks = async () => {
    if (!employee) return
    const data = await fetchTasks(employee.id)
    setTasks(data)
  }
  useEffect(() => {
    loadTasks()
  }, [employee])
  useRealtime('tasks', () => loadTasks())

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id)
  }

  const handleDrop = async (e: React.DragEvent, status: 'todo' | 'in_progress' | 'completed') => {
    const id = e.dataTransfer.getData('taskId')
    if (!id) return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    await updateTask(id, { status })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleCreate = async () => {
    if (!newTaskTitle.trim() || !employee) return
    await createTask({
      title: newTaskTitle,
      status: 'todo',
      assignee: employee.id,
      priority: 'medium',
    })
    setNewTaskTitle('')
    loadTasks()
  }

  const columns = [
    { id: 'todo', label: 'A Fazer' },
    { id: 'in_progress', label: 'Em Andamento' },
    { id: 'completed', label: 'Concluído' },
  ] as const

  return (
    <div className="space-y-6 animate-fade-in-up h-full flex flex-col min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tarefas (Kanban)</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas pendências e projetos.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Nova tarefa..."
            className="max-w-[200px]"
          />
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Adicionar</span>
          </Button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col.id}
            className="bg-slate-50/50 border rounded-lg p-4 flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <h3 className="font-semibold text-slate-700 mb-4 flex justify-between items-center">
              {col.label}{' '}
              <Badge variant="secondary">{tasks.filter((t) => t.status === col.id).length}</Badge>
            </h3>
            <div className="flex-1 space-y-3">
              {tasks
                .filter((t) => t.status === col.id)
                .map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-move hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <p className="font-medium text-sm text-slate-800">{task.title}</p>
                      <div className="flex justify-between items-center mt-3">
                        <Badge
                          variant="outline"
                          className={
                            task.priority === 'high'
                              ? 'text-red-500 bg-red-50 border-red-200'
                              : 'text-slate-500'
                          }
                        >
                          {task.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
