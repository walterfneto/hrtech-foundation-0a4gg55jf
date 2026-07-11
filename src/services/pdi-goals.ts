import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type { PdiGoalRecord } from '@/lib/types'

export async function fetchPdiGoals(employeeId: string): Promise<PdiGoalRecord[]> {
  return pb.collection('pdi_goals').getFullList({
    filter: `employee="${employeeId}"`,
    sort: '-created',
  })
}

export async function fetchCompanyGoals(): Promise<PdiGoalRecord[]> {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('pdi_goals').getFullList({
    filter: `company="${cid}"`,
    expand: 'employee.user',
    sort: '-created',
  })
}

export async function createPdiGoal(data: {
  title: string
  description?: string
  employee: string
  due_date?: string
  status?: string
  progress?: number
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  return pb.collection('pdi_goals').create({
    title: data.title,
    description: data.description || '',
    employee: data.employee,
    due_date: data.due_date || '',
    status: data.status || 'todo',
    progress: data.progress ?? 0,
    company: cid,
  })
}

export async function updatePdiGoal(id: string, data: Partial<PdiGoalRecord>) {
  return pb.collection('pdi_goals').update(id, data)
}

export async function deletePdiGoal(id: string) {
  return pb.collection('pdi_goals').delete(id)
}
