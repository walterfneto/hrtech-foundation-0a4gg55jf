import { useState, useEffect, useCallback } from 'react'
import { fetchFeedbacks, createFeedback } from '@/services/feedbacks'
import { fetchEmployees } from '@/services/employees'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Heart, Lock, Send } from 'lucide-react'
import { EmployeeCombobox } from '@/components/feedback/employee-combobox'
import { toast } from 'sonner'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'
import type { FeedbackRecord, EmployeeRecord } from '@/lib/types'

const FEEDBACK_TYPES = [
  {
    value: 'public_praise',
    label: 'Público (Elogio)',
    icon: Heart,
    activeClass: 'bg-primary text-white border-primary',
    idleClass: 'hover:bg-slate-100',
  },
  {
    value: 'confidential_improvement',
    label: 'Privado (Construtivo)',
    icon: Lock,
    activeClass: 'bg-amber-500 text-white border-amber-500',
    idleClass: 'hover:bg-slate-100',
  },
] as const

export default function Feedback() {
  const { employee } = useAuth()
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([])
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState({
    receiver: '',
    type: 'public_praise',
    content: '',
  })

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

  const myFeedbacks = feedbacks.filter(
    (f) => f.sender === employee?.id || f.receiver === employee?.id,
  )
  const publicPraise = feedbacks.filter((f) => f.type === 'public_praise')

  const handleSubmit = async () => {
    if (!employee) {
      toast.error('Perfil de colaborador não encontrado.')
      return
    }
    if (!form.receiver || !form.content.trim()) {
      toast.error('Preencha o destinatário e a mensagem.')
      return
    }
    setSubmitting(true)
    setFieldErrors({})
    try {
      await createFeedback({
        sender: employee.id,
        receiver: form.receiver,
        type: form.type,
        content: form.content.trim(),
      })
      toast.success('Feedback enviado com sucesso!')
      setForm({ receiver: '', type: 'public_praise', content: '' })
      load()
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) {
        toast.error('Erro ao enviar feedback.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getName = (emp?: any) => emp?.expand?.user?.name ?? 'Desconhecido'
  const getInitial = (emp?: any) => emp?.expand?.user?.name?.charAt(0) ?? 'U'

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Feedback Contínuo</h1>
        <p className="text-muted-foreground mt-1">
          Reconheça conquistas ou envie feedbacks de desenvolvimento.
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 border">
          <TabsTrigger value="feed">Mural de Elogios</TabsTrigger>
          <TabsTrigger value="enviar">Enviar Feedback</TabsTrigger>
          <TabsTrigger value="meus">Meus Feedbacks</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6 space-y-4">
          {publicPraise.map((f) => (
            <Card key={f.id} className="shadow-sm border-slate-200">
              <CardContent className="p-5 flex items-start gap-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback>{getInitial(f.expand?.sender)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-900">
                      {getName(f.expand?.sender)}
                    </span>
                    <span className="text-muted-foreground text-sm">enviou feedback para</span>
                    <span className="font-semibold text-primary">
                      {getName(f.expand?.receiver)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {f.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-700 font-normal capitalize"
                    >
                      {f.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {publicPraise.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum elogio público registrado.
            </p>
          )}
        </TabsContent>

        <TabsContent value="enviar" className="mt-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-2">
                <Label className="text-sm font-semibold">Para quem? *</Label>
                <EmployeeCombobox
                  employees={employees.filter(
                    (e) => e.status === 'active' && e.id !== employee?.id,
                  )}
                  value={form.receiver}
                  onChange={(id) => setForm({ ...form, receiver: id })}
                  placeholder="Selecione um colaborador"
                />
                {fieldErrors.receiver && (
                  <p className="text-sm text-red-500">{fieldErrors.receiver}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-semibold">Tipo de Feedback *</Label>
                <div className="flex gap-2 flex-wrap">
                  {FEEDBACK_TYPES.map((ft) => {
                    const Icon = ft.icon
                    const isActive = form.type === ft.value
                    return (
                      <button
                        key={ft.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: ft.value })}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${isActive ? ft.activeClass : `border-slate-200 bg-white text-slate-600 ${ft.idleClass}`}`}
                      >
                        <Icon className="h-4 w-4" />
                        {ft.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-semibold">Mensagem *</Label>
                <Textarea
                  className="min-h-[120px] bg-slate-50"
                  placeholder="Descreva a situação, o comportamento e o impacto..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
                {fieldErrors.content && (
                  <p className="text-sm text-red-500">{fieldErrors.content}</p>
                )}
              </div>

              <Button
                className="w-full sm:w-auto active:scale-95 transition-all"
                onClick={handleSubmit}
                disabled={submitting || !form.receiver || !form.content.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar Feedback
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meus" className="mt-6 space-y-4">
          {myFeedbacks.map((f) => {
            const isSender = f.sender === employee?.id
            const other = isSender ? f.expand?.receiver : f.expand?.sender
            return (
              <Card key={f.id} className="shadow-sm border-slate-200">
                <CardContent className="p-5 flex items-start gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>{getInitial(other)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-900">
                        {isSender ? 'Você' : getName(other)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {isSender ? 'enviou para' : 'recebido de'}
                      </span>
                      <span className="font-semibold text-primary">
                        {isSender ? getName(f.expand?.receiver) : 'Você'}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {f.content}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`mt-3 font-normal capitalize ${
                        f.type === 'public_praise'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {f.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {myFeedbacks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum feedback registrado.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
