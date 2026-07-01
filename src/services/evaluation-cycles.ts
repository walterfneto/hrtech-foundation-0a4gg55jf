import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export async function fetchCycles() {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('evaluation_cycles').getFullList({
    filter: `company="${cid}"`,
    expand: 'template',
    sort: '-created',
  })
}

export async function createCycle(data: {
  title: string
  description: string
  start_date: string
  end_date: string
  status: string
  company: string
  template: string
}) {
  return pb.collection('evaluation_cycles').create(data)
}

export async function updateCycleStatus(id: string, status: string) {
  return pb.collection('evaluation_cycles').update(id, { status })
}
