import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PerformanceEvolutionChart } from './performance-evolution-chart'

interface EmployeeEvolutionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId: string | null
  employeeName: string
}

export function EmployeeEvolutionDialog({
  open,
  onOpenChange,
  employeeId,
  employeeName,
}: EmployeeEvolutionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Evolução de Desempenho — {employeeName}</DialogTitle>
          <DialogDescription>
            Histórico de pontuações em avaliações concluídas ao longo dos ciclos.
          </DialogDescription>
        </DialogHeader>
        {employeeId && (
          <PerformanceEvolutionChart
            employeeId={employeeId}
            title="Evolução de Desempenho"
            description={`Pontuações de ${employeeName} em avaliações concluídas.`}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
