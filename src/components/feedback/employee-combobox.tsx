import { useState } from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { EmployeeRecord } from '@/lib/types'

interface EmployeeComboboxProps {
  employees: EmployeeRecord[]
  value: string
  onChange: (employeeId: string) => void
  placeholder?: string
  disabled?: boolean
}

export function EmployeeCombobox({
  employees,
  value,
  onChange,
  placeholder = 'Selecione um colaborador',
  disabled = false,
}: EmployeeComboboxProps) {
  const [open, setOpen] = useState(false)

  const selected = employees.find((e) => e.id === value)
  const selectedName = selected?.expand?.user?.name ?? ''
  const selectedTitle = selected?.job_title ?? selected?.department ?? ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between bg-muted/50 font-normal border-border',
            'hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/30',
            !value && 'text-muted-foreground',
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <Avatar className="h-6 w-6 border">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {selectedName.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-foreground">{selectedName}</span>
              {selectedTitle && (
                <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                  · {selectedTitle}
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0"
        align="start"
      >
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Buscar por nome..." className="h-9" />
          </div>
          <CommandList className="max-h-[280px]">
            <CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
            <CommandGroup>
              {employees.map((e) => {
                const name = e.expand?.user?.name ?? 'Desconhecido'
                const title = e.job_title ?? e.department ?? ''
                return (
                  <CommandItem
                    key={e.id}
                    value={`${name} ${title}`}
                    onSelect={() => {
                      onChange(e.id === value ? '' : e.id)
                      setOpen(false)
                    }}
                    className="gap-2"
                  >
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0',
                        value === e.id ? 'opacity-100 text-primary' : 'opacity-0',
                      )}
                    />
                    <Avatar className="h-7 w-7 border">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {name.charAt(0) ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-foreground truncate">{name}</span>
                      {title && (
                        <span className="text-xs text-muted-foreground truncate">{title}</span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
