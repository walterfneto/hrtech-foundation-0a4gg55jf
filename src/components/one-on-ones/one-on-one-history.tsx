import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { History } from 'lucide-react'
import type { OneOnOneRecord } from '@/services/one-on-ones'

interface Props {
  meetings: OneOnOneRecord[]
}

export function OneOnOneHistory({ meetings }: Props) {
  const completed = meetings.filter(
    (m) => m.status === 'completed' && (m.positive_points || m.improvement_points),
  )

  if (completed.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-500" />
          Histórico de Desenvolvimento
        </CardTitle>
        <CardDescription>
          Evolução de pontos positivos e de melhoria ao longo do tempo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {completed.map((m) => (
          <div key={m.id} className="border-l-2 border-slate-200 pl-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              {m.scheduled_at
                ? new Date(m.scheduled_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Data não definida'}
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {m.positive_points && (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">O que está bom</p>
                  <p className="text-sm text-slate-700">{m.positive_points}</p>
                </div>
              )}
              {m.improvement_points && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 mb-1">
                    O que precisa melhorar
                  </p>
                  <p className="text-sm text-slate-700">{m.improvement_points}</p>
                </div>
              )}
            </div>
            {m.action_deadline && (
              <p className="text-xs text-slate-500">
                Prazo: {new Date(m.action_deadline).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
