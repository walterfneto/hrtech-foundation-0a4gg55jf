import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type { CandidateRecord, CandidateCompetency } from '@/lib/types'

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
  competencies?: CandidateCompetency[]
  status?: string
  observations?: string
  interview_info?: string
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  return pb.collection('candidates').create({
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    role: data.role || '',
    skills: JSON.stringify(data.competencies || []),
    status: data.status || 'screening',
    observations: data.observations || '',
    interview_info: data.interview_info || '',
    evaluation_details: JSON.stringify([]),
    company: cid,
  })
}

export async function updateCandidate(
  id: string,
  data: Partial<CandidateRecord> & {
    competencies?: CandidateCompetency[]
  },
) {
  const update: Record<string, any> = {}

  if (data.name !== undefined) update.name = data.name
  if (data.email !== undefined) update.email = data.email
  if (data.phone !== undefined) update.phone = data.phone
  if (data.role !== undefined) update.role = data.role
  if (data.status !== undefined) update.status = data.status
  if (data.observations !== undefined) update.observations = data.observations
  if (data.interview_info !== undefined) update.interview_info = data.interview_info
  if (data.evaluation_details !== undefined) {
    update.evaluation_details = JSON.stringify(data.evaluation_details)
  }

  if (data.competencies !== undefined) {
    update.skills = JSON.stringify(data.competencies)
  } else if (Array.isArray(data.skills)) {
    const comps = data.skills.map((s: any) =>
      typeof s === 'string' ? { name: s, level: '', notes: '' } : s,
    )
    update.skills = JSON.stringify(comps)
  }

  return pb.collection('candidates').update(id, update)
}

export async function deleteCandidate(id: string) {
  return pb.collection('candidates').delete(id)
}
