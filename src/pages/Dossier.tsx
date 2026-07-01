import { useState } from 'react'
import { DossierTimeline } from '@/components/dossier/dossier-timeline'
import { DossierPreview } from '@/components/dossier/dossier-preview'
import { DossierMetadata } from '@/components/dossier/dossier-metadata'
import { DOSSIER_EVENTS } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Dossier() {
  const [selectedEventId, setSelectedEventId] = useState(DOSSIER_EVENTS[0].id)
  const selectedEvent = DOSSIER_EVENTS.find((e) => e.id === selectedEventId)

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dossiê do Colaborador
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Histórico completo unificado, visão 360° inspirada no e-Proc.
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden border rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        {/* Cabeçalho do Dossiê */}
        <div className="h-20 border-b bg-slate-50/80 flex items-center px-6 gap-4 shrink-0">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-lg leading-none text-slate-900">Ana Souza</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-medium text-slate-600">Desenvolvedora Sênior</span>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-500">Engenharia</span>
              <span className="text-slate-300">•</span>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[9px] px-1.5 py-0"
              >
                Ativo
              </Badge>
            </div>
          </div>
        </div>

        {/* 3 Panels Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Painel Esquerdo: Linha do Tempo */}
          <div className="w-1/3 max-w-[320px] border-r overflow-y-auto bg-slate-50/30">
            <DossierTimeline
              events={DOSSIER_EVENTS}
              selectedId={selectedEventId}
              onSelect={setSelectedEventId}
            />
          </div>

          {/* Central & Direito */}
          <div className="flex-1 flex min-w-0">
            {/* Painel Central: Preview */}
            <div className="flex-1 border-r overflow-y-auto p-8 bg-white">
              {selectedEvent ? (
                <DossierPreview event={selectedEvent} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  Selecione um evento na linha do tempo
                </div>
              )}
            </div>

            {/* Painel Direito: Metadados */}
            <div className="w-64 lg:w-72 bg-slate-50/50 overflow-y-auto p-6">
              {selectedEvent && <DossierMetadata event={selectedEvent} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
