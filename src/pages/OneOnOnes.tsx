import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Calendar, Plus, Video, MoreVertical, Pencil, Trash2, FileDown } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { fetchAllOneOnOnes, deleteOneOnOne, type OneOnOneRecord } from '@/services/one-on-ones'
import { AddOneOnOneDialog } from '@/components/one-on-ones/add-one-on-one-dialog'
import { EditOneOnOneDialog } from '@/components/one-on-ones/edit-one-on-one-dialog'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import { exportToPdf } from '@/lib/pdf-utils'

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  planned: { label: 'Agendada', class: 'bg-blue-50 text-blue-700' },
  completed: { label: 'Concluída', class: 'bg-emerald-50 text-emerald-700' },
  cancelled: { label: 'Cancelada', class: 'bg-rose-50 text-rose-700' },
}

function parseNotes(notes: any): Record<string, any> {
  if (!notes) return {}
  if (typeof notes === 'string') {
    try {
      return JSON.parse(notes)
    } catch {
      return {}
    }
  }
  return notes
}

export default function OneOnOnes() {
  const { employee } = useAuth()
  const [meetings, setMeetings] = useState<OneOnOneRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const load = useCallback(async () => {
    if (!employee) {
      setLoading(false)
      return
    }
    try {
      setMeetings(await fetchAllOneOnOnes(employee.id))
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }, [employee])

  useEffect(() => {
    load()
  }, [load])
  useEffect(() => {
    if (!selectedId && meetings.length > 0) setSelectedId(meetings[0].id)
  }, [meetings, selectedId])
  useRealtime('one_on_ones', () => {
    load()
  })

  const selected = meetings.find((m) => m.id === selectedId) ?? null
  const notes = parseNotes(selected?.notes)
  const selIsMgr = selected?.manager === employee?.id
  const selOther = selIsMgr ? selected?.expand?.employee : selected?.expand?.manager
  const otherName = selOther?.expand?.user?.name ?? selOther?.job_title ?? 'Colaborador'

  const handlePdf = () => {
    if (!selected) return
    const dateStr = selected.scheduled_at
      ? new Date(selected.scheduled_at).toLocaleString('pt-BR')
      : 'N/A'
    const sections: Array<{
      heading: string
      items?: Array<{ label: string; value: string }>
      content?: string
      list?: Array<{ text: string; done?: boolean }>
    }> = [
      {
        heading: 'Informações',
        items: [
          { label: 'Data', value: dateStr },
          { label: 'Participante', value: otherName },
          { label: 'Status', value: STATUS_BADGE[selected.status]?.label ?? selected.status },
        ],
      },
    ]
    if (notes.agenda?.length)
      sections.push({
        heading: 'Pauta',
        list: notes.agenda.map((a: any) => ({ text: typeof a === 'string' ? a : a.text })),
      })
    if (notes.summary) sections.push({ heading: 'Resumo', content: notes.summary })
    if (notes.privateNotes)
      sections.push({ heading: 'Notas Privadas', content: notes.privateNotes })
    exportToPdf({
      title: 'Relatório de Reunião 1:1',
      subtitle: `${otherName} • ${dateStr}`,
      sections,
    })
  }

  const handleDelete = async () => {
    if (selected) {
      await deleteOneOnOne(selected.id)
      setSelectedId(null)
    }
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reuniões 1:1</h1>
          <p className="text-slate-500 mt-1">Alinhamento, pautas e histórico.</p>
        </div>
        <Button
          className="shadow-sm active:scale-95 transition-all"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Agendar 1:1
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-slate-800">Reuniões</h3>
          {meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma reunião agendada.</p>
          ) : (
            meetings.map((m) => {
              const isMgr = m.manager === employee?.id
              const other = isMgr ? m.expand?.employee : m.expand?.manager
              const oName = other?.expand?.user?.name ?? other?.job_title ?? 'Colaborador'
              const st = STATUS_BADGE[m.status] ?? STATUS_BADGE.planned
              const dateStr = m.scheduled_at
                ? new Date(m.scheduled_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''
              return (
                <Card
                  key={m.id}
                  className={`shadow-sm cursor-pointer transition-colors ${selectedId === m.id ? 'border-blue-300 bg-blue-50/50 ring-1 ring-blue-500' : 'hover:bg-slate-50'}`}
                  onClick={() => setSelectedId(m.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={st.class}>{dateStr}</Badge>
                      {m.status === 'planned' && <Video className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarFallback>{oName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{oName}</p>
                        <p className="text-xs text-slate-500">{other?.job_title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
        <div className="md:col-span-2">
          {selected ? (
            <Card className="shadow-md h-full min-h-[500px] flex flex-col">
              <CardHeader className="bg-slate-50/80 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback>{otherName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">1:1 com {otherName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3" />{' '}
                        {selected.scheduled_at
                          ? new Date(selected.scheduled_at).toLocaleString('pt-BR')
                          : 'N/A'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePdf}>
                      <FileDown className="w-4 h-4 mr-1" /> PDF
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditOpen(true)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                {notes.agenda?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
                      Pauta
                    </h4>
                    <ul className="space-y-2">
                      {notes.agenda.map((item: any, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 p-3 bg-white border rounded-md shadow-sm"
                        >
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 ${item.done ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          />
                          <p className="text-sm font-medium text-slate-800">
                            {typeof item === 'string' ? item : item.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {notes.summary && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Resumo
                    </h4>
                    <p className="text-sm text-slate-700">{notes.summary}</p>
                  </div>
                )}
                {notes.privateNotes && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Notas Privadas
                    </h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                      {notes.privateNotes}
                    </p>
                  </div>
                )}
                {!notes.agenda?.length && !notes.summary && !notes.privateNotes && (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma nota registrada. Clique em Editar para adicionar.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[500px]">
              <CardContent>
                <p className="text-muted-foreground">Selecione uma reunião.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {employee && (
        <AddOneOnOneDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          onCreated={load}
          managerId={employee.id}
        />
      )}
      <EditOneOnOneDialog
        oneOnOne={selected}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={load}
      />
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir Reunião 1:1"
        description="Tem certeza que deseja excluir esta reunião? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
      />
    </div>
  )
}
