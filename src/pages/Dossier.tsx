import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { DossierTimeline } from '@/components/dossier/dossier-timeline'
import { DossierPreview } from '@/components/dossier/dossier-preview'
import { DossierMetadata } from '@/components/dossier/dossier-metadata'
import { UploadDocumentDialog } from '@/components/dossier/upload-document-dialog'
import { fetchDossierEvents, fetchEmployeeInfo, type DossierEvent } from '@/services/dossier'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Upload, ArrowLeft } from 'lucide-react'
import { getAvatarUrl } from '@/services/helpers'

export default function Dossier() {
  const { employeeId: paramEmployeeId } = useParams()
  const { employee: currentEmployee } = useAuth()
  const employeeId = paramEmployeeId || currentEmployee?.id || ''

  const [events, setEvents] = useState<DossierEvent[]>([])
  const [employee, setEmployee] = useState<any>(null)
  const [selectedEventId, setSelectedEventId] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)

  const loadData = useCallback(async () => {
    if (!employeeId) {
      setLoading(false)
      return
    }
    try {
      const [emp, evts] = await Promise.all([
        fetchEmployeeInfo(employeeId).catch(() => null),
        fetchDossierEvents(employeeId),
      ])
      setEmployee(emp)
      setEvents(evts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const rtEnabled = !!employeeId
  useRealtime(
    'feedbacks',
    () => {
      loadData()
    },
    rtEnabled,
  )
  useRealtime(
    'one_on_ones',
    () => {
      loadData()
    },
    rtEnabled,
  )
  useRealtime(
    'evaluations',
    () => {
      loadData()
    },
    rtEnabled,
  )
  useRealtime(
    'employee_documents',
    () => {
      loadData()
    },
    rtEnabled,
  )

  useEffect(() => {
    if (events.length > 0 && !events.find((e) => e.id === selectedEventId)) {
      setSelectedEventId(events[0].id)
    }
  }, [events, selectedEventId])

  const selectedEvent = events.find((e) => e.id === selectedEventId)
  const empName = employee?.expand?.user?.name ?? 'Colaborador'
  const empTitle = employee?.job_title ?? ''
  const empDept = employee?.department ?? ''
  const empAvatar = employee?.expand?.user ? getAvatarUrl(employee.expand.user) : null

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[calc(100vh-10rem)] w-full rounded-xl" />
      </div>
    )
  }

  if (!employeeId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)] animate-fade-in">
        <div className="text-center">
          <p className="text-muted-foreground">Nenhum colaborador selecionado.</p>
          <Button asChild className="mt-4">
            <Link to="/equipe">Ver Equipe</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {paramEmployeeId && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/equipe">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dossiê do Colaborador
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Histórico completo unificado, visão 360° inspirada no e-Proc.
            </p>
          </div>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Enviar Documento
        </Button>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden border rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="h-20 border-b bg-slate-50/80 flex items-center px-6 gap-4 shrink-0">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={empAvatar ?? undefined} />
            <AvatarFallback>{empName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-lg leading-none text-slate-900">{empName}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              {empTitle && <span className="text-sm font-medium text-slate-600">{empTitle}</span>}
              {empTitle && empDept && <span className="text-slate-300">•</span>}
              {empDept && <span className="text-sm text-slate-500">{empDept}</span>}
              <span className="text-slate-300">•</span>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[9px] px-1.5 py-0"
              >
                Ativo
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 max-w-[320px] border-r overflow-y-auto bg-slate-50/30">
            <DossierTimeline
              events={events}
              selectedId={selectedEventId}
              onSelect={setSelectedEventId}
            />
          </div>
          <div className="flex-1 flex min-w-0">
            <div className="flex-1 border-r overflow-y-auto p-8 bg-white">
              {selectedEvent ? (
                <DossierPreview event={selectedEvent} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  {events.length === 0
                    ? 'Nenhum registro encontrado para este colaborador.'
                    : 'Selecione um evento na linha do tempo'}
                </div>
              )}
            </div>
            <div className="w-64 lg:w-72 bg-slate-50/50 overflow-y-auto p-6">
              {selectedEvent && <DossierMetadata event={selectedEvent} />}
            </div>
          </div>
        </div>
      </div>

      <UploadDocumentDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        employeeId={employeeId}
        onUploaded={loadData}
      />
    </div>
  )
}
