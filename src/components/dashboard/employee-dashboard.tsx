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
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <Card className="rounded-lg border bg-card shadow-subtle border-l-2 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
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
                <Badge variant="destructive">{t.priority}</Badge>
              </div>
            ))}
            <Button asChild variant="link" className="px-0 text-destructive">
              <Link to="/tarefas">Ver todas as tarefas</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-lg border bg-card shadow-subtle">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Olá, {user?.name ?? 'Colaborador'}!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Você tem {pendingTasks.length} tarefa(s) pendente(s) e {myGoals.length} meta(s) em
            desenvolvimento.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              Avaliações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 divide-y divide-border">
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

        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Meu Desenvolvimento (PDI)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 divide-y divide-border">
            {myGoals.length === 0 ? (
              <EmptyState message="Nenhuma meta de desenvolvimento encontrada." />
            ) : (
              myGoals.slice(0, 3).map((g) => <GoalProgressItem key={g.id} goal={g} />)
            )}
          </CardContent>
        </Card>
      </div>

      {myFeedbacks.length > 0 && (
        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Feedbacks Recebidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 divide-y divide-border">
            {myFeedbacks.map((f) => (
              <FeedbackItem key={f.id} feedback={f} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
