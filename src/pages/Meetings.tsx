import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { fetchAllOneOnOnes, updateOneOnOne } from '@/services/one-on-ones'
import { AddOneOnOneDialog } from '@/components/one-on-ones/add-one-on-one-dialog'
import { getAvatarUrl } from '@/services/helpers'
import { toast } from 'sonner'
import type { OneOnOneRecord } from '@/services/one-on-ones'

export default function Meetings() {
  const { employee } = useAuth()
  const [sessions, setSessions] = useState<OneOnOneRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [agendaInputs, setAgendaInputs] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    if (!employee) return
    try {
      setSessions(await fetchAllOneOnOnes(employee.id))
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }, [employee])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('one_on_ones', () => {
    load()
  })

  const getNotes = (s: OneOnOneRecord): Record<string, any> => {
    if (!s.notes) return { agenda: [], privateNotes: '' }
    if (typeof s.notes === 'string') {
      try {
        return JSON.parse(s.notes)
      } catch {
        return { agenda: [], privateNotes: '' }
      }
    }
    return s.notes as Record<string, any>
  }

  const addAgendaItem = async (sessionId: string) => {
    const text = (agendaInputs[sessionId] || '').trim()
    if (!text) return
    const session = sessions.find((s) => s.id === sessionId)
    if (!session) return
    const notes = getNotes(session)
    const agenda = notes.agenda || []
    agenda.push({ id: Date.now().toString(), text, done: false })
    try {
      await updateOneOnOne(sessionId, { notes: { ...notes, agenda } })
      setAgendaInputs({ ...agendaInputs, [sessionId]: '' })
      toast.success('Item adicionado à pauta!')
    } catch {
      toast.error('Erro ao adicionar item.')
    }
  }

  const plannedSessions = sessions.filter((s) => s.status === 'planned')

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reuniões 1:1</h1>
          <p className="text-muted-foreground mt-1">
            Alinhamento, pautas colaborativas e histórico.
          </p>
        </div>
        <Button className="shadow-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agendar 1:1
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : plannedSessions.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">
            Nenhuma reunião 1:1 agendada. Clique em "Agendar 1:1".
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {plannedSessions.map((s) => {
            const emp = s.expand?.employee
            const user = emp?.expand?.user
            const notes = getNotes(s)
            const agenda: any[] = notes.agenda || []
            return (
              <Card key={s.id} className="shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user ? (getAvatarUrl(user) ?? undefined) : undefined} />
                      <AvatarFallback>{user?.name?.charAt(0) ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{user?.name ?? 'Colaborador'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(s.scheduled_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700">Planejada</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Pauta Colaborativa
                    </p>
                    {agenda.length > 0 ? (
                      agenda.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-start gap-2 p-2 bg-slate-50 rounded-md"
                        >
                          <span
                            className={`text-sm ${a.done ? 'line-through text-muted-foreground' : 'text-slate-700'}`}
                          >
                            {a.text}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Nenhum item na pauta ainda.
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={agendaInputs[s.id] || ''}
                        onChange={(e) =>
                          setAgendaInputs({ ...agendaInputs, [s.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addAgendaItem(s.id)
                          }
                        }}
                        placeholder="Adicionar item à pauta..."
                        className="text-sm"
                      />
                      <Button size="sm" variant="outline" onClick={() => addAgendaItem(s.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {employee && (
        <AddOneOnOneDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCreated={load}
          managerId={employee.id}
        />
      )}
    </div>
  )
}
