import { Link, useLocation } from 'react-router-dom'
import {
  Users,
  LayoutDashboard,
  FileText,
  Target,
  CalendarDays,
  MessageSquare,
  TrendingUp,
  FolderOpen,
  UserCheck,
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
  { title: 'Dossiê', url: '/dossie', icon: FolderOpen },
  { title: 'Meu Desenvolvimento', url: '/meu-desenvolvimento', icon: UserCheck },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary w-full px-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
            C
          </div>
          <span className="truncate">Caminho</span>
        </div>
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
