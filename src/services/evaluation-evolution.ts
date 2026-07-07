import pb from '@/lib/pocketbase/client'

export interface EvolutionDataPoint {
  cycleId: string
  cycleTitle: string
  cycleDate: string
  score: number
  evaluationId: string
}

export async function fetchEmployeeEvolution(employeeId: string): Promise<EvolutionDataPoint[]> {
  const evaluations = await pb.collection('evaluations').getFullList({
    filter: `employee="${employeeId}" && status="completed"`,
    expand: 'cycle',
    sort: 'created',
  })

  return evaluations
    .filter((e: any) => e.expand?.cycle)
    .map((e: any) => {
      const cycle = e.expand.cycle
      return {
        cycleId: cycle.id,
        cycleTitle: cycle.title || 'Sem título',
        cycleDate: cycle.start_date || cycle.created || e.created,
        score: Number(e.score) || 0,
        evaluationId: e.id,
      }
    })
    .sort((a, b) => new Date(a.cycleDate).getTime() - new Date(b.cycleDate).getTime())
}
