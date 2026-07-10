import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Target, TrendingUp, MessageSquare, Calendar, ClipboardList } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { fetchTasks } from '@/services/modules'
import { useAuth } from '@/hooks/use-auth'

export function EmployeeDashboard() {
  const { employee } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  useEffect(() => {
    if (employee) {
      fetchTasks(employee.id).then(setTasks)
    }
  }, [employee])

  const pendingTasks = tasks.filter((t) => t.status !== 'completed')

  return (
    <div className="space-y-6 animate-fade-in-up">
      {pendingTasks.length > 0 && (
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Central de Pendências Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingTasks.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center bg-slate-50 p-3 rounded border"
              >
                <span className="text-sm font-medium">{t.title}</span>
                <Badge variant="destructive" className="bg-red-500">
                  {t.priority}
                </Badge>
              </div>
            ))}
            <Button asChild variant="link" className="px-0 text-red-600">
              <Link to="/tarefas">Ver todas as tarefas</Link>
            </Button>
          </CardContent>
        </Card>
      )}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-6 text-white shadow-elevation">
        <h2 className="text-xl font-bold">Olá, Walter!</h2>
        <p className="mt-2 opacity-90 text-sm max-w-xl">
          Você tem uma autoavaliação pendente para o ciclo 2026.1 e seu próximo 1:1 está agendado
          para amanhã.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-amber-700 hover:bg-amber-50"
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

      <Card className="border-l-4 border-l-amber-400">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-amber-500" />
            Avaliações Ativas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Autoavaliação 2026.1</p>
              <p className="text-xs text-muted-foreground">Prazo: 15 Jul 2026</p>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Pendente
            </Badge>
          </div>
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link to="/avaliacoes">Ir para Avaliações</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
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
                <Target className="h-4 w-4 text-teal-500" />
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
                <span className="text-[10px] font-bold uppercase text-teal-600 bg-teal-100 px-2 py-0.5 rounded">
                  No Prazo
                </span>
              </div>
              <Progress value={80} className="h-1.5 [&>div]:bg-teal-500" />
            </div>
            <div className="p-3 bg-slate-50 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium leading-tight">Melhorar cobertura de testes</p>
                <span className="text-[10px] font-bold uppercase text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                  Em Risco
                </span>
              </div>
              <Progress value={30} className="h-1.5 [&>div]:bg-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
