import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquarePlus, Heart } from 'lucide-react'

export default function Feedback() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Feedback Contínuo</h1>
        <p className="text-muted-foreground mt-1">
          Reconheça conquistas ou envie feedbacks de desenvolvimento.
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 border">
          <TabsTrigger value="feed">Mural de Elogios</TabsTrigger>
          <TabsTrigger value="enviar">Enviar Feedback</TabsTrigger>
          <TabsTrigger value="meus">Meus Feedbacks</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6 space-y-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5 flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?seed=2&gender=female" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-900">Ana Souza</span>
                  <span className="text-muted-foreground text-sm">elogiou</span>
                  <span className="font-semibold text-primary">Carlos Mendes</span>
                  <span className="text-xs text-muted-foreground ml-auto">Há 2 horas</span>
                </div>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Excelente trabalho na entrega da feature X. Sua dedicação nos detalhes de UX fez
                  toda a diferença para o cliente. Ajudou muito o time! 🚀
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-normal"
                  >
                    Trabalho em Equipe
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-muted-foreground hover:text-rose-500"
                  >
                    <Heart className="h-4 w-4 mr-1.5" /> 12
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enviar" className="mt-6">
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div>
                <label className="text-sm font-semibold mb-2 block">Para quem?</label>
                <Input placeholder="Busque um colega..." className="bg-slate-50" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Tipo de Feedback</label>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm cursor-pointer bg-primary text-white border-primary"
                  >
                    Público (Elogio)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-100"
                  >
                    Privado (Construtivo)
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Mensagem</label>
                <Textarea
                  className="min-h-[120px] bg-slate-50"
                  placeholder="Descreva a situação, o comportamento e o impacto..."
                />
              </div>
              <Button className="w-full sm:w-auto">
                <MessageSquarePlus className="mr-2 h-4 w-4" /> Enviar Feedback
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
