import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'
import type { FeedbackRecord } from '@/lib/types'

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
  content: string
}) {
  const cid = getCurrentCompanyId()
  if (!cid) throw new Error('Company context not found')
  return pb.collection('feedbacks').create({
    ...data,
    company: cid,
  })
}
