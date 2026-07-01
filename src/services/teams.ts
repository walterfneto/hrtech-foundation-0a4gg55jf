import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export async function fetchTeams() {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('teams').getFullList({
    filter: `company="${cid}"`,
    sort: 'created',
  })
}

export async function createTeam(data: { name: string; company: string }) {
  return pb.collection('teams').create(data)
}
