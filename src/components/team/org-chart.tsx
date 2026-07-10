import { useState, useRef, useMemo, useCallback } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Users, Pencil, Check, RotateCcw, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { EmployeeRecord } from '@/lib/types'
import { type OrgTreeNode, buildOrgTree, getDescendantIds, wouldCreateCycle } from '@/lib/org-tree'
import { batchUpdateManagers } from '@/services/employees'
import { OrgNodeCard } from '@/components/team/org-node-card'
import { OrgInfoPanel } from '@/components/team/org-info-panel'

interface Props {
  employees: EmployeeRecord[]
}

export function OrgChart({ employees }: Props) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<OrgTreeNode | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [pending, setPending] = useState<EmployeeRecord[]>([])
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set())
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const dragRef = useRef<{ sx: number; sy: number; bx: number; by: number } | null>(null)
  const { toast } = useToast()

  const display = editMode ? pending : employees
  const tree = useMemo(() => buildOrgTree(display), [display])

  const invalidTargets = useMemo(() => {
    if (!draggedId) return new Set<string>()
    const ids = getDescendantIds(display, draggedId)
    ids.add(draggedId)
    return ids
  }, [draggedId, display])

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
    if (editMode) return
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

  const applyChange = useCallback((empId: string, managerId: string | null) => {
    setPending((prev) => {
      const next = prev.map((e) => ({ ...e }))
      const emp = next.find((e) => e.id === empId)
      if (emp) emp.manager = managerId
      return next
    })
    setChangedIds((prev) => new Set([...prev, empId]))
  }, [])

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!draggedId) return
      if (draggedId === targetId || wouldCreateCycle(display, draggedId, targetId)) {
        toast({
          title: 'Operação inválida',
          description: 'Esta mudança criaria uma referência circular na hierarquia.',
          variant: 'destructive',
        })
      } else {
        const emp = display.find((e) => e.id === draggedId)
        if (emp?.manager !== targetId) applyChange(draggedId, targetId)
      }
      setDraggedId(null)
      setDropTargetId(null)
    },
    [draggedId, display, applyChange, toast],
  )

  const handleDropToRoot = useCallback(() => {
    if (!draggedId) return
    const emp = display.find((e) => e.id === draggedId)
    if (emp?.manager) applyChange(draggedId, null)
    setDraggedId(null)
    setDropTargetId(null)
  }, [draggedId, display, applyChange])

  const handleUnlink = useCallback(
    (empId: string) => {
      const emp = display.find((e) => e.id === empId)
      if (emp?.manager) applyChange(empId, null)
    },
    [display, applyChange],
  )

  const enterEdit = () => {
    setPending(employees.map((e) => ({ ...e })))
    setChangedIds(new Set())
    setEditMode(true)
    setSelected(null)
  }
  const exitEdit = () => {
    setEditMode(false)
    setPending([])
    setChangedIds(new Set())
    setDraggedId(null)
    setDropTargetId(null)
  }

  const handleConfirm = async () => {
    setSaving(true)
    try {
      const updates = Array.from(changedIds).map((id) => {
        const emp = pending.find((e) => e.id === id)
        return { id, manager: emp?.manager || null }
      })
      await batchUpdateManagers(updates)
      toast({
        title: 'Alterações salvas',
        description: `${updates.length} alteração(ões) aplicada(s) na hierarquia.`,
      })
      exitEdit()
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (employees.length === 0 || tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-yellow-200 rounded-xl bg-yellow-50/50">
        <Users className="h-12 w-12 text-yellow-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-1">
          {employees.length === 0
            ? 'Nenhum colaborador cadastrado'
            : 'Estrutura hierárquica indefinida'}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {employees.length === 0
            ? 'Adicione colaboradores à sua equipe para visualizar o organograma interativo.'
            : 'Defina um gestor sem superior para criar a raiz do organograma.'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] border border-yellow-200 rounded-xl bg-yellow-50/20 overflow-hidden">
      <div className="absolute top-4 right-4 z-20 flex gap-2 bg-white/90 backdrop-blur rounded-lg p-1 shadow-sm border border-yellow-100">
        <Button size="icon" variant="ghost" onClick={zoomOut} className="h-8 w-8">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium flex items-center px-1 text-slate-600">
          {Math.round(scale * 100)}%
        </span>
        <Button size="icon" variant="ghost" onClick={zoomIn} className="h-8 w-8">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={reset} className="h-8 w-8">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {!editMode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={enterEdit}
            className="bg-white/90 backdrop-blur"
          >
            <Pencil className="mr-2 h-3.5 w-3.5" /> Editar Organograma
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={exitEdit}
              className="bg-white/90 backdrop-blur"
              disabled={saving}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" /> Descartar
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={changedIds.size === 0 || saving}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Check className="mr-2 h-3.5 w-3.5" /> Confirmar ({changedIds.size})
            </Button>
          </>
        )}
      </div>

      {selected && !editMode && <OrgInfoPanel node={selected} onClose={() => setSelected(null)} />}

      {editMode && draggedId && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
          }}
          onDrop={(e) => {
            e.preventDefault()
            handleDropToRoot()
          }}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 text-yellow-700 text-sm font-medium animate-fade-in"
        >
          <UserX className="inline mr-2 h-4 w-4" /> Soltar aqui para remover gestor
        </div>
      )}

      <div
        className={cn('w-full h-full', editMode ? '' : 'cursor-grab active:cursor-grabbing')}
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
          <div className={cn('p-8 flex justify-center gap-8', editMode && 'pt-24')}>
            {tree.map((root) => (
              <OrgNodeCard
                key={root.id}
                node={root}
                onSelect={setSelected}
                selectedId={selected?.id ?? null}
                isEditMode={editMode}
                draggedId={draggedId}
                dropTargetId={dropTargetId}
                invalidTargetIds={invalidTargets}
                onDragStart={setDraggedId}
                onDragEnd={() => {
                  setDraggedId(null)
                  setDropTargetId(null)
                }}
                onDragEnter={setDropTargetId}
                onDrop={handleDrop}
                onUnlink={handleUnlink}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
