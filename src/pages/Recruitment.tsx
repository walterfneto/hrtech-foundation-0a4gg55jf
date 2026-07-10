import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, UserRound, Mail, Phone } from 'lucide-react'
import { fetchCandidates } from '@/services/candidates'
import { useRealtime } from '@/hooks/use-realtime'
import { AddCandidateDialog } from '@/components/recruitment/add-candidate-dialog'
import type { CandidateRecord } from '@/lib/types'

const STAGES = [
  { key: 'screening', label: 'Triagem', color: 'border-t-slate-400' },
  { key: 'interview', label: 'Entrevista', color: 'border-t-blue-500' },
  { key: 'offer', label: 'Proposta', color: 'border-t-amber-500' },
  { key: 'hired', label: 'Contratado', color: 'border-t-emerald-500' },
  { key: 'rejected', label: 'Rejeitado', color: 'border-t-red-400' },
] as const

function parseSkills(skills: any): string[] {
  if (!skills) return []
  if (Array.isArray(skills)) return skills
  try {
    return JSON.parse(skills)
  } catch {
    return []
  }
}

export default function Recruitment() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  return (
    <div className="space-y-6 animate-fade-in-up pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recrutamento</h1>
          <p className="text-muted-foreground mt-1">Pipeline de candidatos e processo seletivo.</p>
        </div>
        <Button className="shadow-sm" onClick={() => setDialogOpen(true)}>
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
                      const skills = parseSkills(c.skills)
                      return (
                        <Card key={c.id} className="shadow-none">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm text-slate-800">{c.name}</p>
                                {c.role && (
                                  <p className="text-[10px] text-muted-foreground">{c.role}</p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {c.email}
                              </p>
                              {c.phone && (
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {c.phone}
                                </p>
                              )}
                            </div>
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {skills.slice(0, 3).map((s) => (
                                  <Badge key={s} variant="secondary" className="text-[9px]">
                                    {s}
                                  </Badge>
                                ))}
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

      <AddCandidateDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={load} />
    </div>
  )
}
