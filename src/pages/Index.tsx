import { useAuth } from '@/hooks/use-auth'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { ManagerDashboard } from '@/components/dashboard/manager-dashboard'
import { EmployeeDashboard } from '@/components/dashboard/employee-dashboard'

export default function Index() {
  const { role } = useAuth()
  const data = useDashboardData()

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta. Aqui está o resumo do seu espaço.
        </p>
      </div>

      {(role === 'Admin RH' || role === 'Super Admin') && <AdminDashboard data={data} />}
      {role === 'Gestor' && <ManagerDashboard data={data} />}
      {role === 'Colaborador' && <EmployeeDashboard data={data} />}
    </div>
  )
}
