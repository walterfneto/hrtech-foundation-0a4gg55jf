import pb from '@/lib/pocketbase/client'

export interface MyEvaluationRecord {
  id: string
  cycle: string
  employee: string
  evaluator: string
  responses: Record<string, string | number> | null
  score: number
  status: 'pending' | 'in_progress' | 'completed'
  company: string
  created: string
  updated: string
  expand?: {
    cycle: any
    employee: any
    evaluator: any
  }
}

export async function fetchMyEvaluations(employeeId: string): Promise<MyEvaluationRecord[]> {
  return pb.collection('evaluations').getFullList({
    filter: `employee="${employeeId}"`,
    expand: 'cycle,employee,evaluator',
    sort: '-created',
  })
}
