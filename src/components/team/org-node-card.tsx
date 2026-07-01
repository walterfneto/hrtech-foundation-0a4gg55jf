import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { OrgNode } from '@/lib/types'

interface Props {
  node: OrgNode
  onSelect: (node: OrgNode) => void
  selectedId: string | null
}

export function OrgNodeCard({ node, onSelect, selectedId }: Props) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onSelect(node)}
        className={cn(
          'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md hover:border-primary/50 min-w-[200px]',
          selectedId === node.id && 'ring-2 ring-primary border-primary',
        )}
      >
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={node.avatar_url ?? undefined} />
          <AvatarFallback>{node.nome.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-left overflow-hidden">
          <p className="text-sm font-semibold text-slate-800 truncate">{node.nome}</p>
          <p className="text-xs text-muted-foreground truncate">{node.cargo}</p>
        </div>
      </button>
      {node.children.length > 0 && (
        <>
          <div className="w-px h-6 bg-slate-300" />
          <div className="flex gap-6">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-slate-300" />
                <OrgNodeCard node={child} onSelect={onSelect} selectedId={selectedId} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
