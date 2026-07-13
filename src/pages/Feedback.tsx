import { useState, useEffect, useCallback } from 'react'
import { fetchFeedbacks, filterVisibleFeedbacks } from '@/services/feedbacks'
import { fetchEmployees } from '@/services/employees'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { FeedbackCard } from '@/components/feedback/feedback-card'
import { FeedbackSendForm } from '@/components/feedback/feedback-send-form'
import type { FeedbackRecord, EmployeeRecord } from '@/lib/types'

export default function Feedback() {
  const { employee } = useAuth()
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([])
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [fbs, emps] = await Promise.all([fetchFeedbacks(), fetchEmployees()])
      setFeedbacks(fbs)
      setEmployees(emps)
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useRealtime('feedbacks', () => {
    load()
  })

  const empId = employee?.id ?? ''
  const visible = filterVisibleFeedbacks(feedbacks, empId)
  const received = visible.filter((f) => f.receiver === empId)
  const sent = visible.filter((f) => f.sender === empId)
  const publicPraise = feedbacks.filter(
    (f) => f.type === 'public_praise' && filterVisibleFeedbacks([f], empId).length > 0,
  )

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  const emptyMsg = (msg: string) => <p className="text-center text-muted-foreground py-8">{msg}</p>

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Feedback Contínuo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reconheça conquistas ou envie feedbacks de desenvolvimento.
        </p>
      </div>

      <Tabs defaultValue="recebidos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
          <TabsTrigger value="enviados">Enviados</TabsTrigger>
          <TabsTrigger value="mural">Mural</TabsTrigger>
          <TabsTrigger value="enviar">Enviar</TabsTrigger>
        </TabsList>

        <TabsContent value="recebidos" className="mt-6 space-y-4">
          {received.length > 0
            ? received.map((f) => (
                <FeedbackCard key={f.id} feedback={f} view="received" currentEmployeeId={empId} />
              ))
            : emptyMsg('Nenhum feedback recebido ainda.')}
        </TabsContent>

        <TabsContent value="enviados" className="mt-6 space-y-4">
          {sent.length > 0
            ? sent.map((f) => (
                <FeedbackCard key={f.id} feedback={f} view="sent" currentEmployeeId={empId} />
              ))
            : emptyMsg('Você ainda não enviou nenhum feedback.')}
        </TabsContent>

        <TabsContent value="mural" className="mt-6 space-y-4">
          {publicPraise.length > 0
            ? publicPraise.map((f) => (
                <FeedbackCard key={f.id} feedback={f} view="mural" currentEmployeeId={empId} />
              ))
            : emptyMsg('Nenhum elogio público registrado.')}
        </TabsContent>

        <TabsContent value="enviar" className="mt-6">
          <FeedbackSendForm employees={employees} currentEmployeeId={empId} onSubmitted={load} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
