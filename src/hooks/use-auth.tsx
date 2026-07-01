import { createContext, useContext, useState, ReactNode } from 'react'
import { MOCK_USER } from '@/lib/mock-data'

type Role = 'Admin RH' | 'Gestor' | 'Colaborador'

interface AuthContextType {
  role: Role
  setRole: (role: Role) => void
  user: typeof MOCK_USER
  empresaId: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Gestor')

  return (
    <AuthContext.Provider
      value={{ role, setRole, user: MOCK_USER, empresaId: MOCK_USER.empresa_id }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
