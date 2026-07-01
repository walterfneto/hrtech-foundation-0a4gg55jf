import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Plus, Video, FileText } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function OneOnOnes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reuniões 1:1</h1>
          <p className="text-slate-500 mt-2">
            Alinhamento, pautas colaborativas e histórico com liderados.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-sm active:scale-95 transition-all">
          <Plus className="w-4 h-4 mr-2" /> Agendar 1:1
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Próximas Reuniões - Coluna Menor */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Próximas Reuniões</h3>

          <Card className="shadow-sm border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer ring-1 ring-blue-500 ring-offset-1">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Hoje, 14:00</Badge>
                <Video className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2" />
                  <AvatarFallback>CS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">Carlos Santos</p>
                  <p className="text-xs text-slate-500">Engenheiro de Software</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline" className="text-slate-600 bg-slate-50">
                  Amanhã, 10:00
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">Mariana Costa</p>
                  <p className="text-xs text-slate-500">Designer de Produto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspace da Reunião Selecionada - Coluna Maior */}
        <div className="md:col-span-2">
          <Card className="shadow-md border-border/50 bg-white h-full min-h-[500px] flex flex-col overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2" />
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl text-slate-900">1:1 com Carlos Santos</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" /> Hoje • 14:00 - 14:45
                    </CardDescription>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Iniciar Reunião
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col md:flex-row">
              {/* Pauta Compartilhada */}
              <div className="flex-1 p-6 border-r border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" /> Pauta Compartilhada
                  </h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Revisar meta de entregas MVP
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Adicionado por Carlos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md shadow-sm">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Bloqueio na API de terceiros
                      </p>
                      <p className="text-xs text-amber-700/70 mt-1 flex items-center gap-1">
                        Sugerido pelo sistema (Meta em risco)
                      </p>
                    </div>
                  </li>
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-slate-500 hover:text-slate-900 border border-dashed border-slate-300"
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar item à pauta
                </Button>
              </div>

              {/* Notas Privadas */}
              <div className="flex-1 p-6 bg-slate-50">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 text-slate-500">
                  Minhas Notas Privadas
                </h4>
                <textarea
                  className="w-full h-[300px] p-4 text-sm border border-slate-200 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-inner"
                  placeholder="Anotações visíveis apenas para você..."
                ></textarea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
