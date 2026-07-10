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
  expand?: {
    employee: any
    manager: any
    company: any
  }
}

export async function fetchMyOneOnOnes(employeeId: string): Promise<OneOnOneRecord[]> {
  return pb.collection('one_on_ones').getFullList({
    filter: `employee="${employeeId}"`,
    expand: 'employee,manager,company',
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
  notes?: Record<string, any>
  status: string
}) {
  const cid = getCurrentCompanyId()
  return pb.collection('one_on_ones').create({
    ...data,
    notes: data.notes ? JSON.stringify(data.notes) : '',
    company: cid,
  })
}

export async function updateOneOnOne(
  id: string,
  data: { notes?: Record<string, any>; status?: string },
) {
  const update: Record<string, any> = {}
  if (data.notes !== undefined) update.notes = JSON.stringify(data.notes)
  if (data.status !== undefined) update.status = data.status
  return pb.collection('one_on_ones').update(id, update)
}

export async function deleteOneOnOne(id: string) {
  return pb.collection('one_on_ones').delete(id)
}
