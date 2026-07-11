import pb from '@/lib/pocketbase/client'

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  try {
    const userId = pb.authStore.record?.id
    if (!userId) return { error: 'Usuário não autenticado.' }

    await pb.collection('users').update(userId, {
      oldPassword,
      password: newPassword,
      passwordConfirm: newPassword,
    })
    return { error: null }
  } catch (err: any) {
    const msg = err?.response?.message || err?.message || 'Erro ao alterar senha.'
    if (msg.includes('oldPassword') || msg.toLowerCase().includes('old')) {
      return { error: 'Senha atual incorreta.' }
    }
    return { error: msg }
  }
}
