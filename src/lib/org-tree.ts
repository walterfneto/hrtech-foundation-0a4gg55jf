import type { EmployeeRecord } from '@/lib/types'

export interface OrgTreeNode extends EmployeeRecord {
  children: OrgTreeNode[]
}

export function buildOrgTree(employees: EmployeeRecord[]): OrgTreeNode[] {
  const roots = employees.filter((e) => !e.manager || e.manager === '')

  function buildNode(emp: EmployeeRecord): OrgTreeNode {
    const children = employees.filter((e) => e.manager === emp.id).map(buildNode)
    return { ...emp, children }
  }

  return roots.map(buildNode)
}

export function getDescendantIds(employees: EmployeeRecord[], employeeId: string): Set<string> {
  const ids = new Set<string>()
  function collect(id: string) {
    const children = employees.filter((e) => e.manager === id)
    for (const child of children) {
      ids.add(child.id)
      collect(child.id)
    }
  }
  collect(employeeId)
  return ids
}

export function wouldCreateCycle(
  employees: EmployeeRecord[],
  employeeId: string,
  newManagerId: string,
): boolean {
  if (employeeId === newManagerId) return true
  let current: string | null = newManagerId
  const visited = new Set<string>()
  while (current && !visited.has(current)) {
    if (current === employeeId) return true
    visited.add(current)
    const emp = employees.find((e) => e.id === current)
    if (!emp) break
    current = emp.manager
  }
  return false
}
