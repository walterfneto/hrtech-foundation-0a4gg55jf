import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { createCycle, fetchTemplates } from '@/lib/api'
import { MOCK_TEAMS } from '@/lib/org-data'
import type { EvaluationTemplate } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function CycleDialog({ open, onOpenChange, onCreated }: Props) {
  const [nome, setNome] = useState('')
  const [templateId, setTemplateId] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [target, setTarget] = useState<'empresa' | 'times'>('empresa')
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([])

  useEffect(() => {
    if (open) fetchTemplates().then(setTemplates)
  }, [open])

  const toggleTeam = (id: string) =>
    setSelectedTeams((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))

  const handleSubmit = async () => {
    if (!nome.trim() || !templateId || !dataInicio || !dataFim) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    await createCycle({
      nome,
      template_id: templateId,
      data_inicio: dataInicio,
      data_fim: dataFim,
      target,
      target_teams: target === 'times' ? selectedTeams : [],
    })
    toast.success('Ciclo de avaliação criado!')
    setNome('')
    setTemplateId('')
    setDataInicio('')
    setDataFim('')
    setSelectedTeams([])
    onCreated()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Ciclo de Avaliação</DialogTitle>
          <DialogDescription>
            Configure um novo ciclo com template, datas e participantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome do Ciclo</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ciclo Semestral 2026.2"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Data de Início</Label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Data de Fim</Label>
              <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Participantes</Label>
            <Select value={target} onValueChange={(v: 'empresa' | 'times') => setTarget(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empresa">Toda a Empresa</SelectItem>
                <SelectItem value="times">Times Específicos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {target === 'times' && (
            <div className="space-y-2 border rounded-lg p-3 bg-slate-50/50">
              {MOCK_TEAMS.map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTeams.includes(t.id)}
                    onCheckedChange={() => toggleTeam(t.id)}
                    id={`team-${t.id}`}
                  />
                  <Label htmlFor={`team-${t.id}`} className="text-sm cursor-pointer">
                    {t.nome}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Criar Ciclo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
