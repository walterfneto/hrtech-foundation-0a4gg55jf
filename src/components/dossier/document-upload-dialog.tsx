import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { createEmployeeDocument } from '@/services/employee-documents'

const CATEGORIES = [
  { value: 'Curriculum', label: 'Currículo' },
  { value: 'Certificate', label: 'Certificado' },
  { value: 'Medical Certificate', label: 'Atestado Médico' },
  { value: 'Contract', label: 'Contrato' },
  { value: 'Termination', label: 'Rescisão' },
  { value: 'Other', label: 'Outro' },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId: string
  onUploaded: () => void
}

export function DocumentUploadDialog({ open, onOpenChange, employeeId, onUploaded }: Props) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title || !category || !eventDate || !file) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    setSubmitting(true)
    try {
      await createEmployeeDocument({
        employee: employeeId,
        title,
        file,
        category,
        event_date: eventDate,
      })
      toast.success('Documento enviado com sucesso!')
      setTitle('')
      setCategory('')
      setEventDate('')
      setFile(null)
      onOpenChange(false)
      onUploaded()
    } catch {
      toast.error('Erro ao enviar documento')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Documento</DialogTitle>
          <DialogDescription>Adicione um documento ao dossiê do colaborador.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Atestado Médico"
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data do Evento *</Label>
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Arquivo (PDF, JPG, PNG) *</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
