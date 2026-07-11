import { Link, useLocation } from 'react-router-dom'
import logoUrl from '@/assets/whatsapp-image-2026-07-11-at-08.27.08-64d07.jpeg'
import {
  Home,
  Users,
  CheckSquare,
  Target,
  UserCircle,
  MessageSquare,
  BookOpen,
  FileText,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'

const items = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Equipe', url: '/equipe', icon: Users },
  { title: 'Avaliações', url: '/avaliacoes', icon: CheckSquare },
  { title: 'Metas e OKRs', url: '/metas', icon: Target },
  { title: '1:1s', url: '/1a1', icon: UserCircle },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare },
  { title: 'PDI', url: '/pdi', icon: BookOpen },
  { title: 'Tarefas (Kanban)', url: '/tarefas', icon: FileText },
  { title: 'Clima e Cultura', url: '/clima', icon: Target },
  { title: 'Recrutamento', url: '/recrutamento', icon: Users },
  { title: 'People Analytics', url: '/analytics', icon: CheckSquare },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-border bg-sidebar" variant="inset">
      <SidebarHeader className="h-16 flex items-center px-4 justify-center border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="h-9 w-9 rounded-md overflow-hidden shrink-0 ring-1 ring-sidebar-border bg-background">
            <img src={logoUrl} alt="Caminho" className="h-full w-full object-cover" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground truncate hidden sm:inline tracking-tight">
            caminho
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase mt-4">
            Plataforma
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="transition-colors"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/50 text-center">Caminho HRTech © 2026</div>
      </SidebarFooter>
    </Sidebar>
  )
}
