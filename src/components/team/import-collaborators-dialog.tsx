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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { importUsers } from '@/lib/api'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported: () => void
}

const FIELDS = ['nome', 'email', 'cargo', 'departamento', 'manager_nome'] as const

export function ImportCollaboratorsDialog({ open, onOpenChange, onImported }: Props) {
  const [rows, setRows] = useState<string[][]>([])
  const [fileName, setFileName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = text
        .trim()
        .split('\n')
        .map((r) => r.split(',').map((c) => c.trim()))
      setRows(parsed)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (rows.length < 2) {
      toast.error('Arquivo CSV vazio ou inválido')
      return
    }
    const dataRows = rows.slice(1).map((r) => ({
      nome: r[0] ?? '',
      email: r[1] ?? '',
      cargo: r[2] ?? '',
      departamento: r[3] ?? '',
      manager_nome: r[4] ?? undefined,
    }))
    const count = await importUsers(dataRows)
    toast.success(`${count} colaboradores importados com sucesso!`)
    setRows([])
    setFileName('')
    onImported()
    onOpenChange(false)
  }

  const handleClose = (v: boolean) => {
    if (!v) {
      setRows([])
      setFileName('')
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Colaboradores</DialogTitle>
          <DialogDescription>
            Upload de arquivo CSV. Colunas esperadas: nome, email, cargo, departamento, gestor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFile}
            />
            <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">
              {fileName || 'Clique para selecionar um arquivo CSV'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Multi-tenancy: todos os usuários serão associados à empresa atual
            </p>
          </div>

          {rows.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-50 border-b flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">
                  Pré-visualização ({rows.length - 1} registros)
                </span>
              </div>
              <div className="max-h-48 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      {FIELDS.map((f) => (
                        <TableHead key={f} className="text-xs capitalize">
                          {f.replace('_', ' ')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(1, 6).map((r, i) => (
                      <TableRow key={i}>
                        {FIELDS.map((_, j) => (
                          <TableCell key={j} className="text-xs py-2">
                            {r[j] ?? '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={rows.length < 2}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmar Importação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
