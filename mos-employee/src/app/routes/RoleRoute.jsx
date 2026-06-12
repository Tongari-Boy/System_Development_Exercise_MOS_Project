import { Navigate, Outlet } from 'react-router-dom'
import { getUser, getUseCase } from '../auth/auth'

export default function RoleRoute({ allowedRoles = [], allowedUseCases = [] }) {
  const user = getUser()
  const useCase = getUseCase()

  if (!user) return <Navigate to="/" replace />

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/employee" replace />
  }

  if (allowedUseCases.length > 0 && !allowedUseCases.includes(useCase)) {
    return <Navigate to="/employee" replace />
  }

  return <Outlet />
}
