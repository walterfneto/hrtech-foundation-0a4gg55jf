import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type { FeedbackRecord, ImprovementStatus } from '@/lib/types'

export async function fetchFeedbacks(): Promise<FeedbackRecord[]> {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('feedbacks').getFullList({
    filter: `company="${cid}"`,
    expand: 'sender.user,receiver.user',
    sort: '-created',
  })
}

export async function createFeedback(data: {
  sender: string
  receiver: string
  type: string
  context: string
  impact: string
  action_plan: string
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  return pb.collection('feedbacks').create({
    ...data,
    content: data.context,
    company: cid,
    improvement_status: 'pending',
  })
}

export async function updateFeedbackFollowUp(
  id: string,
  data: { follow_up_notes: string; improvement_status: ImprovementStatus },
) {
  return pb.collection('feedbacks').update(id, data)
}

export function filterVisibleFeedbacks(
  feedbacks: FeedbackRecord[],
  currentEmployeeId: string,
): FeedbackRecord[] {
  return feedbacks.filter((f) => {
    if (f.type === 'public_praise') return true
    return f.sender === currentEmployeeId || f.receiver === currentEmployeeId
  })
}
