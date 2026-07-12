import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { fetchFeedbacks } from '@/services/feedbacks'
import { fetchEmployees } from '@/services/employees'
import { fetchAllOneOnOnes } from '@/services/one-on-ones'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Heart, Lock, CalendarDays, Users, ShieldCheck } from 'lucide-react'
import { Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import type { FeedbackRecord, EmployeeRecord } from '@/lib/types'
import { getAvatarUrl } from '@/services/helpers'

const chartConfig: ChartConfig = {
  recebidos: { label: 'Recebidos', color: 'hsl(var(--primary))' },
  enviados: { label: 'Enviados', color: 'hsl(38 92% 50%)' },
}

export default function LeaderDashboard() {
  const { employee, role } = useAuth()
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([])
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [oneOnOnes, setOneOnOnes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [fbs, emps, o3s] = await Promise.all([
        fetchFeedbacks(),
        fetchEmployees(),
        fetchAllOneOnOnes().catch(() => []),
      ])
      setFeedbacks(fbs)
      setEmployees(emps)
      setOneOnOnes(o3s as any[])
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('feedbacks', () => load())
  useRealtime('one_on_ones', () => load())

  const empId = employee?.id ?? ''

  const stats = useMemo(() => {
    const tm = employees.filter((e) => e.manager === empId && e.status === 'active')
    const teamIds = new Set(tm.map((m) => m.id))
    teamIds.add(empId)
    const tf = feedbacks.filter((f) => teamIds.has(f.sender) || teamIds.has(f.receiver))
    const pc = tf.filter((f) => f.type === 'public_praise').length
    const cc = tf.filter((f) => f.type === 'confidential_improvement').length
    const completed = oneOnOnes
      .filter(
        (o) => (teamIds.has(o.employee) || teamIds.has(o.manager)) && o.status === 'completed',
      )
      .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    const days = completed[0]
      ? Math.floor((Date.now() - new Date(completed[0].scheduled_at).getTime()) / 86400000)
      : null
    const mfc = tm.map((m) => ({
      member: m,
      received: tf.filter((f) => f.receiver === m.id).length,
      sent: tf.filter((f) => f.sender === m.id).length,
    }))
    return {
      teamMembers: tm,
      teamFeedbacks: tf,
      publicCount: pc,
      confidentialCount: cc,
      daysSinceLast1on1: days,
      memberFeedbackCounts: mfc,
    }
  }, [employees, feedbacks, oneOnOnes, empId])

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-8">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (role !== 'Gestor' && role !== 'Admin RH') {
    return (
      <div className="text-center py-12 text-muted-foreground max-w-4xl mx-auto">
        <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>Acesso restrito a gestores.</p>
      </div>
    )
  }

  const pieData = [
    { name: 'Públicos', value: stats.publicCount, fill: 'hsl(var(--primary))' },
    { name: 'Privados', value: stats.confidentialCount, fill: 'hsl(38 92% 50%)' },
  ]
  const barData = stats.memberFeedbackCounts.map((m) => ({
    name: m.member.expand?.user?.name?.split(' ')[0] ?? '?',
    recebidos: m.received,
    enviados: m.sent,
  }))

  const statCards = [
    {
      label: 'Total de Feedbacks',
      value: stats.teamFeedbacks.length,
      icon: MessageSquare,
      color: 'text-primary',
      border: 'border-l-primary',
    },
    {
      label: 'Elogios Públicos',
      value: stats.publicCount,
      icon: Heart,
      color: 'text-teal-500',
      border: 'border-l-teal-400',
    },
    {
      label: 'Construtivos Privados',
      value: stats.confidentialCount,
      icon: Lock,
      color: 'text-amber-500',
      border: 'border-l-amber-400',
    },
    {
      label: 'Dias últ. 1:1',
      value: stats.daysSinceLast1on1 ?? '—',
      icon: CalendarDays,
      color: 'text-blue-500',
      border: 'border-l-blue-400',
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Painel do Líder</h1>
        <p className="text-muted-foreground mt-1">
          Métricas de feedback e desenvolvimento da sua equipe.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className={s.border}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Tipos</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={e.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feedbacks por Membro</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-square max-h-[250px] w-full">
              <BarChart data={barData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="recebidos" fill="hsl(var(--primary))" radius={4} />
                <Bar dataKey="enviados" fill="hsl(38 92% 50%)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Equipe Direta
          </CardTitle>
          <CardDescription>Resumo de feedbacks por liderado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.memberFeedbackCounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nenhum liderado encontrado.</p>
          ) : (
            stats.memberFeedbackCounts.map((mfc) => {
              const user = mfc.member.expand?.user
              const avatarUrl = user ? getAvatarUrl(user) : null
              return (
                <div
                  key={mfc.member.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={avatarUrl ?? undefined} />
                      <AvatarFallback>{user?.name?.charAt(0) ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name ?? 'Colaborador'}</p>
                      <p className="text-xs text-muted-foreground">{mfc.member.job_title}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                      {mfc.received} recebidos
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                      {mfc.sent} enviados
                    </Badge>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
