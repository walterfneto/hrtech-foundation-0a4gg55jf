import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Unlink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/services/helpers'
import type { OrgTreeNode } from '@/lib/org-tree'

interface Props {
  node: OrgTreeNode
  onSelect: (node: OrgTreeNode) => void
  selectedId: string | null
  isEditMode?: boolean
  draggedId?: string | null
  dropTargetId?: string | null
  invalidTargetIds?: Set<string>
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  onDragEnter?: (id: string) => void
  onDrop?: (id: string) => void
  onUnlink?: (id: string) => void
}

export function OrgNodeCard({
  node,
  onSelect,
  selectedId,
  isEditMode = false,
  draggedId = null,
  dropTargetId = null,
  invalidTargetIds,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDrop,
  onUnlink,
}: Props) {
  const name = node.expand?.user?.name ?? 'Desconhecido'
  const avatarUrl = node.expand?.user ? getAvatarUrl(node.expand.user) : null
  const isThisDragged = draggedId === node.id
  const isHoverTarget = dropTargetId === node.id
  const isPotentialTarget =
    isEditMode && !!draggedId && draggedId !== node.id && !invalidTargetIds?.has(node.id)

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <button
          onClick={() => !isEditMode && onSelect(node)}
          draggable={isEditMode}
          onDragStart={(e) => {
            if (isEditMode) {
              e.dataTransfer.effectAllowed = 'move'
              onDragStart?.(node.id)
            }
          }}
          onDragEnd={() => onDragEnd?.()}
          onDragOver={(e) => {
            if (isEditMode && isPotentialTarget) e.preventDefault()
          }}
          onDragEnter={() => {
            if (isEditMode && isPotentialTarget) onDragEnter?.(node.id)
          }}
          onDrop={(e) => {
            if (isEditMode) {
              e.preventDefault()
              onDrop?.(node.id)
            }
          }}
          className={cn(
            'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition-all min-w-[200px]',
            isEditMode
              ? 'cursor-move'
              : 'hover:shadow-md hover:border-yellow-400/50 cursor-pointer',
            selectedId === node.id && 'ring-2 ring-yellow-400 border-yellow-400',
            isThisDragged && 'opacity-40',
            isPotentialTarget && 'border-yellow-300 bg-yellow-50/50 hover:bg-yellow-50',
            isHoverTarget &&
              isPotentialTarget &&
              'ring-2 ring-yellow-400 border-yellow-400 bg-yellow-50',
          )}
        >
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-left overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{node.job_title || '—'}</p>
          </div>
        </button>
        {isEditMode && node.manager && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-yellow-200 shadow-sm hover:bg-red-50 hover:border-red-300 z-10"
            onClick={(e) => {
              e.stopPropagation()
              onUnlink?.(node.id)
            }}
            title="Desvincular gestor"
          >
            <Unlink className="h-3 w-3 text-slate-500" />
          </Button>
        )}
      </div>
      {node.children.length > 0 && (
        <>
          <div className={cn('w-px h-6', isEditMode ? 'bg-yellow-300/50' : 'bg-yellow-300/70')} />
          <div className="flex gap-6">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div
                  className={cn('w-px h-6', isEditMode ? 'bg-yellow-300/50' : 'bg-yellow-300/70')}
                />
                <OrgNodeCard
                  node={child}
                  onSelect={onSelect}
                  selectedId={selectedId}
                  isEditMode={isEditMode}
                  draggedId={draggedId}
                  dropTargetId={dropTargetId}
                  invalidTargetIds={invalidTargetIds}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDragEnter={onDragEnter}
                  onDrop={onDrop}
                  onUnlink={onUnlink}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
