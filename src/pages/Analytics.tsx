import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export default function Analytics() {
  const [evals, setEvals] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const cid = getCurrentCompanyId()
    if (!cid) return
    pb.collection('evaluations')
      .getFullList({ filter: `company="${cid}"`, expand: 'employee.user' })
      .then(setEvals)
    pb.collection('tasks')
      .getFullList({ filter: `company="${cid}" && status != "completed"`, expand: 'assignee.user' })
      .then(setTasks)
  }, [])

  const getBox = (score: number, pot: number) => {
    let sLevel = score < 2.5 ? 0 : score <= 4 ? 1 : 2
    let pLevel = pot < 2.5 ? 0 : pot <= 4 ? 1 : 2
    return `${pLevel}-${sLevel}`
  }

  const boxes: Record<string, any[]> = {}
  for (let p = 2; p >= 0; p--) {
    for (let s = 0; s <= 2; s++) {
      boxes[`${p}-${s}`] = []
    }
  }

  evals.forEach((ev) => {
    if (ev.score && ev.potential) {
      boxes[getBox(ev.score, ev.potential)]?.push(ev)
    }
  })

  const taskCounts: Record<string, number> = {}
  tasks.forEach((t) => {
    if (t.assignee) taskCounts[t.assignee] = (taskCounts[t.assignee] || 0) + 1
  })
  const burnoutRisks = Object.entries(taskCounts)
    .filter(([_, c]) => c > 1)
    .map(([id, c]) => {
      const t = tasks.find((x) => x.assignee === id)
      return { name: t?.expand?.assignee?.expand?.user?.name || 'Unknown', count: c }
    })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">People Analytics</h1>
        <p className="text-muted-foreground mt-1">Visão macro de performance e risco.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Matriz Nine Box</CardTitle>
              <CardDescription>Cruzamento de Desempenho (X) vs Potencial (Y).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-4 rounded-lg">
                {[2, 1, 0].map((p) =>
                  [0, 1, 2].map((s) => {
                    const items = boxes[`${p}-${s}`] || []
                    return (
                      <div
                        key={`${p}-${s}`}
                        className="border rounded bg-white p-3 min-h-[100px] shadow-sm"
                      >
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold mb-2 leading-tight">
                          {p === 2 ? 'Alto' : p === 1 ? 'Médio' : 'Baixo'} Pot /<br />
                          {s === 2 ? 'Alto' : s === 1 ? 'Médio' : 'Baixo'} Des
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {items.map((i: any) => (
                            <Badge key={i.id} variant="secondary" className="text-[10px]">
                              {i.expand?.employee?.expand?.user?.name?.split(' ')[0]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  }),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-rose-200 bg-rose-50/50 h-full">
            <CardHeader>
              <CardTitle className="text-rose-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Risco de Burnout
              </CardTitle>
              <CardDescription>
                Sobrecarga de tarefas pendentes ou alertas de clima.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {burnoutRisks.length > 0 ? (
                <div className="space-y-3">
                  {burnoutRisks.map((r, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white p-3 rounded border border-rose-100 shadow-sm"
                    >
                      <span className="font-medium text-sm text-slate-800">{r.name}</span>
                      <Badge variant="destructive" className="bg-rose-500">
                        {r.count} tarefas
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-emerald-600 font-medium">
                  Nenhum risco de sobrecarga detectado no momento.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
