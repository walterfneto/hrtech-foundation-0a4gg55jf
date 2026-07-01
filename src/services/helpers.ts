import pb from '@/lib/pocketbase/client'

export function getCurrentCompanyId(): string {
  const record = pb.authStore.record
  return record ? ((record as any).company ?? '') : ''
}

export function getCurrentUserId(): string {
  return pb.authStore.record?.id ?? ''
}

export function getAvatarUrl(user: any): string | null {
  if (!user?.avatar) return null
  const colId = user.collectionId || '_pb_users_auth_'
  return `${pb.baseUrl}/api/files/${colId}/${user.id}/${user.avatar}`
}
