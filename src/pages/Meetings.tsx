import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Video, Plus, Target, CheckCircle2 } from 'lucide-react'

export default function Meetings() {
  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">1:1 com Ana Souza</h1>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Hoje, 15:00
          </Badge>
        </div>
        <Button variant="outline" className="shadow-sm bg-white">
          <Video className="mr-2 h-4 w-4" /> Entrar na Sala
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 pb-4">
        {/* Lado Esquerdo: Pauta Colaborativa */}
        <div className="w-full md:w-1/2 flex flex-col border rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Pauta Colaborativa</h2>
            <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Itens Sugeridos */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2 flex items-center gap-1">
                <Target className="h-3 w-3" /> Sugerido pelo Sistema
              </p>
              <div className="flex items-start space-x-3">
                <Checkbox id="sug1" className="mt-0.5" />
                <label
                  htmlFor="sug1"
                  className="text-sm font-medium leading-tight text-slate-800 cursor-pointer"
                >
                  A meta "Migrar imagens" está em risco. Como posso ajudar a destravar?
                </label>
              </div>
            </div>

            {/* Itens Manuais */}
            <div className="flex items-start space-x-3 group">
              <Checkbox id="i1" className="mt-0.5" />
              <div className="flex-1">
                <label
                  htmlFor="i1"
                  className="text-sm font-medium leading-tight text-slate-800 cursor-pointer"
                >
                  Feedback sobre a última entrega do projeto Delta
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1" />
                  </Avatar>
                  <span className="text-[10px] text-muted-foreground">Adicionado por você</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 group opacity-50">
              <Checkbox
                id="i2"
                checked
                className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="i2"
                  className="text-sm font-medium leading-tight text-slate-800 line-through"
                >
                  Dúvidas sobre o processo de PDI
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2" />
                  </Avatar>
                  <span className="text-[10px] text-muted-foreground">Adicionado por Ana</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Anotações */}
        <div className="w-full md:w-1/2 flex flex-col border rounded-lg bg-white shadow-sm overflow-hidden relative">
          <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Anotações Privadas</h2>
            <span className="text-[10px] uppercase text-muted-foreground font-semibold flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Salvo
            </span>
          </div>
          <Textarea
            className="flex-1 resize-none border-0 rounded-none shadow-none focus-visible:ring-0 text-sm leading-relaxed p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjMyIj48bGluZSB4MT0iMCIgeTE9IjMxIiB4Mj0iMTAwJSIgeTI9IjMxIiBzdHJva2U9IiNlMmU4ZjAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-local"
            placeholder="Escreva suas anotações aqui. Elas são visíveis apenas para você e ficarão salvas no histórico deste 1:1."
          />
        </div>
      </div>
    </div>
  )
}
// Required dummy export for JSX types
import { Badge } from '@/components/ui/badge'
