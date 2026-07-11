import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, TrendingUp, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import {
  LoadingState,
  EmptyState,
  GoalProgressItem,
  CycleItem,
  FeedbackItem,
} from './dashboard-shared'
import type { DashboardData } from '@/hooks/use-dashboard-data'
import { useAuth } from '@/hooks/use-auth'

export function EmployeeDashboard({ data }: { data: DashboardData }) {
  const { employee, user } = useAuth()

  if (data.loading) return <LoadingState />

  const myTasks = data.tasks.filter((t) => t.assignee === employee?.id)
  const pendingTasks = myTasks.filter((t) => t.status !== 'completed')
  const myGoals = data.pdiGoals.filter((g) => g.employee === employee?.id)
  const activeCycles = data.cycles.filter((c) => c.status === 'active')
  const myFeedbacks = data.feedbacks
    .filter((f) => f.expand?.receiver?.id === employee?.id)
    .slice(0, 3)

  return (
    <div className="space-y-6 animate-fade-in-up">
      {pendingTasks.length > 0 && (
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Central de Pendências Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingTasks.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center bg-muted/50 p-3 rounded border"
              >
                <span className="text-sm font-medium">{t.title}</span>
                <Badge variant="destructive" className="bg-red-500">
                  {t.priority}
                </Badge>
              </div>
            ))}
            <Button asChild variant="link" className="px-0 text-red-600 dark:text-red-400">
              <Link to="/tarefas">Ver todas as tarefas</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-6 text-white shadow-elevation">
        <h2 className="text-xl font-bold">Olá, {user?.name ?? 'Colaborador'}!</h2>
        <p className="mt-2 opacity-90 text-sm max-w-xl">
          Você tem {pendingTasks.length} tarefa(s) pendente(s) e {myGoals.length} meta(s) em
          desenvolvimento.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-amber-500" />
              Avaliações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeCycles.length === 0 ? (
              <EmptyState message="Nenhuma avaliação ativa." />
            ) : (
              activeCycles.slice(0, 3).map((c) => <CycleItem key={c.id} cycle={c} />)
            )}
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link to="/avaliacoes">Ir para Avaliações</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Meu Desenvolvimento (PDI)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myGoals.length === 0 ? (
              <EmptyState message="Nenhuma meta de desenvolvimento encontrada." />
            ) : (
              myGoals.slice(0, 3).map((g) => <GoalProgressItem key={g.id} goal={g} />)
            )}
          </CardContent>
        </Card>
      </div>

      {myFeedbacks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-teal-500" />
              Feedbacks Recebidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {myFeedbacks.map((f) => (
              <FeedbackItem key={f.id} feedback={f} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
