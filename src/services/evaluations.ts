import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export async function fetchEvaluations(cycleId: string) {
  return pb.collection('evaluations').getFullList({
    filter: `cycle="${cycleId}"`,
    expand: 'employee,evaluator,cycle',
    sort: 'created',
  })
}

export async function createEvaluation(data: {
  cycle: string
  employee: string
  evaluator: string
  responses: Record<string, string | number>
  score: number
  status: string
  company: string
}) {
  return pb.collection('evaluations').create({
    ...data,
    responses: JSON.stringify(data.responses),
  })
}

export async function updateEvaluation(
  id: string,
  data: {
    responses?: Record<string, string | number>
    score?: number
    status?: string
  },
) {
  const update: Record<string, any> = {}
  if (data.responses !== undefined) update.responses = JSON.stringify(data.responses)
  if (data.score !== undefined) update.score = data.score
  if (data.status !== undefined) update.status = data.status
  return pb.collection('evaluations').update(id, update)
}
