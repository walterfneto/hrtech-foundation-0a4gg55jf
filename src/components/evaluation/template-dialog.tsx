import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { createTemplate } from '@/lib/api'
import type { EvaluationQuestion, QuestionType } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

const emptyQuestion = (): EvaluationQuestion => ({
  id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  type: 'rating',
  label: '',
  required: true,
  scaleMax: 5,
})

export function TemplateDialog({ open, onOpenChange, onCreated }: Props) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([emptyQuestion()])

  const updateQ = (id: string, patch: Partial<EvaluationQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const removeQ = (id: string) => setQuestions((qs) => qs.filter((q) => q.id !== id))
  const addQ = () => setQuestions((qs) => [...qs, emptyQuestion()])

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toast.error('Informe o nome do template')
      return
    }
    if (questions.length === 0) {
      toast.error('Adicione ao menos uma pergunta')
      return
    }
    await createTemplate({ nome, descricao, questions })
    toast.success('Template criado com sucesso!')
    setNome('')
    setDescricao('')
    setQuestions([emptyQuestion()])
    onCreated()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Template de Avaliação</DialogTitle>
          <DialogDescription>Crie um modelo com perguntas customizadas.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tpl-nome">Nome do Template</Label>
            <Input
              id="tpl-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Avaliação Semestral"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tpl-desc">Descrição</Label>
            <Textarea
              id="tpl-desc"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o objetivo..."
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Perguntas</Label>
              <Button size="sm" variant="outline" onClick={addQ}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
              </Button>
            </div>
            {questions.map((q, i) => (
              <div key={q.id} className="border rounded-lg p-3 space-y-2 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Pergunta {i + 1}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto h-6 w-6 text-destructive"
                    onClick={() => removeQ(q.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Input
                  value={q.label}
                  onChange={(e) => updateQ(q.id, { label: e.target.value })}
                  placeholder="Texto da pergunta"
                />
                <Select
                  value={q.type}
                  onValueChange={(v: QuestionType) => updateQ(q.id, { type: v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Escala (1-N)</SelectItem>
                    <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                    <SelectItem value="text">Texto Aberto</SelectItem>
                  </SelectContent>
                </Select>
                {q.type === 'multiple_choice' && (
                  <Input
                    value={q.options?.join(', ') ?? ''}
                    onChange={(e) =>
                      updateQ(q.id, { options: e.target.value.split(',').map((s) => s.trim()) })
                    }
                    placeholder="Opções separadas por vírgula"
                  />
                )}
                {q.type === 'rating' && (
                  <Select
                    value={String(q.scaleMax ?? 5)}
                    onValueChange={(v) => updateQ(q.id, { scaleMax: Number(v) })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Escala 1-3</SelectItem>
                      <SelectItem value="5">Escala 1-5</SelectItem>
                      <SelectItem value="10">Escala 1-10</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Criar Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
