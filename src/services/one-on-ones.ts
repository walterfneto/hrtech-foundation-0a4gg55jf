import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export interface OneOnOneRecord {
  id: string
  employee: string
  manager: string
  scheduled_at: string
  notes: Record<string, any> | null
  status: 'planned' | 'completed' | 'cancelled'
  company: string
  created: string
  updated: string
  objective: string
  reason: string
  positive_points: string
  improvement_points: string
  report: string
  action_deadline: string
  expand?: {
    employee: any
    manager: any
    company: any
  }
}

export async function fetchMyOneOnOnes(employeeId: string): Promise<OneOnOneRecord[]> {
  return pb.collection('one_on_ones').getFullList({
    filter: `employee="${employeeId}"`,
    expand: 'employee.user,manager.user,company',
    sort: '-scheduled_at',
  })
}

export async function fetchAllOneOnOnes(employeeId: string): Promise<OneOnOneRecord[]> {
  return pb.collection('one_on_ones').getFullList({
    filter: `employee="${employeeId}" || manager="${employeeId}"`,
    expand: 'employee.user,manager.user,company',
    sort: '-scheduled_at',
  })
}

export async function createOneOnOne(data: {
  employee: string
  manager: string
  scheduled_at: string
  status: string
  objective?: string
  reason?: string
  positive_points?: string
  improvement_points?: string
  report?: string
  action_deadline?: string
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  return pb.collection('one_on_ones').create({
    employee: data.employee,
    manager: data.manager,
    scheduled_at: data.scheduled_at,
    status: data.status,
    objective: data.objective || '',
    reason: data.reason || '',
    positive_points: data.positive_points || '',
    improvement_points: data.improvement_points || '',
    report: data.report || '',
    action_deadline: data.action_deadline || '',
    company: cid,
  })
}

export async function updateOneOnOne(
  id: string,
  data: {
    notes?: Record<string, any>
    status?: string
    scheduled_at?: string
    objective?: string
    reason?: string
    positive_points?: string
    improvement_points?: string
    report?: string
    action_deadline?: string
  },
) {
  const update: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) update[key] = value
  }
  return pb.collection('one_on_ones').update(id, update)
}

export async function deleteOneOnOne(id: string) {
  return pb.collection('one_on_ones').delete(id)
}
