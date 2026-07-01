import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Play, Lock } from 'lucide-react'
import {
  MOCK_CYCLES,
  MOCK_TEMPLATES,
  getCycleProgress,
  getCycle,
  getTemplate,
} from '@/lib/eval-data'
import type { AvaliacaoCiclo, CicloStatus } from '@/lib/types'
import { toast } from 'sonner'

const statusConfig: Record<CicloStatus, { label: string; class: string }> = {
  rascunho: { label: 'Rascunho', class: 'bg-slate-100 text-slate-700 border-slate-200' },
  ativo: { label: 'Ativo', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  fechado: { label: 'Fechado', class: 'bg-slate-50 text-slate-500 border-slate-200' },
}

export function CycleManagerTab() {
  const [showDialog, setShowDialog] = useState(false)
  const [cycles, setCycles] = useState<AvaliacaoCiclo[]>(MOCK_CYCLES)
  const [form, setForm] = useState({
    nome: '',
    modelo_id: '',
    data_inicio: '',
    data_fim: '',
    participantes: 'empresa',
  })

  const handleCreate = () => {
    const novo: AvaliacaoCiclo = {
      id: `c-${Date.now()}`,
      empresa_id: 'emp-1',
      modelo_id: form.modelo_id,
      nome: form.nome,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      participantes: form.participantes,
      status: 'rascunho',
      deleted_at: null,
    }
    setCycles((prev) => [...prev, novo])
    setShowDialog(false)
    setForm({ nome: '', modelo_id: '', data_inicio: '', data_fim: '', participantes: 'empresa' })
    toast.success('Ciclo de avaliação criado!')
  }

  const changeStatus = (id: string, status: CicloStatus) => {
    setCycles((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    toast.success(`Ciclo ${status === 'ativo' ? 'ativado' : 'fechado'} com sucesso!`)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ciclos de Avaliação</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie os ciclos de avaliação de desempenho.
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Ciclo
        </Button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>Ciclo</TableHead>
              <TableHead className="hidden md:table-cell">Modelo</TableHead>
              <TableHead className="hidden lg:table-cell">Período</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cycles.map((cycle) => {
              const tpl = getTemplate(cycle.modelo_id)
              const prog = getCycleProgress(cycle.id)
              const pct = prog.total > 0 ? (prog.completed / prog.total) * 100 : 0
              const sc = statusConfig[cycle.status]
              return (
                <TableRow key={cycle.id}>
                  <TableCell className="font-medium">{cycle.nome}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600 text-sm">
                    {tpl?.nome ?? '—'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-600 text-sm">
                    {new Date(cycle.data_inicio).toLocaleDateString('pt-BR')} →{' '}
                    {new Date(cycle.data_fim).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="w-32">
                    {cycle.status === 'ativo' ? (
                      <div className="space-y-1">
                        <Progress value={pct} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground">
                          {prog.completed}/{prog.total}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={sc.class}>
                      {sc.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cycle.status === 'rascunho' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeStatus(cycle.id, 'ativo')}
                        className="h-8 text-emerald-600"
                      >
                        <Play className="h-3 w-3 mr-1" /> Ativar
                      </Button>
                    )}
                    {cycle.status === 'ativo' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => changeStatus(cycle.id, 'fechado')}
                        className="h-8 text-slate-600"
                      >
                        <Lock className="h-3 w-3 mr-1" /> Fechar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Ciclo de Avaliação</DialogTitle>
            <DialogDescription>Configure as datas e participantes do ciclo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome do Ciclo</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Ciclo Semestral 2026.2"
              />
            </div>
            <div className="space-y-2">
              <Label>Modelo de Avaliação</Label>
              <Select
                value={form.modelo_id}
                onValueChange={(v) => setForm({ ...form, modelo_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={form.data_inicio}
                  onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Fim</Label>
                <Input
                  type="date"
                  value={form.data_fim}
                  onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Participantes</Label>
              <Select
                value={form.participantes}
                onValueChange={(v) => setForm({ ...form, participantes: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresa">Empresa toda</SelectItem>
                  <SelectItem value="times:t-1">Engenharia</SelectItem>
                  <SelectItem value="times:t-2">Design</SelectItem>
                  <SelectItem value="times:t-3">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.nome || !form.modelo_id || !form.data_inicio || !form.data_fim}
            >
              Criar Ciclo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
