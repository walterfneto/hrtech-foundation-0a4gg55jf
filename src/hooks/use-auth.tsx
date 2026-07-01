import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'
import { getAvatarUrl } from '@/services/helpers'

interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string | null
  empresa_id: string
  tenant: string
}

interface AuthContextType {
  user: AuthUser | null
  employee: any | null
  role: string
  empresaId: string
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [employee, setEmployee] = useState<any | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  const loadEmployee = async (userId: string) => {
    try {
      const emp = await pb.collection('employees').getFirstListItem(`user="${userId}"`, {
        expand: 'user,team,company,manager',
      })
      setEmployee(emp)
      const u = emp.expand?.user
      const company = emp.expand?.company
      setUser({
        id: u?.id ?? userId,
        name: u?.name ?? '',
        email: u?.email ?? '',
        avatar: u ? getAvatarUrl(u) : null,
        empresa_id: emp.company ?? '',
        tenant: company?.name ?? '',
      })
    } catch {
      setEmployee(null)
      const rec = pb.authStore.record
      setUser(
        rec
          ? {
              id: rec.id,
              name: (rec as any).name ?? '',
              email: (rec as any).email ?? '',
              avatar: getAvatarUrl(rec),
              empresa_id: (rec as any).company ?? '',
              tenant: '',
            }
          : null,
      )
    }
  }

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setIsAuthenticated(pb.authStore.isValid)
      if (!pb.authStore.isValid) {
        setUser(null)
        setEmployee(null)
      }
    })
    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .then(() => loadEmployee(pb.authStore.record!.id))
        .catch(() => {
          pb.authStore.clear()
          setUser(null)
          setEmployee(null)
        })
        .finally(() => setLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }
    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      await loadEmployee(pb.authStore.record!.id)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password, name })
      await pb.collection('users').authWithPassword(email, password)
      await loadEmployee(pb.authStore.record!.id)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
    setUser(null)
    setEmployee(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        role: employee?.role ?? 'Colaborador',
        empresaId: employee?.company ?? user?.empresa_id ?? '',
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
