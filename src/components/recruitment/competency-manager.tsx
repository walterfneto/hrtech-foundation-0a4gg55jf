import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Award } from 'lucide-react'
import type { CandidateCompetency } from '@/lib/types'

const LEVELS = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
  { value: 'especialista', label: 'Especialista' },
] as const

const LEVEL_COLORS: Record<string, string> = {
  iniciante: 'bg-slate-100 text-slate-600',
  intermediario: 'bg-blue-100 text-blue-700',
  avancado: 'bg-emerald-100 text-emerald-700',
  especialista: 'bg-purple-100 text-purple-700',
}

interface Props {
  competencies: CandidateCompetency[]
  onChange: (comps: CandidateCompetency[]) => void
}

export function CompetencyManager({ competencies, onChange }: Props) {
  const [newName, setNewName] = useState('')
  const [newLevel, setNewLevel] = useState<CandidateCompetency['level']>('')
  const [newNotes, setNewNotes] = useState('')

  const addCompetency = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    if (competencies.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return
    onChange([...competencies, { name: trimmed, level: newLevel, notes: newNotes.trim() }])
    setNewName('')
    setNewLevel('')
    setNewNotes('')
  }

  const removeCompetency = (index: number) => {
    onChange(competencies.filter((_, i) => i !== index))
  }

  const updateCompetency = (index: number, field: keyof CandidateCompetency, value: string) => {
    onChange(competencies.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-3">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <Award className="h-4 w-4 text-slate-500" /> Adicionar Competência
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCompetency()
              }
            }}
            placeholder="Nome da competência"
          />
          <Select
            value={newLevel || undefined}
            onValueChange={(v) => setNewLevel(v as CandidateCompetency['level'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nível de proficiência" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          placeholder="Comentário qualitativo (opcional)"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCompetency}
          disabled={!newName.trim()}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
        </Button>
      </div>

      {competencies.length > 0 ? (
        <div className="space-y-2">
          {competencies.map((comp, i) => (
            <div
              key={i}
              className="rounded-lg border bg-white p-3 flex flex-col sm:flex-row sm:items-start gap-3"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-1">
                  <p className="text-xs text-muted-foreground mb-0.5">Competência</p>
                  <p className="font-medium text-sm text-slate-800">{comp.name}</p>
                </div>
                <div className="sm:col-span-1">
                  <p className="text-xs text-muted-foreground mb-0.5">Nível</p>
                  {comp.level ? (
                    <Badge className={LEVEL_COLORS[comp.level] || 'bg-slate-100'}>
                      {LEVELS.find((l) => l.value === comp.level)?.label || comp.level}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <p className="text-xs text-muted-foreground mb-0.5">Comentário</p>
                  <Textarea
                    value={comp.notes}
                    onChange={(e) => updateCompetency(i, 'notes', e.target.value)}
                    placeholder="Adicione uma observação..."
                    className="min-h-[36px] text-sm"
                    rows={1}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-500"
                onClick={() => removeCompetency(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma competência adicionada.
        </p>
      )}
    </div>
  )
}
