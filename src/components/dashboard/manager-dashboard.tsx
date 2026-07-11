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
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-amber-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pessoas na Equipe</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Liderados diretos ativos</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas em Risco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{goalsAtRisk.length}</div>
            <p className="text-xs text-muted-foreground">Requerem atenção</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ciclos Ativos</CardTitle>
            <FileEdit className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCycles.length}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status da Equipe Direta</CardTitle>
            <CardDescription>Resumo dos seus liderados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.length === 0 ? (
              <EmptyState message="Nenhum liderado encontrado." />
            ) : (
              teamMembers.map((m) => {
                const user = m.expand?.user
                const avatarUrl = user ? getAvatarUrl(user) : null
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors"
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ciclos Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeCycles.length === 0 ? (
              <EmptyState message="Nenhum ciclo ativo." />
            ) : (
              activeCycles.slice(0, 4).map((c) => <CycleItem key={c.id} cycle={c} />)
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metas da Equipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamGoals.length === 0 ? (
              <EmptyState message="Nenhuma meta atribuída à equipe." />
            ) : (
              teamGoals.slice(0, 3).map((g) => <GoalProgressItem key={g.id} goal={g} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feedbacks Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
