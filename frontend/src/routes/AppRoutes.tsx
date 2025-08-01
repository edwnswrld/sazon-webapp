import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import AuthWrapper from '../components/AuthWrapper'
import AppLayout from '../components/AppLayout'

import Onboarding from '../pages/Onboarding'
import Dashboard from '../pages/Dashboard'
import Plan from '../pages/Plan'
import SazonAuthCallback from '../pages/AuthCallback'
import SazonResetPassword from '../pages/ResetPassword'
import SazonSettings from '../pages/Settings'
import SazonGroceryList from '../pages/GroceryList'
import { LandingPage } from '../pages/landing/LandingPage'
import { hasCompletedOnboarding } from '../lib/onboardingUtils'
import { MockDesignsPreview } from '../components/MockDesignsPreview'

// Development-only components
const SazonDevOnboardingPage = React.lazy(() => import('../pages/DevOnboarding'))

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
      {/* Development-only routes - only available in development mode */}
      {import.meta.env.DEV && (
        <>
          <Route 
            path="/dev-onboarding" 
            element={
              <React.Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              }>
                <SazonDevOnboardingPage />
              </React.Suspense>
            } 
          />
          <Route 
            path="/mock-designs" 
            element={<MockDesignsPreview />} 
          />
        </>
      )}

      {/* Public routes */}
      <Route 
        path="/" 
        element={
          user ? (
            profile && hasCompletedOnboarding(profile) ? 
              <Navigate to="/app/dashboard" replace /> : 
              <Navigate to="/app/onboarding" replace />
          ) : (
            <LandingPage />
          )
        } 
      />
      
      {/* Landing page route */}
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Auth callback routes */}
      <Route path="/auth/callback" element={<SazonAuthCallback />} />
      <Route path="/reset-password" element={<SazonResetPassword />} />
      
      {/* App routes - all authenticated routes under /app */}
      <Route
        path="/app"
        element={
          <AuthWrapper>
            <AppLayout />
          </AuthWrapper>
        }
      >
        {/* Redirect /app to dashboard if onboarding is complete */}
        <Route
          index
          element={
            profile && hasCompletedOnboarding(profile) ? 
              <Navigate to="/app/dashboard" replace /> : 
              <Navigate to="/app/onboarding" replace />
          }
        />
        
        {/* Onboarding route */}
        <Route
          path="onboarding"
          element={
            profile && hasCompletedOnboarding(profile) ? 
              <Navigate to="/app/dashboard" replace /> : 
              <Onboarding />
          }
        />
        
        {/* Dashboard route */}
        <Route
          path="dashboard"
          element={
            !profile || !hasCompletedOnboarding(profile) ? 
              <Navigate to="/app/onboarding" replace /> : 
              <Dashboard />
          }
        />
        
        {/* Plan route */}
        <Route
          path="plan"
          element={
            !profile || !hasCompletedOnboarding(profile) ? 
              <Navigate to="/app/onboarding" replace /> : 
              <Plan />
          }
        />
        
        {/* Grocery list route */}
        <Route
          path="grocery"
          element={
            !profile || !hasCompletedOnboarding(profile) ? 
              <Navigate to="/app/onboarding" replace /> : 
              <SazonGroceryList />
          }
        />
        
        {/* Settings route */}
        <Route
          path="settings"
          element={<SazonSettings />}
        />
      </Route>
      
      {/* Legacy routes - redirect to /app for backward compatibility */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/plan" element={<Navigate to="/app/plan" replace />} />
      <Route path="/grocery" element={<Navigate to="/app/grocery" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="/onboarding" element={<Navigate to="/app/onboarding" replace />} />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes 