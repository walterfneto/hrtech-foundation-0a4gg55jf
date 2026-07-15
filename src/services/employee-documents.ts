import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export interface EmployeeDocumentRecord {
  id: string
  employee: string
  company: string
  title: string
  file: string
  category: string
  event_date: string
  metadata: any
  created: string
  updated: string
}

export async function fetchEmployeeDocuments(
  employeeId: string,
): Promise<EmployeeDocumentRecord[]> {
  return pb.collection('employee_documents').getFullList({
    filter: `employee="${employeeId}"`,
    sort: '-event_date',
  })
}

export async function createEmployeeDocument(data: {
  employee: string
  title: string
  file: File
  category: string
  event_date: string
  metadata?: Record<string, any>
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  const formData = new FormData()
  formData.append('employee', data.employee)
  formData.append('company', cid)
  formData.append('title', data.title)
  formData.append('file', data.file)
  formData.append('category', data.category)
  formData.append('event_date', data.event_date)
  if (data.metadata) formData.append('metadata', JSON.stringify(data.metadata))
  return pb.collection('employee_documents').create(formData)
}

export async function deleteEmployeeDocument(id: string) {
  return pb.collection('employee_documents').delete(id)
}

export function getDocumentFileUrl(record: EmployeeDocumentRecord): string {
  if (!record.file) return ''
  return `${pb.baseUrl}/api/files/employee_documents/${record.id}/${record.file}?token=${pb.authStore.token}`
}
