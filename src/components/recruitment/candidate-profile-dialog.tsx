import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Mail,
  Phone,
  Briefcase,
  FileText,
  MessageSquare,
  ClipboardCheck,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateCandidate } from '@/services/candidates'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import type { CandidateRecord, CandidateCompetency } from '@/lib/types'

const LEVEL_LABELS: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
  especialista: 'Especialista',
}

const LEVEL_COLORS: Record<string, string> = {
  iniciante: 'bg-slate-100 text-slate-600',
  intermediario: 'bg-blue-100 text-blue-700',
  avancado: 'bg-emerald-100 text-emerald-700',
  especialista: 'bg-purple-100 text-purple-700',
}

interface Props {
  candidate: CandidateRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function CandidateProfileDialog({ candidate, open, onOpenChange, onUpdated }: Props) {
  const [saving, setSaving] = useState(false)
  const [observations, setObservations] = useState('')
  const [interviewInfo, setInterviewInfo] = useState('')

  useEffect(() => {
    if (candidate && open) {
      setObservations(candidate.observations || '')
      setInterviewInfo(candidate.interview_info || '')
    }
  }, [candidate, open])

  const handleSave = async () => {
    if (!candidate) return
    setSaving(true)
    try {
      await updateCandidate(candidate.id, {
        observations,
        interview_info: interviewInfo,
      } as any)
      toast.success('Informações salvas com sucesso!')
      onUpdated()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar informações.')
    } finally {
      setSaving(false)
    }
  }

  if (!candidate) return null

  const competencies: CandidateCompetency[] = (() => {
    const raw = (candidate as any).skills
    if (Array.isArray(raw)) {
      return raw.map((s: any) => (typeof s === 'string' ? { name: s, level: '', notes: '' } : s))
    }
    try {
      const parsed = JSON.parse(raw || '[]')
      if (Array.isArray(parsed)) {
        return parsed.map((s: any) =>
          typeof s === 'string' ? { name: s, level: '', notes: '' } : s,
        )
      }
    } catch {
      /* intentionally ignored */
    }
    return []
  })()

  const evaluationDetails = (() => {
    const raw = (candidate as any).evaluation_details
    if (Array.isArray(raw)) return raw
    try {
      const parsed = JSON.parse(raw || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{candidate.name}</p>
              <p className="text-sm text-muted-foreground font-normal">
                {candidate.role || 'Cargo não definido'}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">Perfil do candidato</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
          {candidate.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {candidate.email}
            </span>
          )}
          {candidate.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {candidate.phone}
            </span>
          )}
          {candidate.role && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {candidate.role}
            </span>
          )}
        </div>

        <Tabs defaultValue="observations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="observations" className="text-xs">
              <FileText className="h-3.5 w-3.5 mr-1" /> Observações
            </TabsTrigger>
            <TabsTrigger value="interview" className="text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Entrevista
            </TabsTrigger>
            <TabsTrigger value="competencies" className="text-xs">
              <Award className="h-3.5 w-3.5 mr-1" /> Competências
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="text-xs">
              <ClipboardCheck className="h-3.5 w-3.5 mr-1" /> Avaliação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="observations" className="space-y-3 mt-3">
            <div className="space-y-2">
              <Label>Observações Gerais</Label>
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Registre observações gerais sobre o candidato..."
                className="min-h-[150px]"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1" /> Salvar
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="interview" className="space-y-3 mt-3">
            <div className="space-y-2">
              <Label>Informações da Entrevista</Label>
              <Textarea
                value={interviewInfo}
                onChange={(e) => setInterviewInfo(e.target.value)}
                placeholder="Registre feedback e detalhes da entrevista..."
                className="min-h-[150px]"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1" /> Salvar
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="competencies" className="space-y-3 mt-3">
            {competencies.length > 0 ? (
              <div className="space-y-2">
                {competencies.map((comp, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 bg-white p-3 flex items-start gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-slate-800">{comp.name}</p>
                        {comp.level && (
                          <Badge className={LEVEL_COLORS[comp.level] || 'bg-slate-100'}>
                            {LEVEL_LABELS[comp.level] || comp.level}
                          </Badge>
                        )}
                      </div>
                      {comp.notes && <p className="text-sm text-muted-foreground">{comp.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhuma competência registrada. Use o botão "Editar" para adicioná-las.
              </p>
            )}
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-3 mt-3">
            {evaluationDetails.length > 0 ? (
              <div className="space-y-2">
                {evaluationDetails.map((ev: any, i: number) => (
                  <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-slate-800">
                        {ev.criteria || `Critério ${i + 1}`}
                      </p>
                      <Badge variant="outline">{ev.rating}/5</Badge>
                    </div>
                    {ev.comment && <p className="text-sm text-muted-foreground">{ev.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhuma avaliação estruturada registrada.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
