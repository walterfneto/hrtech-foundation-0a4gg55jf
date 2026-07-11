import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Calendar, MessageSquare, ThumbsUp, Lock } from 'lucide-react'
import type { EvaluationCycleRecord, FeedbackRecord, PdiGoalRecord } from '@/lib/types'

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p className="text-sm">{message}</p>
    </div>
  )
}

const feedbackTypeConfig: Record<string, { label: string; icon: typeof ThumbsUp; color: string }> =
  {
    public_praise: { label: 'Reconhecimento Público', icon: ThumbsUp, color: 'text-teal-500' },
    confidential_improvement: {
      label: 'Melhoria Confidencial',
      icon: Lock,
      color: 'text-amber-500',
    },
    '1_on_1': { label: 'Feedback 1:1', icon: MessageSquare, color: 'text-blue-500' },
  }

export function FeedbackItem({ feedback }: { feedback: FeedbackRecord }) {
  const sender = feedback.expand?.sender
  const senderUser = sender?.expand?.user
  const receiver = feedback.expand?.receiver
  const receiverUser = receiver?.expand?.user
  const config = feedbackTypeConfig[feedback.type] ?? feedbackTypeConfig['1_on_1']
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors">
      <div className={`mt-0.5 ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-medium truncate">
            {senderUser?.name ?? sender?.job_title ?? 'Colaborador'}
          </span>
          <span className="text-xs text-muted-foreground">→</span>
          <span className="text-sm text-muted-foreground truncate">
            {receiverUser?.name ?? receiver?.job_title ?? 'Colaborador'}
          </span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{feedback.content}</p>
        <Badge variant="outline" className="mt-1 text-[10px]">
          {config.label}
        </Badge>
      </div>
    </div>
  )
}

export function CycleItem({ cycle }: { cycle: EvaluationCycleRecord }) {
  const templateName = cycle.expand?.template?.name ?? 'Sem template'
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{cycle.title}</p>
        <p className="text-xs text-muted-foreground truncate">{templateName}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-2">
        <Calendar className="h-3 w-3" />
        <span>{cycle.end_date ? new Date(cycle.end_date).toLocaleDateString('pt-BR') : '—'}</span>
      </div>
    </div>
  )
}

export function GoalProgressItem({ goal }: { goal: PdiGoalRecord }) {
  const pct = goal.progress ?? 0
  const statusLabel =
    goal.status === 'completed'
      ? 'Concluído'
      : goal.status === 'in_progress'
        ? 'Em Progresso'
        : 'A Fazer'
  const statusColor =
    goal.status === 'completed'
      ? 'text-teal-600 bg-teal-100'
      : goal.status === 'in_progress'
        ? 'text-amber-600 bg-amber-100'
        : 'text-slate-600 bg-slate-100'
  return (
    <div className="p-3 bg-slate-50 border rounded-lg">
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="text-sm font-medium leading-tight">{goal.title}</p>
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div
          className="bg-primary rounded-full h-1.5 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{pct}% concluído</p>
    </div>
  )
}
