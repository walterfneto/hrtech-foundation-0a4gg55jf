import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, ListChecks, Star, AlignLeft } from 'lucide-react'
import { MOCK_TEMPLATES } from '@/lib/eval-data'
import { TemplateBuilderDialog } from '@/components/evaluations/template-builder-dialog'
import type { AvaliacaoModelo } from '@/lib/types'
import { toast } from 'sonner'

const tipoIcon: Record<string, typeof Star> = {
  multipla_escolha: ListChecks,
  escala: Star,
  texto: AlignLeft,
}

const tipoLabel: Record<string, string> = {
  multipla_escolha: 'Múltipla Escolha',
  escala: 'Escala',
  texto: 'Texto Aberto',
}

export function TemplateManagerTab() {
  const [showBuilder, setShowBuilder] = useState(false)
  const [templates, setTemplates] = useState<AvaliacaoModelo[]>(MOCK_TEMPLATES)

  const handleSave = (template: AvaliacaoModelo) => {
    setTemplates((prev) => [...prev, template])
    setShowBuilder(false)
    toast.success('Modelo de avaliação criado com sucesso!')
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Modelos de Avaliação</h2>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie templates de avaliação de desempenho.
          </p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Modelo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{tpl.nome}</CardTitle>
                    <CardDescription className="text-xs">{tpl.descricao}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">{tpl.questoes.length} questões</p>
              <div className="flex flex-wrap gap-1.5">
                {tpl.questoes.map((q) => {
                  const Icon = tipoIcon[q.tipo] || Star
                  return (
                    <Badge key={q.id} variant="secondary" className="text-[10px] gap-1">
                      <Icon className="h-3 w-3" /> {tipoLabel[q.tipo]}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TemplateBuilderDialog open={showBuilder} onOpenChange={setShowBuilder} onSave={handleSave} />
    </div>
  )
}
