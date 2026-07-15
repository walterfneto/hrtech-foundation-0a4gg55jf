import { useState, useRef } from 'react'
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
import { Loader2, Upload, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { createEmployeeDocument } from '@/services/employee-documents'
import { getErrorMessage } from '@/lib/pocketbase/errors'

const CATEGORIES = [
  'Curriculum',
  'Certificate',
  'Medical Certificate',
  'Contract',
  'Termination',
  'Other',
]

const CATEGORY_LABELS: Record<string, string> = {
  Curriculum: 'Curriculum',
  Certificate: 'Certificado',
  'Medical Certificate': 'Atestado Médico',
  Contract: 'Contrato',
  Termination: 'Rescisão',
  Other: 'Outro',
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId: string
  onUploaded: () => void
}

export function UploadDocumentDialog({ open, onOpenChange, employeeId, onUploaded }: Props) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setTitle('')
    setCategory('')
    setEventDate('')
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
      reset()
      onOpenChange(false)
      onUploaded()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = (v: boolean) => {
    if (!v) reset()
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Documento</DialogTitle>
          <DialogDescription>Adicione um documento ao dossiê do colaborador.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="doc-title">Título *</Label>
            <Input
              id="doc-title"
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
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-date">Data do Evento *</Label>
            <Input
              id="doc-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-file">Arquivo (PDF, JPG, PNG) *</Label>
            <Input
              id="doc-file"
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" /> {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Enviar Documento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
