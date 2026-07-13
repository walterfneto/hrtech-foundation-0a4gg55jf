import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertTriangle, Calendar, FileEdit, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import {
  LoadingState,
  EmptyState,
  CycleItem,
  GoalProgressItem,
  FeedbackItem,
} from './dashboard-shared'
import type { DashboardData } from '@/hooks/use-dashboard-data'
import { useAuth } from '@/hooks/use-auth'
import { getAvatarUrl } from '@/services/helpers'

export function ManagerDashboard({ data }: { data: DashboardData }) {
  const { employee } = useAuth()

  if (data.loading) return <LoadingState />

  const teamMembers = data.employees.filter(
    (e) => e.manager === employee?.id && e.status === 'active',
  )
  const activeCycles = data.cycles.filter((c) => c.status === 'active')
  const teamGoals = data.pdiGoals.filter((g) => teamMembers.some((m) => m.id === g.employee))
  const goalsAtRisk = teamGoals.filter((g) => g.status !== 'completed' && (g.progress ?? 0) < 50)
  const recentFeedbacks = data.feedbacks.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pessoas na Equipe
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums tracking-tight">
              {teamMembers.length}
            </div>
            <p className="text-xs text-muted-foreground">Liderados diretos ativos</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metas em Risco
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums tracking-tight text-destructive">
              {goalsAtRisk.length}
            </div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ciclos Ativos
            </CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums tracking-tight">
              {activeCycles.length}
            </div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status da Equipe Direta
            </CardTitle>
            <CardDescription>Resumo dos seus liderados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 divide-y divide-border">
            {teamMembers.length === 0 ? (
              <EmptyState message="Nenhum liderado encontrado." />
            ) : (
              teamMembers.map((m) => {
                const user = m.expand?.user
                const avatarUrl = user ? getAvatarUrl(user) : null
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={avatarUrl ?? undefined} />
                        <AvatarFallback>
                          {(user?.name ?? m.job_title ?? '?').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {user?.name ?? 'Colaborador'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{m.job_title}</p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Link to="/equipe">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ciclos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 divide-y divide-border">
            {activeCycles.length === 0 ? (
              <EmptyState message="Nenhum ciclo ativo." />
            ) : (
              activeCycles.slice(0, 4).map((c) => <CycleItem key={c.id} cycle={c} />)
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metas da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 divide-y divide-border">
            {teamGoals.length === 0 ? (
              <EmptyState message="Nenhuma meta atribuída à equipe." />
            ) : (
              teamGoals.slice(0, 3).map((g) => <GoalProgressItem key={g.id} goal={g} />)
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg border bg-card shadow-subtle">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Feedbacks Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 divide-y divide-border">
            {recentFeedbacks.length === 0 ? (
              <EmptyState message="Nenhum feedback registrado." />
            ) : (
              recentFeedbacks.map((f) => <FeedbackItem key={f.id} feedback={f} />)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
