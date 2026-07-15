import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown, Plus, Search, Loader2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { fetchTeams, createTeam } from '@/services/teams'
import { getCurrentCompanyId } from '@/services/helpers'
import { extractFieldErrors, type FieldErrors } from '@/lib/pocketbase/errors'

interface TeamComboboxProps {
  value: string
  onChange: (teamId: string) => void
  placeholder?: string
  disabled?: boolean
}

interface TeamItem {
  id: string
  name: string
}

export function TeamCombobox({
  value,
  onChange,
  placeholder = 'Selecionar time',
  disabled = false,
}: TeamComboboxProps) {
  const [open, setOpen] = useState(false)
  const [teams, setTeams] = useState<TeamItem[]>([])
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const loadTeams = useCallback(async () => {
    try {
      const data = await fetchTeams()
      setTeams(data.map((t: any) => ({ id: t.id, name: t.name })))
    } catch {
      setTeams([])
    }
  }, [])

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  const selected = teams.find((t) => t.id === value)
  const trimmedSearch = search.trim()
  const exactMatch = teams.some((t) => t.name.toLowerCase() === trimmedSearch.toLowerCase())
  const canCreate = trimmedSearch.length > 0 && !exactMatch && !creating

  const handleCreate = async () => {
    if (!trimmedSearch) return
    setCreating(true)
    setFieldErrors({})
    try {
      const cid = getCurrentCompanyId()
      if (!cid) {
        toast.error('Contexto da empresa não encontrado.')
        return
      }
      const record = await createTeam({ name: trimmedSearch, company: cid })
      const newTeam: TeamItem = { id: record.id, name: record.name }
      setTeams((prev) => [...prev, newTeam])
      onChange(newTeam.id)
      setSearch('')
      setOpen(false)
      toast.success(`Time "${newTeam.name}" criado com sucesso!`)
    } catch (err) {
      const errors = extractFieldErrors(err)
      setFieldErrors(errors)
      if (Object.keys(errors).length === 0) {
        toast.error('Erro ao criar time.')
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between bg-muted/50 font-normal border rounded-lg',
              'hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/30 shadow-subtle',
              !value && 'text-muted-foreground',
            )}
          >
            {selected ? (
              <span className="truncate text-foreground">{selected.name}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0 rounded-lg border shadow-subtle"
          align="start"
        >
          <Command shouldFilter={true}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Buscar ou criar time..."
                className="h-9"
                value={search}
                onValueChange={setSearch}
              />
            </div>
            <CommandList className="max-h-[280px]">
              <CommandEmpty>
                {trimmedSearch ? (
                  <span className="text-sm text-muted-foreground">Nenhum time encontrado.</span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Digite para buscar ou criar um time.
                  </span>
                )}
              </CommandEmpty>
              {teams.length > 0 && (
                <CommandGroup>
                  {teams.map((t) => (
                    <CommandItem
                      key={t.id}
                      value={t.name}
                      onSelect={() => {
                        onChange(t.id === value ? '' : t.id)
                        setOpen(false)
                        setSearch('')
                      }}
                      className="gap-2"
                    >
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0',
                          value === t.id ? 'opacity-100 text-primary' : 'opacity-0',
                        )}
                      />
                      <span className="text-sm font-medium text-foreground truncate">{t.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {canCreate && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={handleCreate} className="gap-2" disabled={creating}>
                      {creating ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                      ) : (
                        <Plus className="h-4 w-4 shrink-0 text-primary" />
                      )}
                      <span className="text-sm font-medium text-primary">
                        {creating ? 'Criando...' : `Criar "${trimmedSearch}"`}
                      </span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {fieldErrors.name && <p className="text-sm text-destructive mt-1">{fieldErrors.name}</p>}
    </div>
  )
}
