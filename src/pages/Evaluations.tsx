import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Sparkles, Info, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Evaluations() {
  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Avaliação: Ana Souza</h1>
        <p className="text-muted-foreground mt-1">Ciclo Semestral 2026.1 • Prazo final em 5 dias</p>
      </div>

      <Alert className="bg-indigo-50 border-indigo-100 text-indigo-900">
        <Sparkles className="h-4 w-4 text-indigo-600" />
        <AlertTitle>IA Assistiva Ativa</AlertTitle>
        <AlertDescription className="text-indigo-800/80">
          Você pode usar a IA para resumir a autoavaliação da Ana ou ajudar a redigir seu feedback
          construtivo.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0 pb-6">
        {/* Lado Esquerdo: Autoavaliação */}
        <div className="border rounded-lg bg-slate-50 flex flex-col shadow-sm">
          <div className="p-4 border-b bg-white rounded-t-lg">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" /> Contexto: Autoavaliação
            </h3>
          </div>
          <div className="p-4 overflow-y-auto space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-sm">Comunicação e Alinhamento</p>
                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">
                  Nota Dela: 4/5
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Neste semestre, assumi a liderança técnica da squad e acredito que consegui manter
                todos alinhados durante as crises. Sinto que posso melhorar em ser mais direta nas
                reuniões com os stakeholders.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário do Gestor */}
        <div className="border rounded-lg bg-white flex flex-col shadow-sm">
          <div className="p-4 border-b bg-slate-50/50 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Sua Avaliação (Gestor)</h3>
            <Button size="sm" variant="outline" className="h-8">
              Salvar Rascunho
            </Button>
          </div>
          <div className="p-6 overflow-y-auto space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-900">
                  Comunicação e Alinhamento
                </label>
                <span className="text-sm font-medium text-primary">Sua Nota: 4</span>
              </div>
              <Slider defaultValue={[4]} max={5} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 - Abaixo do esperado</span>
                <span>5 - Supera expectativas</span>
              </div>

              <div className="relative mt-4">
                <Textarea
                  className="min-h-[120px] resize-none pr-12 focus-visible:ring-primary/50 text-sm"
                  placeholder="Escreva sua avaliação sobre a comunicação da Ana. Baseie-se em fatos e exemplos."
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                  title="Gerar rascunho com IA"
                >
                  <Sparkles className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar Avaliação
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
