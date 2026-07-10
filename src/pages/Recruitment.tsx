import { useState, useEffect } from 'react'
import { fetchCandidates, updateCandidate, createCandidate } from '@/services/modules'
import type { CandidateRecord } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Mail } from 'lucide-react'

export default function Recruitment() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([])

  const load = async () => setCandidates(await fetchCandidates())
  useEffect(() => {
    load()
  }, [])

  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData('cid', id)
  const handleDrop = async (e: React.DragEvent, status: CandidateRecord['status']) => {
    const id = e.dataTransfer.getData('cid')
    if (!id) return
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    await updateCandidate(id, { status })
  }
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const columns = [
    { id: 'screening', label: 'Triagem' },
    { id: 'interview', label: 'Entrevista' },
    { id: 'offer', label: 'Proposta' },
    { id: 'hired', label: 'Contratado' },
    { id: 'rejected', label: 'Rejeitado' },
  ] as const

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Banco de Talentos</h1>
          <p className="text-muted-foreground mt-1">Pipeline de recrutamento inteligente.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Candidato
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
        {columns.map((col) => (
          <div
            key={col.id}
            className="min-w-[280px] w-[280px] bg-slate-50/50 border rounded-lg p-3 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="font-semibold text-slate-700 mb-3 flex items-center justify-between">
              {col.label}{' '}
              <Badge variant="secondary">
                {candidates.filter((c) => c.status === col.id).length}
              </Badge>
            </div>
            <div className="flex-1 space-y-3">
              {candidates
                .filter((c) => c.status === col.id)
                .map((c) => (
                  <Card
                    key={c.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, c.id)}
                    className="cursor-move hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3">
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{c.role}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {c.email}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.skills?.map((s) => (
                          <Badge key={s} variant="outline" className="text-[9px] px-1 py-0">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
