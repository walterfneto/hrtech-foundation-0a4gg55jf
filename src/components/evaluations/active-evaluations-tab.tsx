import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Clock, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  MOCK_AVALIACOES,
  getCycle,
  getTemplate,
  getMember,
  getCycleProgress,
} from '@/lib/eval-data'
import { EvaluationFormDialog } from '@/components/evaluations/evaluation-form-dialog'
import type { AvaliacaoResposta } from '@/lib/types'

const statusConfig: Record<string, { label: string; class: string; icon: typeof Clock }> = {
  pendente: {
    label: 'Pendente',
    class: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  em_andamento: {
    label: 'Em Andamento',
    class: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: FileText,
  },
  concluida: {
    label: 'Concluída',
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
}

export function ActiveEvaluationsTab() {
  const { role, user } = useAuth()
  const [selected, setSelected] = useState<AvaliacaoResposta | null>(null)

  const myAvaliacoes = MOCK_AVALIACOES.filter(
    (a) => a.avaliador_id === user.id && a.status !== 'concluida',
  )
  const teamAvaliacoes = MOCK_AVALIACOES.filter((a) => a.avaliador_id === user.id)
  const activeCycle = MOCK_AVALIACOES.length > 0 ? getCycle(MOCK_AVALIACOES[0].ciclo_id) : null

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Avaliações Ativas</h2>
        <p className="text-muted-foreground mt-1">
          {role === 'Colaborador'
            ? 'Suas avaliações pendentes.'
            : 'Acompanhe e execute avaliações da sua equipe.'}
        </p>
      </div>

      {/* Pending evaluations for current user */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Minhas Avaliações Pendentes</h3>
        {myAvaliacoes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground text-sm">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              Nenhuma avaliação pendente. Você está em dia!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {myAvaliacoes.map((av) => {
              const cycle = getCycle(av.ciclo_id)
              const tpl = cycle ? getTemplate(cycle.modelo_id) : null
              const avaliado = getMember(av.avaliado_id)
              const sc = statusConfig[av.status]
              const Icon = sc.icon
              return (
                <Card key={av.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avaliado?.avatar} />
                          <AvatarFallback>{avaliado?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{avaliado?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {av.tipo === 'auto' ? 'Autoavaliação' : `Avaliação como ${av.tipo}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={sc.class}>
                        <Icon className="h-3 w-3 mr-1" />
                        {sc.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{cycle?.nome}</span>
                      <span>{tpl?.questoes.length} questões</span>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => setSelected(av)}>
                      {av.status === 'pendente' ? 'Iniciar Avaliação' : 'Continuar'}{' '}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Manager/Admin: Team progress */}
      {(role === 'Gestor' || role === 'Admin RH' || role === 'Super Admin') && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Progresso da Equipe</h3>
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Colaborador</TableHead>
                    <TableHead className="hidden sm:table-cell">Cargo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Progresso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamAvaliacoes.map((av) => {
                    const avaliado = getMember(av.avaliado_id)
                    const sc = statusConfig[av.status]
                    const tpl = getCycle(av.ciclo_id)
                      ? getTemplate(getCycle(av.ciclo_id)!.modelo_id)
                      : null
                    const total = tpl?.questoes.length || 1
                    const done = Object.keys(av.respostas).length
                    const pct = (done / total) * 100
                    return (
                      <TableRow key={av.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={avaliado?.avatar} />
                              <AvatarFallback>{avaliado?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {avaliado?.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-slate-600 text-sm">
                          {avaliado?.role}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={sc.class}>
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell w-32">
                          <Progress value={pct} className="h-1.5" />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* Admin: Cycle overview */}
      {(role === 'Admin RH' || role === 'Super Admin') && activeCycle && (
        <Card className="bg-indigo-50/50 border-indigo-100">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-indigo-600" /> Visão Geral do Ciclo Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const prog = getCycleProgress(activeCycle.id)
              const pct = prog.total > 0 ? (prog.completed / prog.total) * 100 : 0
              return (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{activeCycle.nome}</span>
                    <span className="text-muted-foreground">
                      {prog.completed}/{prog.total} concluídas
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {pct.toFixed(0)}% de conclusão geral
                  </p>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {selected && <EvaluationFormDialog avaliacao={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
