import { useState, useEffect, useCallback } from 'react'
import { useRealtime } from '@/hooks/use-realtime'
import { fetchEmployees } from '@/services/employees'
import { fetchCycles } from '@/services/evaluation-cycles'
import { fetchTasks } from '@/services/tasks'
import { fetchCompanyGoals } from '@/services/pdi-goals'
import { fetchFeedbacks } from '@/services/feedbacks'
import type {
  EmployeeRecord,
  EvaluationCycleRecord,
  TaskRecord,
  PdiGoalRecord,
  FeedbackRecord,
} from '@/lib/types'

export interface DashboardData {
  employees: EmployeeRecord[]
  cycles: EvaluationCycleRecord[]
  tasks: TaskRecord[]
  pdiGoals: PdiGoalRecord[]
  feedbacks: FeedbackRecord[]
  loading: boolean
}

export function useDashboardData(): DashboardData {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [cycles, setCycles] = useState<EvaluationCycleRecord[]>([])
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [pdiGoals, setPdiGoals] = useState<PdiGoalRecord[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    try {
      const [emps, cycs, tks, goals, fbks] = await Promise.all([
        fetchEmployees().catch(() => []),
        fetchCycles().catch(() => []),
        fetchTasks().catch(() => []),
        fetchCompanyGoals().catch(() => []),
        fetchFeedbacks().catch(() => []),
      ])
      setEmployees(emps as EmployeeRecord[])
      setCycles(cycs as EvaluationCycleRecord[])
      setTasks(tks as TaskRecord[])
      setPdiGoals(goals as PdiGoalRecord[])
      setFeedbacks(fbks as FeedbackRecord[])
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useRealtime('employees', () => {
    loadAll()
  })
  useRealtime('evaluation_cycles', () => {
    loadAll()
  })
  useRealtime('tasks', () => {
    loadAll()
  })
  useRealtime('pdi_goals', () => {
    loadAll()
  })
  useRealtime('feedbacks', () => {
    loadAll()
  })

  return { employees, cycles, tasks, pdiGoals, feedbacks, loading }
}
