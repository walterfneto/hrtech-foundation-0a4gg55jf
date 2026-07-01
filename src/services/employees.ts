import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export async function fetchEmployees() {
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
