import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, UserRound, Mail, Phone, Pencil, Eye, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fetchCandidates, updateCandidate } from '@/services/candidates'
import { useRealtime } from '@/hooks/use-realtime'
import { AddCandidateDialog } from '@/components/recruitment/add-candidate-dialog'
import { EditCandidateDialog } from '@/components/recruitment/edit-candidate-dialog'
import { CandidateProfileDialog } from '@/components/recruitment/candidate-profile-dialog'
import { toast } from 'sonner'
import type { CandidateRecord, CandidateCompetency } from '@/lib/types'

const STAGES = [
  { key: 'screening', label: 'Triagem', color: 'border-t-slate-400' },
  { key: 'interview', label: 'Entrevista', color: 'border-t-blue-500' },
  { key: 'offer', label: 'Proposta', color: 'border-t-amber-500' },
  { key: 'hired', label: 'Contratado', color: 'border-t-emerald-500' },
  { key: 'rejected', label: 'Rejeitado', color: 'border-t-red-400' },
] as const

const STAGE_LABELS: Record<string, string> = {
  screening: 'Triagem',
  interview: 'Entrevista',
  offer: 'Proposta',
  hired: 'Contratado',
  rejected: 'Rejeitado',
}

const LEVEL_COLORS: Record<string, string> = {
  iniciante: 'bg-slate-100 text-slate-600',
  intermediario: 'bg-blue-100 text-blue-700',
  avancado: 'bg-emerald-100 text-emerald-700',
  especialista: 'bg-purple-100 text-purple-700',
}

const LEVEL_LABELS: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  especialista: 'Especialista',
}

function parseCompetencies(raw: any): CandidateCompetency[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((s: any) => (typeof s === 'string' ? { name: s, level: '', notes: '' } : s))
  }
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map((s: any) => (typeof s === 'string' ? { name: s, level: '', notes: '' } : s))
    }
  } catch {
    /* intentionally ignored */
  }
  return []
}

export default function Recruitment() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editCandidate, setEditCandidate] = useState<CandidateRecord | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [profileCandidate, setProfileCandidate] = useState<CandidateRecord | null>(null)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      setCandidates(await fetchCandidates())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('candidates', () => {
    load()
  })

  const handleStageChange = async (candidate: CandidateRecord, newStatus: string) => {
    try {
      await updateCandidate(candidate.id, { status: newStatus } as any)
      toast.success(`${candidate.name} movido para ${STAGE_LABELS[newStatus] || newStatus}`)
    } catch {
      toast.error('Erro ao alterar status do candidato.')
    }
  }

  const openEdit = (c: CandidateRecord) => {
    setEditCandidate(c)
    setEditDialogOpen(true)
  }

  const openProfile = (c: CandidateRecord) => {
    setProfileCandidate(c)
    setProfileDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recrutamento</h1>
          <p className="text-muted-foreground mt-1">Pipeline de candidatos e processo seletivo.</p>
        </div>
        <Button className="shadow-sm" onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Candidato
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-12">
          <UserRound className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Nenhum candidato cadastrado. Adicione o primeiro!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter(
              (c) => (c.status || 'screening') === stage.key,
            )
            return (
              <div key={stage.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-slate-700">{stage.label}</h3>
                  <Badge variant="outline" className="text-xs">
                    {stageCandidates.length}
                  </Badge>
                </div>
                <div
                  className={`rounded-lg border-t-4 ${stage.color} bg-white border shadow-sm min-h-[200px] p-2 space-y-2`}
                >
                  {stageCandidates.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">Vazio</p>
                  ) : (
                    stageCandidates.map((c) => {
                      const comps = parseCompetencies(c.skills)
                      return (
                        <Card key={c.id} className="shadow-none group relative">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-slate-800 truncate">
                                  {c.name}
                                </p>
                                {c.role && (
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {c.role}
                                  </p>
                                )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openProfile(c)}>
                                    <Eye className="h-3.5 w-3.5 mr-2" /> Ver Perfil
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openEdit(c)}>
                                    <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <p className="px-2 py-1 text-[10px] text-muted-foreground">
                                    Mover para:
                                  </p>
                                  {STAGES.filter((s) => s.key !== (c.status || 'screening')).map(
                                    (s) => (
                                      <DropdownMenuItem
                                        key={s.key}
                                        onClick={() => handleStageChange(c, s.key)}
                                      >
                                        {s.label}
                                      </DropdownMenuItem>
                                    ),
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="space-y-0.5">
                              {c.email && (
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3 shrink-0" /> {c.email}
                                </p>
                              )}
                              {c.phone && (
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                                  <Phone className="h-3 w-3 shrink-0" /> {c.phone}
                                </p>
                              )}
                            </div>
                            {comps.length > 0 && (
                              <div className="space-y-1">
                                {comps.slice(0, 2).map((comp, i) => (
                                  <div key={i} className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] text-slate-600 truncate">
                                      {comp.name}
                                    </span>
                                    {comp.level && (
                                      <Badge
                                        className={`text-[8px] px-1 py-0 ${LEVEL_COLORS[comp.level] || 'bg-slate-100'}`}
                                      >
                                        {LEVEL_LABELS[comp.level] || comp.level}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                                {comps.length > 2 && (
                                  <p className="text-[9px] text-muted-foreground">
                                    +{comps.length - 2} competências
                                  </p>
                                )}
                              </div>
                            )}
                            {(c.observations || c.interview_info) && (
                              <div className="flex gap-1 pt-1">
                                {c.observations && (
                                  <Badge variant="outline" className="text-[8px] px-1 py-0 gap-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Obs.
                                  </Badge>
                                )}
                                {c.interview_info && (
                                  <Badge variant="outline" className="text-[8px] px-1 py-0 gap-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />{' '}
                                    Entrev.
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AddCandidateDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onCreated={load} />
      <EditCandidateDialog
        candidate={editCandidate}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdated={load}
      />
      <CandidateProfileDialog
        candidate={profileCandidate}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onUpdated={load}
      />
    </div>
  )
}
