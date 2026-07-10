import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { OrgTreeNode } from '@/lib/org-tree'
import { getAvatarUrl } from '@/services/helpers'

interface Props {
  node: OrgTreeNode
  onClose: () => void
}

export function OrgInfoPanel({ node, onClose }: Props) {
  const name = node.expand?.user?.name ?? 'Desconhecido'
  const avatar = node.expand?.user ? getAvatarUrl(node.expand.user) : null
  const email = node.expand?.user?.email ?? ''

  return (
    <div className="absolute bottom-4 left-4 z-20 bg-white border border-yellow-200 rounded-xl shadow-lg p-4 max-w-xs animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar ?? undefined} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-slate-800">{name}</p>
            <p className="text-xs text-muted-foreground">{node.job_title || '—'}</p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6 -mt-1 -mr-1" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Departamento</span>
          <span className="font-medium">{node.department || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium truncate ml-2">{email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{node.expand?.team?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status</span>
          <Badge
            variant="outline"
            className={
              node.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }
          >
            {node.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subordinados</span>
          <span className="font-medium">{node.children.length}</span>
        </div>
      </div>
    </div>
  )
}
