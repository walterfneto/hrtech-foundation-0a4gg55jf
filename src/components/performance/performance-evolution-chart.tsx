import { useEffect, useState, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { fetchEmployeeEvolution, type EvolutionDataPoint } from '@/services/evaluation-evolution'
import { format, parseISO } from 'date-fns'

const chartConfig = {
  score: {
    label: 'Pontuação',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

interface PerformanceEvolutionChartProps {
  employeeId: string
  title?: string
  description?: string
}

export function PerformanceEvolutionChart({
  employeeId,
  title = 'Evolução de Desempenho',
  description = 'Histórico de pontuações em avaliações concluídas.',
}: PerformanceEvolutionChartProps) {
  const [data, setData] = useState<EvolutionDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const result = await fetchEmployeeEvolution(employeeId)
      setData(result)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [loadData])

  const chartData = data.map((d) => ({
    label: format(parseISO(d.cycleDate), 'MMM/yyyy'),
    score: d.score,
    cycleTitle: d.cycleTitle,
    cycleDate: format(parseISO(d.cycleDate), 'dd/MM/yyyy'),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length < 2 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm max-w-sm">
              Ainda não há dados suficientes para gerar o gráfico de evolução. São necessárias pelo
              menos duas avaliações concluídas.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={[0, 'auto']} tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                content={({ active, payload }: any) => {
                  if (!active || !payload || payload.length === 0) return null
                  const p = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md min-w-[150px]">
                      <p className="font-medium text-sm">{p.cycleTitle}</p>
                      <p className="text-sm mt-1">
                        Pontuação: <span className="font-bold">{p.score}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.cycleDate}</p>
                    </div>
                  )
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--chart-1))' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
