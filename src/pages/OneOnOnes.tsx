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
import {
  Calendar,
  Plus,
  Video,
  MoreVertical,
  Pencil,
  Trash2,
  FileDown,
  Target,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { fetchAllOneOnOnes, deleteOneOnOne, type OneOnOneRecord } from '@/services/one-on-ones'
import { AddOneOnOneDialog } from '@/components/one-on-ones/add-one-on-one-dialog'
import { EditOneOnOneDialog } from '@/components/one-on-ones/edit-one-on-one-dialog'
import { OneOnOneHistory } from '@/components/one-on-ones/one-on-one-history'
import { DeleteDialog } from '@/components/shared/delete-dialog'
import { exportToPdf } from '@/lib/pdf-utils'
import { ONE_ON_ONE_STATUS } from '@/lib/status'

const DETAIL_FIELDS = [
  {
    key: 'objective',
    label: 'Objetivo / Finalidade',
    icon: Target,
    color: 'text-muted-foreground',
  },
  { key: 'reason', label: 'Motivo', icon: FileText, color: 'text-muted-foreground' },
  { key: 'positive_points', label: 'O que está bom', icon: TrendingUp, color: 'text-primary' },
  {
    key: 'improvement_points',
    label: 'O que precisa melhorar',
    icon: TrendingDown,
    color: 'text-warning',
  },
  { key: 'report', label: 'Relatório da Reunião', icon: FileText, color: 'text-muted-foreground' },
] as const

export default function OneOnOnes() {
  const { employee, role } = useAuth()
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
  const selIsMgr = selected?.manager === employee?.id
  const selOther = selIsMgr ? selected?.expand?.employee : selected?.expand?.manager
  const otherName = selOther?.expand?.user?.name ?? selOther?.job_title ?? 'Colaborador'
  const canEdit = selIsMgr || role === 'Admin RH'

  const handlePdf = () => {
    if (!selected) return
    const dateStr = selected.scheduled_at
      ? new Date(selected.scheduled_at).toLocaleString('pt-BR')
      : 'N/A'
    const sections: Array<any> = [
      {
        heading: 'Informações',
        items: [
          { label: 'Data', value: dateStr },
          { label: 'Participante', value: otherName },
          { label: 'Status', value: ONE_ON_ONE_STATUS[selected.status]?.label ?? selected.status },
        ],
      },
    ]
    if (selected.objective)
      sections.push({ heading: 'Objetivo / Finalidade', content: selected.objective })
    if (selected.reason) sections.push({ heading: 'Motivo', content: selected.reason })
    if (selected.positive_points)
      sections.push({ heading: 'O que está bom', content: selected.positive_points })
    if (selected.improvement_points)
      sections.push({ heading: 'O que precisa melhorar', content: selected.improvement_points })
    if (selected.report)
      sections.push({ heading: 'Relatório da Reunião', content: selected.report })
    if (selected.action_deadline)
      sections.push({
        heading: 'Prazo',
        content: new Date(selected.action_deadline).toLocaleDateString('pt-BR'),
      })
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reuniões 1:1</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Alinhamento estruturado, relatórios e histórico.
          </p>
        </div>
        <Button className="transition-colors" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agendar 1:1
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Reuniões</h3>
          {meetings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma reunião agendada.</p>
          ) : (
            meetings.map((m) => {
              const isMgr = m.manager === employee?.id
              const other = isMgr ? m.expand?.employee : m.expand?.manager
              const oName = other?.expand?.user?.name ?? other?.job_title ?? 'Colaborador'
              const stCfg = ONE_ON_ONE_STATUS[m.status] ?? ONE_ON_ONE_STATUS.planned
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
                  className={`rounded-lg border bg-card shadow-subtle cursor-pointer transition-colors ${selectedId === m.id ? 'ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                  onClick={() => setSelectedId(m.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`${stCfg.bg} ${stCfg.text}`}>{dateStr}</Badge>
                      {m.status === 'planned' && <Video className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback>{oName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-foreground">{oName}</p>
                        <p className="text-xs text-muted-foreground">{other?.job_title}</p>
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
            <Card className="rounded-lg border bg-card shadow-subtle h-full min-h-[500px] flex flex-col">
              <CardHeader className="bg-muted/50 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-card">
                      <AvatarFallback>{otherName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-semibold tracking-tight">
                        1:1 com {otherName}
                      </CardTitle>
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
                    {canEdit && (
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
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 space-y-4">
                {DETAIL_FIELDS.map((f) => {
                  const val = selected[f.key as keyof OneOnOneRecord] as string
                  if (!val) return null
                  return (
                    <div key={f.key}>
                      <h4
                        className={`text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2`}
                      >
                        <f.icon className={`h-4 w-4 ${f.color}`} /> {f.label}
                      </h4>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{val}</p>
                    </div>
                  )
                })}
                {selected.action_deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded border">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Prazo para ser feito:</span>{' '}
                    {new Date(selected.action_deadline).toLocaleDateString('pt-BR')}
                  </div>
                )}
                {!selected.objective &&
                  !selected.reason &&
                  !selected.positive_points &&
                  !selected.improvement_points &&
                  !selected.report && (
                    <p className="text-sm text-muted-foreground italic">
                      Nenhuma informação registrada. Clique em Editar para adicionar.
                    </p>
                  )}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-lg border bg-card shadow-subtle h-full flex items-center justify-center min-h-[500px]">
              <CardContent>
                <p className="text-muted-foreground">Selecione uma reunião.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <OneOnOneHistory meetings={meetings} />
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
