import pb from '@/lib/pocketbase/client'
import { getCurrentCompanyId } from '@/services/helpers'

export async function fetchCurrentCompany() {
  const id = getCurrentCompanyId()
  if (!id) return null
  return pb.collection('companies').getOne(id)
}
