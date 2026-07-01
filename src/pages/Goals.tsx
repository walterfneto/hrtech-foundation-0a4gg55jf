import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Target, Users, LayoutList } from 'lucide-react'

export default function Goals() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Metas e OKRs</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhamento de objetivos estratégicos e individuais (Q3 2026).
          </p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Novo Objetivo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Empresa/Time Goal */}
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Badge
                  variant="outline"
                  className="mb-2 bg-slate-50 text-slate-600 flex w-fit items-center gap-1"
                >
                  <Users className="h-3 w-3" /> Time: Engenharia
                </Badge>
                <CardTitle className="text-lg leading-tight">
                  Reduzir tempo de carregamento do Core App
                </CardTitle>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Em Risco
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground font-medium">Progresso Geral</span>
                  <span className="font-bold text-slate-700">45%</span>
                </div>
                <Progress value={45} className="h-2 [&>div]:bg-amber-500" />
              </div>

              {/* Tree View Simulation */}
              <div className="pt-4 border-t mt-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <LayoutList className="h-3 w-3" /> Key Results Alinhados
                </h4>
                <div className="space-y-3 pl-2 border-l-2 border-slate-100 ml-1">
                  <div className="relative before:absolute before:content-[''] before:w-3 before:h-px before:bg-slate-200 before:-left-3 before:top-3">
                    <p className="text-sm font-medium">Otimizar bundle do Webpack</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={80} className="h-1.5 flex-1 [&>div]:bg-emerald-500" />
                      <span className="text-[10px] text-muted-foreground">80%</span>
                    </div>
                  </div>
                  <div className="relative before:absolute before:content-[''] before:w-3 before:h-px before:bg-slate-200 before:-left-3 before:top-3">
                    <p className="text-sm font-medium text-amber-700">
                      Migrar 50% das imagens para WebP
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={10} className="h-1.5 flex-1 [&>div]:bg-amber-500" />
                      <span className="text-[10px] text-muted-foreground">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Goal */}
        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Badge
                  variant="outline"
                  className="mb-2 bg-slate-50 text-slate-600 flex w-fit items-center gap-1"
                >
                  <Target className="h-3 w-3" /> Individual
                </Badge>
                <CardTitle className="text-lg leading-tight">
                  Implementar testes E2E críticos
                </CardTitle>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                No Caminho
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground font-medium">
                    Progresso (25/30 cenários)
                  </span>
                  <span className="font-bold text-slate-700">83%</span>
                </div>
                <Progress value={83} className="h-2 [&>div]:bg-emerald-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 bg-slate-50 p-2 rounded border">
                <strong>Último check-in:</strong> Ontem. Atrasos superados, ritmo normalizado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
