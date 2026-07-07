import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteEmployee } from '@/services/employees'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId: string | null
  employeeName: string
  onDeleted: () => void
}

export function DeleteEmployeeDialog({
  open,
  onOpenChange,
  employeeId,
  employeeName,
  onDeleted,
}: Props) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!employeeId) return
    setDeleting(true)
    try {
      await deleteEmployee(employeeId)
      toast.success(`${employeeName} foi removido com sucesso.`)
      onDeleted()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao remover colaborador. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Remover Colaborador
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover <strong>{employeeName}</strong>? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removendo...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Remover
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
