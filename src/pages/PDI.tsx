import { useState, useEffect } from 'react'
import { fetchPdiGoals } from '@/services/modules'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function PDI() {
  const { employee } = useAuth()
  const [goals, setGoals] = useState<any[]>([])

  const load = async () => {
    if (employee) setGoals(await fetchPdiGoals(employee.id))
  }
  useEffect(() => {
    load()
  }, [employee])

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

      <div className="grid gap-6">
        {goals.map((g) => (
          <Card key={g.id} className="border-t-4 border-t-blue-500 shadow-sm">
            <CardHeader className="pb-4">
              <div className="space-y-1">
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-2"
                >
                  {g.status.replace('_', ' ')}
                </Badge>
                <CardTitle className="text-xl">{g.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{g.description}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-lg border space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Progresso</span>
                  <span className="font-bold text-blue-600">{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="h-2 [&>div]:bg-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
        {goals.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nenhum PDI cadastrado.</p>
        )}
      </div>
    </div>
  )
}
