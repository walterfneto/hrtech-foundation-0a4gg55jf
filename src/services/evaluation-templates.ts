import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export async function fetchTemplates() {
  const cid = getCurrentCompanyId()
  if (!cid) return []
  return pb.collection('evaluation_templates').getFullList({
    filter: `company="${cid}"`,
    sort: '-created',
  })
}

export async function createTemplate(data: {
  name: string
  description: string
  questions: any[]
  company: string
}) {
  return pb.collection('evaluation_templates').create({
    ...data,
    questions: JSON.stringify(data.questions),
  })
}
