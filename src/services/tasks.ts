import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type { TaskRecord } from '@/lib/types'

export async function fetchTasks(): Promise<TaskRecord[]> {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('tasks').getFullList({
    filter: `company="${cid}"`,
    expand: 'assignee',
    sort: '-created',
  })
}

export async function createTask(data: {
  title: string
  description?: string
  priority?: string
  due_date?: string
  assignee?: string
  status?: string
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  return pb.collection('tasks').create({
    title: data.title,
    description: data.description || '',
    priority: data.priority || 'medium',
    due_date: data.due_date || '',
    assignee: data.assignee || '',
    status: data.status || 'todo',
    company: cid,
  })
}

export async function updateTask(id: string, data: Partial<TaskRecord>) {
  return pb.collection('tasks').update(id, data)
}

export async function deleteTask(id: string) {
  return pb.collection('tasks').delete(id)
}
