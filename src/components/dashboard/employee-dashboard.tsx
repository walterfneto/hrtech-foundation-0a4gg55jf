import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Target, TrendingUp, MessageSquare, Calendar } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export function EmployeeDashboard() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-6 text-white shadow-elevation">
        <h2 className="text-xl font-bold">Olá, Walter!</h2>
        <p className="mt-2 opacity-90 text-sm max-w-xl">
          Você tem uma autoavaliação pendente para o ciclo 2026.1 e seu próximo 1:1 está agendado
          para amanhã.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            Preencher Autoavaliação
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Ver Pauta do 1:1
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Meu Desenvolvimento (PDI)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Comunicação Assertiva</span>
                <span className="text-muted-foreground">60%</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Próxima ação: Concluir leitura do livro até sexta.
              </p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Liderança Técnica</span>
                <span className="text-muted-foreground">25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                Minhas Metas
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-50 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium leading-tight">
                  Entregar refatoração do módulo X
                </p>
                <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                  No Prazo
                </span>
              </div>
              <Progress value={80} className="h-1.5 [&>div]:bg-emerald-500" />
            </div>
            <div className="p-3 bg-slate-50 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium leading-tight">Melhorar cobertura de testes</p>
                <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                  Em Risco
                </span>
              </div>
              <Progress value={30} className="h-1.5 [&>div]:bg-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
