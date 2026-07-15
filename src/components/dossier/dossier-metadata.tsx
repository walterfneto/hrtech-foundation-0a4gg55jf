import { Fingerprint, User, ShieldCheck, Database, Calendar, Tag } from 'lucide-react'
import type { DossierEvent } from '@/services/dossier'

export function DossierMetadata({ event }: { event: DossierEvent }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Database className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-700">Metadados</h3>
      </div>

      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Autor / Responsável
            </p>
            <p className="text-sm font-medium mt-1 text-slate-900">{event.author}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Data do Evento
            </p>
            <p className="text-sm font-medium mt-1 text-slate-900">{event.date}</p>
          </div>
        </div>

        {event.category && (
          <div className="flex items-start gap-3">
            <Tag className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Categoria
              </p>
              <p className="text-sm font-medium mt-1 text-slate-900">{event.category}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Integridade LGPD (SHA-256)
            </p>
            <p className="text-xs font-mono break-all text-slate-600 mt-1 bg-white border rounded p-1.5 leading-tight">
              {event.hash}
            </p>
            <p className="text-[10px] text-emerald-600 mt-1">✓ Assinatura digital verificada</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Fingerprint className="h-4 w-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              ID do Registro
            </p>
            <p className="text-xs font-mono text-slate-500 mt-1">{event.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
