import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type { CandidateRecord } from '@/lib/types'

export async function fetchCandidates(): Promise<CandidateRecord[]> {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('candidates').getFullList({
    filter: `company="${cid}"`,
    sort: '-created',
  })
}

export async function createCandidate(data: {
  name: string
  email: string
  phone?: string
  role?: string
  skills?: string[]
  status?: string
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  return pb.collection('candidates').create({
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    role: data.role || '',
    skills: JSON.stringify(data.skills || []),
    status: data.status || 'screening',
    company: cid,
  })
}

export async function updateCandidate(id: string, data: Partial<CandidateRecord>) {
  const update: Record<string, any> = { ...data }
  if (Array.isArray(data.skills)) {
    update.skills = JSON.stringify(data.skills)
  }
  return pb.collection('candidates').update(id, update)
}

export async function deleteCandidate(id: string) {
  return pb.collection('candidates').delete(id)
}
