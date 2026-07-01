import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { AvaliacaoModelo, Questao, QuestionType } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (template: AvaliacaoModelo) => void
}

export function TemplateBuilderDialog({ open, onOpenChange, onSave }: Props) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [questoes, setQuestoes] = useState<Questao[]>([
    { id: `q-${Date.now()}`, texto: '', tipo: 'escala', escala_max: 5 },
  ])

  const addQuestion = () =>
    setQuestoes((prev) => [
      ...prev,
      { id: `q-${Date.now()}`, texto: '', tipo: 'escala', escala_max: 5 },
    ])
  const removeQuestion = (id: string) => setQuestoes((prev) => prev.filter((q) => q.id !== id))
  const updateQ = (id: string, patch: Partial<Questao>) =>
    setQuestoes((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  const addOption = (qid: string) =>
    updateQ(qid, { opcoes: [...(questoes.find((q) => q.id === qid)?.opcoes || []), ''] })
  const updateOption = (qid: string, idx: number, val: string) => {
    const q = questoes.find((q) => q.id === qid)
    if (!q?.opcoes) return
    const opcoes = [...q.opcoes]
    opcoes[idx] = val
    updateQ(qid, { opcoes })
  }

  const handleSave = () => {
    onSave({
      id: `tpl-${Date.now()}`,
      empresa_id: 'emp-1',
      nome,
      descricao,
      questoes: questoes.filter((q) => q.texto.trim()),
      deleted_at: null,
    })
    setNome('')
    setDescricao('')
    setQuestoes([{ id: `q-${Date.now()}`, texto: '', tipo: 'escala', escala_max: 5 }])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Modelo de Avaliação</DialogTitle>
          <DialogDescription>Defina as questões que compõem este modelo.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome do Modelo</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Avaliação Semestral"
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Breve descrição do modelo"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-3">
            <Label>Questões</Label>
            {questoes.map((q, i) => (
              <div key={q.id} className="p-3 border rounded-lg space-y-2 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={q.texto}
                    onChange={(e) => updateQ(q.id, { texto: e.target.value })}
                    placeholder={`Questão ${i + 1}`}
                    className="flex-1"
                  />
                  <Select
                    value={q.tipo}
                    onValueChange={(v) => updateQ(q.id, { tipo: v as QuestionType })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escala">Escala</SelectItem>
                      <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                      <SelectItem value="texto">Texto Aberto</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(q.id)}
                    className="shrink-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {q.tipo === 'multipla_escolha' && (
                  <div className="pl-6 space-y-1">
                    {q.opcoes?.map((op, idx) => (
                      <Input
                        key={idx}
                        value={op}
                        onChange={(e) => updateOption(q.id, idx, e.target.value)}
                        placeholder={`Opção ${idx + 1}`}
                        className="h-8 text-sm"
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(q.id)}
                      className="h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Adicionar opção
                    </Button>
                  </div>
                )}
                {q.tipo === 'escala' && (
                  <div className="pl-6 flex items-center gap-2 text-xs text-muted-foreground">
                    Escala máxima:
                    <Select
                      value={String(q.escala_max || 5)}
                      onValueChange={(v) => updateQ(q.id, { escala_max: Number(v) })}
                    >
                      <SelectTrigger className="w-20 h-7">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 5, 7, 10].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Questão
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!nome.trim() || !questoes.some((q) => q.texto.trim())}
          >
            Criar Modelo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
