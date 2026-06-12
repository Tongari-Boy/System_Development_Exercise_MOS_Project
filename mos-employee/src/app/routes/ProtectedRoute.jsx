import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '../auth/auth'

export default function ProtectedRoute() {
  const user = getUser()
  if (!user) return <Navigate to="/" replace />
  return <Outlet />
}
