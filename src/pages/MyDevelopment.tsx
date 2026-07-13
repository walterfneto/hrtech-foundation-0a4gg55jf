import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { PerformanceEvolutionChart } from '@/components/performance/performance-evolution-chart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { OneOnOneHistory } from '@/components/one-on-ones/one-on-one-history'
import { fetchMyOneOnOnes, type OneOnOneRecord } from '@/services/one-on-ones'

export default function MyDevelopment() {
  const { employee, loading } = useAuth()
  const employeeId = employee?.id ?? ''
  const [oneOnOnes, setOneOnOnes] = useState<OneOnOneRecord[]>([])

  useEffect(() => {
    if (!employeeId) return
    fetchMyOneOnOnes(employeeId)
      .then(setOneOnOnes)
      .catch(() => {})
  }, [employeeId])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meu Desenvolvimento</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe sua evolução e plano de desenvolvimento.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-[400px] w-full rounded-xl" />
      ) : employeeId ? (
        <PerformanceEvolutionChart
          employeeId={employeeId}
          title="Minha Evolução"
          description="Seu histórico de pontuações em avaliações concluídas."
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
            Plano de Desenvolvimento (PDI)
          </CardTitle>
          <CardDescription>Suas metas e ações de desenvolvimento em andamento.</CardDescription>
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
            <p className="text-xs text-muted-foreground mt-1">
              Próxima ação: Mentorar um desenvolvedor júnior no próximo projeto.
            </p>
          </div>
        </CardContent>
      </Card>
      <OneOnOneHistory meetings={oneOnOnes} />
    </div>
  )
}
