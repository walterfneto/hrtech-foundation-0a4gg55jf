import { useState, useRef } from 'react'
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { OrgNode } from '@/lib/types'
import { OrgNodeCard } from '@/components/team/org-node-card'

interface Props {
  data: OrgNode
}

export function OrgChart({ data }: Props) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<OrgNode | null>(null)
  const dragRef = useRef<{ sx: number; sy: number; bx: number; by: number } | null>(null)

  const zoomIn = () => setScale((s) => Math.min(s + 0.15, 2))
  const zoomOut = () => setScale((s) => Math.max(s - 0.15, 0.4))
  const reset = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const onWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setScale((s) => Math.min(Math.max(s + delta, 0.4), 2))
  }

  const onDown = (e: React.MouseEvent) => {
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: offset.x, by: offset.y }
  }
  const onMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return
    setOffset({
      x: dragRef.current.bx + (e.clientX - dragRef.current.sx),
      y: dragRef.current.by + (e.clientY - dragRef.current.sy),
    })
  }
  const onUp = () => {
    dragRef.current = null
  }

  return (
    <div className="relative w-full h-[600px] border rounded-lg bg-slate-50 overflow-hidden">
      <div className="absolute top-4 right-4 z-20 flex gap-2 bg-white/80 backdrop-blur rounded-lg p-1 shadow-sm">
        <Button size="icon" variant="ghost" onClick={zoomOut} className="h-8 w-8">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium flex items-center px-1">
          {Math.round(scale * 100)}%
        </span>
        <Button size="icon" variant="ghost" onClick={zoomIn} className="h-8 w-8">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={reset} className="h-8 w-8">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {selected && (
        <div className="absolute top-4 left-4 z-20 bg-white border rounded-xl shadow-lg p-4 max-w-xs animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selected.avatar_url ?? undefined} />
                <AvatarFallback>{selected.nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-slate-800">{selected.nome}</p>
                <p className="text-xs text-muted-foreground">{selected.cargo}</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 -mt-1 -mr-1"
              onClick={() => setSelected(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Departamento</span>
              <span className="font-medium">{selected.departamento}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium truncate ml-2">{selected.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant="outline"
                className={
                  selected.status === 'Ativo'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }
              >
                {selected.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subordinados</span>
              <span className="font-medium">{selected.children.length}</span>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        <div
          className="origin-top-left"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragRef.current ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <div className="p-8">
            <OrgNodeCard node={data} onSelect={setSelected} selectedId={selected?.id ?? null} />
          </div>
        </div>
      </div>
    </div>
  )
}
