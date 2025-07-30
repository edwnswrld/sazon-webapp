import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import AuthWrapper from '../components/AuthWrapper'
import Home from '../pages/Home'
import Onboarding from '../pages/Onboarding'
import Dashboard from '../pages/Dashboard'
import Plan from '../pages/Plan'

const AppRoutes: React.FC = () => {
  const { user, profile, loading } = useSazonUser()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          user ? (
            profile ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
          ) : (
            <Home />
          )
        } 
      />
      
      {/* Protected routes that require authentication */}
      <Route
        path="/onboarding"
        element={
          <AuthWrapper>
            {profile ? <Navigate to="/dashboard" replace /> : <Onboarding />}
          </AuthWrapper>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <AuthWrapper>
            {!profile ? <Navigate to="/onboarding" replace /> : <Dashboard />}
          </AuthWrapper>
        }
      />
      
      <Route
        path="/plan"
        element={
          <AuthWrapper>
            {!profile ? <Navigate to="/onboarding" replace /> : <Plan />}
          </AuthWrapper>
        }
      />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes 