import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Plus, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function PDI() {
  return (
    <div className="space-y-6 animate-fade-in-up pb-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Meu Desenvolvimento (PDI)
          </h1>
          <p className="text-muted-foreground mt-1">
            Transforme lacunas em ações concretas de crescimento.
          </p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nova Área
        </Button>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-5 rounded-xl flex items-start gap-4 shadow-sm">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-indigo-900">Sugestão Automática de Desenvolvimento</h4>
          <p className="text-sm text-indigo-800/80 mt-1 leading-relaxed">
            Baseado na nota do último ciclo de avaliação (3.0), sugerimos criar um plano focado em{' '}
            <strong>Gestão de Tempo</strong>. A IA analisou comentários frequentes sobre prazos
            apertados.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              Aceitar e Criar Plano
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
            >
              Ignorar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-slate-50">
                  Competência
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                >
                  Em Andamento
                </Badge>
              </div>
              <CardTitle className="text-xl">Comunicação Assertiva com Stakeholders</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Origem: Feedback Construtivo (Abr/2026)
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Progresso do Plano</span>
                  <span className="font-bold text-blue-600">60%</span>
                </div>
                <Progress value={60} className="h-2 [&>div]:bg-blue-500" />
              </div>

              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Planos de Ação
                </h5>

                <div className="flex items-start gap-3 bg-white p-3 rounded-md border shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 line-through opacity-80">
                      Ler livro "Comunicação Não-Violenta"
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Estudo individual • Concluído em 10 Jun
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-md border shadow-sm border-l-2 border-l-blue-500">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      Conduzir apresentação de resultados da Sprint
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Desafio Prático • Prazo: 30 Ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
