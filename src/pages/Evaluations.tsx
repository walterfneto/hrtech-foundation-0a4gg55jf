import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, FileText, CalendarRange, ClipboardList, Sparkles } from 'lucide-react'
import { TemplateDialog } from '@/components/evaluation/template-dialog'
import { CycleDialog } from '@/components/evaluation/cycle-dialog'
import { EvaluationFormDialog } from '@/components/evaluation/evaluation-form-dialog'
import { fetchTemplates, fetchCycles, fetchResponses } from '@/lib/api'
import { MOCK_ORG_USERS } from '@/lib/org-data'
import type { EvaluationTemplate, EvaluationCycle, EvaluationResponse } from '@/lib/types'

const statusColors: Record<string, string> = {
  ativo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rascunho: 'bg-slate-50 text-slate-600 border-slate-200',
  encerrado: 'bg-blue-50 text-blue-700 border-blue-200',
  concluido: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rascunho_r: 'bg-amber-50 text-amber-700 border-amber-200',
  nao_iniciado: 'bg-slate-50 text-slate-500 border-slate-200',
}

export default function Evaluations() {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([])
  const [cycles, setCycles] = useState<EvaluationCycle[]>([])
  const [responses, setResponses] = useState<EvaluationResponse[]>([])
  const [tplOpen, setTplOpen] = useState(false)
  const [cycOpen, setCycOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedTpl, setSelectedTpl] = useState<EvaluationTemplate | null>(null)
  const [selectedCycle, setSelectedCycle] = useState<EvaluationCycle | null>(null)

  const loadData = async () => {
    const [tpls, cycs] = await Promise.all([fetchTemplates(), fetchCycles()])
    setTemplates(tpls)
    setCycles(cycs)
    if (cycs.length > 0) {
      const resp = await fetchResponses(cycs[0].id)
      setResponses(resp)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openForm = (tpl: EvaluationTemplate, cyc: EvaluationCycle) => {
    setSelectedTpl(tpl)
    setSelectedCycle(cyc)
    setFormOpen(true)
  }

  const activeCycle = cycles.find((c) => c.status === 'ativo')
  const activeTpl = activeCycle ? templates.find((t) => t.id === activeCycle.template_id) : null
  const completed = responses.filter((r) => r.status === 'concluido').length
  const progress = responses.length > 0 ? (completed / responses.length) * 100 : 0

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Avaliações de Desempenho
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie templates, ciclos e execute avaliações.
        </p>
      </div>

      <Tabs defaultValue="ciclos">
        <TabsList>
          <TabsTrigger value="ciclos">
            <CalendarRange className="mr-1.5 h-4 w-4" /> Ciclos
          </TabsTrigger>
          <TabsTrigger value="modelos">
            <FileText className="mr-1.5 h-4 w-4" /> Modelos
          </TabsTrigger>
          <TabsTrigger value="avaliar">
            <ClipboardList className="mr-1.5 h-4 w-4" /> Avaliar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ciclos" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setCycOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Ciclo
            </Button>
          </div>
          {cycles.map((c) => {
            const tpl = templates.find((t) => t.id === c.template_id)
            return (
              <Card key={c.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{c.nome}</CardTitle>
                      <CardDescription>{tpl?.nome ?? 'Template não encontrado'}</CardDescription>
                    </div>
                    <Badge variant="outline" className={statusColors[c.status]}>
                      {c.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <span>Início: {new Date(c.data_inicio).toLocaleDateString('pt-BR')}</span>
                    <span>Fim: {new Date(c.data_fim).toLocaleDateString('pt-BR')}</span>
                    <span>
                      Alvo: {c.target === 'empresa' ? 'Toda a empresa' : 'Times específicos'}
                    </span>
                  </div>
                  {c.status === 'ativo' && responses.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progresso da equipe</span>
                        <span>
                          {completed}/{responses.length} concluídas
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="modelos" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setTplOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Novo Modelo
            </Button>
          </div>
          {templates.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-base">{t.nome}</CardTitle>
                <CardDescription>{t.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {t.questions.map((q) => (
                    <Badge key={q.id} variant="secondary" className="text-xs">
                      {q.type === 'rating'
                        ? 'Escala'
                        : q.type === 'multiple_choice'
                          ? 'Múltipla'
                          : 'Texto'}
                      : {q.label}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t.questions.length} perguntas</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="avaliar" className="space-y-4">
          {activeCycle && activeTpl ? (
            <>
              <Card className="bg-indigo-50 border-indigo-100">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <div>
                      <CardTitle className="text-base text-indigo-900">
                        Avaliação Ativa: {activeCycle.nome}
                      </CardTitle>
                      <CardDescription className="text-indigo-700/80">
                        Template: {activeTpl.nome} • Prazo:{' '}
                        {new Date(activeCycle.data_fim).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Pendentes para sua equipe</p>
                {MOCK_ORG_USERS.filter((u) => u.papel_sistema === 'Colaborador').map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar_url ?? undefined} />
                        <AvatarFallback>{u.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{u.nome}</p>
                        <p className="text-xs text-muted-foreground">{u.cargo}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => openForm(activeTpl, activeCycle)}>
                      Avaliar
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Progresso da Equipe</p>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <Tablemini responses={responses} />
                </div>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma avaliação ativa no momento.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <TemplateDialog open={tplOpen} onOpenChange={setTplOpen} onCreated={loadData} />
      <CycleDialog open={cycOpen} onOpenChange={setCycOpen} onCreated={loadData} />
      {selectedTpl && selectedCycle && (
        <EvaluationFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          template={selectedTpl}
          cycleName={selectedCycle.nome}
          targetUserName="Carlos Santos"
        />
      )}
    </div>
  )
}

function Tablemini({ responses }: { responses: EvaluationResponse[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-50/50 border-b">
        <tr>
          <th className="text-left p-3 font-medium">Colaborador</th>
          <th className="text-left p-3 font-medium">Status</th>
          <th className="text-left p-3 font-medium">Enviado em</th>
        </tr>
      </thead>
      <tbody>
        {responses.map((r) => (
          <tr key={r.id} className="border-b last:border-0">
            <td className="p-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={r.user_avatar} />
                  <AvatarFallback>{r.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{r.user_name}</span>
              </div>
            </td>
            <td className="p-3">
              <Badge
                variant="outline"
                className={
                  r.status === 'concluido'
                    ? statusColors.concluido
                    : r.status === 'rascunho'
                      ? statusColors.rascunho_r
                      : statusColors.nao_iniciado
                }
              >
                {r.status.replace('_', ' ')}
              </Badge>
            </td>
            <td className="p-3 text-muted-foreground">
              {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('pt-BR') : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
