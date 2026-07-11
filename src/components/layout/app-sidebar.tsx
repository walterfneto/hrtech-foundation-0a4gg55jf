import { Link, useLocation } from 'react-router-dom'
import logoUrl from '@/assets/whatsapp-image-2026-07-11-at-08.27.08-64d07.jpeg'
import {
  Users,
  LayoutDashboard,
  FileText,
  Target,
  CalendarDays,
  MessageSquare,
  TrendingUp,
  FolderOpen,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'

const items = [
  { title: 'Início', url: '/', icon: LayoutDashboard },
  { title: 'Equipe', url: '/equipe', icon: Users },
  { title: 'Avaliações', url: '/avaliacoes', icon: FileText },
  { title: 'Metas e OKRs', url: '/metas', icon: Target },
  { title: '1:1s', url: '/1a1', icon: CalendarDays },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare },
  { title: 'PDI', url: '/pdi', icon: TrendingUp },
  { title: 'Tarefas', url: '/tarefas', icon: FolderOpen },
  { title: 'Clima', url: '/clima', icon: Target },
  { title: 'Recrutamento', url: '/recrutamento', icon: Users },
  { title: 'Analytics', url: '/analytics', icon: TrendingUp },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center border-b px-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <div className="h-9 w-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-border shadow-sm">
            <img src={logoUrl} alt="Caminho" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground hidden sm:inline tracking-tight">
            caminho
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-center text-muted-foreground border-t">
        Plataforma Segura • LGPD
      </SidebarFooter>
    </Sidebar>
  )
}
