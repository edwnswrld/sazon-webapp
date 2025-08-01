import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'

interface SazonAuthWrapperProps {
  children: ReactNode
}

const AuthWrapper: React.FC<SazonAuthWrapperProps> = ({ children }) => {
  const { user, loading } = useSazonUser()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to home if user is not authenticated
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Render children if user is authenticated
  return <>{children}</>
}

export default AuthWrapper 