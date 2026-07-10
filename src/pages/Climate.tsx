import { useState, useEffect } from 'react'
import { fetchActiveSurveys, submitSurveyResponse, fetchSurveyResponses } from '@/services/modules'
import type { PulseSurveyRecord } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'

export default function Climate() {
  const { role } = useAuth()
  const { toast } = useToast()
  const [surveys, setSurveys] = useState<PulseSurveyRecord[]>([])
  const [responses, setResponses] = useState<any[]>([])
  const [score, setScore] = useState(8)
  const [comments, setComments] = useState('')

  useEffect(() => {
    fetchActiveSurveys().then(setSurveys)
    if (role === 'Admin RH' || role === 'Super Admin') {
      fetchSurveyResponses().then(setResponses)
    }
  }, [role])

  const handleSubmit = async (surveyId: string) => {
    try {
      await submitSurveyResponse(surveyId, score, comments)
      toast({
        title: 'Resposta enviada',
        description: 'Obrigado por participar. Sua resposta é anônima.',
      })
      setComments('')
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a resposta.',
        variant: 'destructive',
      })
    }
  }

  const scores = responses.map((r) => r.score)
  const promoters = scores.filter((s) => s >= 9).length
  const detractors = scores.filter((s) => s <= 6).length
  const enps = scores.length > 0 ? Math.round(((promoters - detractors) / scores.length) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clima e Cultura</h1>
        <p className="text-muted-foreground mt-1">Pesquisas de clima (Pulse Surveys) e eNPS.</p>
      </div>

      {(role === 'Admin RH' || role === 'Super Admin') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-indigo-600 text-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-100 text-sm">eNPS Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{enps}</p>
              <p className="text-sm mt-1 opacity-80">Promoters - Detractors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Respostas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{scores.length}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 max-w-4xl">
        {surveys.map((s) => (
          <Card key={s.id} className="border-t-4 border-t-teal-500 shadow-sm">
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>Responda as perguntas abaixo (100% anônimo).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {s.questions?.map((q) => (
                <div key={q.id} className="space-y-4">
                  <p className="font-medium text-slate-800">{q.text}</p>
                  {q.type === 'rating' ? (
                    <div className="space-y-2">
                      <Slider
                        value={[score]}
                        onValueChange={(v) => setScore(v[0])}
                        max={10}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground font-bold">
                        <span>0 (Ruim)</span>
                        <span className="text-teal-600 text-lg">{score}</span>
                        <span>10 (Excelente)</span>
                      </div>
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Opcional..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  )}
                </div>
              ))}
              <Button onClick={() => handleSubmit(s.id)}>Enviar Resposta Anônima</Button>
            </CardContent>
          </Card>
        ))}
        {surveys.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma pesquisa ativa no momento.
          </p>
        )}
      </div>
    </div>
  )
}
