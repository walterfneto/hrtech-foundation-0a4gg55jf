import { Bell, Search, Settings, LogOut, Building } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { currentUser } from '@/lib/mock'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <div className="max-w-md w-full hidden sm:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador ou área..."
            className="pl-9 bg-muted/50 w-full rounded-full border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none p-1 rounded-full hover:bg-muted transition-colors">
              <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left mr-2">
                <span className="text-sm font-semibold leading-none text-foreground">
                  {currentUser.name}
                </span>
                <span className="text-xs text-muted-foreground mt-1 font-medium">
                  {currentUser.role}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 font-sans">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Building className="w-4 h-4 mr-2" /> Alternar Empresa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
