import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { FeedbackSendForm } from '@/components/feedback/feedback-send-form'
import type { EmployeeRecord } from '@/lib/types'

interface FeedbackSendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employees: EmployeeRecord[]
  currentEmployeeId: string
  onSubmitted: () => void
}

export function FeedbackSendDialog({
  open,
  onOpenChange,
  employees,
  currentEmployeeId,
  onSubmitted,
}: FeedbackSendDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto shadow-subtle bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Dar Feedback</DialogTitle>
          <DialogDescription>
            Reconheça conquistas ou envie feedbacks de desenvolvimento.
          </DialogDescription>
        </DialogHeader>
        <FeedbackSendForm
          employees={employees}
          currentEmployeeId={currentEmployeeId}
          onSubmitted={() => {
            onSubmitted()
            onOpenChange(false)
          }}
          embedded
        />
      </DialogContent>
    </Dialog>
  )
}
