import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface ParsedRow {
  nome: string
  email: string
  cargo: string
  departamento: string
  gestor: string
}

export function CsvImportSection() {
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const parseCsv = (text: string) => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const idx = {
      nome: headers.indexOf('nome'),
      email: headers.indexOf('email'),
      cargo: headers.indexOf('cargo'),
      departamento: headers.indexOf('departamento'),
      gestor: headers.indexOf('gestor'),
    }
    return lines.slice(1).map((line) => {
      const cols = line.split(',')
      return {
        nome: cols[idx.nome]?.trim() ?? '',
        email: cols[idx.email]?.trim() ?? '',
        cargo: cols[idx.cargo]?.trim() ?? '',
        departamento: cols[idx.departamento]?.trim() ?? '',
        gestor: cols[idx.gestor]?.trim() ?? '',
      }
    })
  }

  const handleFile = (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setRows(parseCsv(text))
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    toast.success(`${rows.length} colaboradores importados com sucesso!`, {
      description: 'Todos associados à empresa TechCorp Brasil (emp-1).',
    })
    setRows([])
    setFileName('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Importar Colaboradores</h2>
        <p className="text-muted-foreground mt-1">
          Importe em lote via arquivo CSV. Multi-tenancy respeitado automaticamente.
        </p>
      </div>

      <Card
        className="border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <UploadCloud className="h-12 w-12 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-700">
            {fileName || 'Clique para selecionar um arquivo CSV'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Colunas esperadas: nome, email, cargo, departamento, gestor
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <>
          <Alert className="bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">
              {rows.length} colaboradores prontos para importação. Revise os dados abaixo.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pré-visualização</CardTitle>
              <CardDescription>Confirme o mapeamento de campos antes de importar.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Gestor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 8).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.nome}</TableCell>
                        <TableCell className="text-slate-600">{row.email}</TableCell>
                        <TableCell className="text-slate-600">{row.cargo}</TableCell>
                        <TableCell className="text-slate-600">{row.departamento}</TableCell>
                        <TableCell className="text-slate-600">{row.gestor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {rows.length > 8 && (
                <p className="text-xs text-muted-foreground mt-2">
                  +{rows.length - 8} registros adicionais...
                </p>
              )}
              <div className="flex gap-3 mt-4">
                <Button onClick={handleImport}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Confirmar Importação
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRows([])
                    setFileName('')
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
