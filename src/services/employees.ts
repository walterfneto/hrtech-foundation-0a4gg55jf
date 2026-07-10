import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type { EmployeeRecord } from '@/lib/types'

export async function fetchEmployees(): Promise<EmployeeRecord[]> {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('employees').getFullList({
    filter: `company="${cid}"`,
    expand: 'user,team,company,manager',
    sort: 'created',
  })
}

export async function fetchEmployeeByUser(userId: string) {
  return pb.collection('employees').getFirstListItem(`user="${userId}"`, {
    expand: 'user,team,company,manager',
  })
}

export async function createEmployee(data: {
  user: string
  company: string
  team: string
  job_title: string
  department: string
  status: string
  role: string
  manager?: string
}) {
  return pb.collection('employees').create(data)
}

export async function createEmployeeWithUser(data: {
  name: string
  email: string
  password: string
  job_title: string
  department: string
  role: string
  status: string
  team?: string
  manager?: string
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')

  const userRecord = await pb.collection('users').create({
    email: data.email,
    password: data.password,
    passwordConfirm: data.password,
    name: data.name,
    company: cid,
  })

  return pb.collection('employees').create({
    user: userRecord.id,
    company: cid,
    team: data.team || '',
    job_title: data.job_title,
    department: data.department,
    status: data.status,
    role: data.role,
    manager: data.manager || '',
  })
}

export async function deleteEmployee(id: string) {
  return pb.collection('employees').delete(id)
}

export async function updateEmployeeManager(id: string, managerId: string | null) {
  return pb.collection('employees').update(id, { manager: managerId || '' })
}

export async function batchUpdateManagers(updates: Array<{ id: string; manager: string | null }>) {
  return Promise.all(updates.map((u) => updateEmployeeManager(u.id, u.manager)))
}
