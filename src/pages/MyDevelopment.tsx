import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Star, MessageSquare, ChevronRight, Inbox } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { fetchMyEvaluations, type MyEvaluationRecord } from '@/services/my-evaluations'
import { fetchMyOneOnOnes, type OneOnOneRecord } from '@/services/one-on-ones'
import { EvaluationDetailDialog } from '@/components/my-development/evaluation-detail-dialog'
import { OneOnOneDetailDialog } from '@/components/my-development/one-on-one-detail-dialog'
import { getAvatarUrl } from '@/services/helpers'

const evalStatusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pendente', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  in_progress: { label: 'Em Andamento', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Concluída', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

const meetingStatusConfig: Record<string, { label: string; class: string }> = {
  planned: { label: 'Agendada', class: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Concluída', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelada', class: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export default function MyDevelopment() {
  const { employee, user } = useAuth()
  const [evaluations, setEvaluations] = useState<MyEvaluationRecord[]>([])
  const [oneOnOnes, setOneOnOnes] = useState<OneOnOneRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEval, setSelectedEval] = useState<MyEvaluationRecord | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<OneOnOneRecord | null>(null)
  const [evalDialogOpen, setEvalDialogOpen] = useState(false)
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false)

  const employeeId = employee?.id ?? ''

  const loadEvaluations = useCallback(async () => {
    if (!employeeId) return
    try {
      const data = await fetchMyEvaluations(employeeId)
      setEvaluations(data)
    } catch (err) {
      console.error('Failed to load evaluations:', err)
    }
  }, [employeeId])

  const loadOneOnOnes = useCallback(async () => {
    if (!employeeId) return
    try {
      const data = await fetchMyOneOnOnes(employeeId)
      setOneOnOnes(data)
    } catch (err) {
      console.error('Failed to load 1:1s:', err)
    }
  }, [employeeId])

  useEffect(() => {
    if (employeeId) {
      setLoading(true)
      Promise.all([loadEvaluations(), loadOneOnOnes()]).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [employeeId, loadEvaluations, loadOneOnOnes])

  useRealtime('evaluations', () => {
    loadEvaluations()
  })
  useRealtime('one_on_ones', () => {
    loadOneOnOnes()
  })

  const openEvalDetail = (evaluation: MyEvaluationRecord) => {
    setSelectedEval(evaluation)
    setEvalDialogOpen(true)
  }

  const openMeetingDetail = (meeting: OneOnOneRecord) => {
    setSelectedMeeting(meeting)
    setMeetingDialogOpen(true)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meu Desenvolvimento</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seus feedbacks, avaliações e reuniões 1:1 com seu gestor.
        </p>
      </div>

      <Tabs defaultValue="feedbacks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="feedbacks">
            <Star className="mr-1.5 h-4 w-4" /> Feedbacks
          </TabsTrigger>
          <TabsTrigger value="1a1">
            <Calendar className="mr-1.5 h-4 w-4" /> Reuniões 1:1
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedbacks" className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : evaluations.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-muted-foreground">Você ainda não possui feedbacks registrados</p>
              </CardContent>
            </Card>
          ) : (
            evaluations.map((evaluation) => {
              const cycle = evaluation.expand?.cycle
              const evaluator = evaluation.expand?.evaluator
              const status = evalStatusConfig[evaluation.status] ?? evalStatusConfig.pending
              const date = new Date(evaluation.created).toLocaleDateString('pt-BR')
              return (
                <Card
                  key={evaluation.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent
                    className="p-4 flex items-center justify-between gap-3"
                    onClick={() => openEvalDetail(evaluation)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {cycle?.title ?? 'Avaliação'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {date}
                          {evaluator?.expand?.user?.name ? ` • ${evaluator.expand.user.name}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {evaluation.status === 'completed' && (
                        <span className="text-sm font-bold text-primary hidden sm:block">
                          {evaluation.score?.toFixed(1) ?? '-'}
                        </span>
                      )}
                      <Badge variant="outline" className={status.class}>
                        {status.label}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="1a1" className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : oneOnOnes.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-muted-foreground">Nenhuma reunião 1:1 agendada</p>
              </CardContent>
            </Card>
          ) : (
            oneOnOnes.map((meeting) => {
              const manager = meeting.expand?.manager
              const managerName = manager?.expand?.user?.name ?? manager?.job_title ?? 'Gestor'
              const managerAvatar = manager?.expand?.user ? getAvatarUrl(manager.expand.user) : null
              const status = meetingStatusConfig[meeting.status] ?? meetingStatusConfig.planned
              const dateStr = meeting.scheduled_at
                ? new Date(meeting.scheduled_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'
              return (
                <Card key={meeting.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent
                    className="p-4 flex items-center justify-between gap-3"
                    onClick={() => openMeetingDetail(meeting)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 border shrink-0">
                        <AvatarImage src={managerAvatar ?? undefined} />
                        <AvatarFallback>{managerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          1:1 com {managerName}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {dateStr}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className={status.class}>
                        {status.label}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      <EvaluationDetailDialog
        evaluation={selectedEval}
        open={evalDialogOpen}
        onOpenChange={setEvalDialogOpen}
      />
      <OneOnOneDetailDialog
        oneOnOne={selectedMeeting}
        open={meetingDialogOpen}
        onOpenChange={setMeetingDialogOpen}
      />
    </div>
  )
}
