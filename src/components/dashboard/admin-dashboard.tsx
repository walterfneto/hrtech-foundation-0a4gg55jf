import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileCheck, Target, MessageCircle } from 'lucide-react'
import {
  LoadingState,
  EmptyState,
  FeedbackItem,
  CycleItem,
  GoalProgressItem,
} from './dashboard-shared'
import type { DashboardData } from '@/hooks/use-dashboard-data'

export function AdminDashboard({ data }: { data: DashboardData }) {
  if (data.loading) return <LoadingState />

  const activeEmployees = data.employees.filter((e) => e.status === 'active')
  const activeCycles = data.cycles.filter((c) => c.status === 'active')
  const completedGoals = data.pdiGoals.filter((g) => g.status === 'completed')
  const totalItems = data.pdiGoals.length + data.tasks.length
  const completedItems =
    completedGoals.length + data.tasks.filter((t) => t.status === 'completed').length
  const overallCompletion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboradores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees.length}</div>
            <p className="text-xs text-muted-foreground">{data.employees.length} no total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ciclos Ativos</CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeCycles.length}</div>
            <p className="text-xs text-muted-foreground">{data.cycles.length} ciclos no total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas e Tarefas</CardTitle>
            <Target className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-500">{overallCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              {completedItems} de {totalItems} concluídas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedbacks</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.feedbacks.length}</div>
            <p className="text-xs text-muted-foreground">Total registrados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ciclos de Avaliação Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeCycles.length === 0 ? (
              <EmptyState message="Nenhum ciclo ativo encontrado." />
            ) : (
              activeCycles.slice(0, 5).map((c) => <CycleItem key={c.id} cycle={c} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feedbacks Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.feedbacks.length === 0 ? (
              <EmptyState message="Nenhum feedback registrado ainda." />
            ) : (
              data.feedbacks.slice(0, 5).map((f) => <FeedbackItem key={f.id} feedback={f} />)
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Metas e OKRs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {data.pdiGoals.length === 0 ? (
            <EmptyState message="Nenhuma meta cadastrada." />
          ) : (
            data.pdiGoals.slice(0, 4).map((g) => <GoalProgressItem key={g.id} goal={g} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
