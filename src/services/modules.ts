import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type {
  TaskRecord,
  FeedbackRecord,
  PdiGoalRecord,
  HRRequestRecord,
  CandidateRecord,
  PulseSurveyRecord,
} from '@/lib/types'

export async function fetchTasks(employeeId?: string): Promise<TaskRecord[]> {
  const cid = getCurrentCompanyId()
  let filter = `company="${cid}"`
  if (employeeId) filter += ` && assignee="${employeeId}"`
  return pb.collection('tasks').getFullList({ filter, expand: 'assignee.user', sort: '-created' })
}

export async function createTask(data: Partial<TaskRecord>) {
  return pb.collection('tasks').create({ ...data, company: getCurrentCompanyId() })
}

export async function updateTask(id: string, data: Partial<TaskRecord>) {
  return pb.collection('tasks').update(id, data)
}

export async function fetchFeedbacks(): Promise<FeedbackRecord[]> {
  const cid = getCurrentCompanyId()
  return pb.collection('feedbacks').getFullList({
    filter: `company="${cid}"`,
    expand: 'sender.user,receiver.user',
    sort: '-created',
  })
}

export async function createFeedback(data: Partial<FeedbackRecord>) {
  return pb.collection('feedbacks').create({ ...data, company: getCurrentCompanyId() })
}

export async function fetchPdiGoals(employeeId: string): Promise<PdiGoalRecord[]> {
  const cid = getCurrentCompanyId()
  return pb
    .collection('pdi_goals')
    .getFullList({ filter: `company="${cid}" && employee="${employeeId}"`, sort: '-created' })
}

export async function createPdiGoal(data: Partial<PdiGoalRecord>) {
  return pb.collection('pdi_goals').create({ ...data, company: getCurrentCompanyId() })
}

export async function updatePdiGoal(id: string, data: Partial<PdiGoalRecord>) {
  return pb.collection('pdi_goals').update(id, data)
}

export async function fetchHRRequests(): Promise<HRRequestRecord[]> {
  const cid = getCurrentCompanyId()
  return pb
    .collection('hr_requests')
    .getFullList({ filter: `company="${cid}"`, expand: 'requester.user', sort: '-created' })
}

export async function updateHRRequest(id: string, status: string) {
  return pb.collection('hr_requests').update(id, { status })
}

export async function fetchCandidates(): Promise<CandidateRecord[]> {
  const cid = getCurrentCompanyId()
  return pb.collection('candidates').getFullList({ filter: `company="${cid}"`, sort: '-created' })
}

export async function createCandidate(data: Partial<CandidateRecord>) {
  return pb.collection('candidates').create({ ...data, company: getCurrentCompanyId() })
}

export async function updateCandidate(id: string, data: Partial<CandidateRecord>) {
  return pb.collection('candidates').update(id, data)
}

export async function fetchActiveSurveys(): Promise<PulseSurveyRecord[]> {
  const cid = getCurrentCompanyId()
  return pb
    .collection('pulse_surveys')
    .getFullList({ filter: `company="${cid}" && active=true`, sort: '-created' })
}

export async function submitSurveyResponse(surveyId: string, score: number, comments: string) {
  return pb
    .collection('pulse_responses')
    .create({ survey: surveyId, score, comments, company: getCurrentCompanyId() })
}

export async function fetchSurveyResponses(): Promise<any[]> {
  const cid = getCurrentCompanyId()
  return pb
    .collection('pulse_responses')
    .getFullList({ filter: `company="${cid}"`, sort: '-created' })
}
